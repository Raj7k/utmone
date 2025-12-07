import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartWrapper } from "@/components/charts/ChartWrapper";
import { useChartAccessibility } from "@/hooks/useChartAccessibility";
import { useClickHeatmap } from "@/hooks/useClickHeatmap";
import { Skeleton } from "@/components/ui/skeleton";
import { LazyBarChart, LazyChartContainer, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "@/components/charts/LazyCharts";

interface DayOfWeekChartProps {
  workspaceId: string;
  linkId?: string;
  days?: number;
}

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const DayOfWeekChart = ({ workspaceId, linkId, days = 30 }: DayOfWeekChartProps) => {
  const { heatmapData, bestDay, isLoading } = useClickHeatmap({ workspaceId, linkId, days });

  if (isLoading) {
    return (
      <Card variant="glass">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Aggregate clicks by day of week
  const dayTotals = new Map<number, number>();
  for (let day = 0; day < 7; day++) {
    dayTotals.set(day, 0);
  }
  heatmapData.forEach(cell => {
    dayTotals.set(cell.day, (dayTotals.get(cell.day) || 0) + cell.clicks);
  });

  // Calculate average
  const totalClicks = Array.from(dayTotals.values()).reduce((sum, val) => sum + val, 0);
  const average = totalClicks / 7;

  // Prepare chart data
  const chartData = Array.from({ length: 7 }, (_, i) => ({
    day: DAYS_OF_WEEK[i],
    dayIndex: i,
    clicks: dayTotals.get(i) || 0,
    isBest: i === bestDay.day
  }));

  // Accessibility data
  const accessibilityData = useChartAccessibility(
    chartData,
    "Day of Week Click Distribution",
    "day",
    ["clicks"]
  );

  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle>Day of Week Performance</CardTitle>
        <CardDescription>
          Click distribution across the week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartWrapper height={300} accessibilityData={accessibilityData}>
          <LazyChartContainer height={300}>
            <ResponsiveContainer width="100%" height={300}>
              <LazyBarChart data={chartData}>
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload[0]) {
                      const data = payload[0].payload;
                      const percentDiff = ((data.clicks - average) / average * 100).toFixed(1);
                      return (
                        <div className="rounded-lg shadow-lg p-3 bg-popover border border-border">
                          <p className="font-semibold text-popover-foreground">{data.day}</p>
                          <p className="text-sm">
                            <span className="font-medium text-popover-foreground">{data.clicks}</span>
                            <span className="text-muted-foreground"> clicks</span>
                          </p>
                          {data.isBest && (
                            <p className="text-xs font-medium mt-1 text-popover-foreground/80">
                              🏆 Best Day
                            </p>
                          )}
                          <p className="text-xs mt-1 text-muted-foreground">
                            {Number(percentDiff) > 0 ? "+" : ""}{percentDiff}% vs avg
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="clicks" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.isBest ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.5)"}
                    />
                  ))}
                </Bar>
              </LazyBarChart>
            </ResponsiveContainer>
          </LazyChartContainer>
        </ChartWrapper>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary" />
            <span className="text-muted-foreground">Best Day</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-muted-foreground/50" />
            <span className="text-muted-foreground">Other Days</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
