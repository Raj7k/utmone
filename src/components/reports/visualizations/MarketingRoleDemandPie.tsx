import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { name: 'Product Marketing', value: 28, color: '#FF5B04' },
  { name: 'Demand Generation', value: 24, color: '#075056' },
  { name: 'Marketing Ops', value: 18, color: '#16232A' },
  { name: 'Content Marketing', value: 15, color: '#FF5B04' },
  { name: 'Growth Marketing', value: 10, color: '#075056' },
  { name: 'Brand Marketing', value: 5, color: '#16232A' }
];

export const MarketingRoleDemandPie = () => {
  return (
    <Card className="bg-background border-border">
      <CardHeader>
        <CardTitle className="text-2xl font-display">Marketing Role Demand Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value}%`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
