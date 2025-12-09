import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  ReferenceLine, ReferenceArea, Legend, CartesianGrid
} from "recharts";
import { ComparisonTimeseriesPoint } from "@/hooks/useFieldEvents";
import { format, parseISO } from "date-fns";
import { Info } from "lucide-react";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EventControlChartProps {
  comparisonTimeseries: ComparisonTimeseriesPoint[];
  eventStart: string;
  eventEnd: string;
  baselineDailyAverage: number;
  targetCity: string;
  controlCity: string | null;
  divergenceScore: number;
}

export const EventControlChart = ({
  comparisonTimeseries,
  eventStart,
  eventEnd,
  baselineDailyAverage,
  targetCity,
  controlCity,
  divergenceScore
}: EventControlChartProps) => {
  const chartData = useMemo(() => {
    if (!comparisonTimeseries || comparisonTimeseries.length === 0) return [];
    
    // Normalize control visitors to same scale as target for visual comparison
    const maxTarget = Math.max(...comparisonTimeseries.map(d => d.target_visitors || 0));
    const maxControl = Math.max(...comparisonTimeseries.map(d => d.control_visitors || 0));
    const scaleFactor = maxControl > 0 ? maxTarget / maxControl : 1;
    
    return comparisonTimeseries.map(point => ({
      date: format(parseISO(point.visit_date), 'MMM d'),
      rawDate: point.visit_date,
      target: point.target_visitors,
      control: Math.round(point.control_visitors * scaleFactor),
      controlRaw: point.control_visitors,
      baseline: Math.round(baselineDailyAverage)
    }));
  }, [comparisonTimeseries, baselineDailyAverage]);

  const eventStartDate = format(parseISO(eventStart), 'MMM d');
  const eventEndDate = format(parseISO(eventEnd), 'MMM d');

  // Find event period indices
  const eventStartIndex = chartData.findIndex(d => d.rawDate >= eventStart);
  const eventEndIndex = chartData.findIndex(d => d.rawDate > eventEnd);

  if (chartData.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground text-center">no comparison data available</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            control group comparison
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">
                    the control city ({controlCity || 'none'}) shows what traffic would look like 
                    without the event. the divergence between target and control proves event impact.
                  </p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </h3>
          <p className="text-sm text-muted-foreground">
            {targetCity} (event) vs {controlCity || 'baseline'} (control)
          </p>
        </div>
        
        {divergenceScore !== 0 && (
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">
              +{divergenceScore.toFixed(0)}%
            </p>
            <p className="text-xs text-muted-foreground">divergence score</p>
          </div>
        )}
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            
            {/* Event period highlight */}
            {eventStartIndex >= 0 && (
              <ReferenceArea
                x1={chartData[eventStartIndex]?.date}
                x2={chartData[eventEndIndex > 0 ? eventEndIndex - 1 : chartData.length - 1]?.date}
                fill="hsl(var(--primary))"
                fillOpacity={0.1}
              />
            )}
            
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value: number, name: string) => {
                const labels: Record<string, string> = {
                  target: `${targetCity} (event)`,
                  control: `${controlCity || 'control'} (scaled)`,
                  baseline: '30-day baseline'
                };
                return [value, labels[name] || name];
              }}
            />
            <Legend 
              verticalAlign="top"
              height={36}
              formatter={(value) => {
                const labels: Record<string, string> = {
                  target: `${targetCity} (event city)`,
                  control: `${controlCity || 'control'} (control city)`,
                  baseline: '30-day baseline'
                };
                return labels[value] || value;
              }}
            />
            
            {/* Baseline reference line */}
            <ReferenceLine 
              y={baselineDailyAverage} 
              stroke="hsl(var(--muted-foreground))" 
              strokeDasharray="5 5"
              label={{ 
                value: 'baseline', 
                position: 'right', 
                fontSize: 10,
                fill: 'hsl(var(--muted-foreground))'
              }}
            />
            
            {/* Control city line (flat for non-event) */}
            {controlCity && (
              <Line
                type="monotone"
                dataKey="control"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={2}
                dot={false}
                strokeDasharray="5 5"
              />
            )}
            
            {/* Target city line (spike during event) */}
            <Line
              type="monotone"
              dataKey="target"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: 'hsl(var(--primary))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        shaded area = event period ({eventStartDate} - {eventEndDate})
      </p>
    </Card>
  );
};
