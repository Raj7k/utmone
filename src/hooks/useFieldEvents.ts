import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface FieldEvent {
  id: string;
  workspace_id: string;
  name: string;
  location_city: string;
  location_country: string;
  start_date: string;
  end_date: string;
  booth_link_id: string | null;
  direct_scans: number;
  badge_imports: number;
  halo_visitors: number;
  baseline_visitors: number;
  lift_percentage: number;
  attributed_pipeline: number;
  attributed_revenue: number;
  status: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface BadgeScan {
  id: string;
  event_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  title: string | null;
  scanned_at: string;
  visitor_id: string | null;
  conversion_status: string;
  created_at: string;
}

export const useFieldEvents = (workspaceId: string) => {
  return useQuery({
    queryKey: ['field-events', workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('field_events')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('start_date', { ascending: false });

      if (error) throw error;
      return data as FieldEvent[];
    },
    enabled: !!workspaceId,
  });
};

export const useFieldEvent = (eventId: string) => {
  return useQuery({
    queryKey: ['field-event', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('field_events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) throw error;
      return data as FieldEvent;
    },
    enabled: !!eventId,
  });
};

export const useEventBadgeScans = (eventId: string) => {
  return useQuery({
    queryKey: ['event-badge-scans', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_badge_scans')
        .select('*')
        .eq('event_id', eventId)
        .order('scanned_at', { ascending: false });

      if (error) throw error;
      return data as BadgeScan[];
    },
    enabled: !!eventId,
  });
};

export interface EventHaloResult {
  event_id: string;
  event_name: string;
  location_city: string;
  baseline_daily_average: number;
  baseline_total_visitors: number;
  event_visitors: number;
  halo_visitors: number;
  lift_percentage: number;
  event_duration_days: number;
  has_sufficient_data: boolean;
  direct_scans: number;
  total_impact: number;
  attributed_pipeline: number;
  timeseries: { visit_date: string; unique_visitors: number }[];
  event_start: string;
  event_end: string;
}

export const useCalculateEventHalo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, workspaceId }: { eventId: string; workspaceId: string }): Promise<EventHaloResult> => {
      const { data, error } = await supabase.functions.invoke('calculate-event-halo', {
        body: { event_id: eventId, workspace_id: workspaceId },
      });

      if (error) throw error;
      return data as EventHaloResult;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['field-events', variables.workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['field-event', variables.eventId] });
      // Cache the halo result with timeseries
      queryClient.setQueryData(['event-halo-result', variables.eventId], data);
    },
  });
};

export const useDeleteFieldEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, workspaceId }: { eventId: string; workspaceId: string }) => {
      const { error } = await supabase
        .from('field_events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['field-events', variables.workspaceId] });
    },
  });
};
