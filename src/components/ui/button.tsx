import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-apple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md h-12",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 h-12",
        outline: "border border-border bg-card text-foreground hover:bg-muted h-12",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-hover h-12",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-foreground underline-offset-4 hover:underline",
        gradient: "bg-gradient-nature-3 text-white hover:bg-gradient-nature-2 transition-all duration-300 h-12",
        "glow-pink": "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[0_0_20px_hsl(var(--destructive)/0.4)] hover:shadow-[0_0_30px_hsl(var(--destructive)/0.6)] transition-all duration-300 h-12",
        // Apple HIG System Variants - using semantic colors instead of system-blue
        system: "bg-primary text-primary-foreground hover:opacity-80 active:opacity-60 h-[44px]",
        "system-secondary": "bg-fill-secondary text-foreground border border-border hover:bg-fill-primary h-[44px]",
        "system-tertiary": "bg-transparent text-primary hover:bg-fill-tertiary h-[44px]",
        "system-destructive": "bg-destructive text-destructive-foreground hover:opacity-80 active:opacity-60 h-[44px]",
        marketing: "bg-primary text-primary-foreground hover:opacity-90 shadow-sm hover:shadow-md h-[44px]",
        "marketing-glow": "bg-primary text-primary-foreground font-semibold shadow-[0_0_20px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.6)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 h-[52px]",
        // Halo Button - theme-aware with glow
        halo: "bg-primary text-primary-foreground font-semibold shadow-[0_0_20px_-5px_hsl(var(--primary)/0.5)] hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 h-12 rounded-full",
        // Glass Button - theme-aware
        "glass": "bg-muted/40 backdrop-blur-xl border border-border text-foreground hover:bg-muted/60 hover:border-border/80 transition-all duration-300 h-12",
        // Glass Ghost Button - theme-aware
        "glass-ghost": "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all duration-300 h-12",
      },
      size: {
        default: "px-4 py-2 min-h-[44px]",
        sm: "h-[44px] px-4",
        lg: "h-[52px] px-8",
        icon: "h-[44px] w-[44px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp 
        className={cn(buttonVariants({ variant, size, className }))} 
        ref={ref} 
        {...props}
        // Add default ARIA attributes if not provided
        aria-disabled={props.disabled}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
