import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const EquityCalculator = () => {
  const [sharesGranted, setSharesGranted] = useState("10000");
  const [strikePrice, setStrikePrice] = useState("5");
  const [currentValuation, setCurrentValuation] = useState("100");
  const [companyStage, setCompanyStage] = useState("Series A");
  const [vestingYears, setVestingYears] = useState("4");

  const calculateEquityValue = () => {
    const shares = parseInt(sharesGranted) || 0;
    const strike = parseFloat(strikePrice) || 0;
    const valuation = parseFloat(currentValuation) || 0;
    
    // Simplified calculation: (shares * price per share) - (shares * strike price)
    const pricePerShare = valuation / 1000000; // Assuming 1M shares outstanding
    const potentialValue = shares * pricePerShare;
    const costToExercise = shares * strike;
    const netValue = potentialValue - costToExercise;

    return {
      potentialValue: Math.round(potentialValue),
      costToExercise: Math.round(costToExercise),
      netValue: Math.round(netValue),
      annualValue: Math.round(netValue / parseInt(vestingYears))
    };
  };

  const result = calculateEquityValue();

  const stageMultipliers = {
    "Seed": { risk: "Very High", multiplier: "10-50x", probability: "5%" },
    "Series A": { risk: "High", multiplier: "5-20x", probability: "15%" },
    "Series B": { risk: "Medium-High", multiplier: "3-10x", probability: "25%" },
    "Series C": { risk: "Medium", multiplier: "2-5x", probability: "40%" },
    "Pre-IPO": { risk: "Low-Medium", multiplier: "1.5-3x", probability: "60%" },
    "Public": { risk: "Low", multiplier: "1-2x", probability: "Market" }
  };

  return (
    <Card className="border-2 border-blazeOrange/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blazeOrange/10">
            <Calculator className="h-6 w-6 text-blazeOrange" />
          </div>
          <div>
            <CardTitle className="text-2xl">Equity & Stock Options Calculator</CardTitle>
            <p className="text-sm text-secondary-label mt-1">
              Understand the real value of your equity compensation
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Number of Shares/Options Granted</Label>
            <Input
              type="number"
              value={sharesGranted}
              onChange={(e) => setSharesGranted(e.target.value)}
              placeholder="e.g., 10000"
            />
          </div>

          <div className="space-y-2">
            <Label>Strike Price (per share)</Label>
            <Input
              type="number"
              value={strikePrice}
              onChange={(e) => setStrikePrice(e.target.value)}
              placeholder="e.g., 5.00"
            />
          </div>

          <div className="space-y-2">
            <Label>Current Valuation ($M)</Label>
            <Input
              type="number"
              value={currentValuation}
              onChange={(e) => setCurrentValuation(e.target.value)}
              placeholder="e.g., 100"
            />
          </div>

          <div className="space-y-2">
            <Label>Company Stage</Label>
            <Select value={companyStage} onValueChange={setCompanyStage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Seed">Seed</SelectItem>
                <SelectItem value="Series A">Series A</SelectItem>
                <SelectItem value="Series B">Series B</SelectItem>
                <SelectItem value="Series C">Series C</SelectItem>
                <SelectItem value="Pre-IPO">Pre-IPO</SelectItem>
                <SelectItem value="Public">Public</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Vesting Period (years)</Label>
            <Select value={vestingYears} onValueChange={setVestingYears}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 years</SelectItem>
                <SelectItem value="3">3 years</SelectItem>
                <SelectItem value="4">4 years</SelectItem>
                <SelectItem value="5">5 years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4 p-6 bg-wildSand rounded-lg border-2 border-deepSea/20">
          <h3 className="font-bold text-lg text-deepSea mb-4">Equity Value Breakdown</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-secondary-label mb-1">Potential Value</div>
              <div className="text-2xl font-bold text-blazeOrange">
                ${result.potentialValue.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-secondary-label mb-1">Cost to Exercise</div>
              <div className="text-2xl font-bold text-mirage">
                ${result.costToExercise.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-secondary-label mb-1">Net Value</div>
              <div className="text-2xl font-bold text-deepSea">
                ${result.netValue.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-secondary-label mb-1">Annual Value (vested)</div>
              <div className="text-2xl font-bold text-deepSea">
                ${result.annualValue.toLocaleString()}/yr
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-blazeOrange/5 rounded-lg border border-blazeOrange/20">
          <div className="flex items-start gap-3 mb-4">
            <TrendingUp className="h-5 w-5 text-blazeOrange mt-0.5" />
            <div>
              <h4 className="font-semibold text-blazeOrange mb-2">
                {companyStage} Stage Risk Profile
              </h4>
              <div className="flex gap-3 mb-3">
                <Badge variant="outline" className="border-blazeOrange text-blazeOrange">
                  Risk: {stageMultipliers[companyStage as keyof typeof stageMultipliers].risk}
                </Badge>
                <Badge className="bg-deepSea">
                  Exit Probability: {stageMultipliers[companyStage as keyof typeof stageMultipliers].probability}
                </Badge>
                <Badge variant="secondary">
                  Potential: {stageMultipliers[companyStage as keyof typeof stageMultipliers].multiplier}
                </Badge>
              </div>
              <p className="text-sm text-secondary-label">
                At {companyStage} stage, your equity has a {stageMultipliers[companyStage as keyof typeof stageMultipliers].probability} probability 
                of a successful exit. Potential upside: {stageMultipliers[companyStage as keyof typeof stageMultipliers].multiplier} on current valuation.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-mirage/5 rounded-lg border border-mirage/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-mirage mt-0.5" />
            <div className="text-sm text-secondary-label space-y-2">
              <p className="font-semibold text-foreground">Important Considerations:</p>
              <ul className="space-y-1 ml-4 list-disc">
                <li>This is a simplified calculation. Actual value depends on: dilution from future funding rounds, preference stack, liquidation preferences.</li>
                <li>Options must be exercised (paid for) to own them. Plan for exercise cost + taxes.</li>
                <li>90-day exercise window post-termination is standard. Negotiate for longer if possible.</li>
                <li>Early exercise and 83(b) election can reduce tax burden significantly.</li>
                <li>Always request: latest 409A valuation, fully diluted share count, cap table visibility.</li>
              </ul>
            </div>
          </div>
        </div>

        <Button className="w-full bg-blazeOrange hover:bg-blazeOrange/90" size="lg">
          Download Detailed Equity Analysis
        </Button>
      </CardContent>
    </Card>
  );
};
