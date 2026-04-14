import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// UUID validation helper - prevents invalid queries like "create" being passed as linkId
const isValidUUID = (id: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

export interface LinkDetail {
  id: string;
  title: string | null;
  description: string | null;
  destination_url: string;
  short_url: string | null;
  domain: string | null;
  slug: string | null;
  status: "active" | "paused" | "archived";
  security_status: string;
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
  fallback_url: string | null;
  total_clicks: number;
  geo_targets: any;
  created_at: string;
  updated_at: string;
  created_by: string;
  workspace_id: string;
  password_hash: string | null;
  qr_code_count: number;
}

export const useLinkDetail = (linkId: string) => {
  const validId = linkId && isValidUUID(linkId);
  
  return useQuery({
    queryKey: ["link-detail", linkId],
    queryFn: async () => {
      const { data: link, error: linkError } = await supabase
        .from("links")
        .select(
          "id, title, description, destination_url, short_url, domain, slug, status, security_status, utm_source, utm_medium, utm_campaign, utm_term, utm_content, og_title, og_description, og_image, redirect_type, expires_at, max_clicks, fallback_url, total_clicks, geo_targets, created_at, updated_at, created_by, workspace_id, password_hash"
        )
        .eq("id", linkId)
        .single();

      if (linkError) throw linkError;
      if (!link) throw new Error("Link not found");

      // Fetch QR code count separately (no FK constraint)
      const { count: qrCount } = await supabase
        .from("qr_codes")
        .select("id", { count: "exact", head: true })
        .eq("link_id", linkId);

      return {
        ...link,
        qr_code_count: qrCount || 0,
      } as LinkDetail;
    },
    enabled: !!validId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
