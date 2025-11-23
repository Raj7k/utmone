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

interface City {
  name: string;
  region: string;
  costOfLiving: number;
  salaryMultiplier: number;
  taxRate: number;
}

const cities: City[] = [
  // United States (25 cities)
  { name: "San Francisco", region: "North America", costOfLiving: 100, salaryMultiplier: 1.45, taxRate: 0.35 },
  { name: "New York", region: "North America", costOfLiving: 95, salaryMultiplier: 1.35, taxRate: 0.33 },
  { name: "Seattle", region: "North America", costOfLiving: 90, salaryMultiplier: 1.30, taxRate: 0.30 },
  { name: "Boston", region: "North America", costOfLiving: 88, salaryMultiplier: 1.28, taxRate: 0.32 },
  { name: "Los Angeles", region: "North America", costOfLiving: 85, salaryMultiplier: 1.25, taxRate: 0.33 },
  { name: "San Diego", region: "North America", costOfLiving: 82, salaryMultiplier: 1.20, taxRate: 0.32 },
  { name: "Washington DC", region: "North America", costOfLiving: 88, salaryMultiplier: 1.28, taxRate: 0.31 },
  { name: "Austin", region: "North America", costOfLiving: 75, salaryMultiplier: 1.10, taxRate: 0.27 },
  { name: "Denver", region: "North America", costOfLiving: 78, salaryMultiplier: 1.12, taxRate: 0.28 },
  { name: "Chicago", region: "North America", costOfLiving: 76, salaryMultiplier: 1.08, taxRate: 0.30 },
  { name: "Portland", region: "North America", costOfLiving: 74, salaryMultiplier: 1.05, taxRate: 0.29 },
  { name: "Atlanta", region: "North America", costOfLiving: 70, salaryMultiplier: 1.00, taxRate: 0.28 },
  { name: "Miami", region: "North America", costOfLiving: 72, salaryMultiplier: 0.98, taxRate: 0.27 },
  { name: "Dallas", region: "North America", costOfLiving: 68, salaryMultiplier: 0.95, taxRate: 0.27 },
  { name: "Phoenix", region: "North America", costOfLiving: 65, salaryMultiplier: 0.92, taxRate: 0.26 },
  { name: "Philadelphia", region: "North America", costOfLiving: 73, salaryMultiplier: 1.02, taxRate: 0.30 },
  { name: "Nashville", region: "North America", costOfLiving: 67, salaryMultiplier: 0.93, taxRate: 0.26 },
  { name: "Raleigh", region: "North America", costOfLiving: 66, salaryMultiplier: 0.94, taxRate: 0.27 },
  { name: "Salt Lake City", region: "North America", costOfLiving: 68, salaryMultiplier: 0.90, taxRate: 0.25 },
  { name: "Remote US (HCOL)", region: "North America", costOfLiving: 75, salaryMultiplier: 0.95, taxRate: 0.28 },
  { name: "Remote US (National)", region: "North America", costOfLiving: 65, salaryMultiplier: 0.85, taxRate: 0.25 },
  { name: "Remote US (LCOL)", region: "North America", costOfLiving: 55, salaryMultiplier: 0.75, taxRate: 0.23 },

  // India (15 cities)
  { name: "Bangalore", region: "Asia Pacific", costOfLiving: 35, salaryMultiplier: 0.35, taxRate: 0.15 },
  { name: "Hyderabad", region: "Asia Pacific", costOfLiving: 32, salaryMultiplier: 0.32, taxRate: 0.14 },
  { name: "Pune", region: "Asia Pacific", costOfLiving: 33, salaryMultiplier: 0.33, taxRate: 0.15 },
  { name: "Mumbai", region: "Asia Pacific", costOfLiving: 40, salaryMultiplier: 0.36, taxRate: 0.16 },
  { name: "Delhi NCR", region: "Asia Pacific", costOfLiving: 37, salaryMultiplier: 0.34, taxRate: 0.15 },
  { name: "Chennai", region: "Asia Pacific", costOfLiving: 30, salaryMultiplier: 0.30, taxRate: 0.14 },
  { name: "Kolkata", region: "Asia Pacific", costOfLiving: 28, salaryMultiplier: 0.28, taxRate: 0.13 },
  { name: "Ahmedabad", region: "Asia Pacific", costOfLiving: 29, salaryMultiplier: 0.29, taxRate: 0.13 },
  { name: "Jaipur", region: "Asia Pacific", costOfLiving: 26, salaryMultiplier: 0.26, taxRate: 0.12 },
  { name: "Kochi", region: "Asia Pacific", costOfLiving: 27, salaryMultiplier: 0.27, taxRate: 0.13 },
  { name: "Chandigarh", region: "Asia Pacific", costOfLiving: 28, salaryMultiplier: 0.28, taxRate: 0.13 },
  { name: "Indore", region: "Asia Pacific", costOfLiving: 24, salaryMultiplier: 0.24, taxRate: 0.12 },
  { name: "Coimbatore", region: "Asia Pacific", costOfLiving: 23, salaryMultiplier: 0.23, taxRate: 0.12 },
  { name: "Vadodara", region: "Asia Pacific", costOfLiving: 25, salaryMultiplier: 0.25, taxRate: 0.12 },
  { name: "Gurgaon", region: "Asia Pacific", costOfLiving: 38, salaryMultiplier: 0.35, taxRate: 0.15 },

  // Europe (12 cities)
  { name: "London", region: "Europe", costOfLiving: 88, salaryMultiplier: 0.88, taxRate: 0.38 },
  { name: "Manchester", region: "Europe", costOfLiving: 68, salaryMultiplier: 0.72, taxRate: 0.35 },
  { name: "Edinburgh", region: "Europe", costOfLiving: 70, salaryMultiplier: 0.73, taxRate: 0.36 },
  { name: "Berlin", region: "Europe", costOfLiving: 72, salaryMultiplier: 0.78, taxRate: 0.40 },
  { name: "Munich", region: "Europe", costOfLiving: 80, salaryMultiplier: 0.85, taxRate: 0.42 },
  { name: "Frankfurt", region: "Europe", costOfLiving: 78, salaryMultiplier: 0.82, taxRate: 0.41 },
  { name: "Amsterdam", region: "Europe", costOfLiving: 85, salaryMultiplier: 0.85, taxRate: 0.43 },
  { name: "Paris", region: "Europe", costOfLiving: 83, salaryMultiplier: 0.80, taxRate: 0.42 },
  { name: "Zurich", region: "Europe", costOfLiving: 110, salaryMultiplier: 1.15, taxRate: 0.30 },
  { name: "Dublin", region: "Europe", costOfLiving: 86, salaryMultiplier: 0.82, taxRate: 0.38 },
  { name: "Madrid", region: "Europe", costOfLiving: 65, salaryMultiplier: 0.65, taxRate: 0.37 },
  { name: "Barcelona", region: "Europe", costOfLiving: 68, salaryMultiplier: 0.67, taxRate: 0.38 },

  // APAC (8 cities)
  { name: "Singapore", region: "Asia Pacific", costOfLiving: 92, salaryMultiplier: 0.95, taxRate: 0.15 },
  { name: "Sydney", region: "Asia Pacific", costOfLiving: 85, salaryMultiplier: 0.88, taxRate: 0.32 },
  { name: "Melbourne", region: "Asia Pacific", costOfLiving: 80, salaryMultiplier: 0.85, taxRate: 0.31 },
  { name: "Brisbane", region: "Asia Pacific", costOfLiving: 72, salaryMultiplier: 0.78, taxRate: 0.30 },
  { name: "Tokyo", region: "Asia Pacific", costOfLiving: 78, salaryMultiplier: 0.72, taxRate: 0.28 },
  { name: "Seoul", region: "Asia Pacific", costOfLiving: 70, salaryMultiplier: 0.68, taxRate: 0.24 },
  { name: "Hong Kong", region: "Asia Pacific", costOfLiving: 95, salaryMultiplier: 0.90, taxRate: 0.15 },
  { name: "Bangkok", region: "Asia Pacific", costOfLiving: 45, salaryMultiplier: 0.42, taxRate: 0.20 },

  // Middle East (3 cities)
  { name: "Dubai", region: "Middle East", costOfLiving: 75, salaryMultiplier: 0.80, taxRate: 0.05 },
  { name: "Abu Dhabi", region: "Middle East", costOfLiving: 73, salaryMultiplier: 0.78, taxRate: 0.05 },
  { name: "Tel Aviv", region: "Middle East", costOfLiving: 82, salaryMultiplier: 0.75, taxRate: 0.35 },

  // Canada (4 cities)
  { name: "Toronto", region: "North America", costOfLiving: 75, salaryMultiplier: 0.80, taxRate: 0.35 },
  { name: "Vancouver", region: "North America", costOfLiving: 78, salaryMultiplier: 0.82, taxRate: 0.36 },
  { name: "Montreal", region: "North America", costOfLiving: 65, salaryMultiplier: 0.70, taxRate: 0.38 },
  { name: "Calgary", region: "North America", costOfLiving: 70, salaryMultiplier: 0.75, taxRate: 0.33 },

  // Latin America (3 cities)
  { name: "Mexico City", region: "Latin America", costOfLiving: 40, salaryMultiplier: 0.30, taxRate: 0.18 },
  { name: "São Paulo", region: "Latin America", costOfLiving: 42, salaryMultiplier: 0.32, taxRate: 0.22 },
  { name: "Buenos Aires", region: "Latin America", costOfLiving: 38, salaryMultiplier: 0.28, taxRate: 0.20 },
];

const regions = ["All Regions", "North America", "Europe", "Asia Pacific", "Middle East", "Latin America"];

export const GeographicArbitrageCalculator = () => {
  const [currentCity, setCurrentCity] = useState("San Francisco");
  const [currentSalary, setCurrentSalary] = useState(135000);
  const [targetCity, setTargetCity] = useState("Austin");
  const [calculated, setCalculated] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("All Regions");

  const calculate = () => {
    setCalculated(true);
  };

  const filteredCities = selectedRegion === "All Regions" 
    ? cities 
    : cities.filter(c => c.region === selectedRegion);

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
        {/* Region Filter */}
        <div className="flex gap-2 flex-wrap">
          {regions.map((region) => (
            <Button
              key={region}
              variant={selectedRegion === region ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRegion(region)}
              className={selectedRegion === region ? "bg-deepSea" : ""}
            >
              {region}
            </Button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label>Current City</Label>
            <Select value={currentCity} onValueChange={setCurrentCity}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {filteredCities.map((city) => (
                  <SelectItem key={city.name} value={city.name}>
                    {city.name} ({city.region})
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
                {filteredCities.map((city) => (
                  <SelectItem key={city.name} value={city.name}>
                    {city.name} ({city.region})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-2">
              Comparing {filteredCities.length} cities
            </p>
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
