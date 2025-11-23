import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-apple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary-hover shadow-sm hover:shadow-md h-12",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 h-12",
        outline: "border border-border bg-white text-foreground hover:bg-muted h-12",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-hover h-12",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-nature-3 text-white hover:bg-gradient-nature-2 transition-all duration-300 h-12",
        "glow-pink": "bg-[#FF6B9D] text-white hover:bg-[#FF5A8C] shadow-[0_0_20px_rgba(255,107,157,0.4)] hover:shadow-[0_0_30px_rgba(255,107,157,0.6)] transition-all duration-300 h-12",
      },
      size: {
        default: "px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-12 rounded-xl px-8",
        icon: "h-12 w-12",
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
