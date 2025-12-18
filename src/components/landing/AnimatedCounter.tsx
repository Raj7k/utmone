import { useState, useEffect, useRef } from "react";

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
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    // Simulate occasional tick-down for urgency
    const interval = setInterval(() => {
      setCount(prev => {
        // Random chance to decrease
        if (Math.random() > 0.7 && prev > 10) {
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 300);
          return prev - 1;
        }
        return prev;
      });
    }, 15000); // Every 15 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={`inline-block transition-all duration-300 ${
        isAnimating ? 'opacity-0 -translate-y-2.5' : 'opacity-100 translate-y-0'
      } ${className}`}
    >
      {prefix}{count}{suffix}
    </span>
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
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    // Occasionally decrease to create urgency
    const interval = setInterval(() => {
      setCurrentSpots(prev => {
        if (Math.random() > 0.8 && prev > 5) {
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 300);
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
      <span
        className={`inline-block transition-all duration-300 ${
          isAnimating ? 'opacity-0 scale-80' : 'opacity-100 scale-100'
        }`}
      >
        {currentSpots} founding spots left
      </span>
    </div>
  );
};
