import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ChannelInfluence {
  channel: string;
  channel_name: string;
  total_journeys: number;
  converted_journeys: number;
  conversion_rate: number;
  baseline_conversion_rate: number;
  lift: number;
  influence_score: number;
  total_revenue: number;
  avg_revenue: number;
}

export interface InfluenceGraphData {
  channels: ChannelInfluence[];
  baseline_conversion_rate: number;
  total_journeys: number;
  converted_journeys: number;
}

export const useInfluenceGraph = (workspaceId: string | undefined, days: number = 30) => {
  return useQuery({
    queryKey: ["influence-graph", workspaceId, days],
    queryFn: async (): Promise<InfluenceGraphData> => {
      if (!workspaceId) {
        throw new Error("Workspace ID required");
      }

      const { data, error } = await supabase.functions.invoke("calculate-influence", {
        body: { workspace_id: workspaceId, days },
      });

      if (error) throw error;
      return data;
    },
    enabled: !!workspaceId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};