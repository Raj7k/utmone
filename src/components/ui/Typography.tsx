import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * Typography System - Single Source of Truth
 * 
 * Font Family Rules:
 * - Heading: font-display (Space Grotesk) for all headlines
 * - Text: font-sans (Inter) for body content
 * - Label: font-sans (Inter) for form labels
 * - Code: font-mono (JetBrains Mono) for URLs, code
 */

// Heading Component
const headingVariants = cva(
  "font-display tracking-tight font-semibold text-foreground",
  {
    variants: {
      size: {
        hero: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold",
        xl: "text-3xl sm:text-4xl md:text-5xl font-bold",
        lg: "text-2xl sm:text-3xl md:text-4xl",
        md: "text-xl sm:text-2xl md:text-3xl",
        sm: "text-lg sm:text-xl md:text-2xl",
        xs: "text-base sm:text-lg",
      },
      variant: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        gradient: "obsidian-platinum-text",
      },
    },
    defaultVariants: {
      size: "lg",
      variant: "default",
    },
  }
);

interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, size, variant, as: Component = "h2", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(headingVariants({ size, variant, className }))}
        {...props}
      />
    );
  }
);
Heading.displayName = "Heading";

// Text Component
const textVariants = cva("font-sans", {
  variants: {
    size: {
      xl: "text-xl md:text-2xl",
      lg: "text-lg md:text-xl",
      md: "text-base md:text-lg",
      sm: "text-sm md:text-base",
      xs: "text-xs md:text-sm",
    },
    variant: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      subtle: "text-muted-foreground/70",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "default",
    weight: "normal",
  },
});

interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  as?: "p" | "span" | "div";
}

const BodyText = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, size, variant, weight, as: Component = "p", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(textVariants({ size, variant, weight, className }))}
        {...props}
      />
    );
  }
);
BodyText.displayName = "BodyText";

// Label Component
const labelVariants = cva("font-sans font-medium", {
  variants: {
    size: {
      lg: "text-base",
      md: "text-sm",
      sm: "text-xs",
    },
    variant: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      error: "text-destructive",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "default",
  },
});

interface LabelTextProps
  extends React.HTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  htmlFor?: string;
}

const LabelText = React.forwardRef<HTMLLabelElement, LabelTextProps>(
  ({ className, size, variant, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(labelVariants({ size, variant, className }))}
        {...props}
      />
    );
  }
);
LabelText.displayName = "LabelText";

// Code Component
const codeVariants = cva("font-mono", {
  variants: {
    size: {
      lg: "text-base",
      md: "text-sm",
      sm: "text-xs",
    },
    variant: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      highlight: "bg-muted px-1.5 py-0.5 rounded text-foreground",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "default",
  },
});

interface CodeProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof codeVariants> {
  inline?: boolean;
}

const Code = React.forwardRef<HTMLElement, CodeProps>(
  ({ className, size, variant, inline = true, ...props }, ref) => {
    if (inline) {
      return (
        <code
          ref={ref as React.Ref<HTMLElement>}
          className={cn(codeVariants({ size, variant, className }))}
          {...props}
        />
      );
    }
    return (
      <pre
        className={cn(codeVariants({ size, variant, className }))}
        {...props}
      />
    );
  }
);
Code.displayName = "Code";

// Caption Component (for small descriptive text)
const Caption = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn("font-sans text-xs text-muted-foreground", className)}
      {...props}
    />
  );
});
Caption.displayName = "Caption";

export { Heading, BodyText, LabelText, Code, Caption, headingVariants, textVariants };
