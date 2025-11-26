import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FlowStepCardProps {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
  delay?: number;
}

export const FlowStepCard = ({ number, title, description, icon: Icon, delay = 0 }: FlowStepCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative group"
    >
      {/* Card Container */}
      <div className="relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
        {/* Number Watermark */}
        <div className="absolute top-4 right-4 text-8xl font-display font-extrabold text-white/5 leading-none pointer-events-none select-none">
          {number}
        </div>

        {/* Icon */}
        <div className="relative z-10 w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-deepSea/20 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-white" strokeWidth={2} />
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-2">
          <h3 className="text-xl font-display font-semibold text-white">
            {title}
          </h3>
          <p className="text-sm text-white/70 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
