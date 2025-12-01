import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PipelineStage {
  stage: string;
  count: number;
  conversion_rate: number;
  total_value: number;
  avg_value: number;
}

export const usePipelineFunnel = (
  workspaceId: string | undefined,
  startDate: Date,
  endDate: Date
) => {
  return useQuery({
    queryKey: ["pipeline-funnel", workspaceId, startDate, endDate],
    queryFn: async () => {
      if (!workspaceId) return [];

      const { data, error } = await supabase.rpc("get_pipeline_funnel", {
        p_workspace_id: workspaceId,
        p_start_date: startDate.toISOString(),
        p_end_date: endDate.toISOString(),
      });

      if (error) throw error;
      return (data || []) as PipelineStage[];
    },
    enabled: !!workspaceId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
