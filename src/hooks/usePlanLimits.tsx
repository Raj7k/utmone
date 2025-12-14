import { useQuery } from "@tanstack/react-query";
import { checkPlanLimits } from "@/lib/planEnforcement";
import { useWorkspace } from "@/hooks/workspace";
import { useAdminSimulation } from "@/contexts/AdminSimulationContext";

export interface UsageStat {
  used: number;
  limit: number | 'unlimited';
  remaining: number | 'unlimited';
}

export interface PlanLimitsResult {
  links: UsageStat;
  clicks: UsageStat;
  domains: UsageStat;
  qrCodes: UsageStat;
  canCreateLink: boolean;
  canAddDomain: boolean;
  planTier: string;
  isLoading: boolean;
}

/**
 * Enhanced plan limits hook with detailed usage statistics
 * Returns structured data for each limit with used/limit/remaining counts
 * Respects admin plan simulation
 */
export const usePlanLimits = () => {
  const { currentWorkspace } = useWorkspace();
  const { simulatedPlan } = useAdminSimulation();

  const query = useQuery({
    queryKey: ['plan-limits', currentWorkspace?.id, simulatedPlan],
    queryFn: () => {
      if (!currentWorkspace?.id) throw new Error('No workspace selected');
      // Pass simulated plan to checkPlanLimits for proper override
      return checkPlanLimits(currentWorkspace.id, simulatedPlan || undefined);
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

  const qrCodesLimit = data?.limits.qrMonthlyLimit;
  const qrCodesUsed = data?.currentUsage.qrCodesThisMonth || 0;
  const qrCodesRemaining = qrCodesLimit === 'unlimited'
    ? 'unlimited'
    : Math.max(0, (qrCodesLimit as number) - qrCodesUsed);

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
    qrCodes: {
      used: qrCodesUsed,
      limit: qrCodesLimit || 0,
      remaining: qrCodesRemaining,
    },
    canCreateLink: data?.canCreateLink || false,
    canAddDomain: data?.canAddDomain || false,
    planTier: data?.planTier || 'free',
    isLoading: query.isLoading,
  };
};
