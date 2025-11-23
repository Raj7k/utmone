import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

const roleData: Record<string, any[]> = {
  'Marketing Manager': [
    { region: 'SF Bay Area', salary: 135, variance: 18, color: '#FF5B04' },
    { region: 'NYC', salary: 128, variance: 15, color: '#FF5B04' },
    { region: 'Austin', salary: 105, variance: 12, color: '#075056' },
    { region: 'Remote US', salary: 86, variance: 20, color: '#16232A' },
    { region: 'London', salary: 81, variance: 14, color: '#075056' },
    { region: 'Bangalore', salary: 32, variance: 25, color: '#16232A' }
  ],
  'Sales AE': [
    { region: 'SF Bay Area', salary: 180, variance: 25, color: '#FF5B04' },
    { region: 'NYC', salary: 175, variance: 22, color: '#FF5B04' },
    { region: 'Austin', salary: 145, variance: 18, color: '#075056' },
    { region: 'Remote US', salary: 120, variance: 28, color: '#16232A' },
    { region: 'London', salary: 110, variance: 20, color: '#075056' },
    { region: 'Bangalore', salary: 42, variance: 30, color: '#16232A' }
  ],
  'Product Manager': [
    { region: 'SF Bay Area', salary: 165, variance: 20, color: '#FF5B04' },
    { region: 'NYC', salary: 158, variance: 18, color: '#FF5B04' },
    { region: 'Austin', salary: 135, variance: 15, color: '#075056' },
    { region: 'Remote US', salary: 115, variance: 25, color: '#16232A' },
    { region: 'London', salary: 105, variance: 18, color: '#075056' },
    { region: 'Bangalore', salary: 45, variance: 28, color: '#16232A' }
  ]
};

const roles = Object.keys(roleData);

export const RegionalFragmentationChart = () => {
  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const data = roleData[selectedRole];

  return (
    <Card className="bg-background border-border">
      <CardHeader>
        <CardTitle className="text-2xl font-display">Regional Compensation Fragmentation</CardTitle>
        <div className="flex flex-wrap gap-2 mt-4">
          {roles.map((role) => (
            <Badge
              key={role}
              variant={selectedRole === role ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedRole(role)}
            >
              {role}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="region" />
            <YAxis tickFormatter={(value) => `$${value}K`} label={{ value: 'Salary (USD thousands)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              formatter={(value: number, name: string) => {
                if (name === 'salary') return `$${value}K`;
                return `±${value}%`;
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Bar dataKey="salary" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <rect key={`bar-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-muted-foreground text-center mt-4">
          Same role, 4.2× salary difference across regions
        </p>
      </CardContent>
    </Card>
  );
};
