import { motion } from "framer-motion";
import { AppleReveal } from "./AppleReveal";

interface FunnelStep {
  label: string;
  value: string;
  subLabel?: string;
  color: string;
}

const funnelSteps: FunnelStep[] = [
  { 
    label: "Total Link Visits", 
    value: "24,044", 
    subLabel: "100%",
    color: "from-blue-500/20 to-blue-600/30" 
  },
  { 
    label: "People Participated", 
    value: "982", 
    subLabel: "Signed up as referrers",
    color: "from-purple-500/20 to-purple-600/30" 
  },
  { 
    label: "Referrals Generated", 
    value: "6,903", 
    subLabel: "28% conversion",
    color: "from-amber-500/20 to-amber-600/30" 
  },
  { 
    label: "After Fraud Check", 
    value: "6,665", 
    subLabel: "96.6% integrity",
    color: "from-emerald-500/20 to-emerald-600/30" 
  },
];

export const FunnelVisualization = () => {
  return (
    <AppleReveal className="w-full">
      <div className="relative py-8">
        {/* Funnel container */}
        <div className="flex flex-col items-center gap-0">
          {funnelSteps.map((step, index) => {
            // Calculate width percentage - decreasing for funnel effect
            const widthPercent = 100 - (index * 18);
            const isLast = index === funnelSteps.length - 1;
            
            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.15,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="relative"
                style={{ width: `${widthPercent}%` }}
              >
                {/* Funnel segment */}
                <div 
                  className={`
                    relative overflow-hidden
                    bg-gradient-to-r ${step.color}
                    backdrop-blur-sm
                    border border-white/10
                    ${index === 0 ? 'rounded-t-2xl' : ''}
                    ${isLast ? 'rounded-b-2xl' : ''}
                  `}
                >
                  {/* Animated fill effect */}
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ 
                      delay: index * 0.15 + 0.3,
                      duration: 1,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"
                  />
                  
                  {/* Content */}
                  <div className="relative z-10 py-6 px-8 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground font-medium">
                        {step.label}
                      </span>
                      {step.subLabel && (
                        <span className="text-xs text-muted-foreground/70 mt-0.5">
                          {step.subLabel}
                        </span>
                      )}
                    </div>
                    <motion.span 
                      className="text-3xl md:text-4xl font-bold text-foreground font-mono"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.15 + 0.5 }}
                    >
                      {step.value}
                    </motion.span>
                  </div>
                </div>

                {/* Conversion arrow between steps */}
                {!isLast && (
                  <div className="flex justify-center -my-1 relative z-20">
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.15 + 0.4 }}
                      className="text-muted-foreground/50"
                    >
                      <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                        <path 
                          d="M12 0L24 8L12 16L12 10L0 10L0 6L12 6L12 0Z" 
                          fill="currentColor"
                          transform="rotate(90 12 8)"
                        />
                      </svg>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
        </div>
      </div>
    </AppleReveal>
  );
};
