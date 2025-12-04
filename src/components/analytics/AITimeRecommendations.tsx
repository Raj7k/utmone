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
            <Sparkles className="h-5 w-5" style={{ color: 'rgba(255,255,255,0.8)' }} />
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
            <AlertCircle className="h-5 w-5" style={{ color: 'rgba(239,68,68,0.9)' }} />
            <CardTitle className="text-title-3">prediction unavailable</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>failed to load ai predictions</p>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.topPredictions.length === 0) {
    return (
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" style={{ color: 'rgba(255,255,255,0.8)' }} />
            <CardTitle className="text-title-3">best times to share</CardTitle>
          </div>
          <CardDescription>when your links get the most clicks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" style={{ color: 'rgba(255,255,255,0.5)' }} />
            <p className="text-body-apple" style={{ color: 'rgba(255,255,255,0.5)' }}>not enough data yet</p>
            <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>keep sharing links to unlock ai predictions</p>
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
            <Sparkles className="h-5 w-5" style={{ color: 'rgba(255,255,255,0.8)' }} />
            <CardTitle className="text-title-3">best times to share</CardTitle>
          </div>
          <Badge variant={data.confidence === 'high' ? 'default' : 'secondary'} className="brand-lowercase">
            {data.confidence} confidence
          </Badge>
        </div>
        <CardDescription>based on your historical click data</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Primary Recommendation */}
        <div 
          className="p-4 rounded-lg"
          style={{ 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid rgba(255,255,255,0.15)' 
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4" style={{ color: 'rgba(255,255,255,0.8)' }} />
                <span className="text-sm font-medium brand-lowercase" style={{ color: 'rgba(255,255,255,0.8)' }}>recommended time</span>
              </div>
              <h3 className="text-2xl font-display font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>
                {bestTime.dayName} {bestTime.timeLabel}
              </h3>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>{Math.round(bestTime.prediction.mean)}</span>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>± {Math.round(bestTime.prediction.std)} clicks predicted</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
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
            <h4 className="text-sm font-medium brand-lowercase" style={{ color: 'rgba(255,255,255,0.5)' }}>alternative high-performing times</h4>
            {data.topPredictions.slice(1, 4).map((slot, idx) => (
              <div
                key={`${slot.dayOfWeek}-${slot.hourOfDay}`}
                className="flex items-center justify-between p-3 rounded-lg transition-colors"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium"
                    style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}
                  >
                    {idx + 2}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>
                      {slot.dayName} {slot.timeLabel}
                    </p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      {Math.round(slot.prediction.mean)} ± {Math.round(slot.prediction.std)} clicks
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>confidence</p>
                  <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
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
              <Lightbulb className="h-4 w-4" style={{ color: 'rgba(234,179,8,0.9)' }} />
              <h4 className="text-sm font-medium brand-lowercase" style={{ color: 'rgba(255,255,255,0.5)' }}>worth trying</h4>
            </div>
            {data.explorationSuggestions.slice(0, 2).map((slot) => (
              <div
                key={`${slot.dayOfWeek}-${slot.hourOfDay}`}
                className="p-3 rounded-lg"
                style={{ 
                  background: 'rgba(234,179,8,0.05)', 
                  border: '1px solid rgba(234,179,8,0.2)' 
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>
                      {slot.dayName} {slot.timeLabel}
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      could perform well but not enough data yet
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="brand-lowercase"
                    style={{ color: 'rgba(234,179,8,0.9)', borderColor: 'rgba(234,179,8,0.5)' }}
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
          <div className="space-y-2 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <h4 className="text-sm font-medium brand-lowercase" style={{ color: 'rgba(255,255,255,0.5)' }}>insights</h4>
            <ul className="space-y-1.5">
              {data.insights.map((insight, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  <span className="mt-0.5" style={{ color: 'rgba(255,255,255,0.8)' }}>•</span>
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
