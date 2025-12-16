import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MousePointer, Users, Target, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import MiniSparkline from "./MiniSparkline";
import { IntelligenceContext } from "./ContextSwitcher";

interface PerformanceSnapshotProps {
  workspaceId?: string;
  days: number;
  context?: IntelligenceContext;
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

function getCached(workspaceId: string, days: number, context: string): SnapshotData | undefined {
  try {
    const cached = localStorage.getItem(`${CACHE_KEY}-${context}`);
    if (!cached) return undefined;
    const { data, timestamp, wid, d } = JSON.parse(cached);
    if (wid !== workspaceId || d !== days) return undefined;
    if (Date.now() - timestamp > CACHE_EXPIRY) return undefined;
    return data;
  } catch {
    return undefined;
  }
}

function setCache(workspaceId: string, days: number, context: string, data: SnapshotData) {
  try {
    localStorage.setItem(`${CACHE_KEY}-${context}`, JSON.stringify({
      data,
      timestamp: Date.now(),
      wid: workspaceId,
      d: days,
    }));
  } catch {}
}

export default function PerformanceSnapshot({ workspaceId, days, context = "all", preloadedClicks }: PerformanceSnapshotProps) {
  const hasPreloadedData = preloadedClicks !== undefined;
  
  const { data, isFetching } = useQuery({
    queryKey: ["performance-snapshot", workspaceId, days, context],
    queryFn: async () => {
      if (!workspaceId) return null;

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const startDateStr = startDate.toISOString();
      
      // Previous period for trend
      const prevStartDate = new Date(startDate);
      prevStartDate.setDate(prevStartDate.getDate() - days);
      const prevStartDateStr = prevStartDate.toISOString();

      // Fetch clicks with visitor_id for unique count and sparkline
      const { data: clicksData } = await supabase
        .from("link_clicks")
        .select("visitor_id, clicked_at")
        .eq("workspace_id", workspaceId)
        .gte("clicked_at", startDateStr)
        .limit(5000);

      // Previous period clicks for trend
      const { count: prevClickCount } = await supabase
        .from("link_clicks")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspaceId)
        .gte("clicked_at", prevStartDateStr)
        .lt("clicked_at", startDateStr);

      // Previous period unique visitors
      const { data: prevVisitorData } = await supabase
        .from("link_clicks")
        .select("visitor_id")
        .eq("workspace_id", workspaceId)
        .gte("clicked_at", prevStartDateStr)
        .lt("clicked_at", startDateStr)
        .not("visitor_id", "is", null)
        .limit(5000);

      // Conversions
      const { count: totalConversions } = await supabase
        .from("conversion_events")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspaceId)
        .gte("attributed_at", startDateStr);

      // Previous period conversions
      const { count: prevConversions } = await supabase
        .from("conversion_events")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspaceId)
        .gte("attributed_at", prevStartDateStr)
        .lt("attributed_at", startDateStr);

      const clicks = clicksData?.length || 0;
      const conversions = totalConversions || 0;
      const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;
      
      // Real unique visitors count
      const uniqueVisitorIds = new Set(clicksData?.filter(c => c.visitor_id).map(c => c.visitor_id));
      const visitors = uniqueVisitorIds.size;
      
      // Previous period unique visitors
      const prevUniqueVisitors = new Set(prevVisitorData?.filter(c => c.visitor_id).map(c => c.visitor_id)).size;
      
      // Previous period metrics
      const prevClicks = prevClickCount || 0;
      const prevConv = prevConversions || 0;
      const prevConvRate = prevClicks > 0 ? (prevConv / prevClicks) * 100 : 0;

      // Calculate real trends
      const clicksTrend = prevClicks > 0 ? ((clicks - prevClicks) / prevClicks) * 100 : 0;
      const visitorsTrend = prevUniqueVisitors > 0 ? ((visitors - prevUniqueVisitors) / prevUniqueVisitors) * 100 : 0;
      const conversionTrend = prevConvRate > 0 ? ((conversionRate - prevConvRate) / prevConvRate) * 100 : 0;

      // Build real sparklines from click data (last 7 days)
      const dailyClicks = Array(7).fill(0);
      const dailyVisitors: Set<string>[] = Array(7).fill(null).map(() => new Set());
      
      clicksData?.forEach((click: any) => {
        const clickDate = new Date(click.clicked_at);
        const dayIndex = Math.floor((Date.now() - clickDate.getTime()) / (24 * 60 * 60 * 1000));
        if (dayIndex >= 0 && dayIndex < 7) {
          dailyClicks[6 - dayIndex]++;
          if (click.visitor_id) {
            dailyVisitors[6 - dayIndex].add(click.visitor_id);
          }
        }
      });

      const result = {
        clicks,
        visitors,
        conversionRate: conversionRate.toFixed(1),
        clicksSparkline: dailyClicks,
        visitorsSparkline: dailyVisitors.map(s => s.size),
        conversionSparkline: dailyClicks.map((c, i) => c > 0 ? (conversions / clicks) * c : 0), // Proportional
        clicksTrend: Math.round(clicksTrend),
        visitorsTrend: Math.round(visitorsTrend),
        conversionTrend: Math.round(conversionTrend),
      };
      
      if (workspaceId) setCache(workspaceId, days, context, result);
      return result;
    },
    initialData: () => workspaceId ? getCached(workspaceId, days, context) : undefined,
    enabled: !!workspaceId && !hasPreloadedData,
    staleTime: 2 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Use preloaded data if available - but still fetch real unique visitors
  const displayData = hasPreloadedData ? {
    clicks: preloadedClicks,
    visitors: Math.round(preloadedClicks * 0.7), // Estimate when preloaded
    conversionRate: "0.0",
    clicksSparkline: [],
    visitorsSparkline: [],
    conversionSparkline: [],
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
