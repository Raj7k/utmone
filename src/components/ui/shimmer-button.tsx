import * as React from "react";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  shimmerColor?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
}

const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      children,
      shimmerColor = "rgba(255, 255, 255, 0.3)",
      borderRadius = "100px",
      shimmerDuration = "2s",
      background = "hsl(var(--primary))",
      className,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap px-6 py-3 font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
          "text-primary-foreground",
          className
        )}
        style={{
          borderRadius,
          background,
        }}
        {...props}
      >
        {/* Shimmer effect */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ borderRadius }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(
                110deg,
                transparent 25%,
                ${shimmerColor} 50%,
                transparent 75%
              )`,
              backgroundSize: "200% 100%",
              animation: `shimmer ${shimmerDuration} linear infinite`,
            }}
          />
        </div>
        
        {/* Glow effect on hover */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            borderRadius,
            boxShadow: `0 0 20px ${shimmerColor}, 0 0 40px ${shimmerColor}`,
          }}
        />
        
        {/* Content */}
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";

export { ShimmerButton };
