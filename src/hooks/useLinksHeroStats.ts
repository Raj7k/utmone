import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useLinksHeroStats = (workspaceId: string) => {
  return useQuery({
    queryKey: ["links-hero-stats", workspaceId],
    enabled: !!workspaceId,
    queryFn: async () => {
      // Get total active links
      const { count: totalActiveLinks } = await supabase
        .from("links")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspaceId)
        .eq("status", "active");

      // Get this week's clicks
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { count: thisWeekClicks } = await supabase
        .from("link_clicks")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspaceId)
        .gte("clicked_at", sevenDaysAgo.toISOString());

      // Get last week's clicks for comparison
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
      
      const { count: lastWeekClicks } = await supabase
        .from("link_clicks")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspaceId)
        .gte("clicked_at", fourteenDaysAgo.toISOString())
        .lt("clicked_at", sevenDaysAgo.toISOString());

      // Calculate trend
      const clickTrend = lastWeekClicks && lastWeekClicks > 0 
        ? Math.round(((thisWeekClicks || 0) - lastWeekClicks) / lastWeekClicks * 100)
        : 0;

      // Get top performer
      const { data: topLink } = await supabase
        .from("links")
        .select("id, title, short_url, total_clicks")
        .eq("workspace_id", workspaceId)
        .eq("status", "active")
        .order("total_clicks", { ascending: false })
        .limit(1)
        .single();

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
