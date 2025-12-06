import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoadmapPhase {
  phase: string;
  duration: string;
  title: string;
  tasks: string[];
}

interface ImplementationRoadmapProps {
  phases: RoadmapPhase[];
  className?: string;
}

export const ImplementationRoadmap = ({ phases, className }: ImplementationRoadmapProps) => {
  return (
    <div className={cn("space-y-6", className)}>
      <h3 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-8">
        implementation roadmap
      </h3>
      
      <div className="space-y-6">
        {phases.map((phase, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative"
          >
            {/* Connector Line */}
            {index < phases.length - 1 && (
              <div className="absolute left-4 top-12 bottom-0 w-px bg-border/50 -translate-x-1/2" />
            )}
            
            <div className="flex gap-6">
              {/* Phase Marker */}
              <div className="flex-shrink-0 relative z-10">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm text-white bg-primary">
                  {index + 1}
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 pb-8">
                <div className="flex items-baseline gap-3 mb-2">
                  <h4 className="text-lg font-semibold text-foreground">
                    {phase.phase}
                  </h4>
                  <span className="text-sm text-muted-foreground">
                    {phase.duration}
                  </span>
                </div>
                
                <p className="text-base text-foreground mb-4">
                  {phase.title}
                </p>
                
                <ul className="space-y-2">
                  {phase.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
