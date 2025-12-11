import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";

interface AnimatedStatCardProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  color?: string;
  delay?: number;
}

export const AnimatedStatCard = ({
  value,
  suffix = "",
  prefix = "",
  label,
  description,
  icon: Icon,
  color = "text-primary",
  delay = 0,
}: AnimatedStatCardProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [hasAnimated, setHasAnimated] = useState(false);

  const springValue = useSpring(0, {
    duration: 2000,
    bounce: 0,
  });

  const displayValue = useTransform(springValue, (latest): string => {
    if (value >= 1000) {
      return `${(latest / 1000).toFixed(1)}k`;
    }
    if (value % 1 !== 0) {
      return latest.toFixed(1);
    }
    return Math.floor(latest).toString();
  });

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setTimeout(() => {
        springValue.set(value);
        setHasAnimated(true);
      }, delay * 1000);
    }
  }, [isInView, value, springValue, hasAnimated, delay]);

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
      
      <div className="flex items-baseline gap-1 mb-2">
        {prefix && <span className="text-2xl font-bold text-foreground">{prefix}</span>}
        <motion.span className="text-4xl md:text-5xl font-bold text-foreground tabular-nums">
          {displayValue}
        </motion.span>
        {suffix && <span className="text-2xl font-bold text-foreground">{suffix}</span>}
      </div>

      <p className="text-sm font-medium text-foreground mb-1 lowercase">{label}</p>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </motion.div>
  );
};

interface AnimatedStatsGridProps {
  title?: string;
  subtitle?: string;
  stats: Array<{
    value: number;
    suffix?: string;
    prefix?: string;
    label: string;
    description?: string;
    icon?: LucideIcon;
  }>;
}

export const AnimatedStatsGrid = ({ title, subtitle, stats }: AnimatedStatsGridProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 bg-muted/30">
      <div className="max-w-[980px] mx-auto px-6 md:px-8">
        {(title || subtitle) && (
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            {title && (
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </motion.div>
        )}

        <div className={`grid gap-6 ${stats.length === 3 ? 'md:grid-cols-3' : stats.length === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2'}`}>
          {stats.map((stat, index) => (
            <AnimatedStatCard
              key={index}
              {...stat}
              delay={index * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
