import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Sparkles, TrendingUp, AlertCircle, Lightbulb } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function AIInsights() {
  const { data: insights, isLoading } = useQuery({
    queryKey: ["ai-insights"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: workspaces } = await supabase
        .from("workspaces")
        .select("id")
        .order("created_at", { ascending: false })
        .limit(1);

      if (!workspaces?.[0]) return [];

      const { data, error } = await supabase
        .from("ai_insights")
        .select("*")
        .eq("workspace_id", workspaces[0].id)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data || [];
    },
  });

  const { data: anomalies } = useQuery({
    queryKey: ["analytics-anomalies"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: workspaces } = await supabase
        .from("workspaces")
        .select("id")
        .order("created_at", { ascending: false })
        .limit(1);

      if (!workspaces?.[0]) return [];

      const { data, error } = await supabase
        .from("analytics_anomalies")
        .select("*")
        .eq("workspace_id", workspaces[0].id)
        .eq("is_dismissed", false)
        .order("detected_at", { ascending: false })
        .limit(2);

      if (error) throw error;
      return data || [];
    },
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
    return (
      <Card className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <Lightbulb className="h-5 w-5" style={{ color: 'rgba(255,255,255,0.8)' }} />
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
          <Sparkles className="h-5 w-5" style={{ color: 'rgba(255,255,255,0.8)' }} />
          <h3 className="text-lg font-semibold">AI Insights</h3>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/analytics">View All</Link>
        </Button>
      </div>
      <div className="space-y-3">
        {allInsights.slice(0, 3).map((insight, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              insight.severity === "error"
                ? "border-red-200 bg-red-50"
                : insight.severity === "warning"
                ? "border-yellow-200 bg-yellow-50"
                : ""
            }`}
            style={insight.severity !== "error" && insight.severity !== "warning" ? { borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)' } : undefined}
          >
            <div className="flex items-start gap-3">
              <insight.icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                insight.severity === "error"
                  ? "text-red-600"
                  : insight.severity === "warning"
                  ? "text-yellow-600"
                  : ""
              }`} style={insight.severity !== "error" && insight.severity !== "warning" ? { color: 'rgba(255,255,255,0.8)' } : undefined} />
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