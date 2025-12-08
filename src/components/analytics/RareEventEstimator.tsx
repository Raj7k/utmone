import { Activity, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useRareEventEstimator } from "@/hooks/useRareEventEstimator";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

interface RareEventEstimatorProps {
  linkId?: string;
  workspaceId?: string;
  title?: string;
}

export function RareEventEstimator({ linkId, workspaceId, title = "conversion probability" }: RareEventEstimatorProps) {
  const { data: estimate, isLoading } = useRareEventEstimator(linkId, workspaceId);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-32 w-full" />
        </div>
      </Card>
    );
  }

  if (!estimate) return null;

  const { estimate: probEstimate } = estimate;
  const percentage = probEstimate.probability * 100;
  const [lowerCI, upperCI] = probEstimate.confidenceInterval;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-foreground" />
            <h3 className="font-semibold text-sm lowercase">{title}</h3>
          </div>
          {probEstimate.reliable ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          )}
        </div>

        {/* Main probability */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">{percentage.toFixed(2)}%</span>
            <span className="text-sm text-muted-foreground">estimated conversion rate</span>
          </div>
          
          {/* Confidence interval */}
          <div className="text-sm text-muted-foreground">
            95% confidence interval: {(lowerCI * 100).toFixed(2)}% - {(upperCI * 100).toFixed(2)}%
          </div>
        </div>

        {/* Visual confidence band */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">confidence band</div>
          <div className="relative h-8 bg-muted rounded-lg overflow-hidden">
            {/* Lower bound */}
            <div 
              className="absolute h-full bg-muted-foreground/20"
              style={{ 
                left: `${lowerCI * 100}%`,
                width: `${(upperCI - lowerCI) * 100}%`
              }}
            />
            {/* Point estimate */}
            <div 
              className="absolute h-full w-1 bg-foreground"
              style={{ left: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Sample size */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">sample size</span>
            <span className="font-medium">{probEstimate.sampleSize.toLocaleString()} clicks</span>
          </div>
          <Progress value={Math.min(100, (probEstimate.sampleSize / 1000) * 100)} />
        </div>

        {/* Reliability warning */}
        {!probEstimate.reliable && probEstimate.recommendation && (
          <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-xs font-medium text-amber-700">low confidence estimate</p>
              <p className="text-xs text-amber-600">{probEstimate.recommendation}</p>
            </div>
          </div>
        )}

        {/* Method info */}
        {probEstimate.reliable && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            <span>estimated based on your conversion data</span>
          </div>
        )}

        {/* Link title if provided */}
        {estimate.linkTitle && (
          <div className="pt-2 border-t border-border">
            <div className="text-xs text-muted-foreground">
              link: <span className="font-medium text-foreground">{estimate.linkTitle}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
