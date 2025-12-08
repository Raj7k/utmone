import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, DollarSign, Clock, Users } from "lucide-react";
import { shareOnLinkedIn } from "@/lib/utils/linkedinShare";

export const ROICalculator = () => {
  const [teamSize, setTeamSize] = useState(5);
  const [hoursPerWeek, setHoursPerWeek] = useState(3);
  const [avgSalary, setAvgSalary] = useState(75000);

  // Calculations
  const hourlyRate = avgSalary / 52 / 40;
  const weeklyWaste = teamSize * hoursPerWeek * hourlyRate;
  const monthlyWaste = weeklyWaste * 4.33;
  const yearlyWaste = monthlyWaste * 12;
  
  // utm.one cost (assuming Business plan at $99/mo)
  const utmOneCost = 99 * 12;
  const yearlySavings = yearlyWaste - utmOneCost;
  const roi = ((yearlySavings / utmOneCost) * 100).toFixed(0);

  const handleShare = () => {
    const message = `I could save ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(yearlySavings)}/year by switching to utm.one for clean link tracking! Calculate your ROI: https://utm.one/growth/roi-calculator`;
    shareOnLinkedIn(message);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Inputs */}
        <div className="p-8 space-y-8 glass-card rounded-2xl">
          <div>
            <h3 className="text-2xl font-display font-bold text-white mb-2 lowercase">
              calculate your roi
            </h3>
            <p className="text-white/60 lowercase">
              see how much time and money you're losing to manual utm cleanup
            </p>
          </div>

          {/* Team Size */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white lowercase">team size</label>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                <span className="text-lg font-bold text-white">{teamSize}</span>
              </div>
            </div>
            <Slider
              value={[teamSize]}
              onValueChange={(value) => setTeamSize(value[0])}
              min={1}
              max={50}
              step={1}
              className="w-full"
            />
          </div>

          {/* Hours per Week */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white lowercase">hours/week cleaning data</label>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                <span className="text-lg font-bold text-white">{hoursPerWeek}h</span>
              </div>
            </div>
            <Slider
              value={[hoursPerWeek]}
              onValueChange={(value) => setHoursPerWeek(value[0])}
              min={0}
              max={10}
              step={0.5}
              className="w-full"
            />
          </div>

          {/* Average Salary */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white lowercase">average salary</label>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                <span className="text-lg font-bold text-white">
                  ${(avgSalary / 1000).toFixed(0)}k
                </span>
              </div>
            </div>
            <Slider
              value={[avgSalary]}
              onValueChange={(value) => setAvgSalary(value[0])}
              min={40000}
              max={200000}
              step={5000}
              className="w-full"
            />
          </div>
        </div>

        {/* Right: Results */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-8 glass-card rounded-2xl h-full flex flex-col">
            <div className="flex-1 space-y-6">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] mx-auto mb-4" />
                <h4 className="text-lg font-display font-semibold text-white mb-2 lowercase">
                  your potential savings
                </h4>
              </div>

              {/* Yearly Waste */}
              <div className="text-center p-6 bg-system-red/10 rounded-xl border border-system-red/20">
                <div className="text-sm text-white/60 mb-1 lowercase">wasted annually on manual cleanup</div>
                <div className="text-4xl font-display font-bold text-system-red">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 0
                  }).format(yearlyWaste)}
                </div>
              </div>

              {/* Savings */}
              <div className="text-center p-6 bg-system-green/10 rounded-xl border border-system-green/20">
                <div className="text-sm text-white/60 mb-1 lowercase">saved with utm.one</div>
                <div className="text-4xl font-display font-bold text-system-green">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 0
                  }).format(yearlySavings)}
                </div>
              </div>

              {/* ROI */}
              <div className="text-center">
                <div className="text-sm text-white/60 mb-1 lowercase">return on investment</div>
                <div className="text-5xl font-display font-bold text-white">{roi}%</div>
              </div>
            </div>

            {/* Share Button */}
            <div className="pt-6 border-t border-white/10 space-y-3">
              <Button
                className="w-full lowercase"
                onClick={handleShare}
              >
                share on linkedin
              </Button>
              <p className="text-xs text-center text-white/60 lowercase">
                show your team the cost of bad data
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
