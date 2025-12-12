import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuditLog } from "@/hooks/useAuditLog";

interface DeleteLinkParams {
  linkId: string;
  permanent: boolean;
}

export const useDeleteLink = () => {
  const queryClient = useQueryClient();
  const { logAction } = useAuditLog();

  return useMutation({
    mutationFn: async ({ linkId, permanent }: DeleteLinkParams) => {
      // Fetch link before deletion for audit log
      const { data: link } = await supabase
        .from("links")
        .select("*")
        .eq("id", linkId)
        .single();

      if (permanent) {
        // Hard delete
        const { error } = await supabase
          .from("links")
          .delete()
          .eq("id", linkId);

        if (error) throw error;
        
        // Log audit action
        if (link) {
          await logAction({
            action: 'delete',
            resourceType: 'link',
            resourceId: linkId,
            oldValues: link,
          });
        }
      } else {
        // Soft delete (archive)
        const { error } = await supabase
          .from("links")
          .update({ status: "archived" })
          .eq("id", linkId);

        if (error) throw error;
        
        // Log audit action
        if (link) {
          await logAction({
            action: 'archive',
            resourceType: 'link',
            resourceId: linkId,
            oldValues: { status: link.status },
            newValues: { status: 'archived' },
          });
        }
      }
      
      return { linkId, permanent, link };
    },
    // Optimistic update for instant UI feedback
    onMutate: async ({ linkId, permanent }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["enhanced-links"] });

      // Snapshot previous value
      const previousLinks = queryClient.getQueryData(["enhanced-links"]);

      // Optimistically update
      queryClient.setQueryData(["enhanced-links"], (old: any) => {
        if (!old?.links) return old;
        
        if (permanent) {
          // Remove from list
          return {
            ...old,
            links: old.links.filter((link: any) => link.id !== linkId),
            totalCount: Math.max(0, (old.totalCount || 0) - 1),
          };
        } else {
          // Update status to archived
          return {
            ...old,
            links: old.links.map((link: any) =>
              link.id === linkId ? { ...link, status: "archived" } : link
            ),
          };
        }
      });

      return { previousLinks };
    },
    onError: (error: Error, _, context) => {
      // Rollback on error
      if (context?.previousLinks) {
        queryClient.setQueryData(["enhanced-links"], context.previousLinks);
      }
      toast.error(error.message || "Failed to delete link");
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["enhanced-links"] });
      queryClient.invalidateQueries({ queryKey: ["link-detail", variables.linkId] });
      toast.success(variables.permanent ? "Link deleted permanently" : "Link archived");
    },
  });
};
