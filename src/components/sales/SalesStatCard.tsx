import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SalesStatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  variant?: "default" | "hot" | "primary" | "amber";
  pulse?: boolean;
}

export const SalesStatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  variant = "default",
  pulse = false 
}: SalesStatCardProps) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const controls = animate(count, value, { 
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1]
    });
    return controls.stop;
  }, [value, count]);

  const variantStyles = {
    default: {
      bg: "bg-muted/50",
      icon: "text-muted-foreground",
    },
    hot: {
      bg: "bg-emerald-500/10",
      icon: "text-emerald-500",
    },
    primary: {
      bg: "bg-primary/10",
      icon: "text-primary",
    },
    amber: {
      bg: "bg-amber-500/10",
      icon: "text-amber-500",
    },
  };

  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg hover:shadow-primary/5 transition-shadow duration-300"
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "p-3 rounded-xl transition-all duration-300",
          styles.bg,
          pulse && "animate-pulse"
        )}>
          <Icon className={cn("h-5 w-5", styles.icon)} />
        </div>
        <div>
          <motion.p className="text-3xl font-bold text-foreground tabular-nums">
            {rounded}
          </motion.p>
          <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
        </div>
      </div>
    </motion.div>
  );
};
