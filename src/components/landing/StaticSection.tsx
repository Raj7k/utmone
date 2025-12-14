import { ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface StaticSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "fade";
  style?: React.CSSProperties;
}

/**
 * CSS-only animated section replacement for framer-motion AnimatedSection.
 * Uses Intersection Observer for scroll-triggered animations.
 * No framer-motion dependency - better for LCP.
 */
export const StaticSection = ({ 
  children, 
  className = "", 
  delay = 0,
  direction = "up",
  style
}: StaticSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => setIsVisible(true), delay * 1000);
          } else {
            setIsVisible(true);
          }
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "-50px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const directionClasses = {
    up: "translate-y-10",
    down: "-translate-y-10",
    left: "translate-x-10",
    right: "-translate-x-10",
    fade: ""
  };

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        isVisible 
          ? "opacity-100 translate-x-0 translate-y-0" 
          : `opacity-0 ${directionClasses[direction]}`,
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
};

// Alias for backward compatibility
export const AnimatedSection = StaticSection;
