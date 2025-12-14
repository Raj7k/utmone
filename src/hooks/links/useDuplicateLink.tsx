import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useDuplicateLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (linkId: string) => {
      // Fetch source link
      const { data: sourceLink, error: fetchError } = await supabase
        .from("links")
        .select("*")
        .eq("id", linkId)
        .single();

      if (fetchError) throw fetchError;
      if (!sourceLink) throw new Error("Link not found");

      // Fetch tags
      const { data: tags } = await supabase
        .from("link_tags")
        .select("tag_name")
        .eq("link_id", linkId);

      // Generate new slug
      let newSlug = `${sourceLink.slug}-copy`;
      let counter = 1;

      // Check if slug exists
      while (true) {
        const { data: existing } = await supabase
          .from("links")
          .select("id")
          .eq("workspace_id", sourceLink.workspace_id)
          .eq("slug", newSlug)
          .single();

        if (!existing) break;
        
        counter++;
        newSlug = `${sourceLink.slug}-copy-${counter}`;
      }

      // Create new link
      const { data: newLink, error: createError } = await supabase
        .from("links")
        .insert({
          workspace_id: sourceLink.workspace_id,
          created_by: sourceLink.created_by,
          title: `${sourceLink.title} (Copy)`,
          description: sourceLink.description,
          destination_url: sourceLink.destination_url,
          domain: sourceLink.domain,
          path: sourceLink.path,
          slug: newSlug,
          status: "active",
          utm_source: sourceLink.utm_source,
          utm_medium: sourceLink.utm_medium,
          utm_campaign: sourceLink.utm_campaign,
          utm_term: sourceLink.utm_term,
          utm_content: sourceLink.utm_content,
          og_title: sourceLink.og_title,
          og_description: sourceLink.og_description,
          og_image: sourceLink.og_image,
          redirect_type: sourceLink.redirect_type,
          expires_at: null, // Don't copy expiry
          max_clicks: sourceLink.max_clicks,
          custom_expiry_message: sourceLink.custom_expiry_message,
          fallback_url: sourceLink.fallback_url,
          folder_id: sourceLink.folder_id,
          final_url: sourceLink.final_url,
          short_url: null, // Will be computed
        })
        .select()
        .single();

      if (createError) throw createError;

      // Copy tags
      if (tags && tags.length > 0) {
        const tagInserts = tags.map((t) => ({
          link_id: newLink.id,
          tag_name: t.tag_name,
        }));

        await supabase.from("link_tags").insert(tagInserts);
      }

      return newLink;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enhanced-links"] });
      toast.success("Link duplicated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to duplicate link");
    },
  });
};
