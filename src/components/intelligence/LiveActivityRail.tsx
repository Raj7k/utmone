import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Activity,
  AlertTriangle,
  Lightbulb,
  MousePointer,
  ExternalLink,
  RefreshCw,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface LiveActivityRailProps {
  workspaceId?: string;
  preloadedClicks?: Array<{
    id: string;
    slug: string;
    city: string;
    country: string;
    device: string;
    timestamp: Date;
  }>;
}

interface ClickEvent {
  id: string;
  shortCode: string;
  city: string;
  country: string;
  device: string;
  timestamp: Date;
}

interface Anomaly {
  id: string;
  title: string;
  severity: "warning" | "critical";
  timestamp: Date;
}

interface Insight {
  id: string;
  title: string;
  description: string;
  actionLabel?: string;
}

// Cache helpers
const ANOMALIES_CACHE_KEY = 'anomalies-cache';
const CACHE_EXPIRY = 60 * 1000; // 1 minute

function getCachedAnomalies(workspaceId: string): Anomaly[] | undefined {
  try {
    const cached = localStorage.getItem(ANOMALIES_CACHE_KEY);
    if (!cached) return undefined;
    const { data, timestamp, wid } = JSON.parse(cached);
    if (wid !== workspaceId) return undefined;
    if (Date.now() - timestamp > CACHE_EXPIRY) return undefined;
    return data.map((a: any) => ({ ...a, timestamp: new Date(a.timestamp) }));
  } catch {
    return undefined;
  }
}

function setCacheAnomalies(workspaceId: string, data: Anomaly[]) {
  try {
    localStorage.setItem(ANOMALIES_CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now(),
      wid: workspaceId,
    }));
  } catch {}
}

export default function LiveActivityRail({ workspaceId, preloadedClicks }: LiveActivityRailProps) {
  const hasPreloadedData = !!preloadedClicks && preloadedClicks.length > 0;
  
  const [recentClicks, setRecentClicks] = useState<ClickEvent[]>(
    hasPreloadedData 
      ? preloadedClicks.map(c => ({ ...c, shortCode: c.slug }))
      : []
  );
  const [isLive, setIsLive] = useState(true);

  // Fetch recent clicks only if no preloaded data
  const { data: initialClicks } = useQuery({
    queryKey: ["live-clicks", workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];

      const { data, error } = await supabase
        .from("link_clicks")
        .select("id, city, country, device_type, clicked_at, links!inner(slug, workspace_id)")
        .eq("links.workspace_id", workspaceId)
        .order("clicked_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      return (data || []).map((click: any) => ({
        id: click.id,
        shortCode: click.links?.slug || "unknown",
        city: click.city || "Unknown",
        country: click.country || "",
        device: click.device_type || "desktop",
        timestamp: new Date(click.clicked_at),
      }));
    },
    enabled: !!workspaceId && !hasPreloadedData,
    staleTime: 30 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Fetch anomalies with caching
  const { data: anomalies, isFetching: anomaliesFetching } = useQuery({
    queryKey: ["anomalies", workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];

      const { data, error } = await supabase
        .from("analytics_anomalies")
        .select("*")
        .eq("workspace_id", workspaceId)
        .eq("is_dismissed", false)
        .order("detected_at", { ascending: false })
        .limit(3);

      if (error) throw error;

      const result = (data || []).map((anomaly: any) => ({
        id: anomaly.id,
        title: anomaly.title,
        severity: anomaly.severity as "warning" | "critical",
        timestamp: new Date(anomaly.detected_at),
      }));
      
      if (workspaceId) setCacheAnomalies(workspaceId, result);
      return result;
    },
    initialData: () => workspaceId ? getCachedAnomalies(workspaceId) : undefined,
    enabled: !!workspaceId,
    staleTime: 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Mock insights (would come from AI in production)
  const insights: Insight[] = [
    {
      id: "1",
      title: "Peak traffic hour",
      description: "Most clicks happen between 2-4 PM EST",
      actionLabel: "Schedule posts",
    },
    {
      id: "2",
      title: "Top performer",
      description: "LinkedIn driving 45% more conversions",
    },
  ];

  // Initialize with fetched data only if no preloaded data
  useEffect(() => {
    if (initialClicks && !hasPreloadedData) {
      setRecentClicks(initialClicks);
    }
  }, [initialClicks, hasPreloadedData]);

  // Real-time subscription
  useEffect(() => {
    if (!workspaceId || !isLive) return;

    const channel = supabase
      .channel("live-activity-rail")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "link_clicks",
        },
        async (payload) => {
          // Fetch full click data with link info
          const { data } = await supabase
            .from("link_clicks")
            .select("id, city, country, device_type, clicked_at, links!inner(slug, workspace_id)")
            .eq("id", payload.new.id)
            .single();

          if (data && (data.links as any)?.workspace_id === workspaceId) {
            const newClick: ClickEvent = {
              id: data.id,
              shortCode: (data.links as any)?.slug || "unknown",
              city: data.city || "Unknown",
              country: data.country || "",
              device: data.device_type || "desktop",
              timestamp: new Date(data.clicked_at),
            };

            setRecentClicks((prev) => [newClick, ...prev.slice(0, 9)]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [workspaceId, isLive]);

  return (
    <div className="space-y-4">
      {/* Live Feed */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="w-4 h-4" />
              live activity
              {isLive && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              )}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsLive(!isLive)}
            >
              {isLive ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 max-h-[240px] overflow-y-auto scrollbar-hide">
            <AnimatePresence mode="popLayout">
              {recentClicks.map((click) => (
                <motion.div
                  key={click.id}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: "auto" }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors text-sm"
                >
                  <MousePointer className="w-3 h-3 text-primary shrink-0" />
                  <span className="font-mono text-xs text-primary">
                    /{click.shortCode}
                  </span>
                  <span className="text-muted-foreground truncate flex-1">
                    {click.city}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatDistanceToNow(click.timestamp, { addSuffix: true })}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
            {recentClicks.length === 0 && (
              <div className="text-center py-4 text-sm text-muted-foreground">
                no recent activity
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Anomalies */}
      {anomalies && anomalies.length > 0 && (
        <Card className="border-amber-500/20 relative">
          {anomaliesFetching && (
            <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          )}
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-500 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {anomalies.map((anomaly) => (
                <div
                  key={anomaly.id}
                  className={cn(
                    "p-2 rounded-lg text-sm",
                    anomaly.severity === "critical"
                      ? "bg-rose-500/10 text-rose-500"
                      : "bg-amber-500/10 text-amber-500"
                  )}
                >
                  {anomaly.title}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Insights */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="p-3 rounded-xl bg-muted/30 space-y-1"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-medium text-sm text-foreground">
                    {insight.title}
                  </div>
                  {insight.actionLabel && (
                    <Button variant="ghost" size="sm" className="h-6 text-xs">
                      {insight.actionLabel}
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {insight.description}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Zap className="w-4 h-4" />
            quick actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="h-9 text-xs">
              Create Link
            </Button>
            <Button variant="outline" size="sm" className="h-9 text-xs">
              New Campaign
            </Button>
            <Button variant="outline" size="sm" className="h-9 text-xs">
              Generate QR
            </Button>
            <Button variant="outline" size="sm" className="h-9 text-xs">
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
