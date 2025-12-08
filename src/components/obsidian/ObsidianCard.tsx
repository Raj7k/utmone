import * as React from "react";
import { cn } from "@/lib/utils";

interface ObsidianCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "glass" | "solid" | "outline";
  hover?: boolean;
  glow?: boolean;
  children: React.ReactNode;
}

/**
 * ObsidianCard - Glass morphism card component
 * 
 * Features:
 * - Theme-aware: works in both light and dark modes
 * - Backdrop blur glass effect
 * - Chamfered top border (light catch)
 * - Squircle border radius (32px)
 * - Optional hover effects and glow
 */
const ObsidianCard = React.forwardRef<HTMLDivElement, ObsidianCardProps>(
  ({ 
    className, 
    variant = "glass",
    hover = false,
    glow = false,
    children, 
    ...props 
  }, ref) => {
    const variantStyles = {
      glass: [
        // Light mode: light gray glass, Dark mode: dark glass
        "bg-muted/40 dark:bg-zinc-900/40",
        "backdrop-blur-xl",
        "border border-border dark:border-white/[0.08]",
        "shadow-lg dark:shadow-[inset_0_1px_0_0_hsl(0_0%_100%_/_0.1)]",
      ].join(" "),
      solid: [
        "bg-card dark:bg-obsidian-surface",
        "border border-border dark:border-white/[0.08]",
      ].join(" "),
      outline: [
        "bg-transparent",
        "border border-border dark:border-white/[0.15]",
      ].join(" "),
    };

    const hoverStyles = hover ? [
      "transition-all duration-300 ease-out",
      "hover:scale-[1.02]",
      "hover:shadow-xl dark:hover:shadow-[0_25px_50px_-12px_hsl(0_0%_0%_/_0.5),inset_0_1px_0_0_hsl(0_0%_100%_/_0.15)]",
      "hover:border-border/80 dark:hover:border-white/[0.15]",
    ].join(" ") : "";

    const glowStyles = glow ? [
      "shadow-[0_0_30px_-10px_hsl(var(--primary)/0.2)] dark:shadow-[0_0_30px_-10px_hsl(0_0%_100%_/_0.2)]",
    ].join(" ") : "";

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-[32px] overflow-hidden",
          variantStyles[variant],
          hoverStyles,
          glowStyles,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ObsidianCard.displayName = "ObsidianCard";

// Card content wrapper with consistent padding
interface ObsidianCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
  children: React.ReactNode;
}

const ObsidianCardContent = React.forwardRef<HTMLDivElement, ObsidianCardContentProps>(
  ({ className, padding = "md", children, ...props }, ref) => {
    const paddingStyles = {
      none: "",
      sm: "p-4",
      md: "p-6 md:p-8",
      lg: "p-8 md:p-12",
    };

    return (
      <div
        ref={ref}
        className={cn(paddingStyles[padding], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ObsidianCardContent.displayName = "ObsidianCardContent";

export { ObsidianCard, ObsidianCardContent };
