import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useWorkspace } from './useWorkspace';

export interface APIKey {
  id: string;
  workspace_id: string;
  key_name: string;
  key_hash: string;
  key_prefix: string;
  scopes: string[];
  rate_limit: number;
  rate_limit_window: string;
  last_used_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export const useAPIKeys = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { currentWorkspace } = useWorkspace();

  const { data: apiKeys, isLoading } = useQuery({
    queryKey: ['api-keys', currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return [];
      
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('workspace_id', currentWorkspace.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as APIKey[];
    },
    enabled: !!currentWorkspace?.id,
  });

  const createAPIKey = useMutation({
    mutationFn: async (keyData: {
      key_name: string;
      key_hash: string;
      key_prefix: string;
      scopes: string[];
      rate_limit: number;
      expires_at?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('api_keys')
        .insert({
          ...keyData,
          workspace_id: currentWorkspace!.id,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys', currentWorkspace?.id] });
      toast({ title: 'api key created' });
    },
    onError: (error) => {
      toast({
        title: 'failed to create api key',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateAPIKey = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<APIKey> & { id: string }) => {
      const { data, error } = await supabase
        .from('api_keys')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys', currentWorkspace?.id] });
      toast({ title: 'api key updated' });
    },
    onError: (error) => {
      toast({
        title: 'failed to update api key',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const revokeAPIKey = useMutation({
    mutationFn: async (keyId: string) => {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: false })
        .eq('id', keyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys', currentWorkspace?.id] });
      toast({ title: 'api key revoked' });
    },
    onError: (error) => {
      toast({
        title: 'failed to revoke api key',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteAPIKey = useMutation({
    mutationFn: async (keyId: string) => {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', keyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys', currentWorkspace?.id] });
      toast({ title: 'api key deleted' });
    },
    onError: (error) => {
      toast({
        title: 'failed to delete api key',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    apiKeys,
    isLoading,
    createAPIKey: createAPIKey.mutate,
    updateAPIKey: updateAPIKey.mutate,
    revokeAPIKey: revokeAPIKey.mutate,
    deleteAPIKey: deleteAPIKey.mutate,
  };
};
