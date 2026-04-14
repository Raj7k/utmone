import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/hooks/workspace";
import { PlanTier } from "@/lib/planConfig";

export interface SubscriptionStatus {
  planTier: PlanTier;
  subscriptionStatus: 'active' | 'expired' | 'grace_period' | 'scheduled_deletion';
  expiresAt: Date | null;
  previousPlanTier: PlanTier | null;
  downgradeAt: Date | null;
  dataDeletionScheduledAt: Date | null;
  daysUntilExpiry: number | null;
  daysUntilDeletion: number | null;
  isInGracePeriod: boolean;
  isExpired: boolean;
}

export const useSubscriptionStatus = () => {
  const { currentWorkspace } = useWorkspace();

  return useQuery({
    queryKey: ['subscription-status', currentWorkspace?.id],
    queryFn: async (): Promise<SubscriptionStatus | null> => {
      if (!currentWorkspace?.id) return null;

      const { data, error } = await (supabase as any)
        .from('workspaces')
        .select(`
          plan_tier,
          subscription_status,
          plan_expires_at,
          previous_plan_tier,
          downgraded_at,
          data_deletion_scheduled_at
        `)
        .eq('id', currentWorkspace.id)
        .single();

      if (error) throw error;
      if (!data) return null;

      const now = new Date();
      const expiresAt = data.plan_expires_at ? new Date(data.plan_expires_at) : null;
      const dataDeletionScheduledAt = data.data_deletion_scheduled_at 
        ? new Date(data.data_deletion_scheduled_at) 
        : null;

      const daysUntilExpiry = expiresAt 
        ? Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : null;

      const daysUntilDeletion = dataDeletionScheduledAt
        ? Math.ceil((dataDeletionScheduledAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : null;

      const subscriptionStatus = (data.subscription_status || 'active') as SubscriptionStatus['subscriptionStatus'];

      return {
        planTier: (data.plan_tier || 'free') as PlanTier,
        subscriptionStatus,
        expiresAt,
        previousPlanTier: data.previous_plan_tier as PlanTier | null,
        downgradeAt: data.downgraded_at ? new Date(data.downgraded_at) : null,
        dataDeletionScheduledAt,
        daysUntilExpiry,
        daysUntilDeletion,
        isInGracePeriod: subscriptionStatus === 'grace_period',
        isExpired: subscriptionStatus === 'expired' || (expiresAt ? expiresAt < now : false),
      };
    },
    enabled: !!currentWorkspace?.id,
    staleTime: 60000, // 1 minute
  });
};

export const useIsSubscriptionExpiringSoon = (daysThreshold = 7) => {
  const { data: status } = useSubscriptionStatus();
  
  if (!status) return false;
  if (status.daysUntilExpiry === null) return false;
  
  return status.daysUntilExpiry > 0 && status.daysUntilExpiry <= daysThreshold;
};