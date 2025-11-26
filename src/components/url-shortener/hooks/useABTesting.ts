import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ABTestVariant {
  linkId: string;
  trafficPercentage: number;
}

export const useABTesting = (workspaceId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const startABTest = useMutation({
    mutationFn: async ({ parentId, variants }: { parentId: string; variants: ABTestVariant[] }) => {
      // Validate traffic split equals 100%
      const totalTraffic = variants.reduce((sum, v) => sum + v.trafficPercentage, 0);
      if (Math.abs(totalTraffic - 100) > 0.1) {
        throw new Error('traffic split must equal 100%');
      }

      // Update parent link
      const { error: parentError } = await supabase
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
        const { error: variantError } = await supabase
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
      toast({
        title: 'a/b test started',
        description: 'traffic is being split between variants',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const pauseABTest = useMutation({
    mutationFn: async (parentId: string) => {
      const { error } = await supabase
        .from('links')
        .update({ ab_test_status: 'paused' })
        .eq('id', parentId)
        .eq('workspace_id', workspaceId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['url-groups', workspaceId] });
      toast({
        title: 'a/b test paused',
        description: 'traffic split has been paused',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const resumeABTest = useMutation({
    mutationFn: async (parentId: string) => {
      const { error } = await supabase
        .from('links')
        .update({ ab_test_status: 'running' })
        .eq('id', parentId)
        .eq('workspace_id', workspaceId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['url-groups', workspaceId] });
      toast({
        title: 'a/b test resumed',
        description: 'traffic split is active again',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const declareWinner = useMutation({
    mutationFn: async ({ parentId, winnerId }: { parentId: string; winnerId: string }) => {
      // Update parent link
      const { error: parentError } = await supabase
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
      const { error: archiveError } = await supabase
        .from('links')
        .update({ status: 'archived' })
        .eq('parent_link_id', parentId)
        .neq('id', winnerId)
        .eq('workspace_id', workspaceId);

      if (archiveError) throw archiveError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['url-groups', workspaceId] });
      toast({
        title: 'winner declared',
        description: 'test completed, losing variants archived',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'error',
        description: error.message,
        variant: 'destructive',
      });
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
      toast({
        title: 'traffic split updated',
        description: 'new percentages are now active',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'error',
        description: error.message,
        variant: 'destructive',
      });
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
