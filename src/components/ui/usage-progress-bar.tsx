import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface UsageProgressBarProps {
  label: string;
  used: number;
  limit: number | 'unlimited';
  className?: string;
}

export const UsageProgressBar = ({ label, used, limit, className }: UsageProgressBarProps) => {
  const isUnlimited = limit === 'unlimited';
  const percentage = isUnlimited ? 0 : Math.min((used / (limit as number)) * 100, 100);
  
  // Color coding based on usage - using rgba for Obsidian compliance
  const getProgressColor = () => {
    if (isUnlimited) return "rgba(59,130,246,1)"; // Electric Blue
    if (percentage >= 90) return "rgba(239,68,68,0.9)"; // Red
    if (percentage >= 75) return "rgba(245,158,11,0.9)"; // Amber
    return "rgba(59,130,246,1)"; // Electric Blue
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-secondary-label font-medium">{label}</span>
        <span className="text-label font-semibold tabular-nums">
          {formatNumber(used)} / {isUnlimited ? '∞' : formatNumber(limit as number)}
        </span>
      </div>
      <div className="relative">
        <Progress 
          value={isUnlimited ? 100 : percentage} 
          className="h-2"
        />
        <div 
          className="absolute inset-0 h-2 rounded-full transition-all"
          style={{ 
            width: `${isUnlimited ? 100 : percentage}%`,
            opacity: 0.8,
            background: getProgressColor()
          }}
        />
      </div>
    </div>
  );
};
