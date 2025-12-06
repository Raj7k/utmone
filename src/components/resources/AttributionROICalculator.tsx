import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const AttributionROICalculator = () => {
  const [marketingSpend, setMarketingSpend] = useState<number>(50000);
  const [currentCAC, setCurrentCAC] = useState<number>(500);
  const [wastedSpend, setWastedSpend] = useState<number>(25);
  const [attributionCost, setAttributionCost] = useState<number>(1000);

  const [results, setResults] = useState({
    efficiency: 0,
    cacReduction: 0,
    roi: 0,
    paybackDays: 0,
    fiveYearSavings: 0
  });

  useEffect(() => {
    // Calculate efficiency gain
    const wastedAmount = (marketingSpend * wastedSpend) / 100;
    const recoveredSpend = wastedAmount * 0.7; // 70% recovery rate
    const efficiencyGain = (recoveredSpend / marketingSpend) * 100;

    // Calculate CAC reduction
    const newCAC = currentCAC * (1 - efficiencyGain / 100);
    const cacReduction = ((currentCAC - newCAC) / currentCAC) * 100;

    // Calculate ROI
    const annualSavings = recoveredSpend * 12;
    const annualCost = attributionCost * 12;
    const roi = ((annualSavings - annualCost) / annualCost) * 100;

    // Calculate payback period
    const paybackDays = Math.round((annualCost / annualSavings) * 365);

    // Calculate 5-year savings
    const fiveYearSavings = annualSavings * 5 - annualCost * 5;

    setResults({
      efficiency: Math.round(efficiencyGain),
      cacReduction: Math.round(cacReduction),
      roi: Math.round(roi),
      paybackDays,
      fiveYearSavings: Math.round(fiveYearSavings)
    });
  }, [marketingSpend, currentCAC, wastedSpend, attributionCost]);

  const getROITier = () => {
    if (results.roi >= 300) return { label: "Excellent", color: "text-green-600" };
    if (results.roi >= 200) return { label: "Great", color: "text-blue-600" };
    if (results.roi >= 100) return { label: "Good", color: "text-yellow-600" };
    return { label: "Needs Improvement", color: "text-red-600" };
  };

  const roiTier = getROITier();

  return (
    <div className="space-y-8">
      {/* Input Fields */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="marketing-spend">Monthly Marketing Spend ($)</Label>
          <Input
            id="marketing-spend"
            type="number"
            value={marketingSpend}
            onChange={(e) => setMarketingSpend(Number(e.target.value))}
            className="text-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="current-cac">Current CAC ($)</Label>
          <Input
            id="current-cac"
            type="number"
            value={currentCAC}
            onChange={(e) => setCurrentCAC(Number(e.target.value))}
            className="text-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="wasted-spend">Estimated Wasted Spend (%)</Label>
          <Input
            id="wasted-spend"
            type="number"
            value={wastedSpend}
            onChange={(e) => setWastedSpend(Number(e.target.value))}
            min={0}
            max={100}
            className="text-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="attribution-cost">Monthly Attribution Cost ($)</Label>
          <Input
            id="attribution-cost"
            type="number"
            value={attributionCost}
            onChange={(e) => setAttributionCost(Number(e.target.value))}
            className="text-lg"
          />
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-6 border-2 border-border/50"
        >
          <div className="text-sm text-muted-foreground mb-2">Efficiency Gain</div>
          <div className="text-4xl font-display font-bold mb-1 text-primary">
            {results.efficiency}%
          </div>
          <div className="text-xs text-muted-foreground">marketing efficiency improvement</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-6 border-2 border-border/50"
        >
          <div className="text-sm text-muted-foreground mb-2">CAC Reduction</div>
          <div className="text-4xl font-display font-bold mb-1 text-primary">
            {results.cacReduction}%
          </div>
          <div className="text-xs text-muted-foreground">lower customer acquisition cost</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl p-6 border-2 border-border/50"
        >
          <div className="text-sm text-muted-foreground mb-2">Payback Period</div>
          <div className="text-4xl font-display font-bold mb-1 text-primary">
            {results.paybackDays}
          </div>
          <div className="text-xs text-muted-foreground">days to break even</div>
        </motion.div>
      </div>

      {/* ROI Gauge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl p-8 border-2 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20"
      >
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Attribution ROI</h3>
          </div>
          
          <div className="text-7xl font-display font-bold text-primary">
            {results.roi}%
          </div>
          
          <div className={cn("text-xl font-semibold", roiTier.color)}>
            {roiTier.label}
          </div>
          
          <div className="pt-4 border-t border-border/50">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="w-4 h-4" />
              <span>5-year projected savings:</span>
              <span className="font-semibold text-foreground">
                ${results.fiveYearSavings.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Explanation */}
      <div className="text-sm text-muted-foreground space-y-2 p-6 bg-muted/30 rounded-lg">
        <p>
          <strong className="text-foreground">How this works:</strong> Attribution systems help you identify and eliminate wasted marketing spend by showing which channels actually drive conversions.
        </p>
        <p>
          Based on industry benchmarks, companies typically recover 70% of their wasted spend within the first year of implementing proper attribution.
        </p>
      </div>
    </div>
  );
};