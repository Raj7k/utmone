import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, AlertTriangle } from "lucide-react";
import { predictLimitDate, type UsageDataPoint } from "@/lib/optimizations/usageForecasting";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format } from "date-fns";

interface UsageForecastWidgetProps {
  usageHistory: UsageDataPoint[];
  currentUsage: number;
  limit: number;
  resourceName: string;
  upgradeLink?: string;
}

export function UsageForecastWidget({
  usageHistory,
  currentUsage,
  limit,
  resourceName,
  upgradeLink = "/settings/billing"
}: UsageForecastWidgetProps) {
  const forecast = predictLimitDate(usageHistory, limit);
  
  const showWarning = forecast.daysUntilLimit < 7 && forecast.daysUntilLimit >= 0;
  const showCritical = forecast.daysUntilLimit < 2 && forecast.daysUntilLimit >= 0;

  // Prepare chart data
  const chartData = [
    ...usageHistory.map(point => ({
      date: format(point.date, 'MMM dd'),
      actual: point.count,
      projected: null as number | null
    })),
    ...forecast.projectedUsage.map(point => ({
      date: format(point.date, 'MMM dd'),
      actual: null as number | null,
      projected: point.count
    }))
  ];

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" style={{ color: 'rgba(255,255,255,0.9)' }} />
              <h3 className="text-sm font-medium">capacity forecast</h3>
            </div>
            <p className="text-2xl font-bold mt-2">
              {currentUsage} / {limit}
            </p>
            <p className="text-xs text-muted-foreground">{resourceName}</p>
          </div>

          {forecast.predictedLimitDate && (
            <div className="text-right">
              {showCritical ? (
                <Badge variant="destructive" className="mb-2">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {forecast.daysUntilLimit} days left
                </Badge>
              ) : showWarning ? (
                <Badge variant="secondary" className="mb-2 bg-amber-500/10 text-amber-600">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {forecast.daysUntilLimit} days left
                </Badge>
              ) : (
                <Badge variant="outline" className="mb-2">
                  {forecast.daysUntilLimit} days left
                </Badge>
              )}
              <p className="text-xs text-muted-foreground">
                limit on {format(forecast.predictedLimitDate, 'MMM dd')}
              </p>
            </div>
          )}
        </div>

        {usageHistory.length >= 2 && (
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <ReferenceLine
                  y={limit}
                  stroke="hsl(var(--destructive))"
                  strokeDasharray="5 5"
                  label={{ value: 'Limit', fontSize: 12 }}
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Actual"
                />
                <Line
                  type="monotone"
                  dataKey="projected"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Projected"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="text-xs space-y-1">
            <p className="text-muted-foreground">
              growth rate: <span className="font-medium text-foreground">
                {forecast.growthRate > 0 ? '+' : ''}{forecast.growthRate.toFixed(1)}/day
              </span>
            </p>
            <p className="text-muted-foreground">
              confidence: <span className="font-medium text-foreground capitalize">
                {forecast.confidence}
              </span>
            </p>
          </div>

          {showWarning && (
            <Link to={upgradeLink}>
              <Button size="sm" variant="default">
                upgrade now
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}
