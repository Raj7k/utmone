import { useQuery } from "@tanstack/react-query";
import { checkPlanLimits } from "@/lib/planEnforcement";
import { useWorkspace } from "./useWorkspace";

export interface UsageStat {
  used: number;
  limit: number | 'unlimited';
  remaining: number | 'unlimited';
}

export interface PlanLimitsResult {
  links: UsageStat;
  clicks: UsageStat;
  domains: UsageStat;
  canCreateLink: boolean;
  canAddDomain: boolean;
  planTier: string;
  isLoading: boolean;
}

/**
 * Enhanced plan limits hook with detailed usage statistics
 * Returns structured data for each limit with used/limit/remaining counts
 */
export const usePlanLimits = () => {
  const { currentWorkspace } = useWorkspace();

  const query = useQuery({
    queryKey: ['plan-limits', currentWorkspace?.id],
    queryFn: () => {
      if (!currentWorkspace?.id) throw new Error('No workspace selected');
      return checkPlanLimits(currentWorkspace.id);
    },
    enabled: !!currentWorkspace?.id,
    staleTime: 30000, // 30 seconds
  });

  // Transform raw limits into enhanced format
  const data = query.data;
  
  const linksLimit = data?.limits.monthlyLinks;
  const linksUsed = data?.currentUsage.linksThisMonth || 0;
  const linksRemaining = linksLimit === 'unlimited' 
    ? 'unlimited' 
    : Math.max(0, (linksLimit as number) - linksUsed);

  const clicksLimit = data?.limits.monthlyClicks;
  const clicksUsed = data?.currentUsage.clicksThisMonth || 0;
  const clicksRemaining = clicksLimit === 'unlimited'
    ? 'unlimited'
    : Math.max(0, (clicksLimit as number) - clicksUsed);

  const domainsLimit = data?.limits.customDomains;
  const domainsUsed = data?.currentUsage.customDomains || 0;
  const domainsRemaining = domainsLimit === 'unlimited'
    ? 'unlimited'
    : Math.max(0, (domainsLimit as number) - domainsUsed);

  return {
    ...query,
    links: {
      used: linksUsed,
      limit: linksLimit || 0,
      remaining: linksRemaining,
    },
    clicks: {
      used: clicksUsed,
      limit: clicksLimit || 0,
      remaining: clicksRemaining,
    },
    domains: {
      used: domainsUsed,
      limit: domainsLimit || 0,
      remaining: domainsRemaining,
    },
    canCreateLink: data?.canCreateLink || false,
    canAddDomain: data?.canAddDomain || false,
    planTier: data?.planTier || 'free',
    isLoading: query.isLoading,
  };
};
