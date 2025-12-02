import { AlertCircle, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ExperimentConfidenceMeterProps {
  probabilityBWins: number;
  variantALabel: string;
  variantBLabel: string;
  variantAClicks: number;
  variantBClicks: number;
  variantAConversions: number;
  variantBConversions: number;
  status: string;
  onDeclareWinner?: (winner: 'A' | 'B') => void;
}

export const ExperimentConfidenceMeter = ({
  probabilityBWins,
  variantALabel,
  variantBLabel,
  variantAClicks,
  variantBClicks,
  variantAConversions,
  variantBConversions,
  status,
  onDeclareWinner,
}: ExperimentConfidenceMeterProps) => {
  const probabilityAWins = 1 - probabilityBWins;
  const confidenceThreshold = 0.95;

  const hasWinner = probabilityBWins >= confidenceThreshold || probabilityAWins >= confidenceThreshold;
  const winner = probabilityBWins >= confidenceThreshold ? 'B' : probabilityAWins >= confidenceThreshold ? 'A' : null;
  const winnerLabel = winner === 'A' ? variantALabel : winner === 'B' ? variantBLabel : null;
  const winnerProbability = winner === 'A' ? probabilityAWins : probabilityBWins;

  const conversionRateA = variantAClicks > 0 ? (variantAConversions / variantAClicks) * 100 : 0;
  const conversionRateB = variantBClicks > 0 ? (variantBConversions / variantBClicks) * 100 : 0;

  return (
    <Card className="p-6 border-border/50 bg-card">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-display font-semibold text-foreground">
              clean-track confidence
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              statistical probability of winning variant
            </p>
          </div>

          {hasWinner && status === 'running' && (
            <Badge variant="default" className="gap-1.5">
              <Trophy className="h-3.5 w-3.5" />
              winner found
            </Badge>
          )}
        </div>

        {/* Confidence Visualization */}
        <div className="space-y-4">
          {/* Variant A */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{variantALabel}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant="outline" className="text-xs">
                        {probabilityAWins >= 0.5 ? '🏆 ' : ''}{(probabilityAWins * 100).toFixed(1)}%
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Probability of being best: {(probabilityAWins * 100).toFixed(2)}%</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="text-muted-foreground">
                {conversionRateA.toFixed(2)}% CR • {variantAConversions}/{variantAClicks}
              </span>
            </div>
            <Progress 
              value={probabilityAWins * 100} 
              className="h-3"
            />
          </div>

          {/* Variant B */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{variantBLabel}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant="outline" className="text-xs">
                        {probabilityBWins >= 0.5 ? '🏆 ' : ''}{(probabilityBWins * 100).toFixed(1)}%
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Probability of being best: {(probabilityBWins * 100).toFixed(2)}%</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="text-muted-foreground">
                {conversionRateB.toFixed(2)}% CR • {variantBConversions}/{variantBClicks}
              </span>
            </div>
            <Progress 
              value={probabilityBWins * 100} 
              className="h-3"
            />
          </div>
        </div>

        {/* Winner Banner */}
        {hasWinner && (
          <div className="rounded-lg bg-primary/10 border border-primary/20 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
                <Trophy className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-sm font-medium text-foreground">
                  {winnerLabel} has {(winnerProbability * 100).toFixed(1)}% chance of beating the other variant
                </p>
                <p className="text-xs text-muted-foreground">
                  Statistical significance threshold reached (95% confidence)
                </p>
                {status === 'running' && onDeclareWinner && (
                  <Button
                    size="sm"
                    onClick={() => onDeclareWinner(winner!)}
                    className="mt-2"
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    declare {winnerLabel} as winner
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Insufficient Data Warning */}
        {!hasWinner && (variantAClicks < 100 || variantBClicks < 100) && (
          <div className="rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  collecting more data...
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum 100 clicks per variant recommended for reliable results
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Methodology Note */}
        <div className="pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            powered by clean-track intelligence
          </p>
        </div>
      </div>
    </Card>
  );
};