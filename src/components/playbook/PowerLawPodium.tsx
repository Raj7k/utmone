import { motion } from "framer-motion";
import { Trophy, Medal, Award } from "lucide-react";

interface TierData {
  rank: string;
  count: number;
  referrals: string;
  conversions: number;
  percentage: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  height: string;
}

const tiers: TierData[] = [
  {
    rank: "2nd",
    count: 28,
    referrals: "10-99",
    conversions: 909,
    percentage: "13%",
    icon: Medal,
    color: "text-zinc-400",
    bgColor: "from-zinc-400/20 to-zinc-500/30",
    height: "h-32 md:h-40"
  },
  {
    rank: "1st",
    count: 7,
    referrals: "100+",
    conversions: 3173,
    percentage: "46%",
    icon: Trophy,
    color: "text-amber-400",
    bgColor: "from-amber-400/20 to-amber-500/30",
    height: "h-44 md:h-56"
  },
  {
    rank: "3rd",
    count: 304,
    referrals: "1-9",
    conversions: 823,
    percentage: "12%",
    icon: Award,
    color: "text-orange-400",
    bgColor: "from-orange-400/20 to-orange-500/30",
    height: "h-24 md:h-32"
  }
];

export const PowerLawPodium = () => {
  return (
    <div className="w-full py-8">
      {/* Podium */}
      <div className="flex items-end justify-center gap-2 md:gap-4 mb-8">
        {tiers.map((tier, index) => {
          const Icon = tier.icon;
          const delay = index === 1 ? 0 : index === 0 ? 0.1 : 0.2;
          
          return (
            <motion.div
              key={tier.rank}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                delay,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="flex flex-col items-center"
            >
              {/* Badge icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: delay + 0.3,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 200
                }}
                className={`mb-3 ${tier.color}`}
              >
                <Icon className="w-8 h-8 md:w-10 md:h-10" />
              </motion.div>

              {/* Podium block */}
              <div 
                className={`
                  ${tier.height} w-24 md:w-36 lg:w-44
                  bg-gradient-to-t ${tier.bgColor}
                  backdrop-blur-sm
                  border border-white/10
                  rounded-t-xl
                  flex flex-col items-center justify-start
                  pt-4 px-2
                  relative overflow-hidden
                `}
              >
                {/* Shimmer effect */}
                <motion.div
                  initial={{ x: "-100%" }}
                  whileInView={{ x: "200%" }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: delay + 0.5,
                    duration: 1.5,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                />

                {/* Count */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: delay + 0.4 }}
                  className="text-center relative z-10"
                >
                  <div className="text-2xl md:text-3xl font-bold text-foreground font-mono">
                    {tier.count}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    referrers
                  </div>
                  <div className="text-xs text-muted-foreground/70 mt-0.5">
                    {tier.referrals} refs each
                  </div>
                </motion.div>

                {/* Percentage badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: delay + 0.6,
                    type: "spring",
                    stiffness: 300
                  }}
                  className={`
                    absolute bottom-3 
                    px-3 py-1 
                    rounded-full 
                    bg-background/80 
                    border border-white/20
                    backdrop-blur-sm
                  `}
                >
                  <span className={`text-sm font-bold ${tier.color}`}>
                    {tier.percentage}
                  </span>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Inactive section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-muted/30 rounded-full border border-border">
          <div className="w-3 h-3 rounded-full bg-zinc-500/50" />
          <span className="text-muted-foreground">
            <span className="font-mono font-bold text-foreground">643</span> referrers with 0 conversions
            <span className="text-muted-foreground/70 ml-2">(65% of total)</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
};
