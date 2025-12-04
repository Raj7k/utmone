import { Sparkles, TrendingUp, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQRStyleOptimizer } from "@/hooks/useQRStyleOptimizer";
import { Skeleton } from "@/components/ui/skeleton";

interface AIStyleRecommendationProps {
  workspaceId: string;
  onApplyStyle: (style: { primaryColor: string; secondaryColor: string; cornerStyle: string }) => void;
}

export function AIStyleRecommendation({ workspaceId, onApplyStyle }: AIStyleRecommendationProps) {
  const { data: recommendation, isLoading } = useQRStyleOptimizer(workspaceId);

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </Card>
    );
  }

  if (!recommendation) return null;

  return (
    <Card className="p-4 border-white/10" style={{ background: 'rgba(59,130,246,0.05)' }}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" style={{ color: 'rgba(59,130,246,1)' }} />
          <h3 className="font-semibold text-sm">clean track recommends</h3>
        </div>

        <div className="space-y-3">
          {/* Color preview */}
          <div className="flex gap-2 items-center">
            <div 
              className="w-12 h-12 rounded-lg border-2 border-border"
              style={{ backgroundColor: recommendation.primaryColor }}
            />
            <div 
              className="w-12 h-12 rounded-lg border-2 border-border"
              style={{ backgroundColor: recommendation.secondaryColor }}
            />
            <div className="flex-1 text-xs text-muted-foreground">
              {recommendation.cornerStyle} corners
            </div>
          </div>

          {/* Expected performance */}
          {recommendation.expectedScans > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-muted-foreground">
                expected: <span className="font-medium text-foreground">{recommendation.expectedScans}</span> scans
              </span>
            </div>
          )}

          {/* Confidence indicator */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">confidence</span>
              <span className="font-medium">{Math.round(recommendation.confidence * 100)}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-500"
                style={{ width: `${recommendation.confidence * 100}%`, background: 'rgba(59,130,246,1)' }}
              />
            </div>
          </div>

          {/* Optimization status */}
          {!recommendation.isOptimizing && (
            <div className="flex items-start gap-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-700">
                need at least 5 qr codes with scan data. currently showing best observed style.
              </p>
            </div>
          )}

          {recommendation.isOptimizing && (
            <p className="text-xs text-muted-foreground">
              based on analyzing {recommendation.expectedScans > 0 ? 'your scan' : 'available'} data
            </p>
          )}

          {/* Apply button */}
          <Button 
            onClick={() => onApplyStyle({
              primaryColor: recommendation.primaryColor,
              secondaryColor: recommendation.secondaryColor,
              cornerStyle: recommendation.cornerStyle
            })}
            className="w-full"
            variant="default"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            apply recommended style
          </Button>
        </div>
      </div>
    </Card>
  );
}
