import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/hooks/workspace/useWorkspace";
import { getCachedWorkspaceId } from "@/contexts/AppSessionContext";

export interface SalesLink {
  id: string;
  title: string;
  slug: string;
  domain: string;
  short_url: string;
  destination_url: string;
  status: string;
  total_clicks: number;
  created_at: string;
  last_clicked_at: string | null;
  link_type: string;
  prospect_name?: string;
  alert_on_click?: boolean;
}

/**
 * Lightweight hook for Sales page - only fetches sales links
 * Reduces 10 queries to 1 for Sales page
 */
export const useSalesData = () => {
  const { currentWorkspace } = useWorkspace();
  const workspaceId = currentWorkspace?.id || getCachedWorkspaceId() || "";

  return useQuery({
    queryKey: ["sales-links", workspaceId],
    queryFn: async (): Promise<SalesLink[]> => {
      const { data, error } = await supabase
        .from("links")
        .select("id, title, slug, short_url, destination_url, status, total_clicks, created_at, last_clicked_at, link_type, prospect_name, alert_on_click")
        .eq("workspace_id", workspaceId)
        .eq("link_type", "sales")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      return (data || []).map(l => ({
        id: l.id,
        title: l.title || "",
        slug: l.slug || "",
        domain: "",
        short_url: l.short_url || "",
        destination_url: l.destination_url || "",
        status: l.status || "active",
        total_clicks: l.total_clicks || 0,
        created_at: l.created_at || "",
        last_clicked_at: l.last_clicked_at,
        link_type: l.link_type || "sales",
        prospect_name: l.prospect_name,
        alert_on_click: l.alert_on_click
      }));
    },
    enabled: !!workspaceId,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
