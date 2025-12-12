import { cn } from "@/lib/utils";

interface ShimmerCardProps {
  variant?: "default" | "stat" | "list" | "chart" | "small";
  className?: string;
}

export const ShimmerCard = ({ variant = "default", className }: ShimmerCardProps) => {
  const baseClasses = "relative overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50";
  
  const shimmerOverlay = (
    <div 
      className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-foreground/5 to-transparent"
      style={{ backgroundSize: '200% 100%' }}
    />
  );

  if (variant === "stat") {
    return (
      <div className={cn(baseClasses, "p-6 h-28", className)}>
        {shimmerOverlay}
        <div className="space-y-3">
          <div className="h-4 w-24 rounded bg-muted/60" />
          <div className="h-8 w-32 rounded bg-muted/40" />
          <div className="h-3 w-20 rounded bg-muted/30" />
        </div>
      </div>
    );
  }

  if (variant === "small") {
    return (
      <div className={cn(baseClasses, "p-4 h-20", className)}>
        {shimmerOverlay}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-muted/50" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-3/4 rounded bg-muted/50" />
            <div className="h-3 w-1/2 rounded bg-muted/30" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className={cn(baseClasses, "p-6", className)}>
        {shimmerOverlay}
        <div className="space-y-4">
          <div className="h-5 w-32 rounded bg-muted/50" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted/40" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-full rounded bg-muted/40" />
                <div className="h-3 w-2/3 rounded bg-muted/30" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "chart") {
    return (
      <div className={cn(baseClasses, "p-6 h-64", className)}>
        {shimmerOverlay}
        <div className="space-y-4 h-full">
          <div className="h-5 w-40 rounded bg-muted/50" />
          <div className="flex-1 flex items-end gap-2 pt-4">
            {[40, 65, 45, 80, 55, 70, 50].map((h, i) => (
              <div 
                key={i} 
                className="flex-1 rounded-t bg-muted/30"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn(baseClasses, "p-6 h-48", className)}>
      {shimmerOverlay}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-32 rounded bg-muted/50" />
          <div className="h-4 w-16 rounded bg-muted/30" />
        </div>
        <div className="h-20 w-full rounded-lg bg-muted/30" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-muted/30" />
          <div className="h-4 w-3/4 rounded bg-muted/20" />
        </div>
      </div>
    </div>
  );
};

// Grid of shimmer cards for dashboard
export const ShimmerGrid = () => (
  <div className="space-y-6 animate-fade-in">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ShimmerCard variant="stat" />
      <ShimmerCard variant="stat" />
      <ShimmerCard variant="stat" />
    </div>
    <ShimmerCard variant="chart" />
    <ShimmerCard variant="list" />
  </div>
);
