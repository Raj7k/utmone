import { PlanTier, PLAN_CONFIG } from './planConfig';

export type DiscountType = 'percentage' | 'fixed' | 'free';
export type BillingCycle = 'monthly' | 'annual';

// ============================================
// ANNUAL BILLING DISCOUNTS
// ============================================
export interface AnnualDiscount {
  tier: PlanTier;
  percentOff: number;
  enabled: boolean;
}

export const ANNUAL_DISCOUNTS: AnnualDiscount[] = [
  { tier: 'starter', percentOff: 10, enabled: true },
  { tier: 'growth', percentOff: 15, enabled: true },
  { tier: 'business', percentOff: 20, enabled: true },
];

// ============================================
// PROMOTIONAL DISCOUNTS
// ============================================
export interface PromoDiscount {
  code: string;
  name: string;
  type: DiscountType;
  value: number;
  applicableTiers: PlanTier[];
  applicableCycles: BillingCycle[];
  validFrom: string;
  validUntil: string;
  maxRedemptions: number | null;
  currentRedemptions: number;
  enabled: boolean;
  badge?: string;
  description?: string;
}

export const PROMO_DISCOUNTS: PromoDiscount[] = [
  {
    code: 'LAUNCH20',
    name: 'launch discount',
    type: 'percentage',
    value: 20,
    applicableTiers: ['starter', 'growth', 'business'],
    applicableCycles: ['monthly', 'annual'],
    validFrom: '2025-01-01',
    validUntil: '2025-03-31',
    maxRedemptions: 500,
    currentRedemptions: 0,
    enabled: false,
    badge: '🚀 launch offer',
    description: '20% off your first 3 months',
  },
  {
    code: 'BLACKFRIDAY',
    name: 'black friday',
    type: 'percentage',
    value: 40,
    applicableTiers: ['starter', 'growth', 'business'],
    applicableCycles: ['annual'],
    validFrom: '2025-11-20',
    validUntil: '2025-12-02',
    maxRedemptions: 100,
    currentRedemptions: 0,
    enabled: false,
    badge: '🔥 black friday',
    description: '40% off annual plans',
  },
];

// ============================================
// FIRST-PERIOD DISCOUNTS
// ============================================
export interface FirstPeriodDiscount {
  tier: PlanTier;
  type: DiscountType;
  value: number;
  periods: number;
  enabled: boolean;
  description?: string;
}

export const FIRST_PERIOD_DISCOUNTS: FirstPeriodDiscount[] = [
  { tier: 'starter', type: 'percentage', value: 25, periods: 1, enabled: false, description: '25% off first month' },
  { tier: 'growth', type: 'percentage', value: 50, periods: 1, enabled: false, description: '50% off first month' },
  { tier: 'business', type: 'free', value: 100, periods: 1, enabled: false, description: 'first month free' },
];

// ============================================
// VOLUME DISCOUNTS (for add-ons)
// ============================================
export interface VolumeDiscount {
  addonKey: string;
  minQuantity: number;
  percentOff: number;
  enabled: boolean;
}

export const VOLUME_DISCOUNTS: VolumeDiscount[] = [
  { addonKey: 'extra_links', minQuantity: 3, percentOff: 10, enabled: true },
  { addonKey: 'extra_domains', minQuantity: 5, percentOff: 15, enabled: true },
  { addonKey: 'extra_clicks', minQuantity: 3, percentOff: 10, enabled: true },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get annual discount config for a tier
 */
export function getAnnualDiscountForTier(tier: PlanTier): AnnualDiscount | undefined {
  return ANNUAL_DISCOUNTS.find(d => d.tier === tier && d.enabled);
}

/**
 * Calculate discounted price for annual billing
 */
export function getAnnualDiscountedPrice(tier: PlanTier, basePrice: number): number {
  const discount = getAnnualDiscountForTier(tier);
  if (!discount || basePrice === 0) return basePrice;
  return Math.round(basePrice * (1 - discount.percentOff / 100));
}

/**
 * Calculate annual savings amount
 */
export function getAnnualSavings(tier: PlanTier, basePrice: number): number {
  const discountedPrice = getAnnualDiscountedPrice(tier, basePrice);
  return (basePrice - discountedPrice) * 12;
}

/**
 * Get max annual discount percentage across all tiers
 */
export function getMaxAnnualDiscount(): number {
  const enabledDiscounts = ANNUAL_DISCOUNTS.filter(d => d.enabled);
  if (enabledDiscounts.length === 0) return 0;
  return Math.max(...enabledDiscounts.map(d => d.percentOff));
}

/**
 * Validate and return promo code if valid
 */
export function validatePromoCode(
  code: string, 
  tier: PlanTier, 
  cycle: BillingCycle
): PromoDiscount | null {
  const now = new Date();
  const promo = PROMO_DISCOUNTS.find(p => 
    p.code.toUpperCase() === code.toUpperCase() && 
    p.enabled &&
    p.applicableTiers.includes(tier) &&
    p.applicableCycles.includes(cycle) &&
    now >= new Date(p.validFrom) &&
    now <= new Date(p.validUntil) &&
    (p.maxRedemptions === null || p.currentRedemptions < p.maxRedemptions)
  );
  return promo || null;
}

/**
 * Get active promotions for display
 */
export function getActivePromotions(): PromoDiscount[] {
  const now = new Date();
  return PROMO_DISCOUNTS.filter(p => 
    p.enabled && 
    new Date(p.validFrom) <= now && 
    new Date(p.validUntil) >= now &&
    (p.maxRedemptions === null || p.currentRedemptions < p.maxRedemptions)
  );
}

/**
 * Get first-period discount for a tier
 */
export function getFirstPeriodDiscount(tier: PlanTier): FirstPeriodDiscount | undefined {
  return FIRST_PERIOD_DISCOUNTS.find(d => d.tier === tier && d.enabled);
}

/**
 * Get volume discount for an addon
 */
export function getVolumeDiscount(addonKey: string, quantity: number): VolumeDiscount | undefined {
  return VOLUME_DISCOUNTS.find(d => 
    d.addonKey === addonKey && 
    d.enabled && 
    quantity >= d.minQuantity
  );
}

/**
 * Calculate final price with all applicable discounts
 */
export function calculateFinalPrice(
  tier: PlanTier, 
  basePrice: number, 
  cycle: BillingCycle,
  promoCode?: string
): { 
  price: number; 
  savings: number; 
  appliedDiscounts: string[];
  originalPrice: number;
} {
  if (basePrice === 0) {
    return { price: 0, savings: 0, appliedDiscounts: [], originalPrice: 0 };
  }

  let price = basePrice;
  const appliedDiscounts: string[] = [];
  const originalPrice = basePrice;

  // Apply annual discount first
  if (cycle === 'annual') {
    const annualDiscount = getAnnualDiscountForTier(tier);
    if (annualDiscount) {
      price = getAnnualDiscountedPrice(tier, basePrice);
      appliedDiscounts.push(`${annualDiscount.percentOff}% annual discount`);
    }
  }

  // Apply promo code on top
  if (promoCode) {
    const promo = validatePromoCode(promoCode, tier, cycle);
    if (promo) {
      if (promo.type === 'percentage') {
        price = Math.round(price * (1 - promo.value / 100));
        appliedDiscounts.push(`${promo.value}% promo (${promo.code})`);
      } else if (promo.type === 'fixed') {
        price = Math.max(0, price - promo.value);
        appliedDiscounts.push(`$${promo.value} off (${promo.code})`);
      }
    }
  }

  return {
    price,
    savings: originalPrice - price,
    appliedDiscounts,
    originalPrice,
  };
}

/**
 * Generate discount-related FAQ content
 */
export function generateDiscountFAQs() {
  const maxDiscount = getMaxAnnualDiscount();
  const growthPlan = PLAN_CONFIG.growth;
  const businessPlan = PLAN_CONFIG.business;
  
  const growthSavings = getAnnualSavings('growth', growthPlan.price as number);
  const businessSavings = getAnnualSavings('business', businessPlan.price as number);

  return [
    {
      question: 'do you offer annual discounts?',
      answer: `yes! save up to ${maxDiscount}% with annual billing. growth saves $${growthSavings}/year, business saves $${businessSavings}/year.`,
    },
    {
      question: 'can i use promo codes?',
      answer: `yes, we occasionally offer promotional discounts. enter your code at checkout to see your savings. promo codes can be combined with annual billing discounts.`,
    },
    {
      question: 'do you offer volume discounts?',
      answer: `yes! when purchasing multiple add-on packs (links, domains, or clicks), you'll receive automatic volume discounts starting at 3+ packs.`,
    },
  ];
}
