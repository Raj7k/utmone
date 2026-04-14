import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface StateValue {
  node_id: string;
  node_name: string;
  node_type: string;
  state_value: number;
  conversion_probability: number;
  next_best_action: string | null;
}

export const useStateValues = (
  workspaceId: string | undefined,
  conversionReward: number = 100,
  discountFactor: number = 0.95
) => {
  return useQuery({
    queryKey: ["state-values", workspaceId, conversionReward, discountFactor],
    queryFn: async () => {
      if (!workspaceId) throw new Error("Workspace ID required");

      const { data, error } = await (supabase as any).rpc("calculate_state_values", {
        p_workspace_id: workspaceId,
        p_conversion_reward: conversionReward,
        p_discount_factor: discountFactor,
        p_max_iterations: 100,
        p_convergence_threshold: 0.001,
      });

      if (error) throw error;
      return data as StateValue[];
    },
    enabled: !!workspaceId,
  });
};
