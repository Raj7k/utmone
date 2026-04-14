import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { PlanTier, PLAN_CONFIG } from "./planConfig";

export interface PlanLimits {
  canCreateLink: boolean;
  canAddDomain: boolean;
  canCreateLinkPage: boolean;
  reason?: string;
  planTier: PlanTier;
  currentUsage: {
    linksThisMonth: number;
    clicksThisMonth: number;
    customDomains: number;
    qrCodesThisMonth: number;
    linkPagesCount: number;
  };
  limits: {
    monthlyLinks: number | 'unlimited';
    monthlyClicks: number | 'unlimited';
    customDomains: number | 'unlimited';
    qrMonthlyLimit: number | 'unlimited';
    linkPages: number | 'unlimited';
  };
}

export async function checkPlanLimits(workspaceId: string, overridePlanTier?: PlanTier): Promise<PlanLimits> {
  // Fetch workspace plan
  const { data: workspace, error: workspaceError } = await supabase
    .from('workspaces')
    .select('plan_tier, monthly_link_count, custom_domain_limit')
    .eq('id', workspaceId)
    .single();

  if (workspaceError || !workspace) {
    throw new Error('Failed to fetch workspace plan');
  }

  // Use override plan tier if provided (for admin simulation), otherwise use workspace plan
  const planTier = (overridePlanTier || workspace.plan_tier || 'free') as PlanTier;
  const planConfig = PLAN_CONFIG[planTier];

  // Count links created this month
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  
  const { count: linksCount } = await supabase
    .from('links')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId)
    .gte('created_at', startOfMonth);

  // Count custom domains
  const { count: domainsCount } = await supabaseFrom('domains')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId);

  // Get link IDs for this workspace
  const { data: workspaceLinks } = await supabase
    .from('links')
    .select('id')
    .eq('workspace_id', workspaceId);

  const linkIds = workspaceLinks?.map(link => link.id) || [];

  // Count clicks this month for workspace links
  const { count: clicksCount } = linkIds.length > 0 
    ? await supabaseFrom('link_clicks')
        .select('id', { count: 'exact', head: true })
        .in('link_id', linkIds)
        .gte('clicked_at', startOfMonth)
    : { count: 0 };

  // Count QR codes created this month (QR codes are linked to links, not directly to workspaces)
  const { count: qrCodesCount } = linkIds.length > 0 
    ? await supabase
        .from('qr_codes')
        .select('id', { count: 'exact', head: true })
        .in('link_id', linkIds)
        .gte('created_at', startOfMonth)
    : { count: 0 };

  // Count link pages for this workspace
  const { count: linkPagesCount } = await supabaseFrom('link_pages')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId);

  const linksThisMonth = linksCount || 0;
  const customDomains = domainsCount || 0;
  const clicksThisMonth = clicksCount || 0;
  const qrCodesThisMonth = qrCodesCount || 0;
  const linkPagesTotal = linkPagesCount || 0;

  const monthlyLinksLimit = planConfig.features.monthlyLinks;
  const customDomainsLimit = planConfig.features.customDomains;
  const monthlyClicksLimit = planConfig.features.monthlyClicks;
  const qrMonthlyLimit = planConfig.features.qrMonthlyLimit;
  const linkPagesLimit = planConfig.features.linkPages;

  const canCreateLink = 
    monthlyLinksLimit === 'unlimited' || 
    (typeof monthlyLinksLimit === 'number' && linksThisMonth < monthlyLinksLimit);

  const canAddDomain = 
    customDomainsLimit === 'unlimited' || 
    (typeof customDomainsLimit === 'number' && customDomains < customDomainsLimit);

  const canCreateLinkPage = 
    linkPagesLimit === 'unlimited' || 
    (typeof linkPagesLimit === 'number' && linkPagesTotal < linkPagesLimit);

  let reason: string | undefined;
  if (!canCreateLink) {
    reason = `you've reached your monthly limit of ${monthlyLinksLimit} links. upgrade to create more.`;
  }
  if (!canAddDomain) {
    reason = `you've reached your limit of ${customDomainsLimit} custom domains. upgrade to add more.`;
  }
  if (!canCreateLinkPage) {
    reason = `you've reached your limit of ${linkPagesLimit} link pages. upgrade to create more.`;
  }

  return {
    canCreateLink,
    canAddDomain,
    canCreateLinkPage,
    reason,
    planTier,
    currentUsage: {
      linksThisMonth,
      clicksThisMonth,
      customDomains,
      qrCodesThisMonth,
      linkPagesCount: linkPagesTotal,
    },
    limits: {
      monthlyLinks: monthlyLinksLimit,
      monthlyClicks: monthlyClicksLimit,
      customDomains: customDomainsLimit,
      qrMonthlyLimit,
      linkPages: linkPagesLimit,
    },
  };
}
