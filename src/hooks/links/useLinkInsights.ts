import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type InsightType = "hot" | "rising" | "declining" | "at-risk" | "dormant" | "testing";

interface LinkInsight {
  type: InsightType;
  label: string;
  confidence?: number;
}

export const useLinkInsights = (linkId: string) => {
  return useQuery({
    queryKey: ["link-insights", linkId],
    enabled: !!linkId,
    queryFn: async (): Promise<LinkInsight | null> => {
      const { data: link } = await supabase
        .from("links")
        .select("*")
        .eq("id", linkId)
        .single();

      if (!link) return null;

      // Get click data from last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: recentClicks } = await supabase
        .from("link_clicks")
        .select("clicked_at")
        .eq("link_id", linkId)
        .gte("clicked_at", sevenDaysAgo.toISOString());

      const clicksLast7Days = recentClicks?.length || 0;
      const avgClicksPerDay = clicksLast7Days / 7;

      // Get previous 7 days for trend
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

      const { data: previousClicks } = await supabase
        .from("link_clicks")
        .select("clicked_at")
        .eq("link_id", linkId)
        .gte("clicked_at", fourteenDaysAgo.toISOString())
        .lt("clicked_at", sevenDaysAgo.toISOString());

      const clicksPrevious7Days = previousClicks?.length || 0;
      const previousAvg = clicksPrevious7Days / 7;

      // Determine insight type
      if (clicksLast7Days === 0 && link.created_at) {
        const createdDate = new Date(link.created_at);
        const daysSinceCreation = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceCreation > 7) {
          return { type: "dormant", label: "💤 dormant" };
        }
      }

      // Check for A/B testing
      const { data: destinations } = await supabase
        .from("links")
        .select("destinations")
        .eq("id", linkId)
        .single();

      if (destinations?.destinations && Array.isArray(destinations.destinations) && destinations.destinations.length > 1) {
        return { type: "testing", label: "🧪 testing", confidence: 75 };
      }

      // Hot: significantly above average
      if (avgClicksPerDay > 10 && previousAvg > 0 && avgClicksPerDay / previousAvg > 1.5) {
        return { type: "hot", label: "🔥 hot" };
      }

      // Rising: positive trend
      if (previousAvg > 0 && avgClicksPerDay > previousAvg * 1.2) {
        return { type: "rising", label: "📈 rising" };
      }

      // Declining: negative trend
      if (previousAvg > 0 && avgClicksPerDay < previousAvg * 0.7) {
        return { type: "declining", label: "📉 declining" };
      }

      // At risk: health issues
      if (link.security_status === "threats_detected" || link.health_status === "unhealthy") {
        return { type: "at-risk", label: "⚠️ at risk" };
      }

      return null;
    },
  });
};
