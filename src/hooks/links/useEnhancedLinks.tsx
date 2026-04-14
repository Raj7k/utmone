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

const CACHE_KEY = 'enhanced-links-cache';

function getCacheKey(params: UseEnhancedLinksParams) {
  return `${CACHE_KEY}-${params.workspaceId}-${params.searchQuery}-${params.statusFilter}-${params.page}`;
}

function getCachedLinks(params: UseEnhancedLinksParams) {
  try {
    const cached = localStorage.getItem(getCacheKey(params));
    if (!cached) return undefined;
    const { data, timestamp } = JSON.parse(cached);
    // 2 minute cache validity
    if (Date.now() - timestamp > 2 * 60 * 1000) return undefined;
    return data;
  } catch { return undefined; }
}

function setCachedLinks(params: UseEnhancedLinksParams, data: any) {
  try {
    localStorage.setItem(getCacheKey(params), JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch { /* ignore storage errors */ }
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
  const effectiveWorkspaceId = workspaceId || getCachedWorkspaceId() || "";
  
  const params = { workspaceId: effectiveWorkspaceId, searchQuery, statusFilter, sortBy, sortOrder, page, pageSize };
  
  return useQuery({
    queryKey: ["enhanced-links", effectiveWorkspaceId, searchQuery, statusFilter, sortBy, sortOrder, page, pageSize],
    enabled: !!effectiveWorkspaceId,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Trust cache on mount
    initialData: () => getCachedLinks(params),
    queryFn: async () => {
      // Direct query without JOINs for performance
      let query = supabase
        .from("links")
        .select(
          [
            "id",
            "title",
            "destination_url",
            "short_url",
            "geo_targets",
            "utm_source",
            "utm_medium",
            "utm_campaign",
            "security_status",
            "expires_at",
            "domain",
            "slug",
            "created_at",
            "total_clicks",
            "status",
          ].join(","),
          { count: "exact" }
        )
        .eq("workspace_id", effectiveWorkspaceId);

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter as Database["public"]["Enums"]["link_status"]);
      }

      if (searchQuery) {
        query = query.or(
          `title.ilike.%${searchQuery}%,` +
          `destination_url.ilike.%${searchQuery}%,` +
          `utm_campaign.ilike.%${searchQuery}%,` +
          `utm_source.ilike.%${searchQuery}%,` +
          `utm_medium.ilike.%${searchQuery}%`
        );
      }

      query = query.order(sortBy, { ascending: sortOrder === "asc" });

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data: links, error, count } = await query;

      if (error) throw error;

      const enhancedLinks = (links || []).map((link: any) => ({
        ...link,
        owner: null, // Skip JOIN for performance
        clicks_last_30_days: link.total_clicks || 0,
      })) as EnhancedLink[];

      const result = {
        links: enhancedLinks,
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      };

      // Cache for next load
      setCachedLinks(params, result);

      return result;
    },
  });
};
