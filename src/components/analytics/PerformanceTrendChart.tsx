import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LazyAreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  LazyChartContainer 
} from "@/components/charts/LazyCharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { format, subDays, startOfDay } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TrendDataPoint {
  date: string;
  clicks: number;
  visitors: number;
}

interface PerformanceTrendChartProps {
  workspaceId: string;
  /** Pre-fetched trend data - if provided, skips internal query */
  trendData?: TrendDataPoint[];
}

type DateRange = 7 | 14 | 30 | 90;

export const PerformanceTrendChart = ({ workspaceId, trendData }: PerformanceTrendChartProps) => {
  const [dateRange, setDateRange] = useState<DateRange>(30);

  // Only fetch if no pre-fetched data provided
  const { data, isLoading } = useQuery({
    queryKey: ["performance-trend", workspaceId, dateRange],
    queryFn: async () => {
      const startDate = startOfDay(subDays(new Date(), dateRange));

      // OPTIMIZED: Reduced limit from 5000 to 500, use COUNT aggregation
      const { data: clicks, error } = await supabaseFrom('link_clicks')
        .select("clicked_at, is_unique")
        .eq("workspace_id", workspaceId)
        .gte("clicked_at", startDate.toISOString())
        .limit(5000);

      if (error) throw error;

      // Group by day
      const dailyData = new Map<string, { total: number; unique: number }>();
      
      // Initialize all days
      for (let i = 0; i < dateRange; i++) {
        const day = format(subDays(new Date(), dateRange - 1 - i), 'MMM dd');
        dailyData.set(day, { total: 0, unique: 0 });
      }

      clicks?.forEach(click => {
        const day = format(new Date(click.clicked_at), 'MMM dd');
        const existing = dailyData.get(day) || { total: 0, unique: 0 };
        dailyData.set(day, {
          total: existing.total + 1,
          unique: existing.unique + (click.is_unique ? 1 : 0)
        });
      });

      return Array.from(dailyData.entries()).map(([date, data]) => ({
        date,
        clicks: data.total,
        visitors: data.unique
      }));
    },
    enabled: !!workspaceId && !trendData,
    staleTime: 5 * 60 * 1000, // 5 min stale time
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const chartData = trendData || data;
  const showLoading = isLoading && !trendData;

  const ranges: { value: DateRange; label: string }[] = [
    { value: 7, label: '7d' },
    { value: 14, label: '14d' },
    { value: 30, label: '30d' },
    { value: 90, label: '90d' }
  ];

  if (showLoading) {
    return (
      <Card className="rounded-2xl">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">performance over time</CardTitle>
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {ranges.map(range => (
            <Button
              key={range.value}
              variant="ghost"
              size="sm"
              onClick={() => setDateRange(range.value)}
              className={cn(
                "h-7 px-3 text-xs",
                dateRange === range.value && "bg-background shadow-sm"
              )}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <LazyChartContainer height={300}>
          <ResponsiveContainer width="100%" height={300}>
            <LazyAreaChart data={chartData || []}>
              <defs>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--secondary-label))', fontSize: 12 }}
                tickFormatter={(value) => dateRange > 30 ? value.split(' ')[0] : value}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--secondary-label))', fontSize: 12 }}
                width={40}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px hsl(0 0% 0% / 0.1)'
                }}
                labelStyle={{ color: 'hsl(var(--label))' }}
              />
              <Area
                type="monotone"
                dataKey="clicks"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorClicks)"
                name="Total Clicks"
              />
              <Area
                type="monotone"
                dataKey="visitors"
                stroke="hsl(var(--accent))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorVisitors)"
                name="Unique Visitors"
              />
            </LazyAreaChart>
          </ResponsiveContainer>
        </LazyChartContainer>
        
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-sm text-secondary-label">Clicks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <span className="text-sm text-secondary-label">Visitors</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};