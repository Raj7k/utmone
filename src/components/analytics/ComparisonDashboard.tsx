import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useComparisonMetrics } from "@/hooks/useComparisonMetrics";
import { PeriodSelector } from "./PeriodSelector";
import { useState } from "react";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface ComparisonDashboardProps {
  workspaceId: string;
}

export const ComparisonDashboard = ({ workspaceId }: ComparisonDashboardProps) => {
  const [period, setPeriod] = useState<"day" | "week" | "month">("month");
  const { data: metrics, isLoading } = useComparisonMetrics({ workspaceId, period });

  if (isLoading) {
    return <div className="text-center py-8 text-secondary-label">loading comparison data…</div>;
  }

  if (!metrics) {
    return <div className="text-center py-8 text-secondary-label">no comparison data available</div>;
  }

  const comparisonItems = [
    {
      label: "Total Clicks",
      current: metrics.clicks.current,
      previous: metrics.clicks.previous,
      change: metrics.clicks.change,
    },
    {
      label: "Unique Visitors",
      current: metrics.uniqueClicks.current,
      previous: metrics.uniqueClicks.previous,
      change: metrics.uniqueClicks.change,
    },
    {
      label: "Links Created",
      current: metrics.links.current,
      previous: metrics.links.previous,
      change: metrics.links.change,
    },
    {
      label: "Average Click Rate",
      current: Number(metrics.clickRate.current.toFixed(1)),
      previous: Number(metrics.clickRate.previous.toFixed(1)),
      change: metrics.clickRate.change,
      suffix: " per link",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-title-2 font-semibold text-label mb-2">Period Comparison</h2>
          <p className="text-body-apple text-secondary-label">
            Compare your performance across different time periods
          </p>
        </div>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {comparisonItems.map((item) => {
          const isPositive = item.change > 0;
          const isNegative = item.change < 0;
          const isNeutral = item.change === 0;
          const maxValue = Math.max(item.current, item.previous);
          const currentPercent = maxValue > 0 ? (item.current / maxValue) * 100 : 0;
          const previousPercent = maxValue > 0 ? (item.previous / maxValue) * 100 : 0;

          return (
            <Card key={item.label}>
              <CardHeader>
                <CardTitle className="text-base">{item.label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-xs text-tertiary-label mb-1">Current Period</div>
                    <div className="text-2xl font-bold text-label">
                      {item.current.toLocaleString()}
                      {item.suffix && <span className="text-sm text-secondary-label">{item.suffix}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-tertiary-label mb-1">Previous Period</div>
                    <div className="text-xl font-semibold text-secondary-label">
                      {item.previous.toLocaleString()}
                      {item.suffix && <span className="text-xs text-tertiary-label">{item.suffix}</span>}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Progress value={currentPercent} className="h-2" />
                    </div>
                    <span className="text-xs text-label font-medium w-16 text-right">Current</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Progress value={previousPercent} className="h-2 opacity-50" />
                    </div>
                    <span className="text-xs text-secondary-label w-16 text-right">Previous</span>
                  </div>
                </div>

                <div
                  className={cn(
                    "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium",
                    isPositive && "bg-system-green/10 text-system-green",
                    isNegative && "bg-system-red/10 text-system-red",
                    isNeutral && "bg-muted text-secondary-label"
                  )}
                >
                  {isPositive && <ArrowUp className="h-3 w-3" />}
                  {isNegative && <ArrowDown className="h-3 w-3" />}
                  {isNeutral && <Minus className="h-3 w-3" />}
                  <span>{Math.abs(item.change).toFixed(1)}% vs previous</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
