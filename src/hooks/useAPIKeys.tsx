import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { notify } from '@/lib/notify';
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
      scopes: string[];
      expires_at?: string;
    }) => {
      if (!currentWorkspace?.id) throw new Error('No workspace selected');

      const { data, error } = await supabase.functions.invoke('generate-api-key', {
        body: {
          key_name: keyData.key_name,
          workspace_id: currentWorkspace.id,
          scopes: keyData.scopes,
          expires_at: keyData.expires_at,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys', currentWorkspace?.id] });
      notify.success('api key created');
    },
    onError: (error) => {
      notify.error(error.message || 'failed to create api key');
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
      notify.success('api key updated');
    },
    onError: (error) => {
      notify.error(error.message || 'failed to update api key');
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
      notify.success('api key revoked');
    },
    onError: (error) => {
      notify.error(error.message || 'failed to revoke api key');
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
      notify.success('api key deleted');
    },
    onError: (error) => {
      notify.error(error.message || 'failed to delete api key');
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
