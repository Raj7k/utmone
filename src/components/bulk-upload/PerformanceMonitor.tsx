import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Zap, TrendingUp, Clock, AlertCircle } from "lucide-react";

interface PerformanceMetrics {
  avgProcessingTime: number;
  linksPerSecond: number;
  successRate: number;
  estimatedTimeRemaining: number;
}

interface PerformanceMonitorProps {
  currentBatch: number;
  totalBatches: number;
  processedCount: number;
  totalCount: number;
  successCount: number;
  startTime: number;
}

export function PerformanceMonitor({
  currentBatch,
  totalBatches,
  processedCount,
  totalCount,
  successCount,
  startTime,
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    avgProcessingTime: 0,
    linksPerSecond: 0,
    successRate: 0,
    estimatedTimeRemaining: 0,
  });

  useEffect(() => {
    if (processedCount === 0 || startTime === 0) return;

    const elapsedSeconds = (Date.now() - startTime) / 1000;
    const avgProcessingTime = elapsedSeconds / processedCount;
    const linksPerSecond = processedCount / elapsedSeconds;
    const successRate = (successCount / processedCount) * 100;
    const remainingLinks = totalCount - processedCount;
    const estimatedTimeRemaining = remainingLinks / linksPerSecond;

    setMetrics({
      avgProcessingTime,
      linksPerSecond,
      successRate,
      estimatedTimeRemaining,
    });
  }, [processedCount, totalCount, successCount, startTime]);

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getPerformanceStatus = (): { label: string; variant: "default" | "secondary" | "destructive" } => {
    if (metrics.linksPerSecond > 5) return { label: "Excellent", variant: "default" };
    if (metrics.linksPerSecond > 2) return { label: "Good", variant: "secondary" };
    return { label: "Slow", variant: "destructive" };
  };

  const performance = getPerformanceStatus();
  const progressPercentage = (processedCount / totalCount) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-display text-title-2">Performance metrics</CardTitle>
            <CardDescription>Real-time processing statistics</CardDescription>
          </div>
          <Badge variant={performance.variant}>
            <Zap className="w-3 h-3 mr-1" />
            {performance.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {processedCount} / {totalCount} links
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Batch {currentBatch} of {totalBatches}</span>
            <span>{progressPercentage.toFixed(1)}%</span>
          </div>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-3 h-3 text-white-80" />
              <span className="text-xs text-muted-foreground">Processing speed</span>
            </div>
            <p className="text-lg font-bold">
              {metrics.linksPerSecond.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">links/sec</span>
            </p>
          </div>

          <div className="p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-3 h-3 text-white-80" />
              <span className="text-xs text-muted-foreground">Avg per link</span>
            </div>
            <p className="text-lg font-bold">
              {metrics.avgProcessingTime.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">sec</span>
            </p>
          </div>

          <div className="p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-3 h-3 text-white-80" />
              <span className="text-xs text-muted-foreground">Success rate</span>
            </div>
            <p className="text-lg font-bold">
              {metrics.successRate.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">%</span>
            </p>
          </div>

          <div className="p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-3 h-3 text-white-80" />
              <span className="text-xs text-muted-foreground">Time remaining</span>
            </div>
            <p className="text-lg font-bold">
              {formatTime(metrics.estimatedTimeRemaining)}
            </p>
          </div>
        </div>

        {/* Performance tips */}
        {metrics.linksPerSecond < 2 && processedCount > 10 && (
          <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg text-sm">
            <p className="font-medium text-warning">Slow processing detected</p>
            <p className="text-xs text-muted-foreground mt-1">
              Consider reducing batch size or checking your network connection
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
