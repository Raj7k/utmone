import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { toast } from "sonner";

export interface BulkUploadComment {
  id: string;
  bulk_upload_id: string;
  user_id: string;
  comment_text: string;
  is_resolved: boolean;
  created_at: string;
  updated_at: string;
}

export const useBulkUploadComments = (bulkUploadId: string | null) => {
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["bulk-upload-comments", bulkUploadId],
    queryFn: async () => {
      if (!bulkUploadId) return [];

      const { data, error } = await supabaseFrom('bulk_upload_comments')
        .select("*")
        .eq("bulk_upload_id", bulkUploadId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as BulkUploadComment[];
    },
    enabled: !!bulkUploadId,
  });

  const addComment = useMutation({
    mutationFn: async ({ 
      comment, 
      parentId, 
      mentions 
    }: { 
      comment: string; 
      parentId?: string | null;
      mentions?: string[];
    }) => {
      if (!bulkUploadId) throw new Error("No bulk upload ID");

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabaseFrom('bulk_upload_comments')
        .insert({
          bulk_upload_id: bulkUploadId,
          user_id: user.id,
          comment_text: comment,
          parent_id: parentId || null,
          mentioned_users: mentions || [],
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bulk-upload-comments", bulkUploadId] });
      toast.success("comment added");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const resolveComment = useMutation({
    mutationFn: async ({ commentId, resolved }: { commentId: string; resolved: boolean }) => {
      const { error } = await supabaseFrom('bulk_upload_comments')
        .update({ is_resolved: resolved })
        .eq("id", commentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bulk-upload-comments", bulkUploadId] });
      toast.success("comment updated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    comments,
    isLoading,
    addComment,
    resolveComment,
  };
};
