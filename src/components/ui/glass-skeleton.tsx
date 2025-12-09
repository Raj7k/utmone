import { cn } from "@/lib/utils";

interface GlassSkeletonProps {
  height?: string;
  className?: string;
}

export const GlassSkeleton = ({ height = "300px", className }: GlassSkeletonProps) => (
  <div 
    className={cn(
      "w-full flex items-center justify-center",
      "bg-muted/30 backdrop-blur-xl border border-border rounded-2xl",
      "animate-pulse",
      className
    )}
    style={{ height, minHeight: height }}
  >
    <div className="w-6 h-6 border-2 border-muted-foreground/20 border-t-muted-foreground/60 rounded-full animate-spin" />
  </div>
);
