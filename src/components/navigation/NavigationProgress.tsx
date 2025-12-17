import { useNavigationProgress } from "@/hooks/useNavigationProgress";
import { cn } from "@/lib/utils";

export const NavigationProgress = () => {
  const { isNavigating, progress, isSlowLoad } = useNavigationProgress();

  return (
    <>
      {/* Progress bar container */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] h-0.5 transition-opacity duration-150",
          isNavigating ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Background track */}
        <div className="absolute inset-0 bg-primary/10" />
        
        {/* Progress bar */}
        <div
          className="absolute inset-y-0 left-0 bg-primary transition-[width] duration-100 ease-out"
          style={{
            width: `${progress}%`,
            boxShadow: "0 0 10px hsl(var(--primary)), 0 0 5px hsl(var(--primary))"
          }}
        />
        
        {/* Shimmer effect */}
        <div
          className={cn(
            "absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent",
            isNavigating ? "animate-[shimmer_1s_linear_infinite]" : ""
          )}
        />
      </div>

      {/* Slow load indicator */}
      <div
        className={cn(
          "fixed top-3 left-1/2 -translate-x-1/2 z-[100] px-3 py-1.5 rounded-full bg-card/80 backdrop-blur-sm border border-border text-xs text-muted-foreground",
          "transition-all duration-200",
          isSlowLoad && progress >= 70 && isNavigating
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2.5 pointer-events-none"
        )}
      >
        still loading...
      </div>
    </>
  );
};
