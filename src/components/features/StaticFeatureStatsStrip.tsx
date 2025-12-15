import { useRef, useEffect, useState } from "react";

interface StatItem {
  value: string;
  label: string;
  suffix?: string;
}

interface FeatureStatsStripProps {
  stats: StatItem[];
}

const AnimatedNumber = ({ value }: { value: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState("0");
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!ref.current || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
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
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return <span ref={ref}>{displayValue}</span>;
};

export const StaticFeatureStatsStrip = ({ stats }: FeatureStatsStripProps) => {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, index) => (
            <div
              key={index}
              className="p-6 text-center bg-card/30 backdrop-blur-xl rounded-2xl border border-border hover:border-primary/30 transition-colors duration-300 opacity-0 translate-y-5 animate-slide-up-fade"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
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

// Re-export with original name for drop-in replacement
export { StaticFeatureStatsStrip as FeatureStatsStrip };
