export type PlanTier = 'free' | 'pro' | 'business' | 'enterprise' | 'lifetime';

export interface PlanFeatures {
  monthlyLinks: number | 'unlimited';
  customDomains: number | 'unlimited';
  monthlyClicks: number | 'unlimited';
  analyticsRetentionDays: number | 'unlimited';
  apiAccess: boolean;
  teamMembers: 'unlimited';
  prioritySupport?: boolean;
  whiteLabel?: boolean;
  sso?: boolean;
  sla?: boolean;
  dedicatedSupport?: boolean;
}

export interface PlanDetails {
  name: string;
  tier: PlanTier;
  price: number | 'custom' | null;
  billingPeriod: 'monthly' | 'annual' | 'lifetime' | null;
  description: string;
  features: PlanFeatures;
  cta: string;
  popular?: boolean;
  badge?: string;
}

export const PLAN_CONFIG: Record<PlanTier, PlanDetails> = {
  free: {
    name: 'free',
    tier: 'free',
    price: 0,
    billingPeriod: 'monthly',
    description: 'for individuals testing utm.one',
    features: {
      monthlyLinks: 100,
      customDomains: 5,
      monthlyClicks: 10000,
      analyticsRetentionDays: 90,
      apiAccess: true,
      teamMembers: 'unlimited',
    },
    cta: 'get started free',
  },
  pro: {
    name: 'pro',
    tier: 'pro',
    price: 15,
    billingPeriod: 'monthly',
    description: 'for solo creators and small teams',
    features: {
      monthlyLinks: 1000,
      customDomains: 'unlimited',
      monthlyClicks: 100000,
      analyticsRetentionDays: 365,
      apiAccess: true,
      teamMembers: 'unlimited',
      prioritySupport: true,
    },
    cta: 'start pro trial',
    popular: true,
    badge: 'most popular',
  },
  business: {
    name: 'business',
    tier: 'business',
    price: 49,
    billingPeriod: 'monthly',
    description: 'for startups and growing companies',
    features: {
      monthlyLinks: 10000,
      customDomains: 'unlimited',
      monthlyClicks: 'unlimited',
      analyticsRetentionDays: 1095,
      apiAccess: true,
      teamMembers: 'unlimited',
      whiteLabel: true,
      prioritySupport: true,
    },
    cta: 'start business trial',
  },
  enterprise: {
    name: 'enterprise',
    tier: 'enterprise',
    price: 'custom',
    billingPeriod: null,
    description: 'for large organizations with custom needs',
    features: {
      monthlyLinks: 'unlimited',
      customDomains: 'unlimited',
      monthlyClicks: 'unlimited',
      analyticsRetentionDays: 'unlimited',
      apiAccess: true,
      teamMembers: 'unlimited',
      sso: true,
      sla: true,
      dedicatedSupport: true,
    },
    cta: 'contact sales',
  },
  lifetime: {
    name: 'lifetime deal',
    tier: 'lifetime',
    price: 299,
    billingPeriod: 'lifetime',
    description: 'pro features forever (limited availability)',
    features: {
      monthlyLinks: 1000,
      customDomains: 'unlimited',
      monthlyClicks: 100000,
      analyticsRetentionDays: 365,
      apiAccess: true,
      teamMembers: 'unlimited',
      prioritySupport: true,
    },
    cta: 'claim lifetime deal',
    badge: 'limited time',
  },
};

export const COMPETITOR_COMPARISON = [
  {
    feature: 'Monthly Links',
    free: { utm: '100', bitly: '25', rebrandly: '25', short: '50' },
    paid: { utm: '1,000', bitly: '500', rebrandly: '500', short: '1,000' },
  },
  {
    feature: 'Custom Domains',
    free: { utm: '5', bitly: '0', rebrandly: '1', short: '1' },
    paid: { utm: 'unlimited', bitly: '1', rebrandly: '3', short: '5' },
  },
  {
    feature: 'Team Members',
    free: { utm: 'unlimited', bitly: '1', rebrandly: '1', short: '1' },
    paid: { utm: 'unlimited', bitly: '1', rebrandly: '1', short: '3' },
  },
  {
    feature: 'API Access',
    free: { utm: '✓', bitly: '✗', rebrandly: '✗', short: '✗' },
    paid: { utm: '✓', bitly: '✓', rebrandly: '✓', short: '✓' },
  },
  {
    feature: 'Analytics Retention',
    free: { utm: '90 days', bitly: '30 days', rebrandly: '30 days', short: '60 days' },
    paid: { utm: '1 year', bitly: '1 year', rebrandly: '6 months', short: '1 year' },
  },
  {
    feature: 'Monthly Price',
    free: { utm: '$0', bitly: '$0', rebrandly: '$0', short: '$0' },
    paid: { utm: '$15', bitly: '$35', rebrandly: '$39', short: '$25' },
  },
];
