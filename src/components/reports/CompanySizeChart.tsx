import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  {
    size: "Startup\n(1-50)",
    cash: 75000,
    equity: 45000,
    benefits: 8000
  },
  {
    size: "Growth\n(51-200)",
    cash: 92000,
    equity: 28000,
    benefits: 12000
  },
  {
    size: "Mid-Market\n(201-1000)",
    cash: 105000,
    equity: 18000,
    benefits: 15000
  },
  {
    size: "Enterprise\n(1000+)",
    cash: 118000,
    equity: 12000,
    benefits: 22000
  }
];

export const CompanySizeChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Compensation by Company Size</CardTitle>
        <p className="text-sm text-secondary-label">
          Breakdown of cash, equity, and benefits for Marketing Managers
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="size" 
              stroke="hsl(var(--secondary-label))"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="hsl(var(--secondary-label))"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip 
              formatter={(value: number) => `$${value.toLocaleString()}`}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px"
              }}
            />
            <Legend />
            <Bar dataKey="cash" fill="hsl(var(--deep-sea))" name="Base Cash" radius={[4, 4, 0, 0]} />
            <Bar dataKey="equity" fill="hsl(var(--blaze-orange))" name="Equity Value (4yr)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="benefits" fill="hsl(var(--mirage))" name="Benefits" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-wildSand rounded-lg">
            <h4 className="font-semibold text-deepSea mb-2">Startup Advantage</h4>
            <p className="text-sm text-secondary-label">
              Higher equity compensation (avg $45K/year over 4 years) but lower cash and benefits. 
              Best for risk-tolerant professionals with 5-10 year horizon.
            </p>
          </div>
          <div className="p-4 bg-wildSand rounded-lg">
            <h4 className="font-semibold text-deepSea mb-2">Enterprise Stability</h4>
            <p className="text-sm text-secondary-label">
              Highest total cash compensation ($140K including benefits) with minimal equity risk. 
              Best for stability-focused professionals.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
