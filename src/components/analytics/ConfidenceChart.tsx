/**
 * Click Prediction Chart Component
 * Shows predicted clicks throughout the day
 */

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAISendTimePredictor } from '@/hooks/useAISendTimePredictor';
import { Skeleton } from '@/components/ui/skeleton';

interface ConfidenceChartProps {
  workspaceId: string;
  days?: number;
  selectedDay?: number; // 0-6, if specified shows only that day
}

const DAY_NAMES = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export const ConfidenceChart = ({ workspaceId, days = 30, selectedDay }: ConfidenceChartProps) => {
  const { data, isLoading } = useAISendTimePredictor(workspaceId, days);

  const chartData = useMemo(() => {
    if (!data || data.weeklyPattern.length === 0) return [];

    const dayToShow = selectedDay !== undefined ? selectedDay : 1; // Default to Monday
    const dayPredictions = data.weeklyPattern[dayToShow];

    return dayPredictions.map(slot => ({
      hour: `${slot.hourOfDay}:00`,
      hourNum: slot.hourOfDay,
      mean: Math.round(slot.prediction.mean),
      lower: Math.round(slot.prediction.confidenceInterval.lower),
      upper: Math.round(slot.prediction.confidenceInterval.upper),
      std: Math.round(slot.prediction.std),
      ei: slot.prediction.expectedImprovement.toFixed(2),
    }));
  }, [data, selectedDay]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-title-3">click predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data || chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-title-3">click predictions</CardTitle>
          <CardDescription>predicted clicks by hour</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-secondary-label">
            <p className="text-sm">no predictions available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const dayName = selectedDay !== undefined ? DAY_NAMES[selectedDay] : 'mon';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-title-3">
          {dayName} hourly predictions
        </CardTitle>
        <CardDescription>
          predicted clicks with confidence range (shaded area shows possible range)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="hour" 
              stroke="hsl(var(--secondary-label))"
              fontSize={12}
              interval={3}
            />
            <YAxis 
              stroke="hsl(var(--secondary-label))"
              fontSize={12}
              label={{ value: 'predicted clicks', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              labelStyle={{ color: 'hsl(var(--label))' }}
              formatter={(value: number, name: string) => {
                if (name === 'mean') return [value, 'predicted clicks'];
                if (name === 'lower') return [value, 'lowest likely'];
                if (name === 'upper') return [value, 'highest likely'];
                return [value, name];
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              formatter={(value) => {
                if (value === 'mean') return 'prediction';
                if (value === 'lower') return 'lowest likely';
                if (value === 'upper') return 'highest likely';
                return value;
              }}
            />
            
            {/* Confidence interval as shaded area */}
            <Area
              type="monotone"
              dataKey="upper"
              stroke="none"
              fill="hsl(var(--primary))"
              fillOpacity={0.1}
            />
            <Area
              type="monotone"
              dataKey="lower"
              stroke="none"
              fill="hsl(var(--card))"
              fillOpacity={1}
            />

            {/* Mean prediction line */}
            <Line
              type="monotone"
              dataKey="mean"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', r: 4 }}
              activeDot={{ r: 6 }}
            />

            {/* Confidence bounds */}
            <Line
              type="monotone"
              dataKey="upper"
              stroke="hsl(var(--primary))"
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="lower"
              stroke="hsl(var(--primary))"
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>

        <div className="mt-4 p-3 rounded-lg bg-muted/30 text-xs text-tertiary-label">
          <p>
            <strong className="text-secondary-label">clean track intelligence:</strong> shaded area shows the range of possible results.
            wider bands = less certain. solid line = most likely result.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
