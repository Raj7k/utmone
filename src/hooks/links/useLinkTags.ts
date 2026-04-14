import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { toast } from "sonner";
import { useAppSession } from "@/contexts/AppSessionContext";

export interface LinkTag {
  id: string;
  link_id: string;
  tag_name: string;
  color: string;
  created_at: string;
  created_by?: string;
}

export const useLinkTags = (linkId: string | null) => {
  const queryClient = useQueryClient();
  const { user } = useAppSession();

  const { data: tags = [], isLoading } = useQuery({
    queryKey: ["link-tags", linkId],
    queryFn: async () => {
      if (!linkId) return [];

      const { data, error } = await supabaseFrom('link_tags')
        .select("*")
        .eq("link_id", linkId)
        .order("tag_name");

      if (error) throw error;
      return data as LinkTag[];
    },
    enabled: !!linkId,
  });

  const addTag = useMutation({
    mutationFn: async ({ tagName, color }: { tagName: string; color?: string }) => {
      if (!linkId) throw new Error("No link ID");
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabaseFrom('link_tags')
        .insert({
          link_id: linkId,
          tag_name: tagName.trim().toLowerCase(),
          color: color || "#3b82f6",
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["link-tags", linkId] });
      queryClient.invalidateQueries({ queryKey: ["enhanced-links"] });
      toast.success("Tag added");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add tag");
    },
  });

  const removeTag = useMutation({
    mutationFn: async (tagId: string) => {
      const { error } = await supabaseFrom('link_tags')
        .delete()
        .eq("id", tagId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["link-tags", linkId] });
      queryClient.invalidateQueries({ queryKey: ["enhanced-links"] });
      toast.success("Tag removed");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to remove tag");
    },
  });

  return {
    tags,
    isLoading,
    addTag,
    removeTag,
  };
};
