import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { notify } from '@/lib/notify';

export interface FeatureFlag {
  id: string;
  flag_key: string;
  is_enabled: boolean;
  description: string;
  category: string;
  last_modified_by: string | null;
  last_modified_at: string;
  created_at: string;
  metadata: Record<string, any>;
}

export const useFeatureFlags = () => {
  const queryClient = useQueryClient();

  const { data: flags, isLoading } = useQuery({
    queryKey: ['feature-flags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .order('category', { ascending: true })
        .order('flag_key', { ascending: true });

      if (error) throw error;
      return data as FeatureFlag[];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const toggleFlag = useMutation({
    mutationFn: async ({ flagKey, enabled }: { flagKey: string; enabled: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Capture metrics before the change
      const beforeMetrics = {
        latency_p95: 85, // In production, fetch from monitoring system
        error_rate: 0.3,
        cache_hit_rate: 87.5
      };
      
      const { error } = await supabase
        .from('feature_flags')
        .update({ 
          is_enabled: enabled,
          last_modified_by: user?.id,
          last_modified_at: new Date().toISOString()
        })
        .eq('flag_key', flagKey);

      if (error) throw error;
      
      // Create metrics snapshot
      const { data: flagData } = await supabase
        .from('feature_flags')
        .select('id')
        .eq('flag_key', flagKey)
        .single();

      await supabase
        .from('metrics_snapshots')
        .insert({
          flag_key: flagKey,
          flag_enabled: enabled,
          changed_by: user?.id,
          latency_p95_before: beforeMetrics.latency_p95,
          error_rate_before: beforeMetrics.error_rate,
          cache_hit_rate_before: beforeMetrics.cache_hit_rate,
          system_load: 'medium', // In production, detect from real metrics
          traffic_pattern: 'normal'
        });
      
      // Invalidate edge function cache immediately
      await supabase.functions.invoke('invalidate-flag-cache');
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
      const { error } = await supabase
        .from('feature_flags')
        .update({ metadata })
        .eq('flag_key', flagKey);

      if (error) throw error;
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
