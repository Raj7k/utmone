import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DeleteLinkParams {
  linkId: string;
  permanent: boolean;
}

export const useDeleteLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ linkId, permanent }: DeleteLinkParams) => {
      if (permanent) {
        // Hard delete
        const { error } = await supabase
          .from("links")
          .delete()
          .eq("id", linkId);

        if (error) throw error;
      } else {
        // Soft delete (archive)
        const { error } = await supabase
          .from("links")
          .update({ status: "archived" })
          .eq("id", linkId);

        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["enhanced-links"] });
      queryClient.invalidateQueries({ queryKey: ["link-detail", variables.linkId] });
      toast.success(variables.permanent ? "Link deleted permanently" : "Link archived");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete link");
    },
  });
};
