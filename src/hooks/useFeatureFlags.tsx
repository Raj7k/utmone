import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

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
      
      const { error } = await supabase
        .from('feature_flags')
        .update({ 
          is_enabled: enabled,
          last_modified_by: user?.id,
          last_modified_at: new Date().toISOString()
        })
        .eq('flag_key', flagKey);

      if (error) throw error;
      
      // Invalidate edge function cache immediately
      await supabase.functions.invoke('invalidate-flag-cache');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['feature-flags'] });
      toast({
        title: variables.enabled ? 'feature enabled' : 'feature disabled',
        description: `${variables.flagKey} has been ${variables.enabled ? 'enabled' : 'disabled'}`,
      });
    },
    onError: (error) => {
      toast({
        title: 'failed to update feature flag',
        description: error.message,
        variant: 'destructive',
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
      toast({
        title: 'metadata updated',
        description: 'feature flag metadata has been updated',
      });
    },
    onError: (error) => {
      toast({
        title: 'failed to update metadata',
        description: error.message,
        variant: 'destructive',
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
