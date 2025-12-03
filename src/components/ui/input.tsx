import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full rounded-xl border transition-apple file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "h-11 px-3 py-2 border-border bg-card text-base md:text-sm ring-offset-background file:text-foreground placeholder:text-tertiary-label focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        system: "h-[44px] px-4 py-2.5 border-separator bg-fill-tertiary text-label placeholder:text-tertiary-label focus-visible:outline-none focus-visible:border-system-blue focus-visible:ring-4 focus-visible:ring-system-blue/15",
        // Obsidian "Recessed Glass" input - dark inset appearance
        glass: "h-11 px-4 py-2 bg-black/50 border-white/10 text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:border-white/30 focus-visible:ring-2 focus-visible:ring-white/10 transition-all",
      }
    },
    defaultVariants: {
      variant: "default",
    }
  }
);

export interface InputProps
  extends React.ComponentProps<"input">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, className }))}
        ref={ref}
        aria-disabled={props.disabled}
        aria-readonly={props.readOnly}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input, inputVariants };
