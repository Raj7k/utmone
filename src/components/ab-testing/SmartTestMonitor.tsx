import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { calculateWinProbability, shouldStopTest, getPosteriorStats } from "@/lib/bayesianOptimization";
import { calculateSignificance, calculateTestProgress, calculateRequiredSampleSize } from "@/lib/statisticalPower";

interface Variant {
  id: string;
  name: string;
  clicks: number;
  conversions: number;
}

interface SmartTestMonitorProps {
  variants: Variant[];
  onStopTest?: (winnerIndex: number) => void;
  baselineRate?: number;
  minDetectableEffect?: number;
}

export function SmartTestMonitor({ 
  variants, 
  onStopTest,
  baselineRate = 0.05,
  minDetectableEffect = 0.2
}: SmartTestMonitorProps) {
  if (variants.length !== 2) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Smart monitoring currently supports 2-variant tests only
        </AlertDescription>
      </Alert>
    );
  }

  const [variantA, variantB] = variants;
  
  // Bayesian analysis
  const winProb = calculateWinProbability(
    { clicks: variantA.clicks, conversions: variantA.conversions },
    { clicks: variantB.clicks, conversions: variantB.conversions }
  );
  
  const earlyStop = shouldStopTest([
    { clicks: variantA.clicks, conversions: variantA.conversions },
    { clicks: variantB.clicks, conversions: variantB.conversions }
  ]);
  
  const posteriorA = getPosteriorStats(variantA.clicks, variantA.conversions);
  const posteriorB = getPosteriorStats(variantB.clicks, variantB.conversions);
  
  // Frequentist analysis
  const significance = calculateSignificance(
    { clicks: variantA.clicks, conversions: variantA.conversions },
    { clicks: variantB.clicks, conversions: variantB.conversions }
  );
  
  // Sample size calculation
  const requiredSampleSize = calculateRequiredSampleSize(
    baselineRate,
    minDetectableEffect
  );
  
  const totalClicks = variantA.clicks + variantB.clicks;
  const progress = calculateTestProgress(totalClicks, requiredSampleSize * 2);

  const winner = earlyStop.winnerIndex !== -1 ? variants[earlyStop.winnerIndex] : null;

  return (
    <div className="space-y-4">
      {/* Early Stop Recommendation */}
      {earlyStop.shouldStop && (
        <Alert className="bg-primary/5 border-primary">
          <CheckCircle className="h-4 w-4 text-primary" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">ready to declare winner</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {winner?.name} has {(earlyStop.confidence * 100).toFixed(1)}% probability of winning
                </p>
              </div>
              {onStopTest && (
                <Button 
                  onClick={() => onStopTest(earlyStop.winnerIndex)}
                  size="sm"
                  variant="default"
                >
                  stop test & declare winner
                </Button>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Statistical Progress */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">test progress</span>
            </div>
            <Badge variant="outline">
              {(progress.progress * 100).toFixed(0)}% complete
            </Badge>
          </div>
          
          <Progress value={progress.progress * 100} className="h-2" />
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">samples collected</p>
              <p className="font-medium">{totalClicks.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">samples needed</p>
              <p className="font-medium">{(requiredSampleSize * 2).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Win Probability */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">bayesian win probability</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{variantA.name}</p>
              <p className="text-2xl font-bold">{(winProb * 100).toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground mt-1">
                95% CI: [{(posteriorA.confidenceInterval[0] * 100).toFixed(1)}%, {(posteriorA.confidenceInterval[1] * 100).toFixed(1)}%]
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">{variantB.name}</p>
              <p className="text-2xl font-bold">{((1 - winProb) * 100).toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground mt-1">
                95% CI: [{(posteriorB.confidenceInterval[0] * 100).toFixed(1)}%, {(posteriorB.confidenceInterval[1] * 100).toFixed(1)}%]
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Statistical Significance */}
      <Card className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">statistical significance</span>
            <Badge variant={significance.isSignificant ? "default" : "secondary"}>
              {significance.isSignificant ? "significant" : "not yet significant"}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">p-value</p>
              <p className="font-medium">{significance.pValue.toFixed(4)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">z-score</p>
              <p className="font-medium">{significance.zScore.toFixed(2)}</p>
            </div>
          </div>
          
          {!significance.isSignificant && progress.samplesRemaining > 0 && (
            <p className="text-xs text-muted-foreground">
              need {progress.samplesRemaining.toLocaleString()} more samples for significance
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
