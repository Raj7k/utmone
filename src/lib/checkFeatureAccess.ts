import { checkPlanLimits, PlanLimits } from './planEnforcement';
import { PlanTier } from './planConfig';

export type Feature = 
  | 'create_link' 
  | 'add_domain' 
  | 'geo_analytics' 
  | 'export_svg' 
  | 'api_access' 
  | 'white_label'
  | 'team_members'
  | 'qr_advanced';

export interface FeatureCheckResult {
  allowed: boolean;
  reason?: string;
  currentUsage?: number;
  limit?: number | 'unlimited';
  upgradeRequired?: PlanTier;
  planLimits?: PlanLimits;
}

const FEATURE_TO_UPGRADE_MAP: Record<Feature, PlanTier> = {
  create_link: 'pro',
  add_domain: 'pro',
  geo_analytics: 'pro',
  export_svg: 'pro',
  api_access: 'pro',
  white_label: 'business',
  team_members: 'pro',
  qr_advanced: 'pro',
};

export async function checkFeatureAccess(
  workspaceId: string,
  feature: Feature
): Promise<FeatureCheckResult> {
  try {
    const limits = await checkPlanLimits(workspaceId);

    // Map features to plan limits
    switch (feature) {
      case 'create_link':
        return {
          allowed: limits.canCreateLink,
          reason: limits.reason,
          currentUsage: limits.currentUsage.linksThisMonth,
          limit: limits.limits.monthlyLinks,
          upgradeRequired: limits.canCreateLink ? undefined : FEATURE_TO_UPGRADE_MAP[feature],
          planLimits: limits,
        };

      case 'add_domain':
        return {
          allowed: limits.canAddDomain,
          reason: limits.reason,
          currentUsage: limits.currentUsage.customDomains,
          limit: limits.limits.customDomains,
          upgradeRequired: limits.canAddDomain ? undefined : FEATURE_TO_UPGRADE_MAP[feature],
          planLimits: limits,
        };

      case 'geo_analytics':
      case 'export_svg':
      case 'qr_advanced':
        // These are plan-tier features
        const hasPremiumFeature = limits.planTier !== 'free';
        return {
          allowed: hasPremiumFeature,
          reason: hasPremiumFeature ? undefined : `Upgrade to ${FEATURE_TO_UPGRADE_MAP[feature]} to access this feature`,
          upgradeRequired: hasPremiumFeature ? undefined : FEATURE_TO_UPGRADE_MAP[feature],
          planLimits: limits,
        };

      case 'api_access':
        return {
          allowed: true, // All plans have API access
          planLimits: limits,
        };

      case 'white_label':
        const hasWhiteLabel = limits.planTier === 'business' || limits.planTier === 'enterprise';
        return {
          allowed: hasWhiteLabel,
          reason: hasWhiteLabel ? undefined : 'Upgrade to Business for white-label features',
          upgradeRequired: hasWhiteLabel ? undefined : 'business',
          planLimits: limits,
        };

      case 'team_members':
        return {
          allowed: true, // All plans have unlimited team members
          planLimits: limits,
        };

      default:
        return {
          allowed: true,
          planLimits: limits,
        };
    }
  } catch (error) {
    console.error('Feature access check failed:', error);
    return {
      allowed: false,
      reason: 'Unable to verify feature access',
    };
  }
}
