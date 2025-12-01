import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type AttributionModel = "linear" | "time_decay" | "position";

interface AttributionResult {
  source: string;
  medium: string;
  campaign: string;
  total_conversions: number;
  credit: number;
  total_revenue: number;
}

export const useAttribution = (
  workspaceId: string | undefined,
  model: AttributionModel,
  startDate: Date,
  endDate: Date
) => {
  return useQuery({
    queryKey: ["attribution", workspaceId, model, startDate, endDate],
    queryFn: async () => {
      if (!workspaceId) return [];

      const functionName =
        model === "linear"
          ? "calculate_linear_attribution"
          : model === "time_decay"
          ? "calculate_time_decay_attribution"
          : "calculate_position_attribution";

      const { data, error } = await supabase.rpc(functionName as any, {
        p_workspace_id: workspaceId,
        p_start_date: startDate.toISOString(),
        p_end_date: endDate.toISOString(),
      });

      if (error) throw error;
      return (data || []) as AttributionResult[];
    },
    enabled: !!workspaceId,
  });
};

interface JourneyEvent {
  event_id: string;
  event_type: string;
  source: string;
  medium: string;
  campaign: string;
  revenue: number;
  event_name: string;
  landing_page: string;
  referrer: string;
  device_type: string;
  created_at: string;
}

export const useCustomerJourney = (
  userId: string | undefined,
  workspaceId: string | undefined
) => {
  return useQuery({
    queryKey: ["customer-journey", userId, workspaceId],
    queryFn: async () => {
      if (!userId || !workspaceId) return [];

      const { data, error } = await supabase.rpc("get_customer_journey" as any, {
        p_user_id: userId,
        p_workspace_id: workspaceId,
      });

      if (error) throw error;
      return (data || []) as JourneyEvent[];
    },
    enabled: !!userId && !!workspaceId,
  });
};

interface JourneyFlowNode {
  source_node: string;
  target_node: string;
  flow_value: number;
  conversion_rate: number;
}

export const useJourneyFlow = (
  workspaceId: string | undefined,
  startDate: Date,
  endDate: Date
) => {
  return useQuery({
    queryKey: ["journey-flow", workspaceId, startDate, endDate],
    queryFn: async () => {
      if (!workspaceId) return [];

      const { data, error } = await supabase.rpc("get_journey_flow" as any, {
        p_workspace_id: workspaceId,
        p_start_date: startDate.toISOString(),
        p_end_date: endDate.toISOString(),
      });

      if (error) throw error;
      return (data || []) as JourneyFlowNode[];
    },
    enabled: !!workspaceId,
  });
};
