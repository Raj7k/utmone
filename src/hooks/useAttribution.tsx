import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";

export type AttributionModel = "linear" | "time_decay" | "position" | "cross_device";

interface AttributionResult {
  source: string;
  medium: string;
  campaign: string;
  total_conversions: number;
  credit: number;
  total_revenue: number;
  cross_device_conversions?: number;
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
          : model === "position"
          ? "calculate_position_attribution"
          : "calculate_cross_device_attribution";

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

      const { data, error } = await (supabase as any).rpc("get_customer_journey" as any, {
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

      const { data, error } = await (supabase as any).rpc("get_journey_flow" as any, {
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

// Identity Graph hooks
interface IdentityEdge {
  id: string;
  source_visitor_id: string;
  target_visitor_id: string;
  match_type: 'deterministic' | 'probabilistic';
  confidence: number;
  signals: Record<string, boolean>;
  created_at: string;
}

export const useIdentityGraph = (workspaceId: string | undefined) => {
  return useQuery({
    queryKey: ["identity-graph", workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];

      const { data, error } = await supabaseFrom('identity_edges')
        .select('*')
        .eq('workspace_id', workspaceId)
        .gte('confidence', 0.5)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return (data || []) as IdentityEdge[];
    },
    enabled: !!workspaceId,
  });
};

// Topic Attribution hooks
interface TopicAttribution {
  topic: string;
  conversions: number;
  total_revenue: number;
  link_count: number;
}

export const useTopicAttribution = (workspaceId: string | undefined) => {
  return useQuery({
    queryKey: ["topic-attribution", workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];

      const { data, error } = await (supabase as any).rpc("get_topic_attribution" as any, {
        p_workspace_id: workspaceId,
      });

      if (error) throw error;
      return (data || []) as TopicAttribution[];
    },
    enabled: !!workspaceId,
  });
};

// Import Batches hooks
interface ImportBatch {
  id: string;
  file_name: string;
  total_rows: number;
  matched_rows: number;
  unmatched_rows: number;
  status: 'processing' | 'completed' | 'failed';
  error_message?: string;
  created_at: string;
  completed_at?: string;
}

export const useImportBatches = (workspaceId: string | undefined) => {
  return useQuery({
    queryKey: ["import-batches", workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];

      const { data, error } = await supabaseFrom('import_batches')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return (data || []) as ImportBatch[];
    },
    enabled: !!workspaceId,
  });
};
