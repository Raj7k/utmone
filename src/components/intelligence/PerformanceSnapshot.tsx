import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MousePointer, Users, Target, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import MiniSparkline from "./MiniSparkline";

interface PerformanceSnapshotProps {
  workspaceId?: string;
  days: number;
  preloadedClicks?: number;
}

interface MetricData {
  label: string;
  value: string | number;
  trend: number;
  sparkline: number[];
  icon: typeof MousePointer;
}

interface SnapshotData {
  clicks: number;
  visitors: number;
  conversionRate: string;
  clicksSparkline: number[];
  visitorsSparkline: number[];
  conversionSparkline: number[];
  clicksTrend: number;
  visitorsTrend: number;
  conversionTrend: number;
}

// Cache helpers
const CACHE_KEY = 'performance-snapshot-cache';
const CACHE_EXPIRY = 2 * 60 * 1000; // 2 minutes

function getCached(workspaceId: string, days: number): SnapshotData | undefined {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return undefined;
    const { data, timestamp, wid, d } = JSON.parse(cached);
    if (wid !== workspaceId || d !== days) return undefined;
    if (Date.now() - timestamp > CACHE_EXPIRY) return undefined;
    return data;
  } catch {
    return undefined;
  }
}

function setCache(workspaceId: string, days: number, data: SnapshotData) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now(),
      wid: workspaceId,
      d: days,
    }));
  } catch {}
}

export default function PerformanceSnapshot({ workspaceId, days, preloadedClicks }: PerformanceSnapshotProps) {
  const hasPreloadedData = preloadedClicks !== undefined;
  
  const { data, isFetching } = useQuery({
    queryKey: ["performance-snapshot", workspaceId, days],
    queryFn: async () => {
      if (!workspaceId) return null;

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Use COUNT for clicks instead of fetching all records
      const { count: totalClicks } = await supabase
        .from("link_clicks")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspaceId)
        .gte("clicked_at", startDate.toISOString());

      // Use COUNT for conversions
      const { count: totalConversions } = await supabase
        .from("conversion_events")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspaceId)
        .gte("attributed_at", startDate.toISOString());

      const clicks = totalClicks || 0;
      const conversions = totalConversions || 0;
      const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;

      // Generate sparkline data (mock for now)
      const generateSparkline = () => Array.from({ length: 7 }, () => Math.random() * 100);

      const result = {
        clicks,
        visitors: Math.round(clicks * 0.7), // Estimate unique visitors
        conversionRate: conversionRate.toFixed(1),
        clicksSparkline: generateSparkline(),
        visitorsSparkline: generateSparkline(),
        conversionSparkline: generateSparkline(),
        clicksTrend: Math.random() > 0.5 ? 12 : -8,
        visitorsTrend: Math.random() > 0.5 ? 8 : -5,
        conversionTrend: Math.random() > 0.5 ? 15 : -3,
      };
      
      if (workspaceId) setCache(workspaceId, days, result);
      return result;
    },
    initialData: () => workspaceId ? getCached(workspaceId, days) : undefined,
    enabled: !!workspaceId && !hasPreloadedData,
    staleTime: 2 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Use preloaded data if available
  const displayData = hasPreloadedData ? {
    clicks: preloadedClicks,
    visitors: Math.round(preloadedClicks * 0.7),
    conversionRate: "0.0",
    clicksSparkline: Array.from({ length: 7 }, () => Math.random() * 100),
    visitorsSparkline: Array.from({ length: 7 }, () => Math.random() * 100),
    conversionSparkline: Array.from({ length: 7 }, () => Math.random() * 100),
    clicksTrend: 0,
    visitorsTrend: 0,
    conversionTrend: 0,
  } : data;

  const metrics: MetricData[] = [
    {
      label: "total clicks",
      value: displayData?.clicks?.toLocaleString() || "0",
      trend: displayData?.clicksTrend || 0,
      sparkline: displayData?.clicksSparkline || [],
      icon: MousePointer,
    },
    {
      label: "unique visitors",
      value: displayData?.visitors?.toLocaleString() || "0",
      trend: displayData?.visitorsTrend || 0,
      sparkline: displayData?.visitorsSparkline || [],
      icon: Users,
    },
    {
      label: "conversion rate",
      value: `${displayData?.conversionRate || "0"}%`,
      trend: displayData?.conversionTrend || 0,
      sparkline: displayData?.conversionSparkline || [],
      icon: Target,
    },
  ];

  return (
    <Card className="h-full relative">
      {/* Subtle loading indicator */}
      {isFetching && (
        <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-primary animate-pulse" />
      )}
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          performance snapshot
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">{metric.label}</span>
                  <span className={cn(
                    "flex items-center gap-0.5 text-xs",
                    metric.trend > 0 ? "text-emerald-500" : "text-rose-500"
                  )}>
                    {metric.trend > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {Math.abs(metric.trend)}%
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <span className="text-lg font-semibold text-foreground tabular-nums">
                    {metric.value}
                  </span>
                  <div className="w-16 h-6">
                    <MiniSparkline
                      data={metric.sparkline}
                      color={metric.trend > 0 ? "hsl(142, 76%, 36%)" : "hsl(var(--primary))"}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
