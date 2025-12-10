import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MousePointer, Users, Target, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import MiniSparkline from "./MiniSparkline";

interface PerformanceSnapshotProps {
  workspaceId?: string;
  days: number;
}

interface MetricData {
  label: string;
  value: string | number;
  trend: number;
  sparkline: number[];
  icon: typeof MousePointer;
}

export default function PerformanceSnapshot({ workspaceId, days }: PerformanceSnapshotProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["performance-snapshot", workspaceId, days],
    queryFn: async () => {
      if (!workspaceId) return null;

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Fetch clicks
      const { data: clicks } = await supabase
        .from("link_clicks")
        .select("id, visitor_id, clicked_at, links!inner(workspace_id)")
        .eq("links.workspace_id", workspaceId)
        .gte("clicked_at", startDate.toISOString());

      // Fetch conversions
      const { data: conversions } = await supabase
        .from("conversion_events")
        .select("id, links!inner(workspace_id)")
        .eq("links.workspace_id", workspaceId)
        .gte("attributed_at", startDate.toISOString());

      const totalClicks = clicks?.length || 0;
      const uniqueVisitors = new Set(clicks?.map((c) => c.visitor_id)).size;
      const totalConversions = conversions?.length || 0;
      const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

      // Generate sparkline data (mock for now)
      const generateSparkline = () => Array.from({ length: 7 }, () => Math.random() * 100);

      return {
        clicks: totalClicks,
        visitors: uniqueVisitors,
        conversionRate: conversionRate.toFixed(1),
        clicksSparkline: generateSparkline(),
        visitorsSparkline: generateSparkline(),
        conversionSparkline: generateSparkline(),
        clicksTrend: Math.random() > 0.5 ? 12 : -8,
        visitorsTrend: Math.random() > 0.5 ? 8 : -5,
        conversionTrend: Math.random() > 0.5 ? 15 : -3,
      };
    },
    enabled: !!workspaceId,
    staleTime: 2 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const metrics: MetricData[] = [
    {
      label: "total clicks",
      value: data?.clicks?.toLocaleString() || "0",
      trend: data?.clicksTrend || 0,
      sparkline: data?.clicksSparkline || [],
      icon: MousePointer,
    },
    {
      label: "unique visitors",
      value: data?.visitors?.toLocaleString() || "0",
      trend: data?.visitorsTrend || 0,
      sparkline: data?.visitorsSparkline || [],
      icon: Users,
    },
    {
      label: "conversion rate",
      value: `${data?.conversionRate || "0"}%`,
      trend: data?.conversionTrend || 0,
      sparkline: data?.conversionSparkline || [],
      icon: Target,
    },
  ];

  return (
    <Card className="h-full">
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
