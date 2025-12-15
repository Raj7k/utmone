import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { requireUserId } from "@/lib/getCachedUser";

export interface BulkOperation {
  id: string;
  workspace_id: string;
  operation_type: string;
  link_ids: string[];
  parameters: Record<string, any>;
  status: string;
  affected_count: number;
  error_message?: string;
  created_by?: string;
  created_at: string;
  completed_at?: string;
}

export const useBulkOperations = (workspaceId: string) => {
  const queryClient = useQueryClient();

  const { data: operations = [], isLoading } = useQuery({
    queryKey: ["bulk-operations", workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bulk_operations_log")
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as BulkOperation[];
    },
    enabled: !!workspaceId,
  });

  const executeBulkOperation = useMutation({
    mutationFn: async ({
      operationType,
      linkIds,
      parameters,
    }: {
      operationType: string;
      linkIds: string[];
      parameters: Record<string, any>;
    }) => {
      const userId = requireUserId();

      // Create operation log
      const { data: operation, error: logError } = await supabase
        .from("bulk_operations_log")
        .insert({
          workspace_id: workspaceId,
          operation_type: operationType,
          link_ids: linkIds,
          parameters,
          created_by: userId,
          status: "processing",
        })
        .select()
        .single();

      if (logError) throw logError;

      try {
        let affected = 0;

        switch (operationType) {
          case "edit_utms":
            // Update UTM parameters for selected links
            const { data: utmData } = await supabase
              .from("links")
              .update({
                utm_source: parameters.utm_source,
                utm_medium: parameters.utm_medium,
                utm_campaign: parameters.utm_campaign,
                utm_term: parameters.utm_term,
                utm_content: parameters.utm_content,
              })
              .in("id", linkIds)
              .select();
            affected = utmData?.length || 0;
            break;

          case "archive":
            const { data: archiveData } = await supabase
              .from("links")
              .update({ status: "archived" })
              .in("id", linkIds)
              .select();
            affected = archiveData?.length || 0;
            break;

          case "delete":
            const { data: deleteData } = await supabase
              .from("links")
              .delete()
              .in("id", linkIds)
              .select();
            affected = deleteData?.length || 0;
            break;

          case "add_tags":
            // Add tags to selected links
            const tagInserts = linkIds.flatMap(linkId =>
              parameters.tags.map((tag: string) => ({
                link_id: linkId,
                tag_name: tag,
              }))
            );
            const { data: tagData } = await supabase
              .from("link_tags")
              .insert(tagInserts)
              .select();
            affected = tagData?.length || 0;
            break;

          case "migrate_domain":
            const { data: migrateData } = await supabase
              .from("links")
              .update({
                domain: parameters.new_domain,
                path: parameters.new_path,
              })
              .in("id", linkIds)
              .select();
            affected = migrateData?.length || 0;
            break;
        }

        // Update operation as completed
        await supabase
          .from("bulk_operations_log")
          .update({
            status: "completed",
            affected_count: affected,
            completed_at: new Date().toISOString(),
          })
          .eq("id", operation.id);

        return { ...operation, affected_count: affected, status: "completed" };
      } catch (error: any) {
        // Update operation as failed
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["bulk-operations", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["enhanced-links"] });
      queryClient.invalidateQueries({ queryKey: ["links"] });
      toast.success(`Operation completed: ${data.affected_count} links affected`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Bulk operation failed");
    },
  });

  return {
    operations,
    isLoading,
    executeBulkOperation,
  };
};
