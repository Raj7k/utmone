import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const CACHE_KEY = 'links-hero-stats-cache';

function getCachedStats(workspaceId: string) {
  try {
    const cached = localStorage.getItem(`${CACHE_KEY}-${workspaceId}`);
    if (!cached) return undefined;
    const { data, timestamp } = JSON.parse(cached);
    // 5 minute cache validity
    if (Date.now() - timestamp > 5 * 60 * 1000) return undefined;
    return data;
  } catch { return undefined; }
}

function setCachedStats(workspaceId: string, data: any) {
  try {
    localStorage.setItem(`${CACHE_KEY}-${workspaceId}`, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch { /* ignore storage errors */ }
}

export const useLinksHeroStats = (workspaceId: string) => {
  return useQuery({
    queryKey: ["links-hero-stats", workspaceId],
    enabled: !!workspaceId,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Trust cache on mount
    initialData: () => getCachedStats(workspaceId),
    queryFn: async () => {
      const { data, error } = await (supabase.rpc as any)("get_links_hero_stats", {
        p_workspace_id: workspaceId,
      });

      if (error) throw error;

      const stats = data?.[0] as any;

      const clickTrend = stats?.click_trend ?? 0;

      const result = {
        totalActiveLinks: stats?.total_active_links ?? 0,
        thisWeekClicks: stats?.this_week_clicks ?? 0,
        clickTrend,
        topPerformer: stats?.top_link_id ? {
          id: stats.top_link_id,
          title: stats.top_link_title,
          shortUrl: stats.top_link_short_url,
          totalClicks: stats.top_link_total_clicks ?? 0,
        } : null,
      };

      // Cache for next load
      setCachedStats(workspaceId, result);

      return result;
    },
  });
};
