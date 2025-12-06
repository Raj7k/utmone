import { LazyAreaChart, Area, ResponsiveContainer, LazyChartContainer } from "@/components/charts/LazyCharts";

interface TrendSparklineProps {
  data: number[];
  change: number;
}

export const TrendSparkline = ({ data, change }: TrendSparklineProps) => {
  const chartData = data.map((value, index) => ({ value, index }));
  const isPositive = change > 0;

  return (
    <div className="h-[30px] w-[60px]">
      <LazyChartContainer height={30}>
        <ResponsiveContainer width="100%" height="100%">
          <LazyAreaChart data={chartData}>
            <defs>
              <linearGradient id={`gradient-${isPositive ? 'green' : 'red'}`} x1="0" y1="0" x2="0" y2="1">
                <stop 
                  offset="5%" 
                  stopColor={isPositive ? "hsl(var(--system-green))" : "hsl(var(--system-red))"} 
                  stopOpacity={0.3}
                />
                <stop 
                  offset="95%" 
                  stopColor={isPositive ? "hsl(var(--system-green))" : "hsl(var(--system-red))"} 
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={isPositive ? "hsl(var(--system-green))" : "hsl(var(--system-red))"}
              strokeWidth={1.5}
              fill={`url(#gradient-${isPositive ? 'green' : 'red'})`}
              isAnimationActive={false}
            />
          </LazyAreaChart>
        </ResponsiveContainer>
      </LazyChartContainer>
    </div>
  );
};
