import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useComparisonMetrics } from "@/hooks/useComparisonMetrics";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface LinkPeriodComparisonProps {
  workspaceId: string;
  linkId: string;
}

export function LinkPeriodComparison({ workspaceId, linkId }: LinkPeriodComparisonProps) {
  const [period, setPeriod] = useState<"day" | "week" | "month">("week");
  const { data: metrics, isLoading } = useComparisonMetrics({ workspaceId, period });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm lowercase">loading period comparison…</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 animate-pulse bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  if (!metrics) return null;

  const getTrendIcon = (change: number) => {
    if (change > 5) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (change < -5) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 5) return "text-green-600";
    if (change < -5) return "text-red-600";
    return "text-muted-foreground";
  };

  const formatPeriodLabel = (period: string) => {
    switch (period) {
      case "day":
        return "vs yesterday";
      case "week":
        return "vs last week";
      case "month":
        return "vs last month";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-display font-semibold lowercase">period comparison</h3>
        <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">daily</SelectItem>
            <SelectItem value="week">weekly</SelectItem>
            <SelectItem value="month">monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Clicks */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground lowercase">clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">{metrics.clicks.current.toLocaleString()}</div>
              <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor(metrics.clicks.change)}`}>
                {getTrendIcon(metrics.clicks.change)}
                <span>{Math.abs(metrics.clicks.change).toFixed(1)}%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{formatPeriodLabel(period)}</p>
          </CardContent>
        </Card>

        {/* Unique Clicks */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground lowercase">unique visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">{metrics.uniqueClicks.current.toLocaleString()}</div>
              <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor(metrics.uniqueClicks.change)}`}>
                {getTrendIcon(metrics.uniqueClicks.change)}
                <span>{Math.abs(metrics.uniqueClicks.change).toFixed(1)}%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{formatPeriodLabel(period)}</p>
          </CardContent>
        </Card>

        {/* Click Rate */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground lowercase">click rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">{metrics.clickRate.current.toFixed(1)}%</div>
              <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor(metrics.clickRate.change)}`}>
                {getTrendIcon(metrics.clickRate.change)}
                <span>{Math.abs(metrics.clickRate.change).toFixed(1)}%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{formatPeriodLabel(period)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
