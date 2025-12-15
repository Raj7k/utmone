import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { requireUserId } from "@/lib/getCachedUser";

export interface BulkUploadApproval {
  id: string;
  bulk_upload_id: string;
  workspace_id: string;
  requested_by: string;
  approver_id: string | null;
  status: "pending" | "approved" | "rejected";
  notes: string | null;
  requested_at: string;
  reviewed_at: string | null;
  metadata: Record<string, any>;
}

export const useBulkUploadApprovals = (workspaceId: string) => {
  const queryClient = useQueryClient();

  const { data: approvals = [], isLoading } = useQuery({
    queryKey: ["bulk-upload-approvals", workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bulk_upload_approvals")
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("requested_at", { ascending: false });

      if (error) throw error;
      return data as BulkUploadApproval[];
    },
  });

  const requestApproval = useMutation({
    mutationFn: async ({ bulkUploadId, notes }: { bulkUploadId: string; notes?: string }) => {
      const userId = requireUserId();

      const { data, error } = await supabase
        .from("bulk_upload_approvals")
        .insert({
          bulk_upload_id: bulkUploadId,
          workspace_id: workspaceId,
          requested_by: userId,
          notes: notes || null,
          metadata: { links_count: 0 },
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bulk-upload-approvals", workspaceId] });
      toast.success("approval requested");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const reviewApproval = useMutation({
    mutationFn: async ({
      approvalId,
      status,
      notes,
    }: {
      approvalId: string;
      status: "approved" | "rejected";
      notes?: string;
    }) => {
      const userId = requireUserId();

      const { error } = await supabase
        .from("bulk_upload_approvals")
        .update({
          status,
          approver_id: userId,
          reviewed_at: new Date().toISOString(),
          notes: notes || null,
        })
        .eq("id", approvalId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bulk-upload-approvals", workspaceId] });
      toast.success("approval reviewed");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    approvals,
    isLoading,
    requestApproval,
    reviewApproval,
  };
};
