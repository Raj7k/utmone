import { useState, useEffect, useRef, ReactNode } from "react";

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  className?: string;
}

/**
 * LazySection - Only renders children when scrolled into view
 * Uses IntersectionObserver for efficient below-fold loading
 */
export const LazySection = ({ 
  children, 
  fallback = null, 
  rootMargin = "100px",
  className = ""
}: LazySectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only need to load once
        }
      },
      { rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : fallback}
    </div>
  );
};

export default LazySection;
