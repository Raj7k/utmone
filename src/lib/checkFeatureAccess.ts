import { checkPlanLimits, PlanLimits } from './planEnforcement';
import { PlanTier } from './planConfig';
import { supabase } from '@/integrations/supabase/client';
import { hasMinPlanTier } from './featureGating';

export type Feature = 
  | 'create_link' 
  | 'add_domain' 
  | 'geo_analytics' 
  | 'export_svg' 
  | 'api_access' 
  | 'white_label'
  | 'team_members'
  | 'qr_advanced'
  | 'csv_export'
  | 'remove_branding'
  | 'sso';

export interface FeatureCheckResult {
  allowed: boolean;
  reason?: string;
  currentUsage?: number;
  limit?: number | 'unlimited';
  upgradeRequired?: PlanTier;
  planLimits?: PlanLimits;
}

/**
 * Check if user can access a feature
 * Now queries the feature_gates table for dynamic feature gating
 */
export async function checkFeatureAccess(
  workspaceId: string,
  feature: Feature,
  overridePlanTier?: PlanTier
): Promise<FeatureCheckResult> {
  try {
    const limits = await checkPlanLimits(workspaceId, overridePlanTier);

    // Handle usage-based features (links, domains)
    if (feature === 'create_link') {
      return {
        allowed: limits.canCreateLink,
        reason: limits.reason,
        currentUsage: limits.currentUsage.linksThisMonth,
        limit: limits.limits.monthlyLinks,
        upgradeRequired: limits.canCreateLink ? undefined : 'pro',
        planLimits: limits,
      };
    }

    if (feature === 'add_domain') {
      return {
        allowed: limits.canAddDomain,
        reason: limits.reason,
        currentUsage: limits.currentUsage.customDomains,
        limit: limits.limits.customDomains,
        upgradeRequired: limits.canAddDomain ? undefined : 'pro',
        planLimits: limits,
      };
    }

    // For tier-based features, query feature_gates table
    const { data: gate, error } = await supabase
      .from('feature_gates')
      .select('*')
      .eq('feature_key', feature)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows found, which is okay
      throw error;
    }

    // If feature not in registry, allow by default (backward compatibility)
    if (!gate) {
      return {
        allowed: true,
        planLimits: limits,
      };
    }

    // Check if user's plan meets minimum requirement
    const allowed = hasMinPlanTier(limits.planTier, gate.min_plan_tier);

    return {
      allowed,
      reason: allowed 
        ? undefined 
        : `Upgrade to ${gate.min_plan_tier} to access ${gate.description}`,
      upgradeRequired: allowed ? undefined : (gate.min_plan_tier as PlanTier),
      planLimits: limits,
    };
  } catch (error) {
    console.error('Feature access check failed:', error);
    return {
      allowed: false,
      reason: 'Unable to verify feature access',
    };
  }
}
