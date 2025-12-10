/**
 * AI Time Recommendations Dashboard Card
 * Displays Gaussian Process predictions for optimal send times
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, Lightbulb, Clock, AlertCircle } from 'lucide-react';
import { useAISendTimePredictor } from '@/hooks/useAISendTimePredictor';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';

interface AITimeRecommendationsProps {
  workspaceId: string;
  days?: number;
}

export const AITimeRecommendations = ({ workspaceId, days = 30 }: AITimeRecommendationsProps) => {
  const { data, isLoading, error } = useAISendTimePredictor(workspaceId, days);

  if (isLoading) {
    return (
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-foreground" />
            <CardTitle className="text-title-3">ai time optimizer</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-title-3">prediction unavailable</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">failed to load ai predictions</p>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.topPredictions.length === 0) {
    return (
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-foreground" />
            <CardTitle className="text-title-3">best times to share</CardTitle>
          </div>
          <CardDescription>when your links get the most clicks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-body-apple text-muted-foreground">not enough data yet</p>
            <p className="text-sm mt-2 text-muted-foreground/50">keep sharing links to unlock ai predictions</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const bestTime = data.topPredictions[0];
  const confidenceScore = data.confidence === 'high' ? 90 : data.confidence === 'medium' ? 60 : 30;

  return (
    <Card variant="glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-foreground" />
            <CardTitle className="text-title-3">best times to share</CardTitle>
          </div>
          <Badge variant={data.confidence === 'high' ? 'default' : 'secondary'}>
            {data.confidence} confidence
          </Badge>
        </div>
        <CardDescription>based on your historical click data</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Primary Recommendation */}
        <div className="p-4 rounded-lg bg-muted/30 border border-border">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-foreground" />
                <span className="text-sm font-medium text-foreground">recommended time</span>
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground">
                {bestTime.dayName} {bestTime.timeLabel}
              </h3>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">{Math.round(bestTime.prediction.mean)}</span>
              <span className="text-sm text-muted-foreground">± {Math.round(bestTime.prediction.std)} clicks predicted</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground/50">
                <span>95% confidence interval</span>
                <span>
                  {Math.round(bestTime.prediction.confidenceInterval.lower)} - {Math.round(bestTime.prediction.confidenceInterval.upper)} clicks
                </span>
              </div>
              <Progress value={confidenceScore} className="h-1.5" />
            </div>
          </div>
        </div>

        {/* Top Alternative Times */}
        {data.topPredictions.length > 1 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">alternative high-performing times</h4>
            {data.topPredictions.slice(1, 4).map((slot, idx) => (
              <div
                key={`${slot.dayOfWeek}-${slot.hourOfDay}`}
                className="flex items-center justify-between p-3 rounded-lg transition-colors bg-muted/20"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium bg-muted text-foreground">
                    {idx + 2}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {slot.dayName} {slot.timeLabel}
                    </p>
                    <p className="text-xs text-muted-foreground/50">
                      {Math.round(slot.prediction.mean)} ± {Math.round(slot.prediction.std)} clicks
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground/50">confidence</p>
                  <p className="text-sm font-medium text-muted-foreground">
                    {Math.round((1 - slot.prediction.std / slot.prediction.mean) * 100)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Exploration Suggestions */}
        {data.explorationSuggestions.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-warning" />
              <h4 className="text-sm font-medium text-muted-foreground">worth trying</h4>
            </div>
            {data.explorationSuggestions.slice(0, 2).map((slot) => (
              <div
                key={`${slot.dayOfWeek}-${slot.hourOfDay}`}
                className="p-3 rounded-lg bg-warning/5 border border-warning/20"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {slot.dayName} {slot.timeLabel}
                    </p>
                    <p className="text-xs mt-1 text-muted-foreground/50">
                      could perform well but not enough data yet
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="text-warning border-warning/50"
                  >
                    worth trying
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Insights */}
        {data.insights.length > 0 && (
          <div className="space-y-2 pt-4 border-t border-border">
            <h4 className="text-sm font-medium text-muted-foreground">insights</h4>
            <ul className="space-y-1.5">
              {data.insights.map((insight, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2 text-muted-foreground/50">
                  <span className="mt-0.5 text-foreground">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
