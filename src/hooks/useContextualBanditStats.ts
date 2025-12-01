import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface BanditStats {
  context_key: string;
  destination_index: number;
  impressions: number;
  conversions: number;
  conversion_rate: number;
}

export function useContextualBanditStats(linkId: string) {
  return useQuery({
    queryKey: ["contextual-bandit-stats", linkId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("link_bandits")
        .select("context_key, destination_index, impressions, conversions")
        .eq("link_id", linkId)
        .order("impressions", { ascending: false });

      if (error) throw error;

      // Calculate conversion rates
      const stats: BanditStats[] = (data || []).map((item) => ({
        ...item,
        conversion_rate:
          item.impressions > 0
            ? (item.conversions / item.impressions) * 100
            : 0,
      }));

      return stats;
    },
    enabled: !!linkId,
  });
}
