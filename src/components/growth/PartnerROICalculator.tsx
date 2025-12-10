import { useState } from "react";
import { motion } from "framer-motion";
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
      <div className="p-8 bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl">
        <h3 className="text-2xl font-display font-bold text-white mb-6">
          your partner program
        </h3>
        
        <div className="space-y-8">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-white/60" />
                Active Partners
              </label>
              <span className="text-2xl font-bold text-white">{partnerCount}</span>
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
              <label className="text-sm font-semibold text-white">
                Deals/Partner/Month
              </label>
              <span className="text-2xl font-bold text-white">{avgDealsPerPartner}</span>
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
              <label className="text-sm font-semibold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-white/60" />
                Average Deal Value
              </label>
              <span className="text-2xl font-bold text-white">${avgDealValue.toLocaleString()}</span>
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
              <label className="text-sm font-semibold text-white">
                Commission Rate
              </label>
              <span className="text-2xl font-bold text-white">{commissionRate}%</span>
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
      </div>

      {/* Right: Results */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-8 bg-zinc-900/60 backdrop-blur-xl border border-white/15 rounded-2xl h-full">
          <h3 className="text-2xl font-display font-bold text-white mb-6">
            your potential with utm.one
          </h3>
          
          <div className="space-y-6">
            <div>
              <div className="text-sm text-white/60 mb-1">Yearly Partner Revenue</div>
              <div className="text-4xl font-bold text-white">
                ${(yearlyRevenue / 1000000).toFixed(2)}M
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-white/60 mb-1">Commission Payout</div>
                <div className="text-2xl font-bold text-white">
                  ${(commissionPayout / 1000).toFixed(0)}K
                </div>
              </div>
              <div>
                <div className="text-sm text-white/60 mb-1">Net Revenue</div>
                <div className="text-2xl font-bold text-white">
                  ${(netRevenue / 1000).toFixed(0)}K
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-semibold text-white">Time Saved with utm.one</span>
              </div>
              <div className="text-3xl font-bold text-emerald-400 mb-1">
                {timeSavedPerYear} hours/year
              </div>
              <div className="text-sm text-white/60 mb-4">
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
        </div>
      </motion.div>
    </div>
  );
};
