import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { year: 2020, revOps: 85, markOps: 78, marketing: 82, sales: 90 },
  { year: 2021, revOps: 95, markOps: 84, marketing: 86, sales: 95 },
  { year: 2022, revOps: 110, markOps: 92, marketing: 90, sales: 100 },
  { year: 2023, revOps: 125, markOps: 102, marketing: 93, sales: 105 },
  { year: 2024, revOps: 142, markOps: 115, marketing: 95, sales: 110 },
  { year: 2025, revOps: 158, markOps: 128, marketing: 98, sales: 115 },
  { year: 2026, revOps: 175, markOps: 140, marketing: 102, sales: 120 }
];

export const RevOpsGrowthChart = () => {
  const growthPercent = ((175 - 85) / 85 * 100).toFixed(0);

  return (
    <Card className="bg-background border-border">
      <CardHeader>
        <CardTitle className="text-2xl font-display">RevOps Salary Growth: 2020-2026</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevOps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF5B04" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#FF5B04" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(value) => `$${value}K`} label={{ value: 'Salary (USD thousands)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              formatter={(value: number) => `$${value}K`}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="revOps" 
              stroke="#FF5B04" 
              strokeWidth={3}
              fill="url(#colorRevOps)" 
              name="RevOps"
            />
            <Line type="monotone" dataKey="markOps" stroke="#075056" strokeWidth={2} name="MarkOps" dot={false} />
            <Line type="monotone" dataKey="marketing" stroke="#16232A" strokeWidth={1.5} strokeDasharray="5 5" name="Marketing" dot={false} />
            <Line type="monotone" dataKey="sales" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} strokeDasharray="5 5" name="Sales" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-4 p-4 bg-[hsl(18,100%,51%)]/10 rounded-lg border border-[hsl(18,100%,51%)]/20">
          <p className="text-sm text-secondary-label">
            <strong className="text-foreground">+{growthPercent}% growth</strong> for RevOps from 2020-2026, outpacing all other GTM roles
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
