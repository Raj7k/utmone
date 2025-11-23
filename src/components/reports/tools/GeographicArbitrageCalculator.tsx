import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MapPin, TrendingDown, TrendingUp } from "lucide-react";

const cities = [
  { name: "San Francisco", costOfLiving: 100, salaryMultiplier: 1.4, taxRate: 0.35 },
  { name: "New York", costOfLiving: 95, salaryMultiplier: 1.35, taxRate: 0.33 },
  { name: "Austin", costOfLiving: 75, salaryMultiplier: 1.1, taxRate: 0.27 },
  { name: "Remote US", costOfLiving: 70, salaryMultiplier: 0.9, taxRate: 0.25 },
  { name: "London", costOfLiving: 85, salaryMultiplier: 0.85, taxRate: 0.38 },
  { name: "Bangalore", costOfLiving: 35, salaryMultiplier: 0.32, taxRate: 0.15 },
  { name: "Mexico City", costOfLiving: 40, salaryMultiplier: 0.28, taxRate: 0.18 },
];

export const GeographicArbitrageCalculator = () => {
  const [currentCity, setCurrentCity] = useState("San Francisco");
  const [currentSalary, setCurrentSalary] = useState(135000);
  const [targetCity, setTargetCity] = useState("Austin");
  const [calculated, setCalculated] = useState(false);

  const calculate = () => {
    setCalculated(true);
  };

  const current = cities.find((c) => c.name === currentCity);
  const target = cities.find((c) => c.name === targetCity);

  if (!current || !target) return null;

  const targetSalary = Math.round(
    (currentSalary * target.salaryMultiplier) / current.salaryMultiplier
  );
  const currentAfterTax = Math.round(currentSalary * (1 - current.taxRate));
  const targetAfterTax = Math.round(targetSalary * (1 - target.taxRate));

  const currentPurchasingPower = (currentAfterTax / current.costOfLiving) * 100;
  const targetPurchasingPower = (targetAfterTax / target.costOfLiving) * 100;
  const purchasingPowerChange =
    ((targetPurchasingPower - currentPurchasingPower) / currentPurchasingPower) * 100;

  const monthlySavings = Math.round((targetAfterTax - currentAfterTax) / 12);
  const annualSavings = targetAfterTax - currentAfterTax;

  return (
    <Card className="border-2 border-deepSea/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <MapPin className="h-6 w-6 text-deepSea" />
          Geographic Arbitrage Calculator
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Compare purchasing power and savings potential across cities
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label>Current City</Label>
            <Select value={currentCity} onValueChange={setCurrentCity}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.name} value={city.name}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-2">
              <Label>Current Salary</Label>
              <Input
                type="number"
                value={currentSalary}
                onChange={(e) => setCurrentSalary(Number(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label>Target City</Label>
            <Select value={targetCity} onValueChange={setTargetCity}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.name} value={city.name}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={calculate} className="w-full bg-deepSea hover:bg-deepSea/90">
          Calculate Arbitrage Opportunity
        </Button>

        {calculated && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-6 border-2 border-deepSea/10">
                <p className="text-xs text-muted-foreground mb-3">Current: {currentCity}</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Gross Salary</p>
                    <p className="text-2xl font-bold text-mirage">
                      ${currentSalary.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">After Tax ({current.taxRate * 100}%)</p>
                    <p className="text-xl font-bold text-deepSea">
                      ${currentAfterTax.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CoL Index</p>
                    <p className="text-lg font-semibold">{current.costOfLiving}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blazeOrange/10 to-deepSea/10 rounded-xl p-6 border-2 border-blazeOrange/20">
                <p className="text-xs text-muted-foreground mb-3">Target: {targetCity}</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Expected Salary</p>
                    <p className="text-2xl font-bold text-mirage">
                      ${targetSalary.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">After Tax ({target.taxRate * 100}%)</p>
                    <p className="text-xl font-bold text-blazeOrange">
                      ${targetAfterTax.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CoL Index</p>
                    <p className="text-lg font-semibold">{target.costOfLiving}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blazeOrange/5 to-deepSea/5 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="font-semibold text-mirage">Purchasing Power Change</p>
                {purchasingPowerChange > 0 ? (
                  <div className="flex items-center gap-2 text-blazeOrange">
                    <TrendingUp className="h-5 w-5" />
                    <span className="text-2xl font-bold">+{purchasingPowerChange.toFixed(1)}%</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-mirage">
                    <TrendingDown className="h-5 w-5" />
                    <span className="text-2xl font-bold">{purchasingPowerChange.toFixed(1)}%</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {purchasingPowerChange > 0
                  ? `Moving to ${targetCity} increases your purchasing power by ${Math.abs(
                      purchasingPowerChange
                    ).toFixed(1)}%`
                  : `Moving to ${targetCity} decreases your purchasing power by ${Math.abs(
                      purchasingPowerChange
                    ).toFixed(1)}%`}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-deepSea/10">
                <p className="text-sm text-muted-foreground mb-1">Monthly Savings Potential</p>
                <p
                  className={`text-3xl font-bold ${
                    monthlySavings > 0 ? "text-blazeOrange" : "text-mirage"
                  }`}
                >
                  {monthlySavings > 0 ? "+" : ""}${Math.abs(monthlySavings).toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-deepSea/10">
                <p className="text-sm text-muted-foreground mb-1">Annual Savings Potential</p>
                <p
                  className={`text-3xl font-bold ${
                    annualSavings > 0 ? "text-deepSea" : "text-mirage"
                  }`}
                >
                  {annualSavings > 0 ? "+" : ""}${Math.abs(annualSavings).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
