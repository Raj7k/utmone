import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Target } from "lucide-react";

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
  const leverageColorClass = leverageScore >= 70 ? "text-system-green bg-system-green/10 border-system-green/30" : 
                             leverageScore >= 40 ? "text-system-orange bg-system-orange/10 border-system-orange/30" : 
                             "text-muted-foreground bg-muted border-border";

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-2xl font-display flex items-center gap-2 lowercase">
          <Target className="w-6 h-6 text-primary" />
          negotiation leverage calculator
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          assess your negotiation leverage based on offers, skills, market demand, and experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="offers" className="lowercase">number of other offers</Label>
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
            <Label htmlFor="experience" className="lowercase">years of experience</Label>
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
          <Label className="lowercase">skill level (1-10)</Label>
          <Slider
            value={[skillLevel]}
            onValueChange={(vals) => setSkillLevel(vals[0])}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="lowercase">beginner</span>
            <span className="font-semibold">{skillLevel}/10</span>
            <span className="lowercase">expert</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="lowercase">market demand for your role (1-10)</Label>
          <Slider
            value={[marketDemand]}
            onValueChange={(vals) => setMarketDemand(vals[0])}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="lowercase">low demand</span>
            <span className="font-semibold">{marketDemand}/10</span>
            <span className="lowercase">high demand</span>
          </div>
        </div>

        <div className={`p-6 rounded-xl border-2 ${leverageColorClass}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1 lowercase">your negotiation leverage</p>
              <p className="text-4xl font-display font-bold">
                {leverageScore}/100
              </p>
            </div>
            <Badge className={`text-lg px-4 py-2 ${leverageColorClass}`}>
              {leverageLevel}
            </Badge>
          </div>

          <div className="space-y-2 text-sm">
            {leverageScore >= 70 && (
              <p className="text-foreground">
                <strong>strong position:</strong> you have significant leverage. anchor high (top of band or above) and negotiate multiple components simultaneously.
              </p>
            )}
            {leverageScore >= 40 && leverageScore < 70 && (
              <p className="text-foreground">
                <strong>moderate position:</strong> you have room to negotiate. focus on signing bonus and total comp structure if base is rigid.
              </p>
            )}
            {leverageScore < 40 && (
              <p className="text-foreground">
                <strong>building position:</strong> focus on demonstrating future value. emphasize skills, AI proficiency, and revenue impact potential.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
