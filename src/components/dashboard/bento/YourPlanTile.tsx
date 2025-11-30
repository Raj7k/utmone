import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Crown } from "lucide-react";
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

  // Safe data access with defaults
  const planConfig = limits ? PLAN_CONFIG[limits.planTier] : null;
  const monthlyLinks = limits?.limits.monthlyLinks;
  const linksUsed = limits?.currentUsage.linksThisMonth ?? 0;
  
  const usagePercentage = 
    limits && typeof monthlyLinks === 'number' && monthlyLinks > 0
      ? Math.min((linksUsed / monthlyLinks) * 100, 100)
      : 0;

  const showUpgrade = limits?.planTier === 'free';

  const daysUntilReset = 30 - new Date().getDate();

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Crown className="h-5 w-5 text-primary" />
        <h3 className="text-title-3 font-display">Your Plan</h3>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-3 flex-1">
          <div className="h-6 bg-muted rounded w-1/2" />
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-2 bg-muted rounded" />
        </div>
      ) : limits && planConfig ? (
        <div className="space-y-3 flex-1 flex flex-col justify-between">
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

          <div className="flex flex-col items-center py-2">
            <CircularProgress value={usagePercentage} size={80} strokeWidth={6} />
            <p className="text-caption-1 text-secondary-label mt-2 tracking-tight">
              <span className="font-semibold">{linksUsed}</span> / {
                typeof monthlyLinks === 'number' 
                  ? monthlyLinks 
                  : '∞'
              } links
            </p>
            <p className="text-caption-2 text-tertiary-label mt-1">
              Resets in {daysUntilReset} days
            </p>
          </div>

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
              onClick={() => navigate('/settings?tab=billing')}
            >
              Manage Plan
            </Button>
          )}
        </div>
      ) : (
        <p className="text-caption-2 text-tertiary-label flex-1">Unable to load plan data</p>
      )}
    </div>
  );
};
