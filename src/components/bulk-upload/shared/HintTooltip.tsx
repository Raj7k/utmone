import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HintTooltipProps {
  content: string;
  className?: string;
}

export const HintTooltip = ({ content, className }: HintTooltipProps) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center justify-center p-1 rounded-full hover:bg-muted/50 transition-colors cursor-help">
            <Info className={`h-5 w-5 text-muted-foreground ${className || ''}`} />
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-[280px]" side="top" align="start">
          <p className="text-[13px] leading-relaxed">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
