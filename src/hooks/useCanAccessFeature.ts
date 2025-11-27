import { useWorkspace } from "./useWorkspace";
import { useFeatureGates } from "./useFeatureGates";
import { hasMinPlanTier } from "@/lib/featureGating";

/**
 * Simple hook to check if user can access a specific feature
 * @param featureKey - The feature_key from feature_gates table
 * @returns Object with access status and minimum plan required
 */
export const useCanAccessFeature = (featureKey: string) => {
  const { currentWorkspace } = useWorkspace();
  const { data: gates, isLoading } = useFeatureGates();
  
  const gate = gates?.find(g => g.feature_key === featureKey);
  const userPlan = currentWorkspace?.plan_tier || 'free';
  
  const allowed = gate 
    ? hasMinPlanTier(userPlan, gate.min_plan_tier)
    : true; // If feature not in registry, allow by default
  
  return {
    allowed,
    minPlanRequired: gate?.min_plan_tier,
    description: gate?.description,
    currentPlan: userPlan,
    isLoading,
  };
};
