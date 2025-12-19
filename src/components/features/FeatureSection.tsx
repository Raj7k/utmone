import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useIntersectionAnimation } from "@/components/landing/motion";

interface FeatureSectionProps {
  children: ReactNode;
  className?: string;
  background?: "default" | "muted" | "elevated";
  maxWidth?: "narrow" | "medium" | "wide";
}

export const FeatureSection = ({
  children,
  className,
  background = "default",
  maxWidth = "medium",
}: FeatureSectionProps) => {
  const { ref, isVisible } = useIntersectionAnimation(0.1);

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
        "py-12 md:py-24 lg:py-32 transition-all duration-700 ease-out",
        backgroundClasses[background],
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
        className
      )}
    >
      <div className={cn("container px-4 sm:px-6 md:px-8 mx-auto", maxWidthClasses[maxWidth])}>
        {children}
      </div>
    </section>
  );
};
