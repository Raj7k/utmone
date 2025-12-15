import { ReactNode, useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface FeatureSectionProps {
  children: ReactNode;
  className?: string;
  background?: "default" | "muted" | "elevated";
  maxWidth?: "narrow" | "medium" | "wide";
}

export const StaticFeatureSection = ({
  children,
  className,
  background = "default",
  maxWidth = "medium",
}: FeatureSectionProps) => {
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "-100px" }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const maxWidthClasses = {
    narrow: "max-w-4xl",
    medium: "max-w-6xl",
    wide: "max-w-7xl",
  };

  const backgroundClasses = {
    default: "bg-transparent",
    muted: "bg-white/[0.02]",
    elevated: "bg-zinc-900/40",
  };

  return (
    <section
      ref={ref}
      className={cn(
        "py-12 md:py-24 lg:py-32 transition-all duration-800 ease-out",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
        backgroundClasses[background],
        className
      )}
    >
      <div className={cn("container px-4 sm:px-6 md:px-8 mx-auto", maxWidthClasses[maxWidth])}>
        {children}
      </div>
    </section>
  );
};

// Re-export with original name for drop-in replacement
export { StaticFeatureSection as FeatureSection };
