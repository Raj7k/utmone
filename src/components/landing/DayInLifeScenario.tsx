import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface TimelineStep {
  time: string;
  action: string;
  icon: LucideIcon;
}

interface DayInLifeScenarioProps {
  title: string;
  description: string;
  timeline: TimelineStep[];
  visualElement: React.ReactNode;
}

export const DayInLifeScenario = ({ title, description, timeline, visualElement }: DayInLifeScenarioProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-12 items-center">
      {/* Left: Timeline */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <div className="space-y-3">
          <h3 className="text-2xl md:text-3xl font-display font-bold text-label lowercase">
            {title}
          </h3>
          <p className="text-lg text-muted-foreground">
            {description}
          </p>
        </div>
        
        <div className="space-y-4">
          {timeline.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="flex items-start gap-4"
            >
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                {index < timeline.length - 1 && (
                  <div className="w-0.5 h-8 bg-primary/20 mt-2" />
                )}
              </div>
              <div className="pt-2">
                <div className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
                  {step.time}
                </div>
                <div className="text-sm text-foreground">
                  {step.action}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Right: Visual */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {visualElement}
      </motion.div>
    </div>
  );
};
