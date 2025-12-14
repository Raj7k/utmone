import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAppSession } from "@/contexts/AppSessionContext";

export type WorkspaceCapability =
  | 'can_view_billing'
  | 'can_manage_billing'
  | 'can_create_links'
  | 'can_update_links'
  | 'can_delete_links'
  | 'can_view_analytics'
  | 'can_export_analytics'
  | 'can_invite_members'
  | 'can_remove_members'
  | 'can_manage_roles'
  | 'can_manage_domains'
  | 'can_manage_integrations'
  | 'can_manage_webhooks'
  | 'can_create_qr'
  | 'can_manage_campaigns'
  | 'can_view_audit_logs'
  | 'can_manage_workspace_settings';

/**
 * Hook to check if current user has a specific capability in workspace
 * Uses secure server-side capability check with Least Privilege principle
 */
export const useCapability = (
  workspaceId: string | undefined,
  capability: WorkspaceCapability
) => {
  const { user } = useAppSession();
  const userId = user?.id;

  return useQuery({
    queryKey: ['capability', workspaceId, capability, userId],
    queryFn: async () => {
      if (!workspaceId || !userId) return false;

      const { data, error } = await supabase.rpc('has_capability', {
        _user_id: userId,
        _workspace_id: workspaceId,
        _capability: capability,
      });

      if (error) {
        console.error('Error checking capability:', error);
        return false;
      }

      return !!data;
    },
    enabled: !!workspaceId && !!userId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

/**
 * Hook to check multiple capabilities at once (more efficient)
 */
export const useCapabilities = (
  workspaceId: string | undefined,
  capabilities: WorkspaceCapability[]
) => {
  const { user } = useAppSession();
  const userId = user?.id;

  return useQuery({
    queryKey: ['capabilities', workspaceId, capabilities.sort().join(','), userId],
    queryFn: async () => {
      if (!workspaceId || !userId) return {};

      const results: Record<WorkspaceCapability, boolean> = {} as any;

      // Execute all capability checks in parallel
      const checks = await Promise.all(
        capabilities.map(async (cap) => {
          const { data, error } = await supabase.rpc('has_capability', {
            _user_id: userId,
            _workspace_id: workspaceId,
            _capability: cap,
          });
          return { capability: cap, hasCapability: !error && !!data };
        })
      );

      checks.forEach(({ capability, hasCapability }) => {
        results[capability] = hasCapability;
      });

      return results;
    },
    enabled: !!workspaceId && !!userId && capabilities.length > 0,
    staleTime: 5 * 60 * 1000,
  });
};
