import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface LinkDetail {
  id: string;
  title: string;
  description: string | null;
  destination_url: string;
  short_url: string | null;
  final_url: string;
  domain: string;
  path: string;
  slug: string;
  status: "active" | "paused" | "archived";
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  redirect_type: string | null;
  expires_at: string | null;
  max_clicks: number | null;
  custom_expiry_message: string | null;
  fallback_url: string | null;
  total_clicks: number | null;
  unique_clicks: number | null;
  last_clicked_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  created_by: string;
  workspace_id: string;
  folder_id: string | null;
  owner: {
    full_name: string | null;
    email: string;
  };
  folder: {
    name: string;
  } | null;
  tags: string[];
  qr_code_count: number;
}

export const useLinkDetail = (linkId: string) => {
  return useQuery({
    queryKey: ["link-detail", linkId],
    queryFn: async () => {
      // Fetch link with owner profile and folder
      const { data: link, error: linkError } = await supabase
        .from("links")
        .select(`
          *,
          owner:profiles!links_created_by_fkey(full_name, email),
          folder:folders(name)
        `)
        .eq("id", linkId)
        .single();

      if (linkError) throw linkError;
      if (!link) throw new Error("Link not found");

      // Fetch tags
      const { data: tags, error: tagsError } = await supabase
        .from("link_tags")
        .select("tag")
        .eq("link_id", linkId);

      if (tagsError) throw tagsError;

      // Fetch QR code count
      const { count: qrCount, error: qrError } = await supabase
        .from("qr_codes")
        .select("*", { count: "exact", head: true })
        .eq("link_id", linkId);

      if (qrError) throw qrError;

      return {
        ...link,
        owner: link.owner,
        folder: link.folder,
        tags: tags?.map((t) => t.tag) || [],
        qr_code_count: qrCount || 0,
      } as LinkDetail;
    },
    enabled: !!linkId,
  });
};
