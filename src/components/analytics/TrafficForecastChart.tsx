import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartWrapper } from "@/components/charts/ChartWrapper";
import { useChartAccessibility } from "@/hooks/useChartAccessibility";
import { TrendingUp, Calendar } from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine,
  ComposedChart
} from "recharts";

interface ForecastDataPoint {
  date: string;
  clicks: number;
  isHistorical: boolean;
  lower?: number;
  upper?: number;
}

interface TrafficForecastChartProps {
  historical: ForecastDataPoint[];
  forecast: ForecastDataPoint[];
  needsMoreData: boolean;
}

export function TrafficForecastChart({ historical, forecast, needsMoreData }: TrafficForecastChartProps) {
  // Combine historical and forecast data
  const allData = [...historical, ...forecast];
  
  // Accessibility data
  const accessibilityData = useChartAccessibility(
    allData,
    "Traffic Forecast - Historical and Predicted Clicks",
    "date",
    ["clicks", "lower", "upper"]
  );
  
  // Format date for display (e.g., "Jan 15")
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.[0]) return null;
    
    const data = payload[0].payload;
    const isHistorical = data.isHistorical;
    
    return (
      <Card className="p-3 shadow-lg border">
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">
            {formatDate(data.date)}
          </p>
          {isHistorical ? (
            <p className="text-sm font-semibold">
              {data.clicks.toLocaleString()} clicks
            </p>
          ) : (
            <div className="space-y-1">
              <p className="text-sm font-semibold">
                forecast: ~{data.clicks.toLocaleString()} clicks
              </p>
              <p className="text-xs text-muted-foreground">
                ± {Math.round((data.upper - data.lower) / 2)} (95% confidence)
              </p>
            </div>
          )}
        </div>
      </Card>
    );
  };

  if (needsMoreData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            traffic trajectory
          </CardTitle>
          <CardDescription>predictive forecast with uncertainty</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-label mb-2">need 7 days of data</h3>
            <p className="text-sm text-secondary-label max-w-md">
              predictions will appear here once you have 7 days of click history. keep sharing your links!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const todayDate = new Date().toISOString().split("T")[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          traffic trajectory
        </CardTitle>
        <CardDescription>
          past 7 days + next 7 days forecast with expanding confidence band
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartWrapper height={400} accessibilityData={accessibilityData}>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={allData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12 }}
              />
              
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12 }}
                label={{ 
                  value: 'clicks', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fontSize: 12, fill: 'hsl(var(--muted-foreground))' }
                }}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              <ReferenceLine 
                x={todayDate} 
                stroke="hsl(var(--muted-foreground))" 
                strokeDasharray="5 5"
                label={{ 
                  value: 'today', 
                  position: 'top',
                  fill: 'hsl(var(--muted-foreground))',
                  fontSize: 12
                }}
              />
              
              <Area
                type="monotone"
                dataKey="upper"
                stroke="none"
                fill="hsl(var(--primary))"
                fillOpacity={0.15}
                connectNulls
              />
              <Area
                type="monotone"
                dataKey="lower"
                stroke="none"
                fill="hsl(var(--background))"
                fillOpacity={1}
                connectNulls
              />
              
              <Line
                type="monotone"
                dataKey="clicks"
                data={historical}
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                name="Historical"
              />
              
              <Line
                type="monotone"
                dataKey="clicks"
                data={forecast}
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                name="Forecast"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartWrapper>

        <div className="mt-4 text-xs text-muted-foreground space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-primary" />
            <span>historical data (past 7 days)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-primary" style={{ backgroundImage: 'repeating-linear-gradient(to right, currentColor 0, currentColor 5px, transparent 5px, transparent 10px)' }} />
            <span>predicted trajectory (next 7 days)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-4 bg-primary/15" />
            <span>95% confidence interval (uncertainty grows over time)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}