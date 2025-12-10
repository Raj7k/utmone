import * as React from "react";
import { cn } from "@/lib/utils";
import { preserveAcronyms } from "@/utils/textFormatter";

interface ObsidianTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "muted" | "dim" | "success" | "error" | "warning";
  as?: "span" | "p" | "div" | "label" | "h1" | "h2" | "h3" | "h4";
  children: React.ReactNode;
  preserveAcronyms?: boolean;
}

/**
 * ObsidianText - Semantic text component for the Obsidian Design System
 * 
 * Replaces inline style={{ color: 'rgba(255,255,255,X)' }} with semantic classes
 * Now supports automatic acronym preservation (AI, UTM, QR, API, etc.)
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

// Recursively process children to preserve acronyms
function processChildren(children: React.ReactNode): React.ReactNode {
  return React.Children.map(children, child => {
    if (typeof child === 'string') {
      return preserveAcronyms(child);
    }
    if (typeof child === 'number') {
      return child;
    }
    if (React.isValidElement(child) && child.props.children) {
      return React.cloneElement(child, {
        ...child.props,
        children: processChildren(child.props.children)
      });
    }
    return child;
  });
}

const ObsidianText = React.forwardRef<HTMLSpanElement, ObsidianTextProps>(
  ({ 
    className, 
    variant = "primary",
    as: Component = "span",
    children,
    preserveAcronyms: shouldPreserve = true,
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

    const processedChildren = shouldPreserve ? processChildren(children) : children;

    return (
      <Component
        ref={ref as any}
        className={cn(variantStyles[variant], className)}
        {...props}
      >
        {processedChildren}
      </Component>
    );
  }
);

ObsidianText.displayName = "ObsidianText";

export { ObsidianText };
