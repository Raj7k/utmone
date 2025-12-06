import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useClickTimeSeries, TimeSeriesGranularity } from "@/hooks/useClickTimeSeries";
import { useState, useMemo, memo } from "react";
import { LazyLineChart, LazyChartContainer, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "@/components/charts/LazyCharts";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";
import { ChartWrapper } from "@/components/charts/ChartWrapper";
import { useChartAccessibility } from "@/hooks/useChartAccessibility";

interface ClicksOverTimeProps {
  workspaceId: string;
  linkId?: string;
  campaignName?: string;
}

const ClicksOverTimeComponent = ({ workspaceId, linkId, campaignName }: ClicksOverTimeProps) => {
  const [days, setDays] = useState<number>(30);
  const [granularity, setGranularity] = useState<TimeSeriesGranularity>("daily");

  const { data, isLoading } = useClickTimeSeries({
    workspaceId,
    linkId,
    campaignName,
    days,
    granularity
  });

  const chartData = useMemo(() => data?.timeSeries || [], [data?.timeSeries]);
  const velocityLabel = useMemo(() => 
    granularity === "daily" ? "per day" : granularity === "weekly" ? "per week" : "per month",
    [granularity]
  );

  // Generate accessibility table data for screen readers
  const accessibilityData = useChartAccessibility(
    chartData,
    `Clicks over time showing total and unique clicks ${velocityLabel}`,
    "date",
    ["totalClicks", "uniqueClicks"]
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="text-center text-secondary-label">loading chart data…</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Clicks Over Time
            </CardTitle>
            <CardDescription>
              {data?.velocity.toFixed(1)} avg clicks {velocityLabel}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={days.toString()} onValueChange={(value) => setDays(parseInt(value))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Select value={granularity} onValueChange={(value) => setGranularity(value as TimeSeriesGranularity)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartWrapper height={300} accessibilityData={accessibilityData}>
          <LazyChartContainer height={300}>
            <ResponsiveContainer width="100%" height={300}>
              <LazyLineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                  tick={{ fill: "hsl(var(--secondary-label))" }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fill: "hsl(var(--secondary-label))" }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="totalClicks" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Total Clicks"
                  dot={{ fill: "hsl(var(--primary))" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="uniqueClicks" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={2}
                  name="Unique Clicks"
                  dot={{ fill: "hsl(var(--accent))" }}
                />
              </LazyLineChart>
            </ResponsiveContainer>
          </LazyChartContainer>
        </ChartWrapper>
      </CardContent>
    </Card>
  );
};

export const ClicksOverTime = memo(ClicksOverTimeComponent);
