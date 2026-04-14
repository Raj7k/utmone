import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";

export interface CampaignPerformance {
  id: string;
  name: string;
  ctr: number; // Click-through rate
  conversionRate: number;
  clicks: number;
  conversions: number;
}

export function useCampaignPerformance(workspaceId: string) {
  return useQuery({
    queryKey: ["campaign-performance", workspaceId],
    queryFn: async () => {
      // Fetch all links with their clicks and conversions
      const { data: links, error: linksError } = await supabase
        .from("links")
        .select(`
          id,
          title,
          total_clicks,
          unique_clicks
        `)
        .eq("workspace_id", workspaceId)
        .gt("total_clicks", 0) // Only links with clicks
        .order("total_clicks", { ascending: false });

      if (linksError) throw linksError;

      // Fetch conversion data
      const { data: conversions, error: conversionsError } = await supabaseFrom('conversion_events')
        .select("link_id")
        .eq("workspace_id", workspaceId);

      if (conversionsError) throw conversionsError;

      // Count conversions per link
      const conversionCounts = new Map<string, number>();
      conversions?.forEach((conv) => {
        conversionCounts.set(conv.link_id, (conversionCounts.get(conv.link_id) || 0) + 1);
      });

      // Calculate performance metrics
      const performance: CampaignPerformance[] = (links || []).map((link) => {
        const conversionCount = conversionCounts.get(link.id) || 0;
        const clicks = link.total_clicks || 0;
        const uniqueClicks = link.unique_clicks || 0;

        // CTR: unique clicks / total impressions (using total_clicks as proxy)
        // For simplicity, we'll use unique_clicks / total_clicks ratio
        const ctr = clicks > 0 ? uniqueClicks / clicks : 0;

        // Conversion rate: conversions / unique clicks
        const conversionRate = uniqueClicks > 0 ? conversionCount / uniqueClicks : 0;

        return {
          id: link.id,
          name: link.title,
          ctr: ctr,
          conversionRate: conversionRate,
          clicks: clicks,
          conversions: conversionCount,
        };
      });

      return performance;
    },
    enabled: !!workspaceId,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false
  });
}
