import { PLAN_CONFIG, PlanTier } from './planConfig';
import { generateDiscountFAQs, getMaxAnnualDiscount } from './discountConfig';

export interface PricingFAQ {
  question: string;
  answer: string;
}

export interface LifetimeDealConfig {
  price: number;
  equivalentTier: PlanTier;
  limitedTo: number;
  enabled: boolean;
  badge: string;
}

/**
 * Lifetime deal configuration - single source of truth
 */
export const LIFETIME_DEAL_CONFIG: LifetimeDealConfig = {
  price: 299,
  equivalentTier: 'growth',
  limitedTo: 500,
  enabled: true,
  badge: '🔥 limited time offer',
};

/**
 * Generate dynamic FAQs based on plan config and discount config
 */
export function generatePricingFAQs(): PricingFAQ[] {
  const free = PLAN_CONFIG.free;
  const starter = PLAN_CONFIG.starter;
  const growth = PLAN_CONFIG.growth;
  const business = PLAN_CONFIG.business;
  
const baseFAQs: PricingFAQ[] = [
    {
      question: 'what happens if i exceed my plan limits?',
      answer: `we'll notify you when you're approaching your limits. you can upgrade anytime to increase your capacity. existing links continue working—we never break your links.`,
    },
    {
      question: 'what are link pages?',
      answer: `link pages are customizable link-in-bio landing pages. free plan includes ${free.features.linkPages} page with basic themes and utm tagging. growth includes ${growth.features.linkPages} pages with advanced themes, scheduled publish, and full analytics. business has unlimited pages with workspace governance, export, and branded domains (coming soon).`,
    },
    {
      question: 'what is one-tap and how does it work?',
      answer: `one-tap is our universal badge scanner that works at any event. it reads qr codes natively, falls back to ai ocr for encrypted badges, and works offline. leads sync automatically when you're back online.`,
    },
    {
      question: 'can one-tap replace my hardware scanners?',
      answer: `yes! one-tap runs on your phone and can read any badge format. it includes ai enrichment to find missing emails—something hardware scanners can't do. at $79/month, it's a fraction of renting $5,000 hardware scanners.`,
    },
    {
      question: 'how many team members can i add?',
      answer: `free plan supports ${free.features.teamMembers} member, starter supports ${starter.features.teamMembers} members, growth supports ${growth.features.teamMembers} members, business supports ${business.features.teamMembers} members. enterprise has unlimited—contact us for details.`,
    },
    {
      question: 'can i cancel anytime?',
      answer: `absolutely. cancel anytime with no penalties. your links will continue working, and you'll have read-only access to your analytics.`,
    },
    {
      question: 'is the lifetime deal really lifetime?',
      answer: `yes. pay once, use forever. even if we shut down, we guarantee your links will continue working through our permanence guarantee.`,
    },
    {
      question: 'what analytics retention do i get?',
      answer: `free plan keeps analytics for ${free.features.analyticsRetentionDays} days, starter for ${Math.round((starter.features.analyticsRetentionDays as number) / 365)} year, growth for ${Math.round((growth.features.analyticsRetentionDays as number) / 365)} year, business for ${Math.round((business.features.analyticsRetentionDays as number) / 365)} years. enterprise has unlimited retention—contact us.`,
    },
    {
      question: 'do you offer custom domains?',
      answer: `yes! free plan doesn't include custom domains, starter includes ${starter.features.customDomains} domain, growth includes ${growth.features.customDomains} domains, business includes ${business.features.customDomains} domains. enterprise has unlimited—contact us.`,
    },
  ];

  // Add discount-related FAQs
  const discountFAQs = generateDiscountFAQs();
  
  return [...baseFAQs, ...discountFAQs];
}

/**
 * Get the maximum annual discount for display
 */
export function getMaxAnnualDiscountDisplay(): string {
  const maxDiscount = getMaxAnnualDiscount();
  return `${maxDiscount}%`;
}

/**
 * Trust indicators for pricing page
 */
export const TRUST_INDICATORS = [
  { text: 'no credit card required', icon: 'check' },
  { text: 'cancel anytime', icon: 'check' },
  { text: '99.9% uptime', icon: 'check' },
] as const;

/**
 * Get lifetime deal description
 */
export function getLifetimeDealDescription(): string {
  const equivalentPlan = PLAN_CONFIG[LIFETIME_DEAL_CONFIG.equivalentTier];
  return `get ${equivalentPlan.name} features forever with a one-time payment. limited to first ${LIFETIME_DEAL_CONFIG.limitedTo} customers.`;
}

/**
 * Get LLM schema data for pricing page
 */
export function getLLMPricingData() {
  const growth = PLAN_CONFIG.growth;
  return {
    planName: `utm.one ${growth.name}`,
    price: String(growth.price),
    validUntil: '2026-12-31',
  };
}
