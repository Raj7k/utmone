import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, DollarSign, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { IntelligenceContext } from "./ContextSwitcher";
import MiniSparkline from "./MiniSparkline";

interface RevenueBentoCardProps {
  workspaceId?: string;
  days: number;
  context: IntelligenceContext;
  preloadedData?: {
    totalRevenue: number;
    conversions: number;
    channels: Array<{ source: string; revenue: number; percentage: number }>;
  };
}

interface ChannelAttribution {
  source: string;
  revenue: number;
  percentage: number;
  trend: number;
}

export default function RevenueBentoCard({ workspaceId, days, context, preloadedData }: RevenueBentoCardProps) {
  // If preloaded data exists, use it directly without fetching
  const hasPreloadedData = !!preloadedData;
  
  const { data, isLoading } = useQuery({
    queryKey: ["revenue-attribution", workspaceId, days, context],
    queryFn: async () => {
      if (!workspaceId) return null;

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Fetch conversion events with revenue
      const { data: conversions, error } = await supabase
        .from("conversion_events")
        .select(`
          event_value,
          attributed_at,
          link_id,
          workspace_id,
          links!inner(
            utm_source,
            utm_medium,
            campaign_id
          )
        `)
        .eq("workspace_id", workspaceId)
        .gte("attributed_at", startDate.toISOString())
        .limit(2000);

      if (error) throw error;

      // Aggregate by source
      const sourceMap = new Map<string, number>();
      let totalRevenue = 0;

      conversions?.forEach((conv: any) => {
        const value = conv.event_value || 0;
        totalRevenue += value;
        
        const source = conv.links?.utm_source || "direct";
        sourceMap.set(source, (sourceMap.get(source) || 0) + value);
      });

      // Sort and get top 3
      const channels: ChannelAttribution[] = Array.from(sourceMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([source, revenue]) => ({
          source,
          revenue,
          percentage: totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0,
          trend: Math.random() > 0.5 ? Math.random() * 20 : -Math.random() * 10, // Placeholder
        }));

      // Generate sparkline data (last 7 data points)
      const sparklineData = Array.from({ length: 7 }, (_, i) => ({
        value: Math.floor(Math.random() * 1000) + 500, // Placeholder
      }));

      return {
        totalRevenue,
        channels,
        sparklineData,
        conversions: conversions?.length || 0,
      };
    },
    enabled: !!workspaceId && !hasPreloadedData,
    staleTime: 2 * 60 * 1000,
  });

  // Use preloaded data if available - with null safety
  const displayData = hasPreloadedData ? {
    totalRevenue: preloadedData?.totalRevenue ?? 0,
    conversions: preloadedData?.conversions ?? 0,
    channels: (preloadedData?.channels ?? []).map(c => ({ ...c, trend: 0 })),
    sparklineData: Array.from({ length: 7 }, () => ({ value: Math.floor(Math.random() * 1000) + 500 })),
  } : data;

  const showLoading = !hasPreloadedData && isLoading;

  if (showLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  const totalRevenue = displayData?.totalRevenue || 0;
  const channels = displayData?.channels || [];
  const sparklineData = displayData?.sparklineData || [];

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            attributed revenue
          </CardTitle>
          <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
            view details
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Total Revenue */}
          <div className="space-y-4">
            <div>
              <div className="text-4xl font-bold text-foreground tabular-nums">
                ${totalRevenue.toLocaleString()}
              </div>
            <div className="text-sm text-muted-foreground mt-1">
              from {displayData?.conversions || 0} conversions
              </div>
            </div>
            
            {/* Mini Sparkline */}
            <div className="h-16">
              <MiniSparkline
                data={sparklineData.map((d) => d.value)}
                color="hsl(var(--primary))"
              />
            </div>
          </div>

          {/* Right: Top Channels */}
          <div className="space-y-3">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              top channels
            </div>
            {channels.length > 0 ? (
              channels.map((channel, index) => (
                <div key={channel.source} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground capitalize">
                      {channel.source}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground tabular-nums">
                        ${channel.revenue.toLocaleString()}
                      </span>
                      <span className={cn(
                        "flex items-center text-xs",
                        channel.trend > 0 ? "text-emerald-500" : "text-rose-500"
                      )}>
                        {channel.trend > 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${channel.percentage}%`,
                        backgroundColor: `hsl(var(--primary) / ${1 - index * 0.2})`,
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground py-4 text-center">
                no revenue data yet
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
