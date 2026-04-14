import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";

interface ConversionMetrics {
  totalClicks: number;
  totalConversions: number;
  leads: number;
  signups: number;
  purchases: number;
  totalRevenue: number;
  conversionRate: number;
  avgOrderValue: number;
}

export const useConversionMetrics = (linkId?: string, workspaceId?: string) => {
  return useQuery({
    queryKey: ['conversion-metrics', linkId, workspaceId],
    queryFn: async (): Promise<ConversionMetrics> => {
      // Get click count
      let clickQuery = supabaseFrom('link_clicks')
        .select('*', { count: 'exact', head: true });

      if (linkId) {
        clickQuery = clickQuery.eq('link_id', linkId);
      } else if (workspaceId) {
        // Get all links in workspace first
        const { data: links } = await supabase
          .from('links')
          .select('id')
          .eq('workspace_id', workspaceId);
        
        const linkIds = links?.map(l => l.id) || [];
        if (linkIds.length > 0) {
          clickQuery = clickQuery.in('link_id', linkIds);
        }
      }

      const { count: totalClicks } = await clickQuery;

      // Get conversion events
      let conversionQuery = supabaseFrom('conversion_events')
        .select('event_type, event_value');

      if (linkId) {
        conversionQuery = conversionQuery.eq('link_id', linkId);
      } else if (workspaceId) {
        conversionQuery = conversionQuery.eq('workspace_id', workspaceId);
      }

      const { data: conversions } = await conversionQuery;

      // Calculate metrics
      const leads = conversions?.filter(c => c.event_type === 'lead').length || 0;
      const signups = conversions?.filter(c => c.event_type === 'signup').length || 0;
      const purchases = conversions?.filter(c => c.event_type === 'purchase').length || 0;
      const totalConversions = conversions?.length || 0;
      
      const totalRevenue = conversions
        ?.filter(c => c.event_type === 'purchase')
        .reduce((sum, c) => sum + (Number(c.event_value) || 0), 0) || 0;

      const conversionRate = totalClicks > 0 ? (purchases / totalClicks) * 100 : 0;
      const avgOrderValue = purchases > 0 ? totalRevenue / purchases : 0;

      return {
        totalClicks: totalClicks || 0,
        totalConversions,
        leads,
        signups,
        purchases,
        totalRevenue,
        conversionRate,
        avgOrderValue,
      };
    },
    enabled: !!linkId || !!workspaceId,
  });
};

// Hook for conversion events list
export const useConversionEvents = (linkId?: string, workspaceId?: string) => {
  return useQuery({
    queryKey: ['conversion-events', linkId, workspaceId],
    queryFn: async () => {
      let query = supabaseFrom('conversion_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (linkId) {
        query = query.eq('link_id', linkId);
      } else if (workspaceId) {
        query = query.eq('workspace_id', workspaceId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
    enabled: !!linkId || !!workspaceId,
  });
};
