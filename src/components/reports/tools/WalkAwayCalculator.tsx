import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle, DollarSign } from "lucide-react";

export const WalkAwayCalculator = () => {
  const [rent, setRent] = useState<number>(2000);
  const [food, setFood] = useState<number>(600);
  const [transport, setTransport] = useState<number>(300);
  const [utilities, setUtilities] = useState<number>(200);
  const [savings, setSavings] = useState<number>(1000);
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const monthlyExpenses = rent + food + transport + utilities + savings;
    const annualMinimum = monthlyExpenses * 12;
    setResult(annualMinimum);
  };

  const getRiskZone = (salary: number) => {
    if (!result) return null;
    if (salary < result) return { zone: "Red Zone", colorStyle: { color: 'hsl(217 33% 17% / 1)', bg: 'hsl(217 33% 17% / 0.1)' } };
    if (salary < result * 1.2)
      return { zone: "Yellow Zone", colorStyle: { color: 'hsl(24 95% 53% / 1)', bg: 'hsl(24 95% 53% / 0.1)' } };
    return { zone: "Green Zone", colorStyle: { color: 'hsl(168 80% 40% / 1)', bg: 'hsl(168 80% 40% / 0.1)' } };
  };

  return (
    <Card className="border-2 border-blazeOrange/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <DollarSign className="h-6 w-6 text-blazeOrange" />
          Walk-Away Calculator
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Calculate your minimum acceptable salary based on expenses and savings goals
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Monthly Rent/Mortgage</Label>
            <Input
              type="number"
              value={rent}
              onChange={(e) => setRent(Number(e.target.value))}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Monthly Food</Label>
            <Input
              type="number"
              value={food}
              onChange={(e) => setFood(Number(e.target.value))}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Monthly Transport</Label>
            <Input
              type="number"
              value={transport}
              onChange={(e) => setTransport(Number(e.target.value))}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Monthly Utilities</Label>
            <Input
              type="number"
              value={utilities}
              onChange={(e) => setUtilities(Number(e.target.value))}
              className="mt-1"
            />
          </div>
          <div className="md:col-span-2">
            <Label>Monthly Savings Goal</Label>
            <Input
              type="number"
              value={savings}
              onChange={(e) => setSavings(Number(e.target.value))}
              className="mt-1"
            />
          </div>
        </div>

        <Button onClick={calculate} className="w-full bg-blazeOrange hover:bg-blazeOrange/90">
          Calculate My Walk-Away Number
        </Button>

        {result && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blazeOrange/10 to-deepSea/10 rounded-xl p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Your Minimum Annual Salary</p>
              <p className="text-4xl font-bold text-blazeOrange">
                ${result.toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <div className="rounded-lg p-3" style={{ background: getRiskZone(result * 0.9)?.colorStyle.bg }}>
                <p className="font-bold" style={{ color: getRiskZone(result * 0.9)?.colorStyle.color }}>Red Zone</p>
                <p className="text-xs text-muted-foreground mt-1">&lt; ${result.toLocaleString()}</p>
              </div>
              <div className="rounded-lg p-3" style={{ background: getRiskZone(result * 1.1)?.colorStyle.bg }}>
                <p className="font-bold" style={{ color: getRiskZone(result * 1.1)?.colorStyle.color }}>Yellow Zone</p>
                <p className="text-xs text-muted-foreground mt-1">
                  ${result.toLocaleString()} - ${(result * 1.2).toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg p-3" style={{ background: getRiskZone(result * 1.3)?.colorStyle.bg }}>
                <p className="font-bold" style={{ color: getRiskZone(result * 1.3)?.colorStyle.color }}>Green Zone</p>
                <p className="text-xs text-muted-foreground mt-1">&gt; ${(result * 1.2).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-deepSea/5 rounded-lg">
              <AlertCircle className="h-5 w-5 text-deepSea mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-foreground mb-1">Negotiation Tip</p>
                <p className="text-muted-foreground">
                  Any offer below ${result.toLocaleString()} puts you in financial stress. Use this
                  number as your non-negotiable floor when evaluating offers.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
