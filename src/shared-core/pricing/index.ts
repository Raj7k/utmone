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
  formatPlanPrice,
  getCompetitorComparison,
  getPricingMetaDescription,
} from '@/lib/planConfig';

export {
  ADDONS_CONFIG,
} from '@/lib/addonsConfig';

export {
  LIFETIME_DEAL_CONFIG,
  TRUST_INDICATORS,
  generatePricingFAQs,
  getLifetimeDealDescription,
  getLLMPricingData,
  getMaxAnnualDiscountDisplay,
} from '@/lib/pricingPageConfig';
