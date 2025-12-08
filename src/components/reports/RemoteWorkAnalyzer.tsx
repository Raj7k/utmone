import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wifi, MapPin, TrendingUp, Home } from "lucide-react";
import { formatCurrency } from "@/lib/salaryData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const RemoteWorkAnalyzer = () => {
  const remoteData = [
    {
      arrangement: 'Fully On-site',
      avgSalary: 98000,
      premium: 0,
      availability: 15,
      description: 'Traditional office-based roles'
    },
    {
      arrangement: 'Hybrid (3 days)',
      avgSalary: 102000,
      premium: 4.1,
      availability: 45,
      description: '3 days office, 2 days remote'
    },
    {
      arrangement: 'Hybrid (1-2 days)',
      avgSalary: 95000,
      premium: -3.1,
      availability: 25,
      description: 'Mostly remote with occasional office'
    },
    {
      arrangement: 'Fully Remote',
      avgSalary: 88000,
      premium: -10.2,
      availability: 15,
      description: '100% remote work, any location'
    }
  ];

  const geographicArbitrage = [
    { fromCity: 'San Francisco', toCity: 'Austin', sfSalary: 133000, austinSalary: 104000, realValue: 122000, gain: '+17%' },
    { fromCity: 'New York', toCity: 'Denver', sfSalary: 127000, austinSalary: 102000, realValue: 115000, gain: '+13%' },
    { fromCity: 'Seattle', toCity: 'Remote US', sfSalary: 118000, austinSalary: 88000, realValue: 100000, gain: '+14%' }
  ];

  const chartData = remoteData.map(d => ({
    name: d.arrangement,
    salary: d.avgSalary,
    availability: d.availability
  }));

  return (
    <div className="space-y-8">
      <Card className="border-2 border-deepSea/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-deepSea/10">
              <Wifi className="h-6 w-6 text-deepSea" />
            </div>
            <div>
              <CardTitle className="text-2xl font-display">Remote Work Premium/Discount</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                How work arrangement affects compensation
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--foreground))" angle={-15} textAnchor="end" height={80} />
                <YAxis stroke="hsl(var(--foreground))" tickFormatter={(val) => `$${val / 1000}K`} />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))' 
                  }}
                />
                <Bar dataKey="salary" fill="hsl(var(--deepSea))" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {remoteData.map(item => (
              <div key={item.arrangement} className="p-5 rounded-lg border-2 border-deepSea/10 hover:border-deepSea/30 transition-apple hover:scale-101">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-display font-bold text-lg">{item.arrangement}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  </div>
                  <Badge variant={item.premium >= 0 ? "default" : "secondary"} className={item.premium >= 0 ? "bg-green-600" : ""}>
                    {item.premium >= 0 ? '+' : ''}{item.premium}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div>
                    <div className="text-2xl font-display font-bold text-deepSea">
                      {formatCurrency(item.avgSalary)}
                    </div>
                    <div className="text-xs text-muted-foreground">Median Salary</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-display font-bold">{item.availability}%</div>
                    <div className="text-xs text-muted-foreground">of Roles</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-blazeOrange/20">
        <CardHeader>
          <CardTitle className="text-xl font-display flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Geographic Arbitrage Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {geographicArbitrage.map(arb => (
              <div key={arb.fromCity} className="p-5 rounded-lg bg-wildSand/50 hover:bg-wildSand transition-apple">
                <div className="flex items-center justify-between mb-3">
                  <div className="space-y-1">
                    <div className="font-medium">{arb.fromCity} → {arb.toCity}</div>
                    <div className="text-sm text-muted-foreground">Remote worker scenario</div>
                  </div>
                  <Badge variant="default" className="bg-green-600 text-lg px-3 py-1">
                    {arb.gain}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">{arb.fromCity} Salary</div>
                    <div className="font-bold">{formatCurrency(arb.sfSalary)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">{arb.toCity} Salary</div>
                    <div className="font-bold">{formatCurrency(arb.austinSalary)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Real Value</div>
                    <div className="font-bold text-green-600">{formatCurrency(arb.realValue)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blazeOrange/5 rounded-lg flex items-start gap-3">
            <Home className="h-5 w-5 text-blazeOrange mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <strong className="text-foreground">Geographic Arbitrage Strategy:</strong> Earn a high-city salary 
              while living in a lower cost-of-living area. Real value = (Lower City Salary) × (Higher City CoL / Lower City CoL).
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
