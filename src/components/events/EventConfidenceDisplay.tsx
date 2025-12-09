import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EventConfidenceDisplayProps {
  haloVisitors: number;
  haloVisitorsLow: number;
  haloVisitorsHigh: number;
  liftPercentage: number;
  hasSufficientData: boolean;
}

export const EventConfidenceDisplay = ({
  haloVisitors,
  haloVisitorsLow,
  haloVisitorsHigh,
  liftPercentage,
  hasSufficientData
}: EventConfidenceDisplayProps) => {
  // Format numbers with k for thousands
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          estimated halo impact
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  confidence ranges are more honest than exact numbers. 
                  the true value falls within this range with 95% confidence.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h3>
        
        {!hasSufficientData && (
          <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
            low confidence
          </span>
        )}
      </div>

      <div className="space-y-6">
        {/* Main confidence range */}
        <div className="text-center">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-4xl font-bold obsidian-platinum-text">
              {formatNumber(haloVisitorsLow)}
            </span>
            <span className="text-2xl text-muted-foreground">–</span>
            <span className="text-4xl font-bold obsidian-platinum-text">
              {formatNumber(haloVisitorsHigh)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            estimated halo visitors (95% confidence)
          </p>
        </div>

        {/* Visual confidence bar */}
        <div className="relative">
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary/50 via-primary to-primary/50 rounded-full"
              style={{ 
                marginLeft: '10%', 
                width: '80%' 
              }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>conservative</span>
            <span className="font-medium text-foreground">{formatNumber(haloVisitors)} midpoint</span>
            <span>optimistic</span>
          </div>
        </div>

        {/* Lift percentage */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">+{liftPercentage.toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground">traffic lift</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {hasSufficientData ? '95%' : '70%'}
            </p>
            <p className="text-xs text-muted-foreground">confidence level</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
