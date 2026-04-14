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

// Columns the full query wants. If any are missing from this DB, Supabase
// returns 400 PGRST204. We retry with only plan_tier (guaranteed to exist)
// and default the rest, so the hook never throws and the dashboard keeps
// rendering regardless of which subscription columns have been migrated.
const FULL_COLUMNS =
  'plan_tier, subscription_status, plan_expires_at, previous_plan_tier, downgraded_at, data_deletion_scheduled_at';
const CORE_COLUMNS = 'plan_tier';

export const useSubscriptionStatus = () => {
  const { currentWorkspace } = useWorkspace();

  return useQuery({
    queryKey: ['subscription-status', currentWorkspace?.id],
    queryFn: async (): Promise<SubscriptionStatus | null> => {
      if (!currentWorkspace?.id) return null;

      const client = supabase as any;

      // Attempt full query first — gives us the rich data when columns exist.
      let { data, error } = await client
        .from('workspaces')
        .select(FULL_COLUMNS)
        .eq('id', currentWorkspace.id)
        .single();

      // 42703 = undefined_column (Postgres). PGRST204 = column not in schema
      // cache (PostgREST). Fall back to the minimal query so the dashboard
      // keeps working on DBs that haven't run the subscription migrations.
      if (error && ((error as any).code === 'PGRST204' || (error as any).code === '42703')) {
        console.warn('[useSubscriptionStatus] Extended query failed (missing column). Falling back to core columns.', error);
        const fallback = await client
          .from('workspaces')
          .select(CORE_COLUMNS)
          .eq('id', currentWorkspace.id)
          .single();
        data = fallback.data;
        error = fallback.error;
      }

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
        previousPlanTier: (data.previous_plan_tier ?? null) as PlanTier | null,
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
    // Don't retry on error — if a column is missing, retry won't help and we
    // already fall back inside queryFn. Prevents console spam.
    retry: false,
  });
};

export const useIsSubscriptionExpiringSoon = (daysThreshold = 7) => {
  const { data: status } = useSubscriptionStatus();

  if (!status) return false;
  if (status.daysUntilExpiry === null) return false;

  return status.daysUntilExpiry > 0 && status.daysUntilExpiry <= daysThreshold;
};
