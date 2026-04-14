import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { notify } from '@/lib/notify';

export const useVersionManagement = (workspaceId: string) => {
  const queryClient = useQueryClient();

  const archiveVersion = useMutation({
    mutationFn: async (linkId: string) => {
      const { error } = await supabase
        .from('links')
        .update({ status: 'archived' })
        .eq('id', linkId)
        .eq('workspace_id', workspaceId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['url-groups', workspaceId] });
      notify.success('version archived', { description: 'link moved to archived status' });
    },
    onError: (error: Error) => {
      notify.error('error', { description: error.message });
    },
  });

  const pauseVersion = useMutation({
    mutationFn: async (linkId: string) => {
      const { error } = await supabase
        .from('links')
        .update({ status: 'paused' })
        .eq('id', linkId)
        .eq('workspace_id', workspaceId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['url-groups', workspaceId] });
      notify.success('version paused', { description: 'link traffic has been paused' });
    },
    onError: (error: Error) => {
      notify.error('error', { description: error.message });
    },
  });

  const activateVersion = useMutation({
    mutationFn: async (linkId: string) => {
      const { error } = await supabase
        .from('links')
        .update({ status: 'active' })
        .eq('id', linkId)
        .eq('workspace_id', workspaceId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['url-groups', workspaceId] });
      notify.success('version activated', { description: 'link is now active' });
    },
    onError: (error: Error) => {
      notify.error('error', { description: error.message });
    },
  });

  const deleteVersion = useMutation({
    mutationFn: async (linkId: string) => {
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', linkId)
        .eq('workspace_id', workspaceId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['url-groups', workspaceId] });
      notify.success('version deleted', { description: 'link permanently removed' });
    },
    onError: (error: Error) => {
      notify.error('error', { description: error.message });
    },
  });

  const createBranch = useMutation({
    mutationFn: async ({ parentId, newSlug, utmParams }: { 
      parentId: string; 
      newSlug: string;
      utmParams?: Record<string, string>;
    }) => {
      // Get parent link
      const { data: parent, error: fetchError } = await supabase
        .from('links')
        .select('*')
        .eq('id', parentId)
        .single();

      if (fetchError) throw fetchError;

      // Create new version
      const { data: newLink, error: insertError } = await supabase
        .from('links')
        .insert({
          workspace_id: workspaceId,
          created_by: parent.created_by,
          title: `${parent.title} (branch)`,
          slug: newSlug,
          destination_url: parent.destination_url,
          domain: parent.domain,
          utm_source: utmParams?.utm_source || parent.utm_source,
          utm_medium: utmParams?.utm_medium || parent.utm_medium,
          utm_campaign: utmParams?.utm_campaign || parent.utm_campaign,
          utm_term: utmParams?.utm_term || parent.utm_term,
          utm_content: utmParams?.utm_content || parent.utm_content,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      return newLink;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['url-groups', workspaceId] });
      notify.success('branch created', { description: 'new version created successfully' });
    },
    onError: (error: Error) => {
      notify.error('error', { description: error.message });
    },
  });

  return {
    archiveVersion,
    pauseVersion,
    activateVersion,
    deleteVersion,
    createBranch,
  };
};
