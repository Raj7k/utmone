import { LazyLineChart, LazyChartContainer, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from "@/components/charts/LazyCharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatCurrency } from "@/lib/salaryData";

interface SalaryDistributionChartProps {
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  currentSalary?: number;
}

export const SalaryDistributionChart = ({
  p10,
  p25,
  p50,
  p75,
  p90,
  currentSalary
}: SalaryDistributionChartProps) => {
  // Generate bell curve data points
  const generateBellCurve = () => {
    const points = [];
    const min = p10 * 0.8;
    const max = p90 * 1.2;
    const steps = 50;
    const stepSize = (max - min) / steps;

    for (let i = 0; i <= steps; i++) {
      const x = min + i * stepSize;
      // Approximate normal distribution centered at median
      const mean = p50;
      const stdDev = (p75 - p25) / 1.35; // Approximate standard deviation
      const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
      const y = Math.exp(exponent);

      points.push({
        salary: x,
        frequency: y
      });
    }

    return points;
  };

  const data = generateBellCurve();

  const chartConfig = {
    frequency: {
      label: "Frequency",
      color: "hsl(var(--primary))"
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-secondary-label text-center">
        salary distribution (bell curve)
      </div>
      
      <ChartContainer config={chartConfig} className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LazyLineChart data={data}>
            <XAxis
              dataKey="salary"
              tickFormatter={(value) => formatCurrency(value)}
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis hide />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [
                    `Salary: ${formatCurrency(data[0]?.salary || 0)}`,
                    ""
                  ]}
                />
              }
            />
            
            {/* Main distribution curve */}
            <Line
              type="monotone"
              dataKey="frequency"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={false}
              fill="hsl(var(--primary))"
              fillOpacity={0.1}
            />

            {/* Percentile markers */}
            <ReferenceLine
              x={p25}
              stroke="hsl(48 96% 53%)"
              strokeDasharray="3 3"
              label={{ value: "25th", position: "top", fontSize: 10 }}
            />
            <ReferenceLine
              x={p50}
              stroke="hsl(142 71% 45%)"
              strokeDasharray="3 3"
              label={{ value: "Median", position: "top", fontSize: 10 }}
            />
            <ReferenceLine
              x={p75}
              stroke="hsl(221 83% 53%)"
              strokeDasharray="3 3"
              label={{ value: "75th", position: "top", fontSize: 10 }}
            />

            {/* Current salary marker */}
            {currentSalary && (
              <ReferenceLine
                x={currentSalary}
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                label={{
                  value: "You",
                  position: "top",
                  fontSize: 12,
                  fontWeight: "bold"
                }}
              />
            )}
          </LazyLineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};
