import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LazyLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LazyChartContainer } from "@/components/charts/LazyCharts";
import { TrendingUp } from "lucide-react";
import { useClickTrendPredictor } from "@/hooks/useClickTrendPredictor";
import { Skeleton } from "@/components/ui/skeleton";

interface ClickTrendPredictorProps {
  linkId: string;
}

export const ClickTrendPredictor = ({ linkId }: ClickTrendPredictorProps) => {
  const { data, isLoading } = useClickTrendPredictor(linkId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">click predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.predictions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">click predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-secondary-label">not enough data yet — check back after 14 days</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5" style={{ color: 'rgba(59,130,246,1)' }} />
          click predictions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-muted/30 rounded-lg">
          <p className="text-sm font-medium text-label">{data.trend}</p>
          <p className="text-xs text-tertiary-label mt-1">
            based on your last 30 days — {data.confidence}% confidence
          </p>
        </div>
        <LazyChartContainer height={200}>
          <ResponsiveContainer width="100%" height={200}>
            <LazyLineChart data={data.predictions}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--secondary-label))"
                fontSize={12}
                tickFormatter={(date) => new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              />
              <YAxis stroke="hsl(var(--secondary-label))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="clicks"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={payload.predicted ? 3 : 4}
                      fill={payload.predicted ? "hsl(var(--primary))" : "hsl(var(--primary))"}
                      fillOpacity={payload.predicted ? 0.5 : 1}
                      strokeDasharray={payload.predicted ? "3 3" : "0"}
                    />
                  );
                }}
              />
            </LazyLineChart>
          </ResponsiveContainer>
        </LazyChartContainer>
      </CardContent>
    </Card>
  );
};
