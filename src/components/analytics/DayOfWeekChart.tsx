import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartWrapper } from "@/components/charts/ChartWrapper";
import { useChartAccessibility } from "@/hooks/useChartAccessibility";
import { useClickHeatmap } from "@/hooks/useClickHeatmap";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

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
          <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.5)' }}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.5)' }} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload[0]) {
                  const data = payload[0].payload;
                  const percentDiff = ((data.clicks - average) / average * 100).toFixed(1);
                  return (
                    <div 
                      className="rounded-lg shadow-lg p-3"
                      style={{ 
                        background: 'rgba(24,24,27,0.95)', 
                        border: '1px solid rgba(255,255,255,0.1)' 
                      }}
                    >
                      <p className="font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>{data.day}</p>
                      <p className="text-sm">
                        <span className="font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>{data.clicks}</span>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}> clicks</span>
                      </p>
                      {data.isBest && (
                        <p className="text-xs font-medium mt-1" style={{ color: 'rgba(255,255,255,0.8)' }}>
                          🏆 Best Day
                        </p>
                      )}
                      <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
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
                  fill={entry.isBest ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        </ChartWrapper>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ background: 'rgba(255,255,255,0.8)' }} />
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>Best Day</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ background: 'rgba(255,255,255,0.3)' }} />
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>Other Days</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
