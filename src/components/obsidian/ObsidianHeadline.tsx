import * as React from "react";
import { cn } from "@/lib/utils";

interface ObsidianHeadlineProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4";
  variant?: "platinum" | "white" | "muted";
  size?: "hero" | "lg" | "md" | "sm";
  children: React.ReactNode;
}

/**
 * ObsidianHeadline - Typography component for the Obsidian Design System
 * 
 * Features:
 * - Platinum gradient effect (brushed metal look)
 * - Playfair Display serif font for headlines
 * - Subtle text shadow for depth
 * - Responsive sizing
 */
const ObsidianHeadline = React.forwardRef<HTMLHeadingElement, ObsidianHeadlineProps>(
  ({ 
    className, 
    as: Component = "h1",
    variant = "platinum",
    size = "lg",
    children, 
    ...props 
  }, ref) => {
    const sizeStyles = {
      hero: "text-5xl sm:text-6xl md:text-7xl lg:text-8xl",
      lg: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
      md: "text-3xl sm:text-4xl md:text-5xl",
      sm: "text-2xl sm:text-3xl md:text-4xl",
    };

    const variantStyles = {
      platinum: "obsidian-platinum-text",
      white: "text-white",
      muted: "text-obsidian-text-muted",
    };

    return (
      <Component
        ref={ref}
        className={cn(
          "font-serif tracking-tight font-medium",
          sizeStyles[size],
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

ObsidianHeadline.displayName = "ObsidianHeadline";

// Subheadline component for muted silver text
interface ObsidianSubheadlineProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: "lg" | "md" | "sm";
  children: React.ReactNode;
}

const ObsidianSubheadline = React.forwardRef<HTMLParagraphElement, ObsidianSubheadlineProps>(
  ({ className, size = "md", children, ...props }, ref) => {
    const sizeStyles = {
      lg: "text-xl md:text-2xl",
      md: "text-lg md:text-xl",
      sm: "text-base md:text-lg",
    };

    return (
      <p
        ref={ref}
        className={cn(
          "text-obsidian-text-muted font-sans",
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </p>
    );
  }
);

ObsidianSubheadline.displayName = "ObsidianSubheadline";

export { ObsidianHeadline, ObsidianSubheadline };
