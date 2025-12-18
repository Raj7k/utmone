import { useRef, useEffect, useState } from "react";
import { useIntersectionAnimation } from "@/components/landing/motion";

interface StatItem {
  value: string;
  label: string;
  suffix?: string;
}

interface FeatureStatsStripProps {
  stats: StatItem[];
}

const AnimatedNumber = ({ value }: { value: string }) => {
  const { ref, isVisible } = useIntersectionAnimation(0.5);
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (!isVisible) return;

    // Extract numeric part
    const numericMatch = value.match(/[\d.]+/);
    if (!numericMatch) {
      setDisplayValue(value);
      return;
    }

    const targetNum = parseFloat(numericMatch[0]);
    const prefix = value.substring(0, value.indexOf(numericMatch[0]));
    const suffix = value.substring(value.indexOf(numericMatch[0]) + numericMatch[0].length);

    const duration = 1500;
    const steps = 60;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = targetNum * eased;

      // Format based on original value
      let formatted: string;
      if (value.includes(".")) {
        formatted = current.toFixed(value.split(".")[1]?.replace(/[^\d]/g, "").length || 2);
      } else {
        formatted = Math.round(current).toString();
      }

      setDisplayValue(`${prefix}${formatted}${suffix}`);

      if (currentStep >= steps) {
        setDisplayValue(value);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return <span ref={ref as React.RefObject<HTMLSpanElement>}>{displayValue}</span>;
};

export const FeatureStatsStrip = ({ stats }: FeatureStatsStripProps) => {
  const { ref, isVisible } = useIntersectionAnimation(0.2);

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div
          ref={ref}
          className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-600 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          {stats.map((item, index) => (
            <div
              key={index}
              className={`p-6 text-center bg-card/30 backdrop-blur-xl rounded-2xl border border-border hover:border-primary/30 transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-5 scale-95"
              }`}
              style={{ 
                transitionDelay: `${index * 100}ms`,
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            >
              <div className="text-4xl md:text-5xl font-sans font-bold hero-gradient mb-2 tabular-nums">
                <AnimatedNumber value={item.value} />
              </div>
              <div className="text-sm uppercase text-muted-foreground tracking-wider">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
