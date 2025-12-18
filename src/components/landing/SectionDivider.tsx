import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SectionDividerProps {
  variant?: "gradient" | "subtle" | "dots";
}

export const SectionDivider = ({ variant = "gradient" }: SectionDividerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  if (variant === "dots") {
    return (
      <div ref={ref} className="flex items-center justify-center gap-2 py-8">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "w-1.5 h-1.5 rounded-full bg-white/30 transition-all duration-300",
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
            )}
            style={{ transitionDelay: isVisible ? `${i * 100}ms` : '0ms' }}
          />
        ))}
      </div>
    );
  }

  if (variant === "subtle") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="h-px bg-white/8" />
      </div>
    );
  }

  return (
    <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4">
      <div
        className={cn(
          "h-px bg-gradient-to-r from-transparent via-white/30 to-transparent origin-left transition-transform duration-800",
          isVisible ? "scale-x-100" : "scale-x-0"
        )}
      />
    </div>
  );
};
