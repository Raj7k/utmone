import { motion } from "framer-motion";
import { AppleReveal } from "./AppleReveal";

interface FunnelStep {
  label: string;
  value: number;
  displayValue: string;
  subLabel?: string;
}

const funnelSteps: FunnelStep[] = [
  { 
    label: "Total Link Visits", 
    value: 24044,
    displayValue: "24,044", 
    subLabel: "100%"
  },
  { 
    label: "People Participated", 
    value: 982,
    displayValue: "982", 
    subLabel: "Signed up as referrers"
  },
  { 
    label: "Referrals Generated", 
    value: 6903,
    displayValue: "6,903", 
    subLabel: "28% conversion"
  },
  { 
    label: "After Fraud Check", 
    value: 6665,
    displayValue: "6,665", 
    subLabel: "96.6% integrity"
  },
];

export const FunnelVisualization = () => {
  // Calculate proportional widths based on the max value (24044)
  const maxValue = funnelSteps[0].value;
  
  return (
    <AppleReveal className="w-full">
      <div className="relative py-8 max-w-3xl mx-auto">
        {/* Funnel container - true funnel shape */}
        <div className="relative">
          {funnelSteps.map((step, index) => {
            // Calculate width as percentage of max, but ensure minimum visibility
            // Use a logarithmic scale to make the funnel look more dramatic
            const ratio = step.value / maxValue;
            const widthPercent = Math.max(30, ratio * 100);
            const isLast = index === funnelSteps.length - 1;
            
            // Color gradient from blue to green
            const colors = [
              "bg-blue-500/20 border-blue-500/30",
              "bg-purple-500/20 border-purple-500/30",
              "bg-amber-500/20 border-amber-500/30",
              "bg-emerald-500/20 border-emerald-500/30",
            ];
            
            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="flex justify-center"
              >
                {/* Funnel segment */}
                <div 
                  className={`
                    relative overflow-hidden
                    ${colors[index]}
                    border
                    ${index === 0 ? 'rounded-t-xl' : ''}
                    ${isLast ? 'rounded-b-xl' : ''}
                    transition-all duration-500
                  `}
                  style={{ 
                    width: `${widthPercent}%`,
                    clipPath: index === 0 
                      ? 'polygon(0 0, 100% 0, 98% 100%, 2% 100%)' 
                      : isLast 
                        ? 'polygon(2% 0, 98% 0, 100% 100%, 0 100%)'
                        : 'polygon(2% 0, 98% 0, 96% 100%, 4% 100%)'
                  }}
                >
                  {/* Content */}
                  <div className="relative z-10 py-5 px-6 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm text-foreground font-medium">
                        {step.label}
                      </span>
                      {step.subLabel && (
                        <span className="text-xs text-muted-foreground mt-0.5">
                          {step.subLabel}
                        </span>
                      )}
                    </div>
                    <motion.span 
                      className="text-2xl md:text-3xl font-bold text-foreground font-mono"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      {step.displayValue}
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Conversion arrows on the side */}
        <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-around pr-4 pointer-events-none hidden lg:flex">
          {[
            { from: "24K", to: "982", rate: "4.1%" },
            { from: "982", to: "6.9K", rate: "7x" },
            { from: "6.9K", to: "6.7K", rate: "96.6%" },
          ].map((conversion, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="text-xs text-muted-foreground text-right"
            >
              <span className="font-mono text-foreground">{conversion.rate}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </AppleReveal>
  );
};
