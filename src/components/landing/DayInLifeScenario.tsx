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
          <h3 
            className="text-2xl md:text-3xl font-display font-bold lowercase"
            style={{ color: 'rgba(255,255,255,0.9)' }}
          >
            {title}
          </h3>
          <p className="text-lg" style={{ color: 'rgba(255,255,255,0.5)' }}>
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
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(59,130,246,0.15)' }}
                >
                  <step.icon className="w-5 h-5" style={{ color: '#3B82F6' }} />
                </div>
                {index < timeline.length - 1 && (
                  <div className="w-0.5 h-8 mt-2" style={{ background: 'rgba(59,130,246,0.2)' }} />
                )}
              </div>
              <div className="pt-2">
                <div 
                  className="text-xs font-semibold uppercase tracking-wide mb-1"
                  style={{ color: '#3B82F6' }}
                >
                  {step.time}
                </div>
                <div className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
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