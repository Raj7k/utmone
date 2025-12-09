import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface FieldEvent {
  id: string;
  workspace_id: string;
  name: string;
  location_city: string;
  location_country: string;
  control_city: string | null;
  start_date: string;
  end_date: string;
  booth_link_id: string | null;
  direct_scans: number;
  badge_imports: number;
  halo_visitors: number;
  halo_visitors_low: number;
  halo_visitors_high: number;
  baseline_visitors: number;
  lift_percentage: number;
  attributed_pipeline: number;
  attributed_revenue: number;
  calculation_metadata: Record<string, unknown> | null;
  status: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CalculationMetadata {
  baseline_days: number;
  baseline_period: { start: string; end: string };
  event_period: { start: string; end: string };
  bots_filtered: number;
  internal_ips_filtered: number;
  control_city: string | null;
  control_lift_percentage: number;
  divergence_score: number;
  calculated_at: string;
  methodology: string;
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

export interface ComparisonTimeseriesPoint {
  visit_date: string;
  target_visitors: number;
  control_visitors: number;
}

export interface EventHaloResult {
  event_id: string;
  event_name: string;
  location_city: string;
  control_city: string | null;
  // Target city metrics
  baseline_daily_average: number;
  baseline_total_visitors: number;
  event_visitors: number;
  halo_visitors: number;
  halo_visitors_low: number;
  halo_visitors_high: number;
  lift_percentage: number;
  event_duration_days: number;
  has_sufficient_data: boolean;
  // Control city metrics
  control_baseline_daily_average: number;
  control_event_visitors: number;
  control_lift_percentage: number;
  divergence_score: number;
  // Additional metrics
  direct_scans: number;
  total_impact: number;
  attributed_pipeline: number;
  // Comparison timeseries for scientific chart
  comparison_timeseries: ComparisonTimeseriesPoint[];
  // Audit metadata
  calculation_metadata: CalculationMetadata;
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
      queryClient.setQueryData(['event-halo-result', variables.eventId], data);
    },
  });
};

export interface LivePulseResult {
  current_hour_visitors: number;
  expected_visitors: number;
  pulse_percentage: number;
  pulse_status: 'excellent' | 'good' | 'moderate' | 'low';
}

export const useEventLivePulse = (workspaceId: string, eventCity: string, baselineHourlyAvg: number) => {
  return useQuery({
    queryKey: ['event-live-pulse', workspaceId, eventCity],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_event_live_pulse', {
        p_workspace_id: workspaceId,
        p_target_city: eventCity,
        p_baseline_hourly_avg: baselineHourlyAvg
      });

      if (error) throw error;
      return (data?.[0] || {
        current_hour_visitors: 0,
        expected_visitors: baselineHourlyAvg,
        pulse_percentage: 0,
        pulse_status: 'low'
      }) as LivePulseResult;
    },
    enabled: !!workspaceId && !!eventCity,
    refetchInterval: 60000, // Refresh every minute for live pulse
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

export const useUpdateEventControlCity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, controlCity }: { eventId: string; controlCity: string }) => {
      const { error } = await supabase
        .from('field_events')
        .update({ control_city: controlCity })
        .eq('id', eventId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['field-event', variables.eventId] });
    },
  });
};
