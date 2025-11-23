import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { trend: 'Compensation Fragmenting', year: 2022, impact: 85, color: '#FF5B04' },
  { trend: 'AI Reshaping Pay', year: 2023, impact: 95, color: '#075056' },
  { trend: 'Manager→Sr Jump', year: 2020, impact: 75, color: '#16232A' },
  { trend: 'Remote Discount', year: 2021, impact: 70, color: '#FF5B04' },
  { trend: 'Skill Inflation', year: 2022, impact: 80, color: '#075056' },
  { trend: 'Career Dissatisfaction', year: 2023, impact: 65, color: '#16232A' },
  { trend: 'SMB Premiums', year: 2024, impact: 60, color: '#FF5B04' },
  { trend: 'Sales Volatility', year: 2021, impact: 85, color: '#075056' },
  { trend: 'RevOps Growth', year: 2022, impact: 90, color: '#16232A' },
  { trend: 'Skills Over Titles', year: 2024, impact: 88, color: '#FF5B04' }
];

export const MegaTrendsTimeline = () => {
  return (
    <Card className="bg-background border-border">
      <CardHeader>
        <CardTitle className="text-2xl font-display">10 Mega-Trends Timeline (2020-2026)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              type="number" 
              dataKey="year" 
              domain={[2019, 2026]} 
              ticks={[2020, 2021, 2022, 2023, 2024, 2025, 2026]} 
            />
            <YAxis type="number" dataKey="impact" domain={[50, 100]} label={{ value: 'Impact Level', angle: -90, position: 'insideLeft' }} />
            <ZAxis type="number" dataKey="impact" range={[100, 1000]} />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                      <p className="font-semibold">{data.trend}</p>
                      <p className="text-sm text-muted-foreground">Year: {data.year}</p>
                      <p className="text-sm text-muted-foreground">Impact: {data.impact}/100</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter data={data} fill="#FF5B04">
              {data.map((entry, index) => (
                <circle key={`dot-${index}`} fill={entry.color} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
