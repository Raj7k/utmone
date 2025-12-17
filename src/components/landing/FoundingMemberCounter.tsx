import { useEffect, useState, useRef } from "react";

interface FoundingMemberCounterProps {
  total?: number;
  remaining?: number;
}

export const FoundingMemberCounter = ({ 
  total = 100, 
  remaining = 47 
}: FoundingMemberCounterProps) => {
  const taken = total - remaining;
  const percentageTaken = (taken / total) * 100;
  const isUrgent = remaining < 50;
  
  const [displayCount, setDisplayCount] = useState(remaining + 10);
  const [progressWidth, setProgressWidth] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Intersection Observer for visibility
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Animate number countdown
  useEffect(() => {
    if (!isVisible) return;
    
    const startValue = remaining + 10;
    const duration = 1500;
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(startValue - (startValue - remaining) * easeOut);
      
      setDisplayCount(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(animate);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [isVisible, remaining]);

  // Animate progress bar
  useEffect(() => {
    if (!isVisible) return;
    
    const timeoutId = setTimeout(() => {
      setProgressWidth(percentageTaken);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [isVisible, percentageTaken]);

  return (
    <div 
      ref={ref}
      className={`relative transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2.5'}`}
      style={{ transitionDelay: '300ms' }}
    >
      {/* Glass container */}
      <div className={`
        relative rounded-2xl p-5 
        bg-white/[0.03] border border-white/10
        ${isUrgent ? 'shadow-[0_0_30px_rgba(251,146,60,0.1)]' : ''}
      `}>
        {/* Urgency glow */}
        {isUrgent && (
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/10 via-transparent to-amber-500/10 animate-pulse"
          />
        )}

        <div className="relative z-10">
          {/* Label */}
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-3">
            founding member spots
          </p>

          {/* Big number display */}
          <div className="flex items-baseline gap-3 mb-4">
            <span 
              className="text-5xl md:text-6xl font-display font-bold text-white tabular-nums transition-transform duration-300"
              style={{ transform: isVisible ? 'scale(1)' : 'scale(1.1)' }}
            >
              {displayCount}
            </span>
            <span className="text-lg text-white/40">
              of {total} left
            </span>
          </div>

          {/* Animated progress bar */}
          <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`
                h-full rounded-full transition-all duration-1000 ease-out
                ${isUrgent 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500' 
                  : 'bg-gradient-to-r from-white/60 to-white/40'
                }
              `}
              style={{ 
                width: `${progressWidth}%`,
                transitionDelay: '500ms'
              }}
            />
            {/* Shimmer effect */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
            />
          </div>

          {/* Pulsing indicator */}
          <div className="flex items-center gap-2 mt-3">
            <div
              className={`w-2 h-2 rounded-full animate-pulse ${isUrgent ? 'bg-orange-500' : 'bg-green-500'}`}
            />
            <span className="text-xs text-white/50">
              {isUrgent ? 'filling up fast' : 'spots available'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
