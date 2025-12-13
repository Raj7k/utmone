import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Circle } from "lucide-react";
import { AppleReveal } from "./AppleReveal";

interface Step {
  id: string;
  title: string;
  description: string;
}

interface Phase {
  id: string;
  title: string;
  icon: string;
  color: string;
  steps: Step[];
}

interface PhaseTimelineProps {
  phases: Phase[];
  title?: string;
}

export const PhaseTimeline = ({ phases, title }: PhaseTimelineProps) => {
  const [expandedPhase, setExpandedPhase] = useState<string | null>(phases[0]?.id || null);

  return (
    <AppleReveal>
      <div className="w-full">
        {title && (
          <h3 className="text-2xl font-display font-semibold text-foreground mb-6">
            {title}
          </h3>
        )}
        
        <div className="space-y-4">
          {phases.map((phase, phaseIndex) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: phaseIndex * 0.1 }}
              className="border border-border rounded-xl overflow-hidden bg-card"
            >
              {/* Phase header */}
              <button
                onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
                className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{phase.icon}</span>
                  <div className="text-left">
                    <div className="font-semibold text-foreground">{phase.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {phase.steps.length} steps
                    </div>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: expandedPhase === phase.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </motion.div>
              </button>

              {/* Expanded content */}
              <AnimatePresence>
                {expandedPhase === phase.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 md:px-6 pb-6 pt-2">
                      <div className="space-y-4 pl-4 border-l-2 border-border">
                        {phase.steps.map((step, stepIndex) => (
                          <motion.div
                            key={step.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: stepIndex * 0.05 }}
                            className="relative pl-6"
                          >
                            {/* Step indicator */}
                            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-card border-2 border-primary flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            </div>
                            
                            <div>
                              <div className="font-medium text-foreground text-sm">
                                {step.title}
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">
                                {step.description}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </AppleReveal>
  );
};
