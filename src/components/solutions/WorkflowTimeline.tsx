import { motion } from "framer-motion";
import { LucideIcon, ArrowRight } from "lucide-react";

interface WorkflowStep {
  icon: LucideIcon;
  label: string;
}

interface WorkflowTimelineProps {
  steps: WorkflowStep[];
  description?: string;
}

export const WorkflowTimeline = ({ steps, description }: WorkflowTimelineProps) => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="relative flex items-center justify-between gap-4">
        {/* Connecting line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 rounded-full -translate-y-1/2" style={{ background: 'rgba(255,255,255,0.1)' }} />
        
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="relative flex-1 flex flex-col items-center gap-4 z-10"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blazeOrange/20 to-deepSea/20 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg">
              <step.icon className="w-10 h-10 text-white" strokeWidth={1.5} />
            </div>
            <p className="text-base font-medium text-white/90 text-center">{step.label}</p>
            
            {index < steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
                className="absolute top-10 -right-4 z-20"
              >
                <ArrowRight className="w-6 h-6 text-white/40" strokeWidth={2} />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
      
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: steps.length * 0.15 }}
          className="text-center text-lg text-white/70 mt-12 max-w-2xl mx-auto"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
};
