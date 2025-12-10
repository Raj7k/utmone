import { motion } from "framer-motion";
import { Link as LinkIcon, Sparkles, QrCode, BarChart3, CheckCircle } from "lucide-react";

interface FlowStep {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const flowSteps: FlowStep[] = [
  { icon: LinkIcon, label: "clean links" },
  { icon: Sparkles, label: "clean UTMs" },
  { icon: QrCode, label: "clean QR" },
  { icon: BarChart3, label: "clean analytics" },
  { icon: CheckCircle, label: "clean decisions" },
];

export const AnimatedFlowDiagram = () => {
  return (
    <div className="relative py-12">
      {/* Container for horizontal flow */}
      <div className="flex items-center justify-between gap-4 md:gap-8 max-w-5xl mx-auto">
        {flowSteps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === flowSteps.length - 1;

          return (
            <div key={index} className="flex items-center gap-4 md:gap-8">
              {/* Step Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="flex flex-col items-center gap-3"
              >
                {/* Icon Circle */}
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 0 0 hsl(var(--primary) / 0.4)",
                      "0 0 0 12px hsl(var(--primary) / 0)",
                      "0 0 0 0 hsl(var(--primary) / 0)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3,
                  }}
                  className="relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-primary/60"
                >
                  <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </motion.div>

                {/* Label */}
                <span className="text-sm md:text-base font-medium text-foreground text-center whitespace-nowrap">
                  {step.label}
                </span>
              </motion.div>

              {/* Connecting Arrow (skip for last item) */}
              {!isLast && (
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileInView={{ scaleX: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.3, duration: 0.5 }}
                  className="hidden sm:flex items-center"
                  style={{ originX: 0 }}
                >
                  <div className="relative w-12 md:w-20 h-[2px]">
                    {/* Base line */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-primary/20" />
                    
                    {/* Animated particle */}
                    <motion.div
                      animate={{
                        x: [0, 48, 80],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.3,
                        ease: "easeInOut",
                      }}
                      className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary"
                    />
                    
                    {/* Arrow head */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1">
                      <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-primary/40" />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
