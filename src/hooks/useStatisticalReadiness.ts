import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { calculateRequiredSampleSize } from "@/lib/statisticalPower";

interface ReadinessResult {
  isReady: boolean;
  progress: number;
  samplesNeeded: number;
  currentSamples: number;
}

export const useStatisticalReadiness = (linkId: string) => {
  return useQuery({
    queryKey: ["statistical-readiness", linkId],
    queryFn: async (): Promise<ReadinessResult> => {
      const { data: link } = await supabase
        .from("links")
        .select("total_clicks")
        .eq("id", linkId)
        .single();

      const { data: conversions } = await supabase
        .from("conversion_events")
        .select("id")
        .eq("link_id", linkId);

      const currentSamples = link?.total_clicks || 0;
      const conversionCount = conversions?.length || 0;
      const conversionRate = currentSamples > 0 ? conversionCount / currentSamples : 0.05;

      // Calculate required sample size for 80% power, 5% significance, 20% effect
      const requiredSamples = calculateRequiredSampleSize(
        Math.max(conversionRate, 0.01),
        0.2,
        0.05,
        0.8
      );

      const progress = Math.min((currentSamples / requiredSamples) * 100, 100);
      const isReady = currentSamples >= requiredSamples;

      return {
        isReady,
        progress: Math.round(progress),
        samplesNeeded: Math.max(0, requiredSamples - currentSamples),
        currentSamples,
      };
    },
    enabled: !!linkId,
  });
};
