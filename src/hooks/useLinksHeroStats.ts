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
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

      const [
        { count: totalActiveLinks },
        { count: thisWeekClicks },
        { count: lastWeekClicks },
        { data: topLink }
      ] = await Promise.all([
        supabase
          .from("links")
          .select("*", { count: "exact", head: true })
          .eq("workspace_id", workspaceId)
          .eq("status", "active"),
        supabase
          .from("link_clicks")
          .select("id", { count: "exact", head: true })
          .eq("workspace_id", workspaceId)
          .gte("clicked_at", sevenDaysAgo.toISOString()),
        supabase
          .from("link_clicks")
          .select("id", { count: "exact", head: true })
          .eq("workspace_id", workspaceId)
          .gte("clicked_at", fourteenDaysAgo.toISOString())
          .lt("clicked_at", sevenDaysAgo.toISOString()),
        supabase
          .from("links")
          .select("id, title, short_url, total_clicks")
          .eq("workspace_id", workspaceId)
          .eq("status", "active")
          .order("total_clicks", { ascending: false })
          .limit(1)
          .maybeSingle()
      ]);

      const clickTrend = lastWeekClicks && lastWeekClicks > 0 
        ? Math.round(((thisWeekClicks || 0) - lastWeekClicks) / lastWeekClicks * 100)
        : 0;

      const result = {
        totalActiveLinks: totalActiveLinks || 0,
        thisWeekClicks: thisWeekClicks || 0,
        clickTrend,
        topPerformer: topLink ? {
          id: topLink.id,
          title: topLink.title,
          shortUrl: topLink.short_url,
          totalClicks: topLink.total_clicks || 0,
        } : null,
      };

      // Cache for next load
      setCachedStats(workspaceId, result);

      return result;
    },
  });
};
