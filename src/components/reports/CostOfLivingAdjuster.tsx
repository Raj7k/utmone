import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Home } from "lucide-react";
import { formatCurrency } from "@/lib/salaryData";

export const CostOfLivingAdjuster = () => {
  const [selectedCity, setSelectedCity] = useState("San Francisco, CA");

  const cities = [
    { name: 'San Francisco, CA', salary: 133000, colIndex: 180, realValue: 73889 },
    { name: 'New York, NY', salary: 127000, colIndex: 175, realValue: 72571 },
    { name: 'Seattle, WA', salary: 118000, colIndex: 140, realValue: 84286 },
    { name: 'Boston, MA', salary: 113000, colIndex: 145, realValue: 77931 },
    { name: 'Austin, TX', salary: 104000, colIndex: 105, realValue: 99048 },
    { name: 'Denver, CO', salary: 102000, colIndex: 115, realValue: 88696 },
    { name: 'Chicago, IL', salary: 99000, colIndex: 108, realValue: 91667 },
    { name: 'Atlanta, GA', salary: 95000, colIndex: 100, realValue: 95000 },
    { name: 'Phoenix, AZ', salary: 90000, colIndex: 95, realValue: 94737 },
    { name: 'Remote (US)', salary: 86000, colIndex: 90, realValue: 95556 }
  ];

  const selectedCityData = cities.find(c => c.name === selectedCity);

  return (
    <Card className="border-2 border-deepSea/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-deepSea/10">
            <Home className="h-6 w-6 text-deepSea" />
          </div>
          <div>
            <CardTitle className="text-2xl font-display">Cost of Living Adjusted Salaries</CardTitle>
            <p className="text-sm text-secondary-label mt-1">
              Real purchasing power comparison across cities
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Your City:</label>
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cities.map(city => (
                <SelectItem key={city.name} value={city.name}>{city.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedCityData && (
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-2 border-blazeOrange/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-sm text-secondary-label mb-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Nominal Salary</span>
                </div>
                <div className="text-3xl font-display font-extrabold text-foreground">
                  {formatCurrency(selectedCityData.salary)}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-deepSea/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-sm text-secondary-label mb-2">
                  <Home className="h-4 w-4" />
                  <span>CoL Index</span>
                </div>
                <div className="text-3xl font-display font-extrabold text-foreground">
                  {selectedCityData.colIndex}
                </div>
                <div className="text-xs text-secondary-label mt-1">100 = National Avg</div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-600/20 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-sm text-secondary-label mb-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Real Value</span>
                </div>
                <div className="text-3xl font-display font-extrabold text-green-600">
                  {formatCurrency(selectedCityData.realValue)}
                </div>
                <div className="text-xs text-secondary-label mt-1">Purchasing Power</div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="space-y-3">
          <h3 className="font-display font-bold text-lg">All Cities Ranked by Real Value</h3>
          {cities
            .sort((a, b) => b.realValue - a.realValue)
            .map((city, idx) => (
              <div 
                key={city.name}
                className={`p-4 rounded-lg border-2 transition-apple ${
                  city.name === selectedCity 
                    ? 'border-deepSea bg-deepSea/5' 
                    : 'border-border hover:border-deepSea/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-bold">#{idx + 1}</Badge>
                    <div>
                      <div className="font-medium">{city.name}</div>
                      <div className="text-sm text-secondary-label">
                        Nominal: {formatCurrency(city.salary)} • CoL: {city.colIndex}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-display font-extrabold text-green-600">
                      {formatCurrency(city.realValue)}
                    </div>
                    <div className="text-xs text-secondary-label">Real Value</div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="p-4 bg-wildSand/50 rounded-lg text-sm text-secondary-label">
          <strong className="text-foreground">Formula:</strong> Real Value = (Nominal Salary) × (100 / Cost of Living Index). 
          This shows what your salary is actually worth in purchasing power when accounting for local costs.
        </div>
      </CardContent>
    </Card>
  );
};
