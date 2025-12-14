import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UpdateLinkData {
  linkId: string;
  title?: string;
  description?: string;
  destination_url?: string;
  domain?: string;
  path?: string;
  slug?: string;
  status?: "active" | "paused" | "archived";
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  redirect_type?: string | null;
  expires_at?: string | null;
  max_clicks?: number | null;
  custom_expiry_message?: string | null;
  fallback_url?: string | null;
  folder_id?: string | null;
}

export const useUpdateLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateLinkData) => {
      const { linkId, ...updateData } = data;

      // If slug is being updated, check uniqueness
      if (updateData.slug) {
        const { data: existingLink } = await supabase
          .from("links")
          .select("id")
          .eq("slug", updateData.slug)
          .neq("id", linkId)
          .single();

        if (existingLink) {
          throw new Error("This slug is already in use");
        }
      }

      // Build final_url if destination or UTMs are being updated
      let final_url: string | undefined;
      if (updateData.destination_url || Object.keys(updateData).some(k => k.startsWith("utm_"))) {
        // Fetch current link to get current values
        const { data: currentLink } = await supabase
          .from("links")
          .select("destination_url, utm_source, utm_medium, utm_campaign, utm_term, utm_content")
          .eq("id", linkId)
          .single();

        const destUrl = updateData.destination_url || currentLink?.destination_url || "";
        const utmParams = new URLSearchParams();

        const utmSource = updateData.utm_source !== undefined ? updateData.utm_source : currentLink?.utm_source;
        const utmMedium = updateData.utm_medium !== undefined ? updateData.utm_medium : currentLink?.utm_medium;
        const utmCampaign = updateData.utm_campaign !== undefined ? updateData.utm_campaign : currentLink?.utm_campaign;
        const utmTerm = updateData.utm_term !== undefined ? updateData.utm_term : currentLink?.utm_term;
        const utmContent = updateData.utm_content !== undefined ? updateData.utm_content : currentLink?.utm_content;

        if (utmSource) utmParams.append("utm_source", utmSource);
        if (utmMedium) utmParams.append("utm_medium", utmMedium);
        if (utmCampaign) utmParams.append("utm_campaign", utmCampaign);
        if (utmTerm) utmParams.append("utm_term", utmTerm);
        if (utmContent) utmParams.append("utm_content", utmContent);

        final_url = utmParams.toString() ? `${destUrl}?${utmParams.toString()}` : destUrl;
      }

      // Update link
      const { data: updatedLink, error } = await supabase
        .from("links")
        .update({
          ...updateData,
          ...(final_url && { final_url }),
          updated_at: new Date().toISOString(),
        })
        .eq("id", linkId)
        .select()
        .single();

      if (error) throw error;
      return updatedLink;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["link-detail", variables.linkId] });
      queryClient.invalidateQueries({ queryKey: ["enhanced-links"] });
      toast.success("Link updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update link");
    },
  });
};
