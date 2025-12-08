import * as React from "react";
import { cn } from "@/lib/utils";

interface ObsidianBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "transparent" | "glass-40" | "glass-60" | "glass-80" | "solid" | "dark";
  border?: boolean;
  glow?: boolean;
  children: React.ReactNode;
}

/**
 * ObsidianBackground - Semantic background wrapper for the Obsidian Design System
 * 
 * Replaces inline style={{ background: '...' }} patterns
 */
const ObsidianBackground = React.forwardRef<HTMLDivElement, ObsidianBackgroundProps>(
  ({ 
    className, 
    variant = "glass-40",
    border = true,
    glow = false,
    children, 
    ...props 
  }, ref) => {
    const variantStyles = {
      transparent: "bg-transparent",
      "glass-40": "obsidian-glass-40 backdrop-blur-xl",
      "glass-60": "obsidian-glass-60 backdrop-blur-xl",
      "glass-80": "obsidian-glass-80 backdrop-blur-xl",
      solid: "bg-background",
      dark: "bg-black/40",
    };

    const borderStyles = border ? "border border-white/10" : "";
    const glowStyles = glow ? "shadow-[0_0_30px_-10px_hsl(0_0%_100%_/_0.2)]" : "";

    return (
      <div
        ref={ref}
        className={cn(
          variantStyles[variant],
          borderStyles,
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

ObsidianBackground.displayName = "ObsidianBackground";

export { ObsidianBackground };
