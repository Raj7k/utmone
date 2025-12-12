import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface HealthFactor {
  name: string;
  score: number;
  weight: number;
  status: "good" | "warning" | "poor";
}

export interface HealthResult {
  score: number;
  factors: HealthFactor[];
  recommendations: string[];
}

export type HealthScoreMap = Record<string, HealthResult>;

const calculateHealthScore = (link: any): HealthResult => {
  const factors: HealthFactor[] = [];
  const recommendations: string[] = [];

  // 1. Engagement Score (40% weight)
  const totalClicks = link.total_clicks || 0;
  
  let engagementScore = 0;
  if (totalClicks > 100) engagementScore = 100;
  else if (totalClicks > 50) engagementScore = 80;
  else if (totalClicks > 20) engagementScore = 60;
  else engagementScore = 30;

  factors.push({
    name: "engagement",
    score: engagementScore,
    weight: 0.4,
    status: engagementScore >= 80 ? "good" : engagementScore >= 60 ? "warning" : "poor",
  });

  if (engagementScore < 60) {
    recommendations.push("share your link more to increase engagement");
  }

  // 2. Conversion Score (30% weight) - simplified for batch
  const conversionCount = link.conversion_events?.[0]?.count || 0;
  const conversionRate = totalClicks > 0 ? (conversionCount / totalClicks) * 100 : 0;
  
  let conversionScore = 0;
  if (conversionRate > 5) conversionScore = 100;
  else if (conversionRate > 2) conversionScore = 80;
  else if (conversionRate > 0.5) conversionScore = 60;
  else conversionScore = 30;

  factors.push({
    name: "conversions",
    score: conversionScore,
    weight: 0.3,
    status: conversionScore >= 80 ? "good" : conversionScore >= 60 ? "warning" : "poor",
  });

  if (conversionScore < 60 && totalClicks > 50) {
    recommendations.push("install tracking pixel to capture conversions");
  }

  // 3. Security Score (15% weight)
  const securityScore = link.security_status === "safe" ? 100 : link.security_status === "not_scanned" ? 50 : 0;

  factors.push({
    name: "security",
    score: securityScore,
    weight: 0.15,
    status: securityScore >= 80 ? "good" : securityScore >= 50 ? "warning" : "poor",
  });

  if (securityScore < 80) {
    recommendations.push("scan your destination url for security");
  }

  // 4. UTM Completeness (15% weight)
  const utmFields = [link.utm_source, link.utm_medium, link.utm_campaign].filter(Boolean).length;
  const utmScore = (utmFields / 3) * 100;

  factors.push({
    name: "utm tags",
    score: utmScore,
    weight: 0.15,
    status: utmScore === 100 ? "good" : utmScore >= 66 ? "warning" : "poor",
  });

  if (utmScore < 100) {
    recommendations.push("add all utm tags for better tracking");
  }

  // Calculate weighted score
  const totalScore = factors.reduce((sum, f) => sum + f.score * f.weight, 0);

  return {
    score: Math.round(totalScore),
    factors,
    recommendations: recommendations.length > 0 ? recommendations : ["this link looks great"],
  };
};

/**
 * Batch fetch health scores for multiple links in a single query
 * Prevents N+1 query problem when rendering link lists
 */
export const useBatchLinkHealthScores = (linkIds: string[]) => {
  return useQuery({
    queryKey: ["link-health-batch", linkIds.sort().join(",")],
    queryFn: async (): Promise<HealthScoreMap> => {
      if (linkIds.length === 0) return {};

      const { data: links } = await supabase
        .from("links")
        .select(`
          id,
          total_clicks,
          unique_clicks,
          security_status,
          utm_source,
          utm_medium,
          utm_campaign,
          conversion_events(count)
        `)
        .in("id", linkIds);

      if (!links) return {};

      // Calculate scores for all links in one pass
      return links.reduce((map, link) => {
        map[link.id] = calculateHealthScore(link);
        return map;
      }, {} as HealthScoreMap);
    },
    enabled: linkIds.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
