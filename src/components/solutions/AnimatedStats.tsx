import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

interface Stat {
  value: string;
  label: string;
}

interface AnimatedStatsProps {
  stats: Stat[];
}

const AnimatedNumber = ({ value }: { value: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // Extract number from string like "2,400+" or "1M+"
  const numericValue = parseInt(value.replace(/[^0-9]/g, "")) || 0;
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2000 });
  const displayValue = useSpring(0, { duration: 2000 });

  useEffect(() => {
    if (isInView) {
      motionValue.set(numericValue);
    }
  }, [isInView, numericValue, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      displayValue.set(latest);
    });
    return unsubscribe;
  }, [springValue, displayValue]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-display font-extrabold text-white">
      <motion.span>
        {isInView ? value : "0"}
      </motion.span>
    </div>
  );
};

export const AnimatedStats = ({ stats }: AnimatedStatsProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-12 md:gap-16 py-12">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="text-center space-y-2"
        >
          <AnimatedNumber value={stat.value} />
          <p className="text-base text-white/70 font-medium">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
};
