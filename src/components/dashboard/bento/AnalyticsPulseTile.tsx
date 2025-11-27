import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Activity, Lock } from "lucide-react";
import { useWorkspace } from "@/hooks/useWorkspace";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { checkFeatureAccess } from "@/lib/checkFeatureAccess";
import { useCurrentPlan } from "@/hooks/useCurrentPlan";
import { Button } from "@/components/ui/button";

type HourlyData = { hour: number; clicks: number };

export const AnalyticsPulseTile = () => {
  const { currentWorkspace } = useWorkspace();
  const { isPaidTier } = useCurrentPlan();

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

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-5 w-5 text-primary" />
        <h3 className="text-title-3 font-display">Analytics Pulse</h3>
      </div>

      {isLoading ? (
        <div className="h-32 flex items-center justify-center">
          <div className="animate-pulse space-y-2 w-full">
            <div className="h-4 bg-slate-200 rounded w-1/2" />
            <div className="h-20 bg-slate-200 rounded" />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-caption-1 text-tertiary-label">Clicks last 7 days</p>
            <p className="text-5xl font-display font-bold text-label mt-1">
              {clicksToday || 0}
            </p>
          </div>

          {!isPaidTier ? (
            // FREE TIER: Show upgrade lock
            <div className="flex flex-col items-center justify-center py-8 px-4 bg-muted/20 rounded-lg border border-border/50">
              <Lock className="h-8 w-8 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">Analytics Chart Locked</p>
              <p className="text-xs text-muted-foreground text-center mb-4">
                Upgrade to Pro to see click trends over time
              </p>
              <Button size="sm" variant="default">
                Upgrade to Pro
              </Button>
            </div>
          ) : showChart ? (
            // PAID TIER: Show chart if data exists
            <div className="h-20 -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
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
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            // PAID TIER: No data yet
            <p className="text-caption-2 text-tertiary-label text-center py-4">
              No clicks in the last 7 days
            </p>
          )}
        </div>
      )}
    </div>
  );
};
