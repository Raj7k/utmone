import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { notify } from "@/lib/notify";
import { Lightbulb, CheckCircle2, XCircle, TrendingDown, TrendingUp } from "lucide-react";

interface Recommendation {
  id: string;
  recommendation_type: string;
  flag_key: string;
  confidence_score: number;
  reason: string;
  expected_impact: {
    latency_change?: number;
    error_rate_change?: number;
    cache_hit_rate_change?: number;
  };
  current_system_load: string;
  current_traffic_pattern: string;
  status: string;
  created_at: string;
  expires_at: string;
}

// Static demo recommendations since the flag_recommendations table doesn't exist yet
const DEMO_RECOMMENDATIONS: Recommendation[] = [];

export function FlagRecommendations() {
  const queryClient = useQueryClient();
  const [recommendations] = useState<Recommendation[]>(DEMO_RECOMMENDATIONS);
  const [isLoading] = useState(false);

  const generateRecommendations = useMutation({
    mutationFn: async () => {
      try {
        const { error } = await supabase.functions.invoke('generate-flag-recommendations');
        if (error) throw error;
      } catch {
        // Edge function may not exist yet
        console.log('generate-flag-recommendations not available yet');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flag-recommendations'] });
      notify.success("recommendations generated");
    },
    onError: (error: Error) => {
      notify.error(error.message || "failed to generate recommendations");
    },
  });

  const applyRecommendation = useMutation({
    mutationFn: async ({ id, flagKey, enable }: { id: string; flagKey: string; enable: boolean }) => {
      const { error: flagError } = await supabase
        .from('feature_gates')
        .update({ 
          min_plan_tier: enable ? 'free' : 'disabled',
        })
        .eq('feature_key', flagKey);

      if (flagError) throw flagError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flag-recommendations'] });
      queryClient.invalidateQueries({ queryKey: ['feature-flags'] });
      notify.success("recommendation applied");
    },
    onError: (error: Error) => {
      notify.error(error.message || "failed to apply recommendation");
    },
  });

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getConfidenceLabel = (score: number) => {
    if (score >= 0.8) return 'high confidence';
    if (score >= 0.6) return 'medium confidence';
    return 'low confidence';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              <CardTitle>intelligent recommendations</CardTitle>
            </div>
            <CardDescription className="mt-2">
              AI-suggested flag configurations based on current system state
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => generateRecommendations.mutate()}
            disabled={generateRecommendations.isPending}
          >
            {generateRecommendations.isPending ? 'analyzing...' : 'refresh recommendations'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-secondary-label">analyzing system...</div>
        ) : !recommendations || recommendations.length === 0 ? (
          <div className="text-center py-12">
            <Lightbulb className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-secondary-label">no recommendations at this time</p>
            <p className="text-xs text-secondary-label mt-2">
              system is running optimally with current configuration
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="p-4 rounded-lg border border-yellow-200 bg-yellow-50/50">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={rec.recommendation_type === 'enable' ? 'default' : 'secondary'}>
                          {rec.recommendation_type} {rec.flag_key}
                        </Badge>
                        <Badge variant="outline" className={getConfidenceColor(rec.confidence_score)}>
                          {Math.round(rec.confidence_score * 100)}% {getConfidenceLabel(rec.confidence_score)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm">{rec.reason}</p>

                  <div className="grid grid-cols-3 gap-4 p-3 rounded bg-white/5 border border-white/10">
                    {rec.expected_impact.latency_change !== undefined && (
                      <div>
                        <p className="text-xs text-secondary-label">latency impact</p>
                        <div className="flex items-center gap-1 mt-1">
                          {rec.expected_impact.latency_change < 0 ? (
                            <TrendingDown className="w-4 h-4 text-green-600" />
                          ) : (
                            <TrendingUp className="w-4 h-4 text-red-600" />
                          )}
                          <span className="text-sm font-medium">
                            {rec.expected_impact.latency_change > 0 ? '+' : ''}{rec.expected_impact.latency_change}ms
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline">{rec.current_system_load} load</Badge>
                    <Badge variant="outline">{rec.current_traffic_pattern} traffic</Badge>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      size="sm"
                      className="gap-2"
                      onClick={() => applyRecommendation.mutate({
                        id: rec.id,
                        flagKey: rec.flag_key,
                        enable: rec.recommendation_type === 'enable'
                      })}
                      disabled={applyRecommendation.isPending}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      apply recommendation
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      disabled={false}
                    >
                      <XCircle className="w-4 h-4" />
                      dismiss
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
