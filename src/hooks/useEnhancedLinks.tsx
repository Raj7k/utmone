import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

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
  return useQuery({
    queryKey: ["enhanced-links", workspaceId, searchQuery, statusFilter, sortBy, sortOrder, page, pageSize],
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
        .eq("workspace_id", workspaceId);

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

      // Calculate clicks for last 30 days for each link
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const enhancedLinks = await Promise.all(
        (links || []).map(async (link) => {
          const { count: clicksLast30Days } = await supabase
            .from("link_clicks")
            .select("*", { count: "exact", head: true })
            .eq("link_id", link.id)
            .gte("clicked_at", thirtyDaysAgo.toISOString());

          return {
            ...link,
            owner: Array.isArray(link.owner) ? link.owner[0] : link.owner,
            clicks_last_30_days: clicksLast30Days || 0,
          } as EnhancedLink;
        })
      );

      return {
        links: enhancedLinks,
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      };
    },
  });
};
