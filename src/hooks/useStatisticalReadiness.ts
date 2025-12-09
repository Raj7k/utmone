import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Practical tier-based thresholds for single-link analytics
const RELIABILITY_TIERS = {
  MINIMUM: 30,      // Minimum for any insights
  EARLY: 100,       // Early insights with caveats
  GOOD: 300,        // Good confidence for most metrics
  RELIABLE: 500     // Highly reliable data
};

export type ReliabilityTier = 'gathering' | 'minimum' | 'early' | 'good' | 'reliable';

interface ReadinessResult {
  isReady: boolean;
  progress: number;
  samplesNeeded: number;
  currentSamples: number;
  tier: ReliabilityTier;
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

      const currentSamples = link?.total_clicks || 0;

      // Calculate progress toward "reliable" threshold
      const progress = Math.min((currentSamples / RELIABILITY_TIERS.RELIABLE) * 100, 100);
      const isReady = currentSamples >= RELIABILITY_TIERS.RELIABLE;
      const samplesNeeded = Math.max(0, RELIABILITY_TIERS.RELIABLE - currentSamples);

      // Determine current tier for messaging
      let tier: ReliabilityTier = 'gathering';
      if (currentSamples >= RELIABILITY_TIERS.RELIABLE) tier = 'reliable';
      else if (currentSamples >= RELIABILITY_TIERS.GOOD) tier = 'good';
      else if (currentSamples >= RELIABILITY_TIERS.EARLY) tier = 'early';
      else if (currentSamples >= RELIABILITY_TIERS.MINIMUM) tier = 'minimum';

      return {
        isReady,
        progress: Math.round(progress),
        samplesNeeded,
        currentSamples,
        tier,
      };
    },
    enabled: !!linkId,
  });
};
