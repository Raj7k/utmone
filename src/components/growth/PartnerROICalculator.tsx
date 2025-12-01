import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { DollarSign, Users, TrendingUp } from "lucide-react";
import { shareOnLinkedIn } from "@/lib/utils/linkedinShare";

export const PartnerROICalculator = () => {
  const [partnerCount, setPartnerCount] = useState(10);
  const [avgDealsPerPartner, setAvgDealsPerPartner] = useState(5);
  const [avgDealValue, setAvgDealValue] = useState(5000);
  const [commissionRate, setCommissionRate] = useState(15);

  // Calculations
  const monthlyRevenue = partnerCount * avgDealsPerPartner * avgDealValue;
  const yearlyRevenue = monthlyRevenue * 12;
  const commissionPayout = yearlyRevenue * (commissionRate / 100);
  const netRevenue = yearlyRevenue - commissionPayout;
  
  // Time saved (hours per month managing partners manually)
  const timeSavedPerMonth = partnerCount * 4; // 4 hours per partner per month
  const timeSavedPerYear = timeSavedPerMonth * 12;
  const timeCostSaved = timeSavedPerYear * 50; // $50/hour ops cost

  const handleShare = () => {
    const message = `Partner program ROI with utm.one:\n\n💰 ${partnerCount} partners generating $${(yearlyRevenue / 1000000).toFixed(2)}M in annual revenue\n⏱️ ${timeSavedPerYear} hours saved per year\n📈 $${(timeCostSaved / 1000).toFixed(0)}K in operational savings\n\nCalculate yours at utm.one`;
    shareOnLinkedIn(message);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {/* Left: Inputs */}
      <Card className="p-8">
        <h3 className="text-2xl font-display font-bold text-foreground lowercase mb-6">
          your partner program
        </h3>
        
        <div className="space-y-8">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Active Partners
              </label>
              <span className="text-2xl font-bold text-primary">{partnerCount}</span>
            </div>
            <Slider
              value={[partnerCount]}
              onValueChange={(value) => setPartnerCount(value[0])}
              min={1}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-foreground">
                Deals/Partner/Month
              </label>
              <span className="text-2xl font-bold text-primary">{avgDealsPerPartner}</span>
            </div>
            <Slider
              value={[avgDealsPerPartner]}
              onValueChange={(value) => setAvgDealsPerPartner(value[0])}
              min={1}
              max={20}
              step={1}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                Average Deal Value
              </label>
              <span className="text-2xl font-bold text-primary">${avgDealValue.toLocaleString()}</span>
            </div>
            <Slider
              value={[avgDealValue]}
              onValueChange={(value) => setAvgDealValue(value[0])}
              min={1000}
              max={50000}
              step={1000}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-foreground">
                Commission Rate
              </label>
              <span className="text-2xl font-bold text-primary">{commissionRate}%</span>
            </div>
            <Slider
              value={[commissionRate]}
              onValueChange={(value) => setCommissionRate(value[0])}
              min={5}
              max={30}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </Card>

      {/* Right: Results */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20">
          <h3 className="text-2xl font-display font-bold text-foreground lowercase mb-6">
            your potential with utm.one
          </h3>
          
          <div className="space-y-6">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Yearly Partner Revenue</div>
              <div className="text-4xl font-bold text-primary">
                ${(yearlyRevenue / 1000000).toFixed(2)}M
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Commission Payout</div>
                <div className="text-2xl font-bold text-foreground">
                  ${(commissionPayout / 1000).toFixed(0)}K
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Net Revenue</div>
                <div className="text-2xl font-bold text-foreground">
                  ${(netRevenue / 1000).toFixed(0)}K
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-foreground">Time Saved with utm.one</span>
              </div>
              <div className="text-3xl font-bold text-primary mb-1">
                {timeSavedPerYear} hours/year
              </div>
              <div className="text-sm text-muted-foreground mb-4">
                Worth ${(timeCostSaved / 1000).toFixed(0)}K in operational savings
              </div>
            </div>

            <Button 
              onClick={handleShare}
              className="w-full"
              variant="marketing"
            >
              Share on LinkedIn
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
