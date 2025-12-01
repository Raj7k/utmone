import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { ChartWrapper } from "@/components/charts/ChartWrapper";
import { useChartAccessibility } from "@/hooks/useChartAccessibility";
import { EstimatedBadge } from "./EstimatedBadge";
import { useStratifiedAnalytics } from "@/hooks/useStratifiedAnalytics";
import { Skeleton } from "@/components/ui/skeleton";

interface StratifiedAnalyticsChartProps {
  workspaceId: string;
  linkId?: string;
  days?: number;
}

export function StratifiedAnalyticsChart({
  workspaceId,
  linkId,
  days = 30,
}: StratifiedAnalyticsChartProps) {
  const { data, isLoading, isLoadingPrecise, isEstimated } = useStratifiedAnalytics(
    workspaceId,
    linkId,
    days
  );

  // Accessibility data
  const accessibilityData = useChartAccessibility(
    data?.timeSeries || [],
    "Click Activity Over Time",
    "date",
    isEstimated ? ["totalClicks"] : ["totalClicks", "uniqueClicks"]
  );

  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">click activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">click activity</CardTitle>
        <EstimatedBadge
          isEstimated={isEstimated}
          isLoadingPrecise={isLoadingPrecise}
          confidence={data.confidence}
        />
      </CardHeader>
      <CardContent>
        <ChartWrapper height={300} accessibilityData={accessibilityData}>
          <ResponsiveContainer width="100%" height={300}>
          {isEstimated ? (
            <AreaChart data={data.timeSeries}>
              <defs>
                <linearGradient id="estimatedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Area
                type="monotone"
                dataKey="totalClicks"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#estimatedGradient)"
                strokeDasharray="5 5"
              />
            </AreaChart>
          ) : (
            <LineChart data={data.timeSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Line
                type="monotone"
                dataKey="totalClicks"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="uniqueClicks"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
        </ChartWrapper>

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <div>
            <span className="font-medium text-foreground">
              {(data.totalClicks || 0).toLocaleString()}
            </span>{" "}
            total clicks
          </div>
          <div>
            <span className="font-medium text-foreground">
              {(data.uniqueVisitors || 0).toLocaleString()}
            </span>{" "}
            unique visitors
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
