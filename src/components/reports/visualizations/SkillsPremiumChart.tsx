import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { skill: 'AI/ML Expertise', premium: 58, category: 'A', color: '#FF5B04' },
  { skill: 'GTM Strategy', premium: 45, category: 'A', color: '#FF5B04' },
  { skill: 'Attribution Modeling', premium: 42, category: 'A', color: '#FF5B04' },
  { skill: 'Revenue Operations', premium: 38, category: 'A', color: '#FF5B04' },
  { skill: 'Product Marketing', premium: 35, category: 'A', color: '#FF5B04' },
  { skill: 'SQL/Data Analysis', premium: 28, category: 'B', color: '#075056' },
  { skill: 'Salesforce Admin', premium: 22, category: 'B', color: '#075056' },
  { skill: 'Marketing Automation', premium: 18, category: 'B', color: '#075056' },
  { skill: 'SEO/SEM', premium: 15, category: 'B', color: '#075056' },
  { skill: 'Copywriting', premium: 12, category: 'B', color: '#075056' },
  { skill: 'Social Media', premium: 8, category: 'C', color: '#16232A' },
  { skill: 'Graphic Design', premium: 5, category: 'C', color: '#16232A' },
  { skill: 'Email Marketing', premium: 3, category: 'C', color: '#16232A' },
  { skill: 'Content Writing', premium: -5, category: 'C', color: '#16232A' },
  { skill: 'Basic Admin', premium: -12, category: 'C', color: '#16232A' }
].sort((a, b) => b.premium - a.premium);

export const SkillsPremiumChart = () => {
  return (
    <Card className="bg-background border-border">
      <CardHeader>
        <CardTitle className="text-2xl font-display">Top Skills Salary Premium (%)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" tickFormatter={(value) => `${value > 0 ? '+' : ''}${value}%`} />
            <YAxis dataKey="skill" type="category" width={150} />
            <Tooltip 
              formatter={(value: number) => `${value > 0 ? '+' : ''}${value}%`}
              contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Bar dataKey="premium" radius={[0, 8, 8, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
