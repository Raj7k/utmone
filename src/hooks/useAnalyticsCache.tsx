import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for cached analytics queries using materialized views
 * Provides 5-minute cache with automatic refresh
 */

export const useAnalyticsCache = () => {
  const queryClient = useQueryClient();

  const invalidateAnalytics = () => {
    queryClient.invalidateQueries({ queryKey: ['analytics'] });
  };

  return { invalidateAnalytics };
};

// Link Analytics (uses mv_link_analytics via security definer function)
export const useCachedLinkAnalytics = (workspaceId: string) => {
  return useQuery({
    queryKey: ['analytics', 'links', workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_link_analytics', { p_workspace_id: workspaceId });

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// UTM Campaign Analytics (uses mv_utm_campaign_analytics via security definer function)
export const useCachedUTMAnalytics = (workspaceId: string) => {
  return useQuery({
    queryKey: ['analytics', 'utm', workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_utm_analytics', { p_workspace_id: workspaceId });

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Geolocation Analytics (uses mv_geolocation_analytics via security definer function)
export const useCachedGeolocationAnalytics = (workspaceId: string) => {
  return useQuery({
    queryKey: ['analytics', 'geolocation', workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_geolocation_analytics', { p_workspace_id: workspaceId });

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Device Analytics (uses mv_device_analytics via security definer function)
export const useCachedDeviceAnalytics = (workspaceId: string) => {
  return useQuery({
    queryKey: ['analytics', 'device', workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_device_analytics', { p_workspace_id: workspaceId });

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Time Series Analytics (uses mv_click_time_series via security definer function)
export const useCachedTimeSeriesAnalytics = (
  workspaceId: string,
  linkId?: string,
  days: number = 30
) => {
  return useQuery({
    queryKey: ['analytics', 'timeseries', workspaceId, linkId, days],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_time_series_analytics', {
          p_workspace_id: workspaceId,
          p_link_id: linkId || null,
          p_days: days
        });

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
