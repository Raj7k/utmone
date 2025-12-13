import { motion } from "framer-motion";
import { Trophy, Medal, Award } from "lucide-react";
import { AppleReveal } from "./AppleReveal";

interface TierData {
  position: number;
  label: string;
  count: number;
  referrals: string;
  conversions: number;
  percentage: string;
  icon: React.ElementType;
  podiumHeight: string;
  badgeColor: string;
}

const tiers: TierData[] = [
  {
    position: 2,
    label: "2nd",
    count: 28,
    referrals: "10-99",
    conversions: 909,
    percentage: "13%",
    icon: Medal,
    podiumHeight: "h-28",
    badgeColor: "text-zinc-400"
  },
  {
    position: 1,
    label: "1st",
    count: 7,
    referrals: "100+",
    conversions: 3173,
    percentage: "46%",
    icon: Trophy,
    podiumHeight: "h-40",
    badgeColor: "text-amber-400"
  },
  {
    position: 3,
    label: "3rd",
    count: 304,
    referrals: "1-9",
    conversions: 823,
    percentage: "12%",
    icon: Award,
    podiumHeight: "h-20",
    badgeColor: "text-orange-400"
  }
];

export const PowerLawPodium = () => {
  return (
    <AppleReveal className="w-full py-8">
      {/* Podium - Olympic style: 2nd | 1st | 3rd */}
      <div className="flex items-end justify-center gap-3 md:gap-4 mb-8">
        {tiers.map((tier, index) => {
          const Icon = tier.icon;
          const delay = index * 0.15;
          
          return (
            <motion.div
              key={tier.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                delay,
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="flex flex-col items-center"
            >
              {/* Icon and count above podium */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: delay + 0.2 }}
                className="text-center mb-3"
              >
                <Icon className={`w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 ${tier.badgeColor}`} />
                <div className="text-2xl md:text-3xl font-bold text-foreground font-mono">
                  {tier.count}
                </div>
                <div className="text-xs text-muted-foreground">
                  referrers
                </div>
              </motion.div>

              {/* Podium block */}
              <div 
                className={`
                  ${tier.podiumHeight} 
                  w-24 md:w-32 lg:w-40
                  bg-muted/50
                  border border-border
                  rounded-t-lg
                  flex flex-col items-center justify-center
                  px-2
                `}
              >
                <div className="text-lg md:text-xl font-bold text-foreground">
                  {tier.label}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {tier.referrals} refs
                </div>
                <div className={`text-sm font-bold mt-2 ${tier.badgeColor}`}>
                  {tier.percentage}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Stats summary */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap justify-center gap-6 text-sm"
      >
        <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 rounded-full border border-border">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-muted-foreground">
            <span className="font-mono font-bold text-foreground">7 champions</span> drove 46% of conversions
          </span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 rounded-full border border-border">
          <div className="w-2 h-2 rounded-full bg-zinc-500" />
          <span className="text-muted-foreground">
            <span className="font-mono font-bold text-foreground">643</span> referrers with 0 conversions (65%)
          </span>
        </div>
      </motion.div>
    </AppleReveal>
  );
};
