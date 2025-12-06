import { LazyBarChart, LazyChartContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from '@/components/charts/LazyCharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { role: 'SDR/BDR', base: 60, ote: 90, color: '#075056' },
  { role: 'AE (Mid-Market)', base: 95, ote: 180, color: '#FF5B04' },
  { role: 'Enterprise AE', base: 150, ote: 320, color: '#16232A' },
  { role: 'Sales Manager', base: 120, ote: 175, color: '#075056' },
  { role: 'VP Sales', base: 215, ote: 360, color: '#FF5B04' }
];

export const SalesOTEHistogram = () => {
  return (
    <Card className="bg-background border-border">
      <CardHeader>
        <CardTitle className="text-2xl font-display">Sales OTE vs Base Salary Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <LazyChartContainer height={400}>
          <ResponsiveContainer width="100%" height={400}>
            <LazyBarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" tickFormatter={(value) => `$${value}K`} />
              <YAxis dataKey="role" type="category" width={120} />
              <Tooltip formatter={(value: number) => `$${value}K`} />
              <Legend />
              <Bar dataKey="base" fill="#075056" name="Base Salary" radius={[0, 8, 8, 0]} />
              <Bar dataKey="ote" fill="#FF5B04" name="OTE" radius={[0, 8, 8, 0]} />
            </LazyBarChart>
          </ResponsiveContainer>
        </LazyChartContainer>
      </CardContent>
    </Card>
  );
};
