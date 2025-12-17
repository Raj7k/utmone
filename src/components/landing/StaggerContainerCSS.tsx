import { ReactNode, useEffect, useRef, useState } from "react";

interface StaggerContainerCSSProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

/**
 * CSS-only StaggerContainer using Intersection Observer
 * Replaces framer-motion StaggerContainer for better performance
 */
export const StaggerContainerCSS = ({ 
  children, 
  className = "",
  staggerDelay = 0.1 
}: StaggerContainerCSSProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "-100px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {Array.isArray(children)
        ? children.map((child, index) => (
            <div
              key={index}
              className={isVisible ? "animate-fade-slide-up" : "opacity-0"}
              style={{ 
                animationDelay: isVisible ? `${index * staggerDelay}s` : "0s",
                animationFillMode: "forwards"
              }}
            >
              {child}
            </div>
          ))
        : (
            <div className={isVisible ? "animate-fade-slide-up" : "opacity-0"}>
              {children}
            </div>
          )
      }
    </div>
  );
};

interface StaggerItemCSSProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const StaggerItemCSS = ({ children, className = "", delay = 0 }: StaggerItemCSSProps) => {
  return (
    <div
      className={`animate-fade-slide-up ${className}`}
      style={{ 
        animationDelay: `${delay}s`,
        animationFillMode: "forwards"
      }}
    >
      {children}
    </div>
  );
};
