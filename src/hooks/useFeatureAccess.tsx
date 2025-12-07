import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { usePlanLimits } from "./usePlanLimits";
import { PlanTier } from "@/lib/planConfig";

export interface FeatureCheckResult {
  allowed: boolean;
  reason?: string;
  currentPlan: PlanTier;
  requiredPlan?: PlanTier;
}

const PLAN_HIERARCHY: Record<PlanTier, number> = {
  free: 0,
  growth: 1,
  business: 2,
  enterprise: 3,
};

/**
 * Hook to check if user has access to a specific feature
 * Queries feature_gates table and compares against current plan tier
 */
export const useFeatureAccess = (featureKey: string): FeatureCheckResult & { isLoading: boolean } => {
  const { planTier, isLoading: planLoading } = usePlanLimits();

  const { data: featureGate, isLoading: gateLoading } = useQuery({
    queryKey: ['feature-gate', featureKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feature_gates')
        .select('*')
        .eq('feature_key', featureKey)
        .single();

      if (error) throw error;
      return data;
    },
    staleTime: 60000, // 1 minute - feature gates rarely change
  });

  const isLoading = planLoading || gateLoading;

  // If feature gate doesn't exist, allow access (feature is unrestricted)
  if (!featureGate && !gateLoading) {
    return {
      allowed: true,
      currentPlan: planTier as PlanTier,
      isLoading: false,
    };
  }

  if (isLoading || !featureGate) {
    return {
      allowed: false,
      currentPlan: planTier as PlanTier,
      isLoading: true,
    };
  }

  const minTier = featureGate.min_plan_tier as PlanTier;
  const currentLevel = PLAN_HIERARCHY[planTier as PlanTier] || 0;
  const requiredLevel = PLAN_HIERARCHY[minTier] || 0;

  const allowed = currentLevel >= requiredLevel;

  return {
    allowed,
    reason: allowed ? undefined : `This feature requires ${minTier} plan or higher`,
    currentPlan: planTier as PlanTier,
    requiredPlan: minTier,
    isLoading: false,
  };
};
