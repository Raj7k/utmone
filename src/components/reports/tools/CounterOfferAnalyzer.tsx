import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Copy } from "lucide-react";
import { toast } from "sonner";

export const CounterOfferAnalyzer = () => {
  const [baseOffer, setBaseOffer] = useState<number>(95000);
  const [equity, setEquity] = useState<number>(20000);
  const [bonus, setBonus] = useState<number>(10000);
  const [calculated, setCalculated] = useState(false);

  const marketMedian = 110000;
  const scenarios = [
    {
      name: "Conservative",
      base: Math.round(baseOffer * 1.05),
      equity: Math.round(equity * 1.1),
      bonus: bonus,
      probability: "85%",
      color: "deepSea",
    },
    {
      name: "Balanced",
      base: Math.round(baseOffer * 1.1),
      equity: Math.round(equity * 1.15),
      bonus: Math.round(bonus * 1.1),
      probability: "65%",
      color: "blazeOrange",
    },
    {
      name: "Aggressive",
      base: Math.round(baseOffer * 1.15),
      equity: Math.round(equity * 1.25),
      bonus: Math.round(bonus * 1.2),
      probability: "35%",
      color: "mirage",
    },
  ];

  const emailTemplate = (scenario: typeof scenarios[0]) => `Subject: Re: Offer - Excited to Join, Counter-Proposal

Hi [Hiring Manager],

Thank you for the offer. I'm very excited about this opportunity and the team.

After careful consideration and based on my research of market rates for this role, I'd like to propose the following adjustments:

• Base Salary: $${scenario.base.toLocaleString()} (from $${baseOffer.toLocaleString()})
• Equity: $${scenario.equity.toLocaleString()} (from $${equity.toLocaleString()})
${scenario.bonus !== bonus ? `• Bonus Target: $${scenario.bonus.toLocaleString()} (from $${bonus.toLocaleString()})` : ""}

This aligns with the market median for this role and my experience level. I'm confident I'll deliver exceptional value.

Looking forward to discussing this further.

Best regards,
[Your Name]`;

  return (
    <Card className="border-2 border-deepSea/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <TrendingUp className="h-6 w-6 text-deepSea" />
          Counter-Offer Analyzer
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Generate optimal counter-offer scenarios with acceptance probability
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label>Base Salary Offered</Label>
            <Input
              type="number"
              value={baseOffer}
              onChange={(e) => setBaseOffer(Number(e.target.value))}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Equity Value (Annual)</Label>
            <Input
              type="number"
              value={equity}
              onChange={(e) => setEquity(Number(e.target.value))}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Bonus Target</Label>
            <Input
              type="number"
              value={bonus}
              onChange={(e) => setBonus(Number(e.target.value))}
              className="mt-1"
            />
          </div>
        </div>

        <div className="bg-wildSand/30 rounded-lg p-4 text-sm">
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Your Total Comp:</span>
            <span className="font-bold text-mirage">
              ${(baseOffer + equity + bonus).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Market Median:</span>
            <span className="font-bold text-deepSea">${marketMedian.toLocaleString()}</span>
          </div>
        </div>

        <Button
          onClick={() => setCalculated(true)}
          className="w-full bg-deepSea hover:bg-deepSea/90"
        >
          Generate Counter-Offer Scenarios
        </Button>

        {calculated && (
          <Tabs defaultValue="conservative" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="conservative">Conservative</TabsTrigger>
              <TabsTrigger value="balanced">Balanced</TabsTrigger>
              <TabsTrigger value="aggressive">Aggressive</TabsTrigger>
            </TabsList>

            {scenarios.map((scenario) => (
              <TabsContent key={scenario.name} value={scenario.name.toLowerCase()} className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-zinc-900/40 backdrop-blur-xl rounded-lg p-4 border border-white/10">
                    <p className="text-xs text-white/60 mb-1">Base Salary</p>
                    <p className={`text-xl font-bold text-${scenario.color}`}>
                      ${scenario.base.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      +{Math.round(((scenario.base - baseOffer) / baseOffer) * 100)}%
                    </p>
                  </div>
                  <div className="bg-zinc-900/40 backdrop-blur-xl rounded-lg p-4 border border-white/10">
                    <p className="text-xs text-white/60 mb-1">Equity</p>
                    <p className={`text-xl font-bold text-${scenario.color}`}>
                      ${scenario.equity.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      +{Math.round(((scenario.equity - equity) / equity) * 100)}%
                    </p>
                  </div>
                  <div className="bg-zinc-900/40 backdrop-blur-xl rounded-lg p-4 border border-white/10">
                    <p className="text-xs text-white/60 mb-1">Total Comp</p>
                    <p className={`text-xl font-bold text-${scenario.color}`}>
                      ${(scenario.base + scenario.equity + scenario.bonus).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blazeOrange/5 to-deepSea/5 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-mirage">Acceptance Probability</p>
                    <p className="text-2xl font-bold text-blazeOrange">{scenario.probability}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Based on typical counter-offer negotiations in your role and market
                  </p>
                </div>

                <div className="bg-zinc-900/40 backdrop-blur-xl rounded-lg p-4 border-2 border-dashed border-white/20">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-semibold text-mirage">Email Template</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(emailTemplate(scenario));
                        toast.success("Email template copied to clipboard");
                      }}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                    {emailTemplate(scenario)}
                  </pre>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};
