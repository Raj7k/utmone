import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeEstimateProps {
  time: string;
  difficulty?: "easy" | "medium" | "hard";
  className?: string;
}

const difficultyColors = {
  easy: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  hard: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
};

export const TimeEstimate = ({ time, difficulty, className }: TimeEstimateProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
        <Clock className="w-3.5 h-3.5" />
        {time}
      </span>
      {difficulty && (
        <span className={cn(
          "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium capitalize",
          difficultyColors[difficulty]
        )}>
          {difficulty}
        </span>
      )}
    </div>
  );
};
