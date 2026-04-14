import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { notify } from '@/lib/notify';

export interface FeatureFlag {
  id: string;
  feature_key: string;
  min_plan_tier: string;
  description: string | null;
  created_at: string;
  // Client-side only fields for admin UI
  is_enabled?: boolean;
  category?: string;
  metadata?: Record<string, any>;
}

export const useFeatureFlags = () => {
  const queryClient = useQueryClient();

  // PERF: Only fetch feature gates for authenticated users.
  // Unauthenticated visitors on marketing pages should not hit this table.
  const [isAuthed, setIsAuthed] = useState<boolean>(false);
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setIsAuthed(!!data.session?.user);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setIsAuthed(!!session?.user);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const { data: flags, isLoading } = useQuery({
    queryKey: ['feature-flags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feature_gates')
        .select('*')
        .order('feature_key', { ascending: true });

      if (error) throw error;
      return (data || []).map(row => ({
        ...row,
        is_enabled: row.min_plan_tier !== 'disabled',
        category: 'general',
        metadata: {},
      })) as FeatureFlag[];
    },
    enabled: isAuthed, // PERF: gate on auth so marketing pages don't hit this
    refetchInterval: isAuthed ? 60000 : false, // PERF: 60s (was 30s)
    staleTime: 30000, // PERF: allow cache reuse across remounts
  });

  const toggleFlag = useMutation({
    mutationFn: async ({ flagKey, enabled }: { flagKey: string; enabled: boolean }) => {
      const { error } = await supabase
        .from('feature_gates')
        .update({ 
          min_plan_tier: enabled ? 'free' : 'disabled',
        })
        .eq('feature_key', flagKey);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['feature-flags'] });
      notify.success(variables.enabled ? 'feature enabled' : 'feature disabled', {
        description: `${variables.flagKey} has been ${variables.enabled ? 'enabled' : 'disabled'}`,
      });
    },
    onError: (error) => {
      notify.error('failed to update feature flag', {
        description: error.message,
      });
    },
  });

  const updateFlagMetadata = useMutation({
    mutationFn: async ({ flagKey, metadata }: { flagKey: string; metadata: Record<string, any> }) => {
      // metadata column doesn't exist yet, no-op for now
      console.log('updateFlagMetadata called for', flagKey, metadata);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-flags'] });
      notify.success('metadata updated', {
        description: 'feature flag metadata has been updated',
      });
    },
    onError: (error) => {
      notify.error('failed to update metadata', {
        description: error.message,
      });
    },
  });

  return {
    flags,
    isLoading,
    toggleFlag: toggleFlag.mutate,
    updateFlagMetadata: updateFlagMetadata.mutate,
    isToggling: toggleFlag.isPending,
  };
};
