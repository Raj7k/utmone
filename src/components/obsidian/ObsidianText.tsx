import * as React from "react";
import { cn } from "@/lib/utils";

interface ObsidianTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "muted" | "dim" | "success" | "error" | "warning";
  as?: "span" | "p" | "div" | "label";
  children: React.ReactNode;
}

/**
 * ObsidianText - Semantic text component for the Obsidian Design System
 * 
 * Replaces inline style={{ color: 'rgba(255,255,255,X)' }} with semantic classes
 * 
 * Variants:
 * - primary: 90% white (main text)
 * - secondary: 70% white (secondary info)
 * - muted: 50% white (hints, captions)
 * - dim: 40% white (disabled, very subtle)
 * - success: green text
 * - error: red text
 * - warning: yellow text
 */
const ObsidianText = React.forwardRef<HTMLSpanElement, ObsidianTextProps>(
  ({ 
    className, 
    variant = "primary",
    as: Component = "span",
    children, 
    ...props 
  }, ref) => {
    const variantStyles = {
      primary: "text-white-90",
      secondary: "text-white-70",
      muted: "text-white-50",
      dim: "text-white-40",
      success: "text-status-success",
      error: "text-status-error",
      warning: "text-status-warning",
    };

    return (
      <Component
        ref={ref as any}
        className={cn(variantStyles[variant], className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

ObsidianText.displayName = "ObsidianText";

export { ObsidianText };
