import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const utmBadgeVariants = cva(
  "inline-flex items-center border font-medium font-mono transition-apple",
  {
    variants: {
      type: {
        source: "bg-utm-source/10 text-utm-source border-utm-source/20",
        medium: "bg-utm-medium/10 text-utm-medium border-utm-medium/20",
        campaign: "bg-utm-campaign/10 text-utm-campaign border-utm-campaign/20",
        term: "bg-utm-term/10 text-utm-term border-utm-term/20",
        content: "bg-utm-content/10 text-utm-content border-utm-content/20",
      },
      size: {
        sm: "px-1.5 py-0.5 text-[11px] rounded-md",
        md: "px-2 py-1 text-footnote rounded-md",
        lg: "px-2.5 py-1.5 text-sm rounded-lg",
      }
    },
    defaultVariants: {
      type: "source",
      size: "md",
    }
  }
);

export interface UTMBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof utmBadgeVariants> {
  value: string;
  label?: string;
}

export const UTMBadge = React.forwardRef<HTMLSpanElement, UTMBadgeProps>(
  ({ className, type, size, value, label, ...props }, ref) => {
    return (
      <span 
        ref={ref}
        className={cn(utmBadgeVariants({ type, size, className }))}
        {...props}
      >
        {label && <span className="opacity-60 mr-1">{label}:</span>}
        {value}
      </span>
    );
  }
);
UTMBadge.displayName = "UTMBadge";
