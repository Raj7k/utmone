import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "subtle";
  children: React.ReactNode;
}

/**
 * GlassCard - Theme-aware glassmorphism card component
 * Uses semantic tokens for consistent appearance in light/dark modes
 */
const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variants = {
      default: "bg-card/40 backdrop-blur-xl border border-border",
      elevated: "bg-card/60 backdrop-blur-2xl border border-border shadow-lg",
      subtle: "bg-card/20 backdrop-blur-md border border-border/50",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl overflow-hidden",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };
