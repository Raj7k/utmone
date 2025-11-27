import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Crown, TrendingUp } from "lucide-react";
import { useWorkspace } from "@/hooks/useWorkspace";
import { checkPlanLimits } from "@/lib/planEnforcement";
import { PLAN_CONFIG, PlanTier } from "@/lib/planConfig";
import { useNavigate } from "react-router-dom";
import { useCurrentPlan } from "@/hooks/useCurrentPlan";

export const YourPlanTile = () => {
  const { currentWorkspace } = useWorkspace();
  const navigate = useNavigate();
  const { id: currentPlanId } = useCurrentPlan();

  const { data: limits, isLoading } = useQuery({
    queryKey: ["plan-limits", currentWorkspace?.id, currentPlanId],
    enabled: !!currentWorkspace?.id,
    queryFn: async () => {
      if (!currentWorkspace?.id) throw new Error("No workspace");
      // Pass simulated plan if it exists (from localStorage)
      const simulatedPlan = localStorage.getItem('SIMULATED_PLAN');
      return checkPlanLimits(currentWorkspace.id, simulatedPlan as PlanTier | undefined);
    },
  });

  const planConfig = limits ? PLAN_CONFIG[limits.planTier] : null;
  const usagePercentage = 
    limits && typeof limits.limits.monthlyLinks === 'number'
      ? Math.min((limits.currentUsage.linksThisMonth / limits.limits.monthlyLinks) * 100, 100)
      : 0;

  const showUpgrade = limits && limits.planTier === 'free';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Crown className="h-5 w-5 text-primary" />
        <h3 className="text-title-3 font-display">Your Plan</h3>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-slate-200 rounded w-1/2" />
          <div className="h-4 bg-slate-200 rounded w-3/4" />
          <div className="h-2 bg-slate-200 rounded" />
        </div>
      ) : limits && planConfig ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize">
              {planConfig.name}
            </Badge>
            {planConfig.popular && (
              <Badge className="bg-system-blue">
                Popular
              </Badge>
            )}
          </div>

          <div className="flex flex-col items-center py-4">
            <CircularProgress value={usagePercentage} size={100} strokeWidth={6} />
            <p className="text-caption-1 text-secondary-label mt-3">
              {limits.currentUsage.linksThisMonth} / {
                typeof limits.limits.monthlyLinks === 'number' 
                  ? limits.limits.monthlyLinks 
                  : '∞'
              } links
            </p>
          </div>

          {limits.currentUsage.clicksThisMonth !== undefined && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-system-green" />
                <span className="text-caption-1 text-secondary-label">Clicks this month</span>
              </div>
              <span className="text-body-apple font-medium text-label">
                {limits.currentUsage.clicksThisMonth.toLocaleString()}
              </span>
            </div>
          )}

          {showUpgrade && (
            <Button
              className="w-full"
              onClick={() => navigate('/pricing')}
            >
              Upgrade to Pro
            </Button>
          )}

          {!showUpgrade && (
            <Button
              variant="system-secondary"
              className="w-full"
              onClick={() => navigate('/settings')}
            >
              Manage Plan
            </Button>
          )}
        </div>
      ) : (
        <p className="text-caption-2 text-tertiary-label">Unable to load plan data</p>
      )}
    </div>
  );
};
