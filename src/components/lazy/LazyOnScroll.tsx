import { lazy, Suspense, ReactNode, ComponentType, useState, useEffect, useRef } from "react";

interface LazyOnScrollProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  height?: string;
  className?: string;
}

/**
 * Wrapper that only renders children when scrolled into view
 * Uses IntersectionObserver for efficient scroll detection
 */
export function LazyOnScroll({ 
  children, 
  fallback,
  rootMargin = "200px",
  threshold = 0.1,
  height = "200px",
  className = ""
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

  // Default fallback with spinner
  const defaultFallback = (
    <div 
      className={`flex items-center justify-center ${className}`}
      style={{ minHeight: height }}
    >
      <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
    </div>
  );

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : (fallback ?? defaultFallback)}
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

// Dropdown-specific shimmer - matches mega dropdown layout for better perceived performance
export function DropdownShimmer() {
  return (
    <div className="w-[800px] p-4 rounded-[20px] bg-zinc-950/95 backdrop-blur-xl border border-white/[0.1]">
      <div className="flex gap-4">
        {/* Left column - 3 showcase cards */}
        <div className="w-[200px] flex flex-col gap-3">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i} 
              className="h-[140px] bg-white/[0.03] rounded-2xl border border-white/[0.08] animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
        {/* Right column - grid area */}
        <div className="flex-1">
          <div className="h-full bg-white/[0.02] rounded-2xl border border-white/[0.06] animate-pulse" style={{ animationDelay: '200ms' }} />
        </div>
      </div>
      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-white/[0.05]">
        <div className="h-3 w-48 bg-white/[0.05] rounded animate-pulse" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}
