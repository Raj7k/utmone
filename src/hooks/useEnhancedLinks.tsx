import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { getCachedWorkspaceId } from "@/contexts/AppSessionContext";

type Link = Database["public"]["Tables"]["links"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export interface EnhancedLink extends Link {
  owner: Pick<Profile, "full_name" | "email"> | null;
  clicks_last_30_days: number;
}

interface UseEnhancedLinksParams {
  workspaceId: string;
  searchQuery?: string;
  statusFilter?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export const useEnhancedLinks = ({
  workspaceId,
  searchQuery = "",
  statusFilter = "all",
  sortBy = "created_at",
  sortOrder = "desc",
  page = 1,
  pageSize = 10,
}: UseEnhancedLinksParams) => {
  // Use cached workspace ID as fallback to enable query immediately
  const effectiveWorkspaceId = workspaceId || getCachedWorkspaceId() || "";
  
  return useQuery({
    queryKey: ["enhanced-links", effectiveWorkspaceId, searchQuery, statusFilter, sortBy, sortOrder, page, pageSize],
    enabled: !!effectiveWorkspaceId,
    staleTime: 2 * 60 * 1000, // 2 minutes - don't refetch if fresh
    gcTime: 10 * 60 * 1000, // 10 minutes cache
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    queryFn: async () => {
      let query = supabase
        .from("links")
        .select(`
          *,
          owner:created_by (
            full_name,
            email
          )
        `, { count: "exact" })
        .eq("workspace_id", effectiveWorkspaceId);

      // Apply status filter
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter as Database["public"]["Enums"]["link_status"]);
      }

      // Apply search filter
      if (searchQuery) {
        query = query.or(
          `title.ilike.%${searchQuery}%,` +
          `destination_url.ilike.%${searchQuery}%,` +
          `utm_campaign.ilike.%${searchQuery}%,` +
          `utm_source.ilike.%${searchQuery}%,` +
          `utm_medium.ilike.%${searchQuery}%`
        );
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === "asc" });

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data: links, error, count } = await query;

      if (error) throw error;

      // Use cached total_clicks column instead of fetching all click rows
      const enhancedLinks = (links || []).map((link) => ({
        ...link,
        owner: Array.isArray(link.owner) ? link.owner[0] : link.owner,
        clicks_last_30_days: link.total_clicks || 0,
      })) as EnhancedLink[];

      return {
        links: enhancedLinks,
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      };
    },
  });
};
