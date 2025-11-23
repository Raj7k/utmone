import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

const allData = [
  { city: 'San Francisco', multiplier: 1.40, region: 'US West', color: '#FF5B04' },
  { city: 'New York', multiplier: 1.35, region: 'US East', color: '#FF5B04' },
  { city: 'Seattle', multiplier: 1.28, region: 'US West', color: '#FF5B04' },
  { city: 'Austin', multiplier: 1.15, region: 'US Central', color: '#075056' },
  { city: 'London', multiplier: 0.85, region: 'Europe', color: '#075056' },
  { city: 'Berlin', multiplier: 0.72, region: 'Europe', color: '#075056' },
  { city: 'Singapore', multiplier: 0.75, region: 'APAC', color: '#16232A' },
  { city: 'Bangalore', multiplier: 0.35, region: 'APAC', color: '#16232A' },
  { city: 'Sydney', multiplier: 0.82, region: 'APAC', color: '#16232A' },
  { city: 'Toronto', multiplier: 0.88, region: 'North America', color: '#075056' }
];

const regions = ['All', 'US West', 'US East', 'US Central', 'Europe', 'APAC', 'North America'];

export const GeographicMultiplierMap = () => {
  const [selectedRegion, setSelectedRegion] = useState('All');
  
  const filteredData = selectedRegion === 'All' 
    ? allData 
    : allData.filter(d => d.region === selectedRegion);

  return (
    <Card className="bg-background border-border">
      <CardHeader>
        <CardTitle className="text-2xl font-display">Geographic Salary Multipliers by City</CardTitle>
        <div className="flex flex-wrap gap-2 mt-4">
          {regions.map((region) => (
            <Badge
              key={region}
              variant={selectedRegion === region ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedRegion(region)}
            >
              {region}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" dataKey="multiplier" domain={[0.3, 1.5]} label={{ value: 'Salary Multiplier', position: 'insideBottom', offset: -5 }} />
            <YAxis type="category" dataKey="city" width={100} />
            <ZAxis type="number" dataKey="multiplier" range={[200, 800]} />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                      <p className="font-semibold">{data.city}</p>
                      <p className="text-sm text-muted-foreground">Region: {data.region}</p>
                      <p className="text-sm font-semibold">Multiplier: {data.multiplier}×</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter data={filteredData} fill="#FF5B04">
              {filteredData.map((entry, index) => (
                <circle key={`dot-${index}`} fill={entry.color} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
