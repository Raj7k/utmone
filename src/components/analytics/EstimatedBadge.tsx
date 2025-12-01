import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EstimatedBadgeProps {
  isEstimated: boolean;
  isLoadingPrecise: boolean;
  confidence?: number;
  margin?: number;
}

export function EstimatedBadge({
  isEstimated,
  isLoadingPrecise,
  confidence = 0.95,
  margin,
}: EstimatedBadgeProps) {
  if (!isEstimated && !isLoadingPrecise) {
    return null;
  }

  if (isLoadingPrecise) {
    return (
      <Badge variant="outline" className="gap-1.5 bg-muted/30">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span className="text-xs">refining data...</span>
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="gap-1.5 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300">
      <span className="text-xs">
        estimated {confidence * 100}%
        {margin && ` (±${margin})`}
      </span>
    </Badge>
  );
}
