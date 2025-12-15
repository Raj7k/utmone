import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/hooks/workspace/useWorkspace";
import { getCachedWorkspaceId } from "@/contexts/AppSessionContext";

export interface Campaign {
  id: string;
  name: string;
  status: "active" | "archived" | "draft";
  color: string;
  created_at: string;
  stats: {
    linkCount: number;
    totalClicks: number;
  };
}

/**
 * Lightweight hook for Campaigns page - only fetches campaigns
 * Reduces 10 queries to 1 for Campaigns page
 */
export const useCampaignsData = () => {
  const { currentWorkspace } = useWorkspace();
  const queryClient = useQueryClient();
  const workspaceId = currentWorkspace?.id || getCachedWorkspaceId() || "";

  const query = useQuery({
    queryKey: ["campaigns", workspaceId],
    queryFn: async (): Promise<Campaign[]> => {
      const { data, error } = await supabase
        .from("campaigns")
        .select(`
          id, name, status, color, created_at,
          links:links(count)
        `)
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;

      return (data || []).map(c => ({
        id: c.id,
        name: c.name || "",
        status: (c.status as "active" | "archived" | "draft") || "active",
        color: c.color || "#3b82f6",
        created_at: c.created_at || "",
        stats: {
          linkCount: Array.isArray(c.links) ? c.links.length : 0,
          totalClicks: 0
        }
      }));
    },
    enabled: !!workspaceId,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["campaigns", workspaceId] });
  };

  return {
    ...query,
    campaigns: query.data || [],
    invalidate,
  };
};
