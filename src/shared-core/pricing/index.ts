/**
 * Shared Pricing Engine
 * Safe to import from both marketing and dashboard shells
 * NO data fetching, NO providers - just static config and pure functions
 */

// Re-export all pricing config - these are pure static data
export { 
  PLAN_CONFIG,
  FEATURE_CATEGORIES,
  type PlanTier,
  type PlanFeatures,
  type PlanDetails,
  type FeatureCategory,
} from '@/lib/planConfig';

export {
  ADDONS_CONFIG,
} from '@/lib/addonsConfig';
