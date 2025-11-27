import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Activity } from "lucide-react";
import { useWorkspace } from "@/hooks/useWorkspace";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { checkFeatureAccess } from "@/lib/checkFeatureAccess";

type HourlyData = { hour: number; clicks: number };

export const AnalyticsPulseTile = () => {
  const { currentWorkspace } = useWorkspace();

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

  const { data: hourlyData } = useQuery({
    queryKey: ["clicks-hourly", currentWorkspace?.id],
    enabled: !!currentWorkspace?.id,
    queryFn: async () => {
      if (!currentWorkspace?.id) return [] as HourlyData[];

      // Check if user has access to analytics
      const access = await checkFeatureAccess(currentWorkspace.id, 'geo_analytics');
      if (!access.allowed) return [] as HourlyData[];

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("link_clicks")
        .select("clicked_at")
        .eq("workspace_id", currentWorkspace.id)
        .gte("clicked_at", today.toISOString())
        .order("clicked_at");

      if (error) throw error;

      // Group by hour
      const hourly = new Array(24).fill(0).map((_, hour) => ({
        hour,
        clicks: 0,
      }));

      data?.forEach((click) => {
        const hour = new Date(click.clicked_at).getHours();
        hourly[hour].clicks++;
      });

      return hourly;
    },
  });

  const showChart = hourlyData && hourlyData.length > 0 && hourlyData.some(d => d.clicks > 0);

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
            <p className="text-caption-1 text-tertiary-label">Clicks today</p>
            <p className="text-5xl font-display font-bold text-label mt-1">
              {clicksToday || 0}
            </p>
          </div>

          {showChart ? (
            <div className="h-20 -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyData}>
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
            <p className="text-caption-2 text-tertiary-label text-center py-4">
              {!showChart && hourlyData ? "Upgrade to Pro for detailed analytics" : "No data yet today"}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
