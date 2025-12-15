import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { requireUserId } from "@/lib/getCachedUser";

export interface BulkUploadActivity {
  id: string;
  bulk_upload_id: string;
  workspace_id: string;
  user_id: string;
  action_type: string;
  metadata: Record<string, any>;
  created_at: string;
}

export const useBulkUploadActivity = (bulkUploadId: string | null) => {
  const queryClient = useQueryClient();

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["bulk-upload-activity", bulkUploadId],
    queryFn: async () => {
      if (!bulkUploadId) return [];

      const { data, error } = await supabase
        .from("bulk_upload_activity")
        .select("*")
        .eq("bulk_upload_id", bulkUploadId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as BulkUploadActivity[];
    },
    enabled: !!bulkUploadId,
  });

  const logActivity = useMutation({
    mutationFn: async ({
      bulkUploadId,
      workspaceId,
      actionType,
      metadata,
    }: {
      bulkUploadId: string;
      workspaceId: string;
      actionType: string;
      metadata?: Record<string, any>;
    }) => {
      const userId = requireUserId();

      const { error } = await supabase
        .from("bulk_upload_activity")
        .insert({
          bulk_upload_id: bulkUploadId,
          workspace_id: workspaceId,
          user_id: userId,
          action_type: actionType,
          metadata: metadata || {},
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bulk-upload-activity", bulkUploadId] });
    },
  });

  return {
    activities,
    isLoading,
    logActivity,
  };
};
