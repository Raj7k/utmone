import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface GoldenPath {
  path_id: number;
  path_nodes: string[];
  path_node_ids: string[];
  total_steps: number;
  total_value: number;
  avg_probability: number;
  is_pareto_optimal: boolean;
  efficiency_score: number;
}

export const useGoldenPaths = (
  workspaceId: string | undefined,
  startNodeType: string = "source",
  endNodeType: string = "conversion"
) => {
  return useQuery({
    queryKey: ["golden-paths", workspaceId, startNodeType, endNodeType],
    queryFn: async () => {
      if (!workspaceId) throw new Error("Workspace ID required");

      const { data, error } = await (supabase as any).rpc("find_pareto_optimal_paths", {
        p_workspace_id: workspaceId,
        p_start_node_type: startNodeType,
        p_end_node_type: endNodeType,
        p_max_path_length: 10,
      });

      if (error) throw error;
      return data as GoldenPath[];
    },
    enabled: !!workspaceId,
  });
};
