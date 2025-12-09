import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator, Share2, DollarSign, Users, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { shareToLinkedIn } from "@/utils/linkedinShare";

export const EventROICalculator = () => {
  const [eventCost, setEventCost] = useState(25000);
  const [badgeScans, setBadgeScans] = useState(120);
  const [avgDealValue, setAvgDealValue] = useState(15000);
  const [haloMultiplier, setHaloMultiplier] = useState([4]);

  const results = useMemo(() => {
    const estimatedHaloVisitors = badgeScans * haloMultiplier[0];
    const totalImpact = badgeScans + estimatedHaloVisitors;
    const conversionRate = 0.02; // 2% conversion rate
    const estimatedDeals = Math.round(totalImpact * conversionRate);
    const estimatedRevenue = estimatedDeals * avgDealValue;
    const roi = ((estimatedRevenue - eventCost) / eventCost) * 100;
    const costPerLeadWithoutHalo = eventCost / badgeScans;
    const costPerLeadWithHalo = eventCost / totalImpact;
    const savings = costPerLeadWithoutHalo - costPerLeadWithHalo;

    return {
      estimatedHaloVisitors,
      totalImpact,
      estimatedDeals,
      estimatedRevenue,
      roi,
      costPerLeadWithoutHalo,
      costPerLeadWithHalo,
      savings,
    };
  }, [eventCost, badgeScans, avgDealValue, haloMultiplier]);

  const handleShare = () => {
    const text = `🎯 Event ROI Calculator Results:\n\n📊 ${badgeScans} badge scans + ${results.estimatedHaloVisitors.toLocaleString()} halo visitors = ${results.totalImpact.toLocaleString()} total impact\n\n💰 Estimated pipeline: $${results.estimatedRevenue.toLocaleString()}\n📈 ROI: ${results.roi.toFixed(0)}%\n\nCalculate your event's true impact → utm.one/features/event-halo`;
    shareToLinkedIn(text);
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">event roi calculator</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="eventCost" className="text-sm text-muted-foreground">
              event cost ($)
            </Label>
            <Input
              id="eventCost"
              type="number"
              value={eventCost}
              onChange={(e) => setEventCost(Number(e.target.value))}
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="badgeScans" className="text-sm text-muted-foreground">
              badge scans / direct leads
            </Label>
            <Input
              id="badgeScans"
              type="number"
              value={badgeScans}
              onChange={(e) => setBadgeScans(Number(e.target.value))}
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avgDealValue" className="text-sm text-muted-foreground">
              average deal value ($)
            </Label>
            <Input
              id="avgDealValue"
              type="number"
              value={avgDealValue}
              onChange={(e) => setAvgDealValue(Number(e.target.value))}
              className="bg-background"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-muted-foreground">
                halo multiplier
              </Label>
              <span className="text-sm font-medium text-foreground">{haloMultiplier[0]}x</span>
            </div>
            <Slider
              value={haloMultiplier}
              onValueChange={setHaloMultiplier}
              min={2}
              max={10}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              industry average: 4-6x visitors per badge scan
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <motion.div
            key={results.totalImpact}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-4 rounded-lg bg-primary/5 border border-primary/20"
          >
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">total impact</span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {results.totalImpact.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {badgeScans} direct + {results.estimatedHaloVisitors.toLocaleString()} halo
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">est. pipeline</span>
              </div>
              <p className="text-xl font-bold text-foreground">
                ${results.estimatedRevenue.toLocaleString()}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">roi</span>
              </div>
              <p className={`text-xl font-bold ${results.roi > 0 ? 'text-primary' : 'text-destructive'}`}>
                {results.roi > 0 ? '+' : ''}{results.roi.toFixed(0)}%
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-border bg-card">
            <p className="text-sm text-muted-foreground mb-2">cost per lead comparison</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">without halo</p>
                <p className="text-lg font-semibold text-destructive line-through">
                  ${results.costPerLeadWithoutHalo.toFixed(0)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">with halo</p>
                <p className="text-lg font-semibold text-primary">
                  ${results.costPerLeadWithHalo.toFixed(0)}
                </p>
              </div>
            </div>
            <p className="text-xs text-primary mt-2">
              saving ${results.savings.toFixed(0)} per lead
            </p>
          </div>

          <Button onClick={handleShare} variant="outline" className="w-full">
            <Share2 className="w-4 h-4 mr-2" />
            share on linkedin
          </Button>
        </div>
      </div>
    </Card>
  );
};