import { useQuery } from "@tanstack/react-query";
import { useWorkspace } from "@/hooks/useWorkspace";
import { supabase } from "@/integrations/supabase/client";

/**
 * Shared hook for pending approvals count.
 * Used by both ExpandedSidebar and CollapsedSidebar to prevent duplicate queries.
 * Uses 2-minute polling instead of 30 seconds to reduce network calls.
 */
export const usePendingApprovalsCount = () => {
  const { currentWorkspace } = useWorkspace();

  return useQuery({
    queryKey: ['pending-approvals-count', currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return 0;
      const { count } = await supabase
        .from('links')
        .select('*', { count: 'exact', head: true })
        .eq('approval_status', 'pending')
        .eq('workspace_id', currentWorkspace.id);
      return count || 0;
    },
    enabled: !!currentWorkspace?.id,
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // 2 minutes (reduced from 30s)
    refetchOnWindowFocus: false, // Prevent extra refetch on tab focus
  });
};
