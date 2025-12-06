import { LazyBarChart, LazyChartContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from '@/components/charts/LazyCharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { role: 'Marketing Manager', traditional: 95, aiEnabled: 125, premium: 32 },
  { role: 'Demand Gen', traditional: 110, aiEnabled: 142, premium: 29 },
  { role: 'Content Lead', traditional: 88, aiEnabled: 102, premium: 16 },
  { role: 'MarkOps Manager', traditional: 115, aiEnabled: 152, premium: 32 },
  { role: 'RevOps Manager', traditional: 120, aiEnabled: 162, premium: 35 }
];

export const AIPremiumComparison = () => {
  return (
    <Card className="bg-background border-border">
      <CardHeader>
        <CardTitle className="text-2xl font-display">AI Premium: Traditional vs AI-Enabled Roles</CardTitle>
      </CardHeader>
      <CardContent>
        <LazyChartContainer height={400}>
          <ResponsiveContainer width="100%" height={400}>
            <LazyBarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="role" />
              <YAxis tickFormatter={(value) => `$${value}K`} label={{ value: 'Salary (USD thousands)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value: number) => `$${value}K`}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend />
              <Bar dataKey="traditional" fill="#16232A" name="Traditional" radius={[8, 8, 0, 0]} />
              <Bar dataKey="aiEnabled" fill="#FF5B04" name="AI-Enabled" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`}>
                    <text
                      x={0}
                      y={0}
                      dy={-10}
                      fill="#FF5B04"
                      fontSize={12}
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      +{entry.premium}%
                    </text>
                  </Cell>
                ))}
              </Bar>
            </LazyBarChart>
          </ResponsiveContainer>
        </LazyChartContainer>
        <p className="text-sm text-secondary-label text-center mt-4">
          AI-enabled professionals command 16-35% salary premiums
        </p>
      </CardContent>
    </Card>
  );
};
