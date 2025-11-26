import { Card } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Version {
  id: string;
  version: number;
  slug: string;
  total_clicks: number;
}

interface PerformanceChartsProps {
  versions: Version[];
}

const COLORS = ['hsl(217, 91%, 60%)', 'hsl(20, 100%, 51%)', 'hsl(240, 60%, 40%)', 'hsl(180, 60%, 50%)', 'hsl(60, 90%, 60%)'];

export const PerformanceCharts = ({ versions }: PerformanceChartsProps) => {
  // Prepare data for version comparison
  const versionData = versions.map(v => ({
    name: `v${v.version}`,
    clicks: v.total_clicks,
    slug: v.slug,
  }));

  // Prepare data for traffic distribution pie chart
  const totalClicks = versions.reduce((sum, v) => sum + v.total_clicks, 0);
  const pieData = versions.map(v => ({
    name: `v${v.version}`,
    value: v.total_clicks,
    percentage: totalClicks > 0 ? ((v.total_clicks / totalClicks) * 100).toFixed(1) : 0,
  }));

  return (
    <div className="space-y-6">
      {/* Version Performance Comparison */}
      <Card className="p-6 bg-gray-900/30 backdrop-blur border-gray-800">
        <h3 className="text-lg font-semibold mb-4 text-foreground">version performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={versionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Bar dataKey="clicks" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Traffic Distribution */}
      <Card className="p-6 bg-gray-900/30 backdrop-blur border-gray-800">
        <h3 className="text-lg font-semibold mb-4 text-foreground">traffic distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name}: ${percentage}%`}
              outerRadius={100}
              fill="hsl(217, 91%, 60%)"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};
