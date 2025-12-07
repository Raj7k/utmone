export type PlanTier = 'free' | 'growth' | 'business' | 'enterprise';

// Feature categories for organized display
export interface FeatureCategory {
  name: string;
  features: {
    key: string;
    label: string;
    free: boolean | string | number;
    growth: boolean | string | number;
    business: boolean | string | number;
    enterprise: boolean | string | number;
  }[];
}

export interface PlanFeatures {
  // Limits
  monthlyLinks: number | 'unlimited';
  customDomains: number | 'unlimited';
  monthlyClicks: number | 'unlimited';
  teamMembers: number | 'unlimited';
  qrMonthlyLimit: number | 'unlimited';
  analyticsRetentionDays: number | 'unlimited';
  
  // Link Intelligence
  shortLinks: boolean;
  utmBuilder: boolean;
  basicQr: boolean;
  brandedQr: boolean;
  linkExpiry: boolean;
  passwordProtection: boolean;
  geoTargeting: boolean;
  smartRouting: boolean;
  linkImmunity: boolean;
  
  // Analytics & Attribution
  clickAnalytics: boolean;
  deviceBrowser: boolean;
  referrerTracking: boolean;
  attributionModels: boolean;
  journeyAnalytics: boolean;
  predictiveAnalytics: boolean;
  identityGraph: boolean;
  liftAnalysis: boolean;
  offlineImport: boolean;
  
  // Team & Governance
  teamRoles: boolean;
  campaigns: boolean;
  bulkCreate: boolean;
  approvalWorkflows: boolean;
  auditLogs: boolean;
  ssoSaml: boolean;
  whiteLabel: boolean;
  
  // Integrations
  apiAccess: boolean;
  webhooks: boolean;
  ga4Integration: boolean;
  customIntegrations: boolean;
  dedicatedCsm: boolean;
  customSla: boolean;
  
  // QR Features
  canRemoveQRWatermark: boolean;
  canExportSVG: boolean;
  canExportPDF: boolean;
  canUploadLogo: boolean;
  canUseGradients: boolean;
  canUseAdvancedShapes: boolean;
  canBulkGenerateQR: boolean;
  canSaveQRTemplates: boolean;
  qrMaxResolution: number;
}

export interface PlanDetails {
  name: string;
  tier: PlanTier;
  price: number | 'custom';
  billingPeriod: 'monthly' | 'annual' | null;
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
    description: 'for individuals getting started',
    features: {
      // Limits
      monthlyLinks: 25,
      customDomains: 0,
      monthlyClicks: 1000,
      teamMembers: 1,
      qrMonthlyLimit: 5,
      analyticsRetentionDays: 30,
      
      // Link Intelligence
      shortLinks: true,
      utmBuilder: true,
      basicQr: true,
      brandedQr: false,
      linkExpiry: false,
      passwordProtection: false,
      geoTargeting: false,
      smartRouting: false,
      linkImmunity: false,
      
      // Analytics & Attribution
      clickAnalytics: true,
      deviceBrowser: false,
      referrerTracking: false,
      attributionModels: false,
      journeyAnalytics: false,
      predictiveAnalytics: false,
      identityGraph: false,
      liftAnalysis: false,
      offlineImport: false,
      
      // Team & Governance
      teamRoles: false,
      campaigns: false,
      bulkCreate: false,
      approvalWorkflows: false,
      auditLogs: false,
      ssoSaml: false,
      whiteLabel: false,
      
      // Integrations
      apiAccess: false,
      webhooks: false,
      ga4Integration: false,
      customIntegrations: false,
      dedicatedCsm: false,
      customSla: false,
      
      // QR Features
      canRemoveQRWatermark: false,
      canExportSVG: false,
      canExportPDF: false,
      canUploadLogo: false,
      canUseGradients: false,
      canUseAdvancedShapes: false,
      canBulkGenerateQR: false,
      canSaveQRTemplates: false,
      qrMaxResolution: 512,
    },
    cta: 'get started free',
  },
  growth: {
    name: 'growth',
    tier: 'growth',
    price: 49,
    billingPeriod: 'monthly',
    description: 'for startups and small teams',
    features: {
      // Limits
      monthlyLinks: 1000,
      customDomains: 3,
      monthlyClicks: 100000,
      teamMembers: 5,
      qrMonthlyLimit: 100,
      analyticsRetentionDays: 365,
      
      // Link Intelligence
      shortLinks: true,
      utmBuilder: true,
      basicQr: true,
      brandedQr: true,
      linkExpiry: true,
      passwordProtection: true,
      geoTargeting: true,
      smartRouting: false,
      linkImmunity: false,
      
      // Analytics & Attribution
      clickAnalytics: true,
      deviceBrowser: true,
      referrerTracking: true,
      attributionModels: true,
      journeyAnalytics: true,
      predictiveAnalytics: false,
      identityGraph: false,
      liftAnalysis: false,
      offlineImport: false,
      
      // Team & Governance
      teamRoles: true,
      campaigns: true,
      bulkCreate: true,
      approvalWorkflows: false,
      auditLogs: false,
      ssoSaml: false,
      whiteLabel: false,
      
      // Integrations
      apiAccess: true,
      webhooks: true,
      ga4Integration: true,
      customIntegrations: false,
      dedicatedCsm: false,
      customSla: false,
      
      // QR Features
      canRemoveQRWatermark: true,
      canExportSVG: true,
      canExportPDF: true,
      canUploadLogo: true,
      canUseGradients: true,
      canUseAdvancedShapes: true,
      canBulkGenerateQR: false,
      canSaveQRTemplates: true,
      qrMaxResolution: 2048,
    },
    cta: 'start growth',
    popular: true,
    badge: 'most popular',
  },
  business: {
    name: 'business',
    tier: 'business',
    price: 149,
    billingPeriod: 'monthly',
    description: 'for scaling companies',
    features: {
      // Limits
      monthlyLinks: 10000,
      customDomains: 10,
      monthlyClicks: 1000000,
      teamMembers: 25,
      qrMonthlyLimit: 500,
      analyticsRetentionDays: 730,
      
      // Link Intelligence
      shortLinks: true,
      utmBuilder: true,
      basicQr: true,
      brandedQr: true,
      linkExpiry: true,
      passwordProtection: true,
      geoTargeting: true,
      smartRouting: true,
      linkImmunity: false,
      
      // Analytics & Attribution
      clickAnalytics: true,
      deviceBrowser: true,
      referrerTracking: true,
      attributionModels: true,
      journeyAnalytics: true,
      predictiveAnalytics: true,
      identityGraph: false,
      liftAnalysis: false,
      offlineImport: false,
      
      // Team & Governance
      teamRoles: true,
      campaigns: true,
      bulkCreate: true,
      approvalWorkflows: true,
      auditLogs: true,
      ssoSaml: false,
      whiteLabel: false,
      
      // Integrations
      apiAccess: true,
      webhooks: true,
      ga4Integration: true,
      customIntegrations: false,
      dedicatedCsm: false,
      customSla: false,
      
      // QR Features
      canRemoveQRWatermark: true,
      canExportSVG: true,
      canExportPDF: true,
      canUploadLogo: true,
      canUseGradients: true,
      canUseAdvancedShapes: true,
      canBulkGenerateQR: true,
      canSaveQRTemplates: true,
      qrMaxResolution: 4096,
    },
    cta: 'start business',
  },
  enterprise: {
    name: 'enterprise',
    tier: 'enterprise',
    price: 'custom',
    billingPeriod: null,
    description: 'for large organizations',
    features: {
      // Limits
      monthlyLinks: 'unlimited',
      customDomains: 'unlimited',
      monthlyClicks: 'unlimited',
      teamMembers: 'unlimited',
      qrMonthlyLimit: 'unlimited',
      analyticsRetentionDays: 'unlimited',
      
      // Link Intelligence
      shortLinks: true,
      utmBuilder: true,
      basicQr: true,
      brandedQr: true,
      linkExpiry: true,
      passwordProtection: true,
      geoTargeting: true,
      smartRouting: true,
      linkImmunity: true,
      
      // Analytics & Attribution
      clickAnalytics: true,
      deviceBrowser: true,
      referrerTracking: true,
      attributionModels: true,
      journeyAnalytics: true,
      predictiveAnalytics: true,
      identityGraph: true,
      liftAnalysis: true,
      offlineImport: true,
      
      // Team & Governance
      teamRoles: true,
      campaigns: true,
      bulkCreate: true,
      approvalWorkflows: true,
      auditLogs: true,
      ssoSaml: true,
      whiteLabel: true,
      
      // Integrations
      apiAccess: true,
      webhooks: true,
      ga4Integration: true,
      customIntegrations: true,
      dedicatedCsm: true,
      customSla: true,
      
      // QR Features
      canRemoveQRWatermark: true,
      canExportSVG: true,
      canExportPDF: true,
      canUploadLogo: true,
      canUseGradients: true,
      canUseAdvancedShapes: true,
      canBulkGenerateQR: true,
      canSaveQRTemplates: true,
      qrMaxResolution: 4096,
    },
    cta: 'contact sales',
  },
};

// Feature categories for pricing table display
export const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    name: 'link intelligence',
    features: [
      { key: 'monthlyLinks', label: 'monthly links', free: 25, growth: '1,000', business: '10,000', enterprise: 'unlimited' },
      { key: 'customDomains', label: 'custom domains', free: 0, growth: 3, business: 10, enterprise: 'unlimited' },
      { key: 'utmBuilder', label: 'utm builder', free: true, growth: true, business: true, enterprise: true },
      { key: 'linkExpiry', label: 'link expiration', free: false, growth: true, business: true, enterprise: true },
      { key: 'passwordProtection', label: 'password protection', free: false, growth: true, business: true, enterprise: true },
      { key: 'geoTargeting', label: 'geo-targeting', free: false, growth: true, business: true, enterprise: true },
      { key: 'smartRouting', label: 'smart routing', free: false, growth: false, business: true, enterprise: true },
      { key: 'linkImmunity', label: 'link immunity', free: false, growth: false, business: false, enterprise: true },
    ],
  },
  {
    name: 'analytics & attribution',
    features: [
      { key: 'monthlyClicks', label: 'monthly clicks', free: '1K', growth: '100K', business: '1M', enterprise: 'unlimited' },
      { key: 'analyticsRetention', label: 'analytics retention', free: '30 days', growth: '1 year', business: '2 years', enterprise: 'unlimited' },
      { key: 'deviceBrowser', label: 'device & browser', free: false, growth: true, business: true, enterprise: true },
      { key: 'referrerTracking', label: 'referrer tracking', free: false, growth: true, business: true, enterprise: true },
      { key: 'attributionModels', label: 'attribution models', free: false, growth: true, business: true, enterprise: true },
      { key: 'journeyAnalytics', label: 'journey analytics', free: false, growth: true, business: true, enterprise: true },
      { key: 'predictiveAnalytics', label: 'predictive analytics', free: false, growth: false, business: true, enterprise: true },
      { key: 'identityGraph', label: 'identity graph', free: false, growth: false, business: false, enterprise: true },
      { key: 'liftAnalysis', label: 'lift analysis', free: false, growth: false, business: false, enterprise: true },
      { key: 'offlineImport', label: 'offline import', free: false, growth: false, business: false, enterprise: true },
    ],
  },
  {
    name: 'team & governance',
    features: [
      { key: 'teamMembers', label: 'team members', free: 1, growth: 5, business: 25, enterprise: 'unlimited' },
      { key: 'teamRoles', label: 'team roles', free: false, growth: true, business: true, enterprise: true },
      { key: 'campaigns', label: 'campaigns', free: false, growth: true, business: true, enterprise: true },
      { key: 'bulkCreate', label: 'bulk create', free: false, growth: true, business: true, enterprise: true },
      { key: 'approvalWorkflows', label: 'approval workflows', free: false, growth: false, business: true, enterprise: true },
      { key: 'auditLogs', label: 'audit logs', free: false, growth: false, business: true, enterprise: true },
      { key: 'ssoSaml', label: 'sso (saml)', free: false, growth: false, business: false, enterprise: true },
      { key: 'whiteLabel', label: 'white-label', free: false, growth: false, business: false, enterprise: true },
    ],
  },
  {
    name: 'integrations',
    features: [
      { key: 'apiAccess', label: 'api access', free: false, growth: true, business: true, enterprise: true },
      { key: 'webhooks', label: 'webhooks', free: false, growth: true, business: true, enterprise: true },
      { key: 'ga4Integration', label: 'ga4 integration', free: false, growth: true, business: true, enterprise: true },
      { key: 'customIntegrations', label: 'custom integrations', free: false, growth: false, business: false, enterprise: true },
      { key: 'dedicatedCsm', label: 'dedicated csm', free: false, growth: false, business: false, enterprise: true },
      { key: 'customSla', label: 'custom sla', free: false, growth: false, business: false, enterprise: true },
    ],
  },
  {
    name: 'qr codes',
    features: [
      { key: 'qrMonthlyLimit', label: 'qr codes/month', free: 5, growth: 100, business: 500, enterprise: 'unlimited' },
      { key: 'brandedQr', label: 'branded qr codes', free: false, growth: true, business: true, enterprise: true },
      { key: 'canRemoveQRWatermark', label: 'remove watermark', free: false, growth: true, business: true, enterprise: true },
      { key: 'canExportSVG', label: 'svg/pdf export', free: false, growth: true, business: true, enterprise: true },
      { key: 'canUploadLogo', label: 'logo upload', free: false, growth: true, business: true, enterprise: true },
      { key: 'canBulkGenerateQR', label: 'bulk generate', free: false, growth: false, business: true, enterprise: true },
    ],
  },
];

// Plan tier hierarchy for comparisons
export const PLAN_HIERARCHY: Record<PlanTier, number> = {
  free: 0,
  growth: 1,
  business: 2,
  enterprise: 3,
};

/**
 * Check if user's plan meets minimum requirement
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
  const planOrder: PlanTier[] = ['free', 'growth', 'business', 'enterprise'];
  const currentIndex = planOrder.indexOf(currentPlan as PlanTier);
  
  if (currentIndex === -1 || currentIndex === planOrder.length - 1) {
    return null;
  }
  
  return planOrder[currentIndex + 1];
}

/**
 * Format price for display
 */
export function formatPlanPrice(tier: PlanTier): string {
  const plan = PLAN_CONFIG[tier];
  if (plan.price === 'custom') return 'Custom';
  if (plan.price === 0) return 'Free';
  return `$${plan.price}`;
}

/**
 * Get SEO-friendly pricing description
 */
export function getPricingMetaDescription(): string {
  const free = PLAN_CONFIG.free;
  const growth = PLAN_CONFIG.growth;
  const business = PLAN_CONFIG.business;
  return `Simple pricing with generous limits. Free forever plan with ${free.features.monthlyLinks} links/month, Growth at $${growth.price}/month with ${growth.features.monthlyLinks.toLocaleString()} links, Business at $${business.price}/month with ${(business.features.monthlyLinks as number).toLocaleString()} links.`;
}

/**
 * Get competitor comparison data
 */
export function getCompetitorComparison() {
  return {
    utmOne: {
      name: `utm.one ${PLAN_CONFIG.growth.name}`,
      price: PLAN_CONFIG.growth.price as number,
      links: PLAN_CONFIG.growth.features.monthlyLinks as number,
      users: PLAN_CONFIG.growth.features.teamMembers as number,
      highlight: true,
    },
    bitly: {
      name: 'Bitly Pro',
      price: 35,
      links: 1500,
      users: 1,
      perUser: true,
    },
    rebrandly: {
      name: 'Rebrandly',
      price: 39,
      links: 5000,
      users: 1,
      perUser: true,
    },
  };
}

/**
 * Get all plan tiers in order
 */
export function getAllPlanTiers(): PlanTier[] {
  return ['free', 'growth', 'business', 'enterprise'];
}

/**
 * Get plan by tier
 */
export function getPlanByTier(tier: PlanTier): PlanDetails {
  return PLAN_CONFIG[tier];
}
