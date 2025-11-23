import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Label } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { role: 'PMM', salary: 125, satisfaction: 7.8, respondents: 150, color: '#FF5B04' },
  { role: 'SDR', salary: 65, satisfaction: 5.2, respondents: 300, color: '#16232A' },
  { role: 'AE', salary: 180, satisfaction: 6.9, respondents: 250, color: '#075056' },
  { role: 'MarkOps', salary: 115, satisfaction: 7.5, respondents: 120, color: '#FF5B04' },
  { role: 'Content', salary: 72, satisfaction: 6.1, respondents: 200, color: '#16232A' },
  { role: 'Demand Gen', salary: 110, satisfaction: 7.2, respondents: 180, color: '#075056' },
  { role: 'RevOps', salary: 142, satisfaction: 8.1, respondents: 95, color: '#FF5B04' },
  { role: 'Growth', salary: 120, satisfaction: 7.4, respondents: 140, color: '#075056' },
  { role: 'Brand', salary: 88, satisfaction: 6.8, respondents: 110, color: '#16232A' },
  { role: 'VP Marketing', salary: 175, satisfaction: 7.0, respondents: 80, color: '#075056' },
  { role: 'CMO', salary: 225, satisfaction: 6.5, respondents: 45, color: '#16232A' },
  { role: 'Sales Manager', salary: 145, satisfaction: 6.6, respondents: 120, color: '#075056' },
  { role: 'CS Manager', salary: 95, satisfaction: 7.3, respondents: 160, color: '#FF5B04' },
  { role: 'Data Analyst', salary: 85, satisfaction: 7.6, respondents: 130, color: '#075056' },
  { role: 'Designer', salary: 78, satisfaction: 7.1, respondents: 150, color: '#16232A' }
];

export const CareerSatisfactionScatter = () => {
  return (
    <Card className="bg-background border-border">
      <CardHeader>
        <CardTitle className="text-2xl font-display">Career Satisfaction vs Compensation</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={450}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              type="number" 
              dataKey="salary" 
              domain={[50, 250]} 
              tickFormatter={(value) => `$${value}K`}
            >
              <Label value="Salary (USD thousands)" position="insideBottom" offset={-10} />
            </XAxis>
            <YAxis 
              type="number" 
              dataKey="satisfaction" 
              domain={[4, 9]}
            >
              <Label value="Satisfaction (1-10)" angle={-90} position="insideLeft" />
            </YAxis>
            <ZAxis type="number" dataKey="respondents" range={[100, 800]} />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                      <p className="font-semibold">{data.role}</p>
                      <p className="text-sm text-muted-foreground">Salary: ${data.salary}K</p>
                      <p className="text-sm text-muted-foreground">Satisfaction: {data.satisfaction}/10</p>
                      <p className="text-sm text-muted-foreground">Respondents: {data.respondents}</p>
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
        <div className="mt-4 p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Goal Zone:</strong> Top-right quadrant (high pay + high satisfaction). 
            RevOps, PMM, and MarkOps cluster here.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
