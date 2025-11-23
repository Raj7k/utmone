import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { role: 'PMM', b2b: 125, b2c: 95, gap: -24 },
  { role: 'Demand Gen', b2b: 110, b2c: 88, gap: -20 },
  { role: 'Content Lead', b2b: 95, b2c: 105, gap: 11, exception: true },
  { role: 'Marketing Manager', b2b: 95, b2c: 78, gap: -18 },
  { role: 'Growth', b2b: 120, b2c: 102, gap: -15 },
  { role: 'MarkOps', b2b: 115, b2c: 85, gap: -26 },
  { role: 'Brand', b2b: 88, b2c: 92, gap: 5, exception: true },
  { role: 'Social Media', b2b: 68, b2c: 72, gap: 6, exception: true }
];

export const B2BvsB2CComparison = () => {
  return (
    <Card className="bg-background border-border">
      <CardHeader>
        <CardTitle className="text-2xl font-display">B2B vs B2C Marketing Salary Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={450}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" tickFormatter={(value) => `$${value}K`} />
            <YAxis dataKey="role" type="category" width={120} />
            <Tooltip 
              formatter={(value: number) => `$${value}K`}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                      <p className="font-semibold mb-2">{data.role}</p>
                      <p className="text-sm text-muted-foreground">B2B: ${data.b2b}K</p>
                      <p className="text-sm text-muted-foreground">B2C: ${data.b2c}K</p>
                      <p className="text-sm font-semibold mt-1">
                        Gap: {data.gap > 0 ? '+' : ''}{data.gap}%
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar dataKey="b2b" fill="#FF5B04" name="B2B" radius={[0, 8, 8, 0]} />
            <Bar dataKey="b2c" fill="#075056" name="B2C" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">B2B pays 10-30% more</strong> for most roles. 
            Exceptions: Content, Brand, and Social Media where B2C slightly leads due to consumer focus.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
