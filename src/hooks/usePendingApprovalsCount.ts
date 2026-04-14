import { useQuery } from "@tanstack/react-query";
import { useWorkspace } from "@/hooks/workspace";
import { supabase } from "@/integrations/supabase/client";

const CACHE_KEY_PREFIX = 'pending-approvals-count-';

/**
 * Get cached count from localStorage for instant badge display
 */
const getCachedCount = (workspaceId: string | undefined): number | undefined => {
  if (!workspaceId) return undefined;
  try {
    const cached = localStorage.getItem(`${CACHE_KEY_PREFIX}${workspaceId}`);
    if (cached) {
      const { count, timestamp } = JSON.parse(cached);
      // Only use cache if less than 5 minutes old
      if (Date.now() - timestamp < 5 * 60 * 1000) {
        return count;
      }
    }
  } catch {
    // Ignore localStorage errors
  }
  return undefined;
};

/**
 * Save count to localStorage for next page load
 */
const setCachedCount = (workspaceId: string | undefined, count: number) => {
  if (!workspaceId) return;
  try {
    localStorage.setItem(
      `${CACHE_KEY_PREFIX}${workspaceId}`,
      JSON.stringify({ count, timestamp: Date.now() })
    );
  } catch {
    // Ignore localStorage errors
  }
};

/**
 * Shared hook for pending approvals count.
 * Uses localStorage caching for instant badge display on page load.
 * Used by both ExpandedSidebar and CollapsedSidebar to prevent duplicate queries.
 */
export const usePendingApprovalsCount = () => {
  const { currentWorkspace } = useWorkspace();
  const workspaceId = currentWorkspace?.id;

  return useQuery({
    queryKey: ['pending-approvals-count', workspaceId],
    queryFn: async () => {
      if (!workspaceId) return 0;
      // approval_status column doesn't exist yet - return 0
      setCachedCount(workspaceId, 0);
      return 0;
    },
    enabled: !!workspaceId,
    initialData: () => getCachedCount(workspaceId),
    staleTime: 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
