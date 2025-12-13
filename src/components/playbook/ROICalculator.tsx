import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Users, TrendingUp, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppleReveal } from "./AppleReveal";

export const ROICalculator = () => {
  const [eventSize, setEventSize] = useState(5000);
  
  // HR Katalyst ratios
  const referrerTakeRate = 0.196; // 19.6% become referrers
  const activeSharerRate = 0.345; // 34.5% of referrers have 1+ conversion
  const avgClicksPerReferrer = 24.5; // 24,044 / 982
  const conversionRate = 0.28; // 28%
  
  const projectedReferrers = Math.round(eventSize * referrerTakeRate);
  const activeSharers = Math.round(projectedReferrers * activeSharerRate);
  const totalClicks = Math.round(projectedReferrers * avgClicksPerReferrer);
  const projectedConversions = Math.round(totalClicks * conversionRate);
  const growthMultiplier = ((eventSize + projectedConversions) / eventSize).toFixed(1);

  return (
    <AppleReveal>
      <Card className="p-6 md:p-8 bg-card border-border overflow-hidden relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calculator className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">ROI Calculator</h3>
              <p className="text-sm text-muted-foreground">Project your referral impact</p>
            </div>
          </div>

          {/* Input */}
          <div className="mb-8">
            <Label htmlFor="eventSize" className="text-sm text-muted-foreground mb-2 block">
              Your expected event registrations
            </Label>
            <Input
              id="eventSize"
              type="number"
              value={eventSize}
              onChange={(e) => setEventSize(Math.max(100, parseInt(e.target.value) || 0))}
              className="text-2xl font-mono font-bold h-14 bg-background"
            />
          </div>

          {/* Results */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { 
                icon: Users, 
                label: "Referrers", 
                value: projectedReferrers.toLocaleString(),
                subLabel: "19.6% take rate"
              },
              { 
                icon: TrendingUp, 
                label: "Active Sharers", 
                value: activeSharers.toLocaleString(),
                subLabel: "34.5% of referrers"
              },
              { 
                icon: Target, 
                label: "New Registrations", 
                value: projectedConversions.toLocaleString(),
                subLabel: "28% conversion"
              },
              { 
                icon: Calculator, 
                label: "Growth Multiple", 
                value: `${growthMultiplier}x`,
                subLabel: "total audience"
              },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-muted/30 rounded-xl p-4 text-center"
              >
                <item.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground font-mono">
                  {item.value}
                </div>
                <div className="text-xs text-muted-foreground">{item.label}</div>
                <div className="text-xs text-muted-foreground/70 mt-1">{item.subLabel}</div>
              </motion.div>
            ))}
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground/70 text-center mt-6">
            Projections based on HR Katalyst Season 5 ratios. Your results may vary.
          </p>
        </div>
      </Card>
    </AppleReveal>
  );
};
