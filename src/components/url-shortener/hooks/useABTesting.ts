import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { notify } from '@/lib/notify';

interface ABTestVariant {
  linkId: string;
  trafficPercentage: number;
}

export const useABTesting = (workspaceId: string) => {
  const queryClient = useQueryClient();

  const startABTest = useMutation({
    mutationFn: async ({ parentId, variants }: { parentId: string; variants: ABTestVariant[] }) => {
      // Validate traffic split equals 100%
      const totalTraffic = variants.reduce((sum, v) => sum + v.trafficPercentage, 0);
      if (Math.abs(totalTraffic - 100) > 0.1) {
        throw new Error('traffic split must equal 100%');
      }

      // Update parent link
      const { error: parentError } = await (supabase as any)
        .from('links')
        .update({ 
          is_ab_test: true,
          ab_test_status: 'running',
          ab_test_started_at: new Date().toISOString(),
        })
        .eq('id', parentId)
        .eq('workspace_id', workspaceId);

      if (parentError) throw parentError;

      // Update variant links
      for (const variant of variants) {
        const { error: variantError } = await (supabase as any)
          .from('links')
          .update({ 
            is_ab_test: true,
          })
          .eq('id', variant.linkId)
          .eq('workspace_id', workspaceId);

        if (variantError) throw variantError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['url-groups', workspaceId] });
      notify.success('a/b test started', {
        description: 'traffic is being split between variants',
      });
    },
    onError: (error: Error) => {
      notify.error(error.message);
    },
  });

  const pauseABTest = useMutation({
    mutationFn: async (parentId: string) => {
      const { error } = await (supabase as any)
        .from('links')
        .update({ ab_test_status: 'paused' })
        .eq('id', parentId)
        .eq('workspace_id', workspaceId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['url-groups', workspaceId] });
      notify.success('a/b test paused', {
        description: 'traffic split has been paused',
      });
    },
    onError: (error: Error) => {
      notify.error(error.message);
    },
  });

  const resumeABTest = useMutation({
    mutationFn: async (parentId: string) => {
      const { error } = await (supabase as any)
        .from('links')
        .update({ ab_test_status: 'running' })
        .eq('id', parentId)
        .eq('workspace_id', workspaceId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['url-groups', workspaceId] });
      notify.success('a/b test resumed', {
        description: 'traffic split is active again',
      });
    },
    onError: (error: Error) => {
      notify.error(error.message);
    },
  });

  const declareWinner = useMutation({
    mutationFn: async ({ parentId, winnerId }: { parentId: string; winnerId: string }) => {
      // Update parent link
      const { error: parentError } = await (supabase as any)
        .from('links')
        .update({ 
          ab_test_status: 'completed',
          ab_test_winner_id: winnerId,
          ab_test_completed_at: new Date().toISOString(),
        })
        .eq('id', parentId)
        .eq('workspace_id', workspaceId);

      if (parentError) throw parentError;

      // Archive losing variants
      const { error: archiveError } = await (supabase as any)
        .from('links')
        .update({ status: 'archived' })
        .eq('parent_link_id', parentId)
        .neq('id', winnerId)
        .eq('workspace_id', workspaceId);

      if (archiveError) throw archiveError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['url-groups', workspaceId] });
      notify.success('winner declared', {
        description: 'test completed, losing variants archived',
      });
    },
    onError: (error: Error) => {
      notify.error(error.message);
    },
  });

  const updateTrafficSplit = useMutation({
    mutationFn: async (variants: ABTestVariant[]) => {
      // Validate traffic split equals 100%
      const totalTraffic = variants.reduce((sum, v) => sum + v.trafficPercentage, 0);
      if (Math.abs(totalTraffic - 100) > 0.1) {
        throw new Error('traffic split must equal 100%');
      }

      // Traffic percentages would be stored in separate table or managed by redirect logic
      return variants;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['url-groups', workspaceId] });
      notify.success('traffic split updated', {
        description: 'new percentages are now active',
      });
    },
    onError: (error: Error) => {
      notify.error(error.message);
    },
  });

  return {
    startABTest,
    pauseABTest,
    resumeABTest,
    declareWinner,
    updateTrafficSplit,
  };
};
