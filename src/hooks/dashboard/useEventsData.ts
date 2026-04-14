import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { useWorkspace } from "@/hooks/workspace/useWorkspace";
import { getCachedWorkspaceId } from "@/contexts/AppSessionContext";

export interface FieldEvent {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  location_city: string;
  location_country: string;
  direct_scans: number;
  halo_visitors: number;
  lift_percentage: number;
  status: string;
}

/**
 * Lightweight hook for Events page - only fetches field events
 * Reduces 10 queries to 1 for Events page
 */
export const useEventsData = () => {
  const { currentWorkspace } = useWorkspace();
  const workspaceId = currentWorkspace?.id || getCachedWorkspaceId() || "";

  return useQuery({
    queryKey: ["field-events", workspaceId],
    queryFn: async (): Promise<FieldEvent[]> => {
      const { data, error } = await supabaseFrom('field_events')
        .select("id, name, start_date, end_date, location_city, location_country, direct_scans, halo_visitors, lift_percentage, status")
        .eq("workspace_id", workspaceId)
        .order("start_date", { ascending: false })
        .limit(10);

      if (error) throw error;

      return (data || []).map(e => ({
        id: e.id,
        name: e.name || "",
        start_date: e.start_date || "",
        end_date: e.end_date || "",
        location_city: e.location_city || "",
        location_country: e.location_country || "",
        direct_scans: e.direct_scans || 0,
        halo_visitors: e.halo_visitors || 0,
        lift_percentage: Number(e.lift_percentage) || 0,
        status: e.status || "upcoming"
      }));
    },
    enabled: !!workspaceId,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
