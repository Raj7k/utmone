import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showErrorToast, showSuccessToast } from "@/lib/errorHandling";

interface JourneyNode {
  id: string;
  name: string;
  type: string;
  value: number;
  traffic: number;
  avgTimeToConversion: number;
}

interface JourneyEdge {
  id: string;
  source: string;
  target: string;
  probability: number;
  count: number;
  confidence: number;
  avgTime: number;
}

interface JourneyGraphData {
  nodes: JourneyNode[];
  edges: JourneyEdge[];
}

export const useJourneyGraph = (
  workspaceId: string | undefined,
  minConfidence: number = 0.5
) => {
  return useQuery({
    queryKey: ["journey-graph", workspaceId, minConfidence],
    queryFn: async (): Promise<JourneyGraphData> => {
      if (!workspaceId) return { nodes: [], edges: [] };

      const { data, error } = await supabase.rpc("get_journey_graph" as any, {
        p_workspace_id: workspaceId,
        p_min_confidence: minConfidence,
      });

      if (error) throw error;

      const result = data?.[0];
      return {
        nodes: result?.nodes || [],
        edges: result?.edges || [],
      };
    },
    enabled: !!workspaceId,
  });
};

export const useDiscoverStructure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      workspaceId,
      lookbackDays = 30,
      minTransitionCount = 10,
    }: {
      workspaceId: string;
      lookbackDays?: number;
      minTransitionCount?: number;
    }) => {
      const { data, error } = await supabase.rpc("discover_journey_structure" as any, {
        p_workspace_id: workspaceId,
        p_lookback_days: lookbackDays,
        p_min_transition_count: minTransitionCount,
      });

      if (error) throw error;
      return data?.[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["journey-graph"] });
      showSuccessToast(
        "Structure discovered",
        `${data.nodes_created} nodes and ${data.edges_created} edges discovered`
      );
    },
    onError: (error) => {
      showErrorToast(error);
    },
  });
};
