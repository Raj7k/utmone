import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent text-white",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent text-white",
        outline: "text-foreground",
        // Obsidian variants
        glass: "border-white/10 bg-zinc-900/40 backdrop-blur-xl text-white/90",
        platinum: "border-white/20 bg-white/10 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, style, ...props }: BadgeProps) {
  const defaultStyle = variant === "default" 
    ? { background: 'rgba(59,130,246,1)', ...style }
    : variant === "destructive"
    ? { background: 'rgba(239,68,68,0.9)', ...style }
    : style;
    
  return <div className={cn(badgeVariants({ variant }), className)} style={defaultStyle} {...props} />;
}

export { Badge, badgeVariants };
