import * as React from "react";
import { cn } from "@/lib/utils";

interface ObsidianSectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "default" | "elevated" | "surface";
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  children: React.ReactNode;
}

/**
 * ObsidianSection - Standard section wrapper for the Obsidian Design System
 * 
 * Enforces:
 * - Consistent background treatments
 * - Proper padding and spacing
 * - Max-width constraints
 * - Noise texture on dark backgrounds
 */
const ObsidianSection = React.forwardRef<HTMLElement, ObsidianSectionProps>(
  ({ 
    className, 
    variant = "default", 
    spacing = "lg",
    maxWidth = "lg",
    children, 
    ...props 
  }, ref) => {
    const variantStyles = {
      default: "bg-obsidian-bg",
      elevated: "bg-obsidian-elevated backdrop-blur-xl",
      surface: "bg-obsidian-surface",
    };

    const spacingStyles = {
      none: "",
      sm: "py-12 md:py-16",
      md: "py-16 md:py-24",
      lg: "py-24 md:py-32",
      xl: "py-32 md:py-48",
    };

    const maxWidthStyles = {
      sm: "max-w-3xl",
      md: "max-w-5xl",
      lg: "max-w-[1400px]",
      xl: "max-w-[1600px]",
      full: "max-w-full",
    };

    return (
      <section
        ref={ref}
        className={cn(
          "relative w-full",
          variantStyles[variant],
          spacingStyles[spacing],
          className
        )}
        {...props}
      >
        {/* Noise texture overlay for physical depth */}
        {variant === "default" && (
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
        )}
        
        {/* Content container with max-width */}
        <div className={cn(
          "relative z-10 mx-auto px-6",
          maxWidthStyles[maxWidth]
        )}>
          {children}
        </div>
      </section>
    );
  }
);

ObsidianSection.displayName = "ObsidianSection";

export { ObsidianSection };
