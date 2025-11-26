import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useVersionManagement = (workspaceId: string) => {
  const { toast } = useToast();
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
      toast({
        title: 'version archived',
        description: 'link moved to archived status',
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
      toast({
        title: 'version paused',
        description: 'link traffic has been paused',
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
      toast({
        title: 'version activated',
        description: 'link is now active',
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
      toast({
        title: 'version deleted',
        description: 'link permanently removed',
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

      // Get next version number
      const { data: nextVersion } = await supabase
        .rpc('get_next_url_version', {
          p_workspace_id: workspaceId,
          p_destination_url: parent.destination_url,
        });

      const version = nextVersion || 1;

      // Create new version
      const { data: newLink, error: insertError } = await supabase
        .from('links')
        .insert({
          workspace_id: workspaceId,
          created_by: parent.created_by,
          title: `${parent.title} (v${version})`,
          slug: newSlug,
          destination_url: parent.destination_url,
          final_url: parent.destination_url,
          domain: parent.domain,
          path: parent.path || '',
          version,
          parent_link_id: parentId,
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
    onSuccess: (newLink) => {
      queryClient.invalidateQueries({ queryKey: ['url-groups', workspaceId] });
      toast({
        title: 'branch created',
        description: `new version v${newLink.version} created successfully`,
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
    archiveVersion,
    pauseVersion,
    activateVersion,
    deleteVersion,
    createBranch,
  };
};
