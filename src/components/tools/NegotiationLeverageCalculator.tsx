import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Target, TrendingUp } from "lucide-react";

export const NegotiationLeverageCalculator = () => {
  const [otherOffers, setOtherOffers] = useState(0);
  const [skillLevel, setSkillLevel] = useState(5);
  const [marketDemand, setMarketDemand] = useState(5);
  const [yearsExperience, setYearsExperience] = useState(3);

  const calculateLeverage = () => {
    let score = 0;
    if (otherOffers > 0) score += 30;
    if (otherOffers > 1) score += 15;
    score += skillLevel * 4;
    score += marketDemand * 4;
    score += Math.min(yearsExperience * 2, 20);
    return Math.min(score, 100);
  };

  const leverageScore = calculateLeverage();
  const leverageLevel = leverageScore >= 70 ? "High" : leverageScore >= 40 ? "Medium" : "Low";
  const leverageColor = leverageScore >= 70 ? "hsl(184,92%,18%)" : leverageScore >= 40 ? "hsl(18,100%,51%)" : "hsl(210,29%,12%)";

  return (
    <Card className="bg-muted/20">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Target className="w-6 h-6 text-[hsl(18,100%,51%)]" />
          Negotiation Leverage Calculator
        </CardTitle>
        <CardDescription>
          Assess your negotiation leverage based on offers, skills, market demand, and experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="offers">Number of Other Offers</Label>
            <Input
              id="offers"
              type="number"
              min="0"
              max="5"
              value={otherOffers}
              onChange={(e) => setOtherOffers(parseInt(e.target.value) || 0)}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Years of Experience</Label>
            <Input
              id="experience"
              type="number"
              min="0"
              max="30"
              value={yearsExperience}
              onChange={(e) => setYearsExperience(parseInt(e.target.value) || 0)}
              className="text-lg"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Skill Level (1-10)</Label>
          <Slider
            value={[skillLevel]}
            onValueChange={(vals) => setSkillLevel(vals[0])}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Beginner</span>
            <span className="font-semibold">{skillLevel}/10</span>
            <span>Expert</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Market Demand for Your Role (1-10)</Label>
          <Slider
            value={[marketDemand]}
            onValueChange={(vals) => setMarketDemand(vals[0])}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low Demand</span>
            <span className="font-semibold">{marketDemand}/10</span>
            <span>High Demand</span>
          </div>
        </div>

        <div className="p-6 bg-background rounded-xl border-2" style={{ borderColor: leverageColor }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Your Negotiation Leverage</p>
              <p className="text-4xl font-display font-bold" style={{ color: leverageColor }}>
                {leverageScore}/100
              </p>
            </div>
            <Badge className="text-lg px-4 py-2" style={{ backgroundColor: leverageColor, color: "white" }}>
              {leverageLevel}
            </Badge>
          </div>

          <div className="space-y-2 text-sm">
            {leverageScore >= 70 && (
              <p className="text-foreground">
                <strong>Strong Position:</strong> You have significant leverage. Anchor high (top of band or above) and negotiate multiple components simultaneously.
              </p>
            )}
            {leverageScore >= 40 && leverageScore < 70 && (
              <p className="text-foreground">
                <strong>Moderate Position:</strong> You have room to negotiate. Focus on signing bonus and total comp structure if base is rigid.
              </p>
            )}
            {leverageScore < 40 && (
              <p className="text-foreground">
                <strong>Building Position:</strong> Focus on demonstrating future value. Emphasize skills, AI proficiency, and revenue impact potential.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
