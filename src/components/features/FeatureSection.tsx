import { ReactNode } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface FeatureSectionProps {
  children: ReactNode;
  className?: string;
  background?: "white" | "muted";
  maxWidth?: "narrow" | "medium" | "wide";
}

export const FeatureSection = ({
  children,
  className,
  background = "white",
  maxWidth = "medium",
}: FeatureSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const maxWidthClasses = {
    narrow: "max-w-4xl",
    medium: "max-w-6xl",
    wide: "max-w-7xl",
  };

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "py-12 md:py-24 lg:py-32",
        background === "muted" ? "bg-muted/20" : "bg-background",
        className
      )}
    >
      <div className={cn("container px-4 sm:px-6 md:px-8 mx-auto", maxWidthClasses[maxWidth])}>
        {children}
      </div>
    </motion.section>
  );
};
