import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { LucideIcon } from "lucide-react";

interface AnimatedStatCardProps {
  value: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  color?: string;
  delay?: number;
}

export const AnimatedStatCard = ({
  value,
  label,
  description,
  icon: Icon,
  color = "text-primary",
  delay = 0,
}: AnimatedStatCardProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="p-6 md:p-8 bg-card rounded-2xl border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg group"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      {Icon && (
        <div className={`w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
      
      <div className="mb-2">
        <span className="text-4xl md:text-5xl font-bold text-foreground tabular-nums">
          {value}
        </span>
      </div>

      <p className="text-sm font-medium text-foreground mb-1 lowercase">{label}</p>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </motion.div>
  );
};
