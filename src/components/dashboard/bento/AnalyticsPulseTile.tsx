import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Activity } from "lucide-react";
import { useWorkspace } from "@/hooks/useWorkspace";
import { LazyAreaChart, Area, ResponsiveContainer, Tooltip, LazyChartContainer } from "@/components/charts/LazyCharts";
import { useCurrentPlan } from "@/hooks/useCurrentPlan";
import { useNavigate } from "react-router-dom";
import { FeatureGuard } from "@/components/feature-gating";

type HourlyData = { hour: number; clicks: number };

export const AnalyticsPulseTile = () => {
  const { currentWorkspace } = useWorkspace();
  const { isPaidTier } = useCurrentPlan();
  const navigate = useNavigate();

  const { data: clicksToday, isLoading } = useQuery<number>({
    queryKey: ["clicks-today", currentWorkspace?.id],
    enabled: !!currentWorkspace?.id,
    queryFn: async (): Promise<number> => {
      if (!currentWorkspace?.id) return 0;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { count, error } = await supabase
        .from("link_clicks")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", currentWorkspace.id)
        .gte("clicked_at", today.toISOString());

      if (error) throw error;
      return count || 0;
    },
  });

  // Fetch 7-day data for sparkline - only for paid tiers
  const { data: weeklyData } = useQuery<HourlyData[]>({
    queryKey: ["clicks-weekly", currentWorkspace?.id, isPaidTier],
    enabled: !!currentWorkspace?.id && isPaidTier,
    queryFn: async (): Promise<HourlyData[]> => {
      if (!currentWorkspace?.id) return [];

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      // @ts-ignore - Suppress deep type inference issue with large Supabase schema
      const result: any = await supabase
        .from("link_clicks")
        .select("clicked_at")
        .eq("workspace_id", currentWorkspace.id)
        .gte("clicked_at", sevenDaysAgo.toISOString())
        .order("clicked_at");

      const data: { clicked_at: string }[] | null = result.data;
      const error: any = result.error;

      if (error) throw error;

      // Group by day
      const daily: HourlyData[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        daily.push({ hour: date.getDate(), clicks: 0 });
      }

      data?.forEach((click) => {
        const clickDate = new Date(click.clicked_at);
        const dayIndex = daily.findIndex(d => d.hour === clickDate.getDate());
        if (dayIndex !== -1) {
          daily[dayIndex].clicks++;
        }
      });

      return daily;
    },
  });

  const showChart = isPaidTier && weeklyData && weeklyData.length > 0 && weeklyData.some(d => d.clicks > 0);
  const activeLinks = 45;
  const topCountry = "USA";

  // Safe data access with defaults
  const safeClicksToday = clicksToday ?? 0;

  return (
    <div 
      className="bg-card rounded-2xl border border-border shadow-sm p-4 cursor-pointer transition-colors h-full"
      style={{ '--hover-border': 'rgba(255,255,255,0.2)' } as React.CSSProperties}
      onClick={() => navigate('/dashboard/analytics')}
    >
      <div className="flex items-center gap-2 mb-3">
        <Activity className="h-5 w-5" style={{ color: 'rgba(255,255,255,0.8)' }} />
        <h3 className="text-title-3 font-display">Analytics Pulse</h3>
      </div>

      {isLoading ? (
        <div className="h-32 flex items-center justify-center">
          <div className="animate-pulse space-y-2 w-full">
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-20 bg-muted rounded" />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Total Clicks</p>
              <p className="text-2xl font-bold text-label tracking-tight">{safeClicksToday.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active Links</p>
              <p className="text-2xl font-bold text-label tracking-tight">{activeLinks}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Top Country</p>
              <p className="text-2xl font-bold text-label tracking-tight">{topCountry}</p>
            </div>
          </div>

          <FeatureGuard 
            feature="geo_analytics"
            mode="lock"
            fallback={
              showChart ? (
                <div className="h-20 -mx-2">
                  <LazyChartContainer height={80}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LazyAreaChart data={weeklyData}>
                        <defs>
                          <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            fontSize: '12px',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="clicks"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorClicks)"
                        />
                      </LazyAreaChart>
                    </ResponsiveContainer>
                  </LazyChartContainer>
                </div>
              ) : (
                <p className="text-caption-2 text-tertiary-label text-center py-4">
                  No clicks in the last 7 days
                </p>
              )
            }
          >
            {showChart ? (
            // PAID TIER: Show chart if data exists
            <div className="h-20 -mx-2">
              <LazyChartContainer height={80}>
                <ResponsiveContainer width="100%" height="100%">
                  <LazyAreaChart data={weeklyData}>
                    <defs>
                      <linearGradient id="colorClicksPaid" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="clicks"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorClicksPaid)"
                    />
                  </LazyAreaChart>
                </ResponsiveContainer>
              </LazyChartContainer>
            </div>
          ) : (
            <p className="text-caption-2 text-tertiary-label text-center py-4">
              No clicks in the last 7 days
            </p>
          )}
          </FeatureGuard>
        </div>
      )}
    </div>
  );
};
