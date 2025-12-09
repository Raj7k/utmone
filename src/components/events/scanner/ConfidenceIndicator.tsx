import { cn } from "@/lib/utils";
import { AlertTriangle, Check, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ConfidenceIndicatorProps {
  confidence: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ConfidenceIndicator = ({ confidence, showLabel = true, size = 'md' }: ConfidenceIndicatorProps) => {
  const getConfidenceLevel = () => {
    if (confidence >= 90) return { level: 'high', color: 'text-green-500', bg: 'bg-green-500/10', icon: Check };
    if (confidence >= 70) return { level: 'medium', color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: HelpCircle };
    return { level: 'low', color: 'text-red-500', bg: 'bg-red-500/10', icon: AlertTriangle };
  };

  const { level, color, bg, icon: Icon } = getConfidenceLevel();

  const sizeClasses = {
    sm: 'text-xs gap-1',
    md: 'text-sm gap-1.5',
    lg: 'text-base gap-2'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5",
            bg,
            sizeClasses[size]
          )}>
            <Icon className={cn(iconSizes[size], color)} />
            {showLabel && (
              <span className={cn("font-medium", color)}>
                {confidence}%
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">
            {level === 'high' && 'High confidence - data looks reliable'}
            {level === 'medium' && 'Medium confidence - please verify'}
            {level === 'low' && 'Low confidence - manual review recommended'}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
