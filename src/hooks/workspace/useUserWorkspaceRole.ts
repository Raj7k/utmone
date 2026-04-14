import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { useAppSession } from "@/contexts/AppSessionContext";

/**
 * Hook to get the current user's role in a specific workspace
 * Returns the role (owner, workspace_admin, editor, contributor, viewer) or null
 */
export const useUserWorkspaceRole = (workspaceId: string | undefined) => {
  const { user } = useAppSession();
  const userId = user?.id;

  return useQuery({
    queryKey: ['user-workspace-role', workspaceId, userId],
    queryFn: async () => {
      if (!userId || !workspaceId) return null;

      // Check if owner
      const { data: workspace } = await supabase
        .from('workspaces')
        .select('owner_id')
        .eq('id', workspaceId)
        .single();
      
      if (workspace?.owner_id === userId) return 'owner';

      // Check workspace_members role
      const { data: member } = await supabaseFrom('workspace_members')
        .select('role')
        .eq('workspace_id', workspaceId)
        .eq('user_id', userId)
        .single();

      return member?.role || null;
    },
    enabled: !!workspaceId && !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Helper function to determine if a role requires approval
 * Contributors and viewers cannot publish links directly
 */
export const requiresApproval = (role: string | null): boolean => {
  return role === 'contributor' || role === 'viewer';
};
