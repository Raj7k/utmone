import { useAdminSimulation } from "@/contexts/AdminSimulationContext";
import { useWorkspace } from "./useWorkspace";
import { PlanTier } from "@/lib/planConfig";

/**
 * Hook to get the currently active plan tier
 * Respects admin simulation override
 */
export const useCurrentPlan = () => {
  const { simulatedPlan } = useAdminSimulation();
  const { currentWorkspace } = useWorkspace();

  // CRITICAL: Return simulation if it exists, otherwise return real DB plan
  const activePlan: PlanTier = (simulatedPlan || currentWorkspace?.plan_tier || 'free') as PlanTier;

  return {
    id: activePlan,
    isFree: activePlan === 'free',
    isPro: activePlan === 'pro',
    isBusiness: activePlan === 'business',
    isEnterprise: activePlan === 'enterprise',
    isPaidTier: activePlan !== 'free',
    displayName: activePlan.charAt(0).toUpperCase() + activePlan.slice(1),
  };
};
