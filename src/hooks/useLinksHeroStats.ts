import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useLinksHeroStats = (workspaceId: string) => {
  return useQuery({
    queryKey: ["links-hero-stats", workspaceId],
    enabled: !!workspaceId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

      // Run all queries in parallel
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

      // Calculate trend
      const clickTrend = lastWeekClicks && lastWeekClicks > 0 
        ? Math.round(((thisWeekClicks || 0) - lastWeekClicks) / lastWeekClicks * 100)
        : 0;

      return {
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
    },
  });
};
