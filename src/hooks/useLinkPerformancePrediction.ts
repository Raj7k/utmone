import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PerformanceData {
  score: number;
  confidence: number;
  insights: string[];
  historicalCTR?: number;
  benchmarkCTR?: number;
}

interface UseLinkPerformancePredictionParams {
  workspaceId?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  enabled?: boolean;
}

export function useLinkPerformancePrediction({
  workspaceId,
  utmSource,
  utmMedium,
  utmCampaign,
  enabled = true,
}: UseLinkPerformancePredictionParams) {
  return useQuery<PerformanceData>({
    queryKey: ["link-performance-prediction", workspaceId, utmSource, utmMedium, utmCampaign],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("predict-link-performance", {
        body: {
          workspace_id: workspaceId,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
        },
      });

      if (error) throw error;
      return data;
    },
    enabled: enabled && !!workspaceId && (!!utmSource || !!utmMedium || !!utmCampaign),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
