import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const AnimatedCounter = ({ 
  target, 
  duration = 2, 
  prefix = "", 
  suffix = "",
  className = ""
}: AnimatedCounterProps) => {
  const [count, setCount] = useState(target);
  
  useEffect(() => {
    // Simulate occasional tick-down for urgency
    const interval = setInterval(() => {
      setCount(prev => {
        // Random chance to decrease
        if (Math.random() > 0.7 && prev > 10) {
          return prev - 1;
        }
        return prev;
      });
    }, 15000); // Every 15 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.span
      key={count}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {prefix}{count}{suffix}
    </motion.span>
  );
};

// Pulsing indicator dot
export const PulsingDot = ({ color = "bg-orange-500" }: { color?: string }) => (
  <span className="relative flex h-2 w-2">
    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`} />
    <span className={`relative inline-flex rounded-full h-2 w-2 ${color}`} />
  </span>
);

// Founding spots with urgency animation
export const FoundingSpotsCounter = ({ spots = 47 }: { spots?: number }) => {
  const [currentSpots, setCurrentSpots] = useState(spots);
  
  useEffect(() => {
    // Occasionally decrease to create urgency
    const interval = setInterval(() => {
      setCurrentSpots(prev => {
        if (Math.random() > 0.8 && prev > 5) {
          return prev - 1;
        }
        return prev;
      });
    }, 20000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm text-white/40">
      <PulsingDot color="bg-orange-500" />
      <motion.span
        key={currentSpots}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {currentSpots} founding spots left
      </motion.span>
    </div>
  );
};
