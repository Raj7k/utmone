import { lazy, Suspense, ReactNode, ComponentType, useState, useEffect, useRef } from "react";

interface LazyOnScrollProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
}

/**
 * Wrapper that only renders children when scrolled into view
 * Uses IntersectionObserver for efficient scroll detection
 */
export function LazyOnScroll({ 
  children, 
  fallback = null,
  rootMargin = "200px",
  threshold = 0.1
}: LazyOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
      { rootMargin, threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return (
    <div ref={ref}>
      {isVisible ? children : fallback}
    </div>
  );
}

// Simple shimmer placeholder for lazy content
export function LazyShimmer({ height = "200px", className = "" }: { height?: string; className?: string }) {
  return (
    <div 
      className={`animate-pulse bg-white/5 rounded-xl ${className}`}
      style={{ height }}
    />
  );
}

// Dropdown-specific shimmer
export function DropdownShimmer() {
  return (
    <div className="w-[600px] p-4 rounded-xl bg-zinc-900/90 backdrop-blur-xl border border-white/10">
      <div className="space-y-3">
        <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
