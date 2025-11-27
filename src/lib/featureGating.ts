/**
 * Feature Gating Utilities
 * Plan tier hierarchy and comparison helpers
 */

export type PlanTier = 'free' | 'pro' | 'business' | 'enterprise';

// Plan tier hierarchy for comparison (higher number = more features)
const PLAN_HIERARCHY: Record<PlanTier, number> = {
  'free': 0,
  'pro': 1,
  'business': 2,
  'enterprise': 3,
};

/**
 * Check if user's plan meets minimum requirement
 * @param userPlan - User's current plan tier
 * @param minPlan - Minimum required plan tier
 * @returns true if user's plan >= minimum required plan
 */
export function hasMinPlanTier(userPlan: string, minPlan: string): boolean {
  const userLevel = PLAN_HIERARCHY[userPlan as PlanTier] ?? -1;
  const minLevel = PLAN_HIERARCHY[minPlan as PlanTier] ?? 999;
  return userLevel >= minLevel;
}

/**
 * Get the next plan tier for upgrade messaging
 */
export function getNextPlanTier(currentPlan: string): PlanTier | null {
  const planOrder: PlanTier[] = ['free', 'pro', 'business', 'enterprise'];
  const currentIndex = planOrder.indexOf(currentPlan as PlanTier);
  
  if (currentIndex === -1 || currentIndex === planOrder.length - 1) {
    return null; // Already at highest tier or invalid plan
  }
  
  return planOrder[currentIndex + 1];
}
