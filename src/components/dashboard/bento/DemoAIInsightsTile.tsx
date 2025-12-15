import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DEMO_AI_INSIGHTS_DATA, getDemoFeaturesForPlan } from "@/hooks/useDemoMode";
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, Zap, Lock, ArrowRight } from "lucide-react";
import { PlanTier } from "@/lib/planConfig";
import { Link } from "react-router-dom";

interface DemoAIInsightsTileProps {
  planTier?: PlanTier;
}

const getInsightIcon = (type: string) => {
  switch (type) {
    case "opportunity": return TrendingUp;
    case "warning": return AlertTriangle;
    case "pattern": return Lightbulb;
    case "anomaly": return Zap;
    default: return Sparkles;
  }
};

export const DemoAIInsightsTile = ({ planTier = 'free' }: DemoAIInsightsTileProps) => {
  const features = getDemoFeaturesForPlan(planTier);
  const visibleInsights = planTier === 'free' ? DEMO_AI_INSIGHTS_DATA.slice(0, 2) : DEMO_AI_INSIGHTS_DATA;
  const lockedCount = planTier === 'free' ? DEMO_AI_INSIGHTS_DATA.length - 2 : 0;

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
            ai insights
          </CardTitle>
          <Badge variant="outline" className="bg-white/10 text-white border-white/20">demo · {planTier}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {visibleInsights.map((insight, index) => {
          const Icon = getInsightIcon(insight.type);
          return (
            <div
              key={index}
              className={`p-3 rounded-lg border animate-fade-in ${
                insight.severity === "warning" ? "border-yellow-500/30 bg-yellow-500/5" : "border-border bg-muted/30"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-3">
                <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                  insight.severity === "warning" ? "text-yellow-600 dark:text-yellow-500" : "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm mb-1">{insight.title}</p>
                  <p className="text-xs text-muted-foreground mb-2">{insight.description}</p>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" asChild>
                    <Link to={insight.action.url}>{insight.action.label}<ArrowRight className="h-3 w-3 ml-1" /></Link>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        {lockedCount > 0 && (
          <div className="p-3 rounded-lg bg-muted/20 border border-dashed border-border animate-fade-in" style={{ animationDelay: "300ms" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="h-3.5 w-3.5" />
                <span>+{lockedCount} more insights</span>
              </div>
              <Badge variant="outline" className="text-xs">starter+</Badge>
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center pt-2">create links to see real insights based on your data</p>
      </CardContent>
    </Card>
  );
};
