import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { SentinelConfig } from "./useSentinelConfig";
import type { Json } from "@/integrations/supabase/types";
import { requireUserId } from "@/lib/getCachedUser";

export interface BulkSentinelStats {
  total_links: number;
  sentinel_enabled: number;
  sentinel_disabled: number;
  coverage_percent: number;
}

export interface BulkSentinelOptions {
  enabled: boolean;
  defaultConfig?: SentinelConfig;
}

export function useBulkSentinelStats(workspaceId: string) {
  return useQuery({
    queryKey: ["bulk-sentinel-stats", workspaceId],
    queryFn: async (): Promise<BulkSentinelStats> => {
      const { data, error } = await supabase
        .from("links")
        .select("id, sentinel_enabled")
        .eq("workspace_id", workspaceId)
        .eq("status", "active");

      if (error) throw error;

      const total = data?.length || 0;
      const enabled = data?.filter(l => l.sentinel_enabled).length || 0;
      const disabled = total - enabled;

      return {
        total_links: total,
        sentinel_enabled: enabled,
        sentinel_disabled: disabled,
        coverage_percent: total > 0 ? Math.round((enabled / total) * 100) : 0,
      };
    },
    enabled: !!workspaceId,
  });
}

export function useBulkSentinelToggle(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ enabled, defaultConfig }: BulkSentinelOptions) => {
      const userId = requireUserId();

      // Get all active links in workspace
      const { data: links, error: fetchError } = await supabase
        .from("links")
        .select("id")
        .eq("workspace_id", workspaceId)
        .eq("status", "active");

      if (fetchError) throw fetchError;
      if (!links?.length) return { affected: 0 };

      const linkIds = links.map(l => l.id);

      // Create bulk operation log
      const { data: operation, error: logError } = await supabase
        .from("bulk_operations_log")
        .insert([{
          workspace_id: workspaceId,
          operation_type: "toggle_sentinel",
          link_ids: linkIds,
          parameters: { enabled, defaultConfig } as unknown as Json,
          created_by: userId,
          status: "processing",
        }])
        .select()
        .single();

      if (logError) throw logError;

      try {
        // Build update object
        const updateData: Record<string, unknown> = {
          sentinel_enabled: enabled,
        };

        // Apply default config if enabling and config provided
        if (enabled && defaultConfig) {
          updateData.sentinel_config = defaultConfig as Json;
        }

        const { data: updatedLinks, error: updateError } = await supabase
          .from("links")
          .update(updateData)
          .eq("workspace_id", workspaceId)
          .eq("status", "active")
          .select();

        if (updateError) throw updateError;

        const affected = updatedLinks?.length || 0;

        // Mark operation as completed
        await supabase
          .from("bulk_operations_log")
          .update({
            status: "completed",
            affected_count: affected,
            completed_at: new Date().toISOString(),
          })
          .eq("id", operation.id);

        return { affected };
      } catch (error: any) {
        // Mark operation as failed
        await supabase
          .from("bulk_operations_log")
          .update({
            status: "failed",
            error_message: error.message,
            completed_at: new Date().toISOString(),
          })
          .eq("id", operation.id);

        throw error;
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bulk-sentinel-stats", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["enhanced-links"] });
      queryClient.invalidateQueries({ queryKey: ["links"] });
      queryClient.invalidateQueries({ queryKey: ["bulk-operations", workspaceId] });
      
      const action = variables.enabled ? "enabled" : "disabled";
      toast.success(`sentinel ${action} on ${data.affected} links.`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "bulk sentinel toggle failed");
    },
  });
}
