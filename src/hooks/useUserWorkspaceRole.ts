import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to get the current user's role in a specific workspace
 * Returns the role (owner, workspace_admin, editor, contributor, viewer) or null
 */
export const useUserWorkspaceRole = (workspaceId: string | undefined) => {
  return useQuery({
    queryKey: ['user-workspace-role', workspaceId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !workspaceId) return null;

      // Check if owner
      const { data: workspace } = await supabase
        .from('workspaces')
        .select('owner_id')
        .eq('id', workspaceId)
        .single();
      
      if (workspace?.owner_id === user.id) return 'owner';

      // Check workspace_members role
      const { data: member } = await supabase
        .from('workspace_members')
        .select('role')
        .eq('workspace_id', workspaceId)
        .eq('user_id', user.id)
        .single();

      return member?.role || null;
    },
    enabled: !!workspaceId,
  });
};

/**
 * Helper function to determine if a role requires approval
 * Contributors and viewers cannot publish links directly
 */
export const requiresApproval = (role: string | null): boolean => {
  return role === 'contributor' || role === 'viewer';
};
