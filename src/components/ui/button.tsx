import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-apple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-white text-zinc-900 hover:bg-white/90 shadow-sm hover:shadow-md h-12",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 h-12",
        outline: "border border-border bg-card text-foreground hover:bg-muted h-12",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-hover h-12",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-white/90 underline-offset-4 hover:underline",
        gradient: "bg-gradient-nature-3 text-white hover:bg-gradient-nature-2 transition-all duration-300 h-12",
        "glow-pink": "bg-[#FF6B9D] text-white hover:bg-[#FF5A8C] shadow-[0_0_20px_rgba(255,107,157,0.4)] hover:shadow-[0_0_30px_rgba(255,107,157,0.6)] transition-all duration-300 h-12",
        // Apple HIG System Variants
        system: "bg-system-blue text-white hover:opacity-80 active:opacity-60 h-[44px]",
        "system-secondary": "bg-fill-secondary text-label border border-separator hover:bg-fill-primary h-[44px]",
        "system-tertiary": "bg-transparent text-system-blue hover:bg-fill-tertiary h-[44px]",
        "system-destructive": "bg-system-red text-white hover:opacity-80 active:opacity-60 h-[44px]",
        marketing: "bg-blazeOrange text-white hover:opacity-90 shadow-sm hover:shadow-md h-[44px]",
        "marketing-glow": "bg-gradient-to-r from-blazeOrange to-[#FF6B35] text-white font-semibold shadow-[0_0_20px_rgba(255,106,0,0.4)] hover:shadow-[0_0_30px_rgba(255,106,0,0.6)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 h-[52px]",
        // Obsidian "Halo" Platinum Button - White with glow
        halo: "bg-white text-zinc-900 font-semibold shadow-[0_0_20px_-5px_rgba(255,255,255,0.5)] hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 h-12 rounded-full",
        // Obsidian Glass Button
        "glass": "bg-zinc-900/40 backdrop-blur-xl border border-white/10 text-white hover:bg-zinc-900/60 hover:border-white/20 transition-all duration-300 h-12",
        // Obsidian Ghost Button
        "glass-ghost": "bg-transparent text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-300 h-12",
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
