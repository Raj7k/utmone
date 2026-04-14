import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { Card } from "@/components/ui/card";
import { Sparkles, TrendingUp, AlertCircle, Lightbulb } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useDemoMode } from "@/hooks/useDemoMode";
import { DemoAIInsightsTile } from "./bento/DemoAIInsightsTile";
import { useAppSession } from "@/contexts/AppSessionContext";

export function AIInsights() {
  const { showDemoMode, activePlan } = useDemoMode();
  const { currentWorkspace } = useAppSession();
  
  const { data: insights, isLoading } = useQuery({
    queryKey: ["ai-insights", currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return [];

      const { data, error } = await supabaseFrom('ai_insights')
        .select("*")
        .eq("workspace_id", currentWorkspace.id)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data || [];
    },
    enabled: !!currentWorkspace?.id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: anomalies } = useQuery({
    queryKey: ["analytics-anomalies", currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return [];

      const { data, error } = await supabaseFrom('analytics_anomalies')
        .select("*")
        .eq("workspace_id", currentWorkspace.id)
        .eq("is_dismissed", false)
        .order("detected_at", { ascending: false })
        .limit(2);

      if (error) throw error;
      return data || [];
    },
    enabled: !!currentWorkspace?.id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  const allInsights = [
    ...(insights || []).map((i) => ({
      type: i.insight_type,
      title: "AI Insight",
      description: i.summary_text,
      icon: Sparkles,
      severity: "info" as const,
    })),
    ...(anomalies || []).map((a) => ({
      type: a.anomaly_type,
      title: a.title,
      description: a.description,
      icon: AlertCircle,
      severity: a.severity as "info" | "warning" | "error",
    })),
  ];

  if (allInsights.length === 0) {
    // Show demo tile when no real insights and demo mode is active
    if (showDemoMode) {
      return <DemoAIInsightsTile planTier={activePlan} />;
    }
    
    return (
      <Card className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <Lightbulb className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">AI Insights</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          No insights available yet. Keep creating links and we'll analyze your data to provide actionable recommendations.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">AI Insights</h3>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/analytics">View All</Link>
        </Button>
      </div>
      <div className="space-y-3">
        {allInsights.slice(0, 3).map((insight, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              insight.severity === "error"
                ? "border-destructive/50 bg-destructive/10"
                : insight.severity === "warning"
                ? "border-yellow-500/50 bg-yellow-500/10"
                : "border-border bg-muted/30"
            }`}
          >
            <div className="flex items-start gap-3">
              <insight.icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                insight.severity === "error"
                  ? "text-destructive"
                  : insight.severity === "warning"
                  ? "text-yellow-600 dark:text-yellow-500"
                  : "text-primary"
              }`} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm mb-1">{insight.title}</p>
                <p className="text-xs text-muted-foreground">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}