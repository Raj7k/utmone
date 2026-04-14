import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";

interface FunnelData {
  clicks: number;
  leads: number;
  purchases: number;
  revenue: number;
  clickToLeadRate: number;
  leadToPurchaseRate: number;
  clickToPurchaseRate: number;
}

export function useConversionFunnel(linkId?: string, workspaceId?: string) {
  return useQuery({
    queryKey: ['conversion-funnel', linkId, workspaceId],
    queryFn: async (): Promise<FunnelData> => {
      // Build query based on filters
      let clicksQuery = supabaseFrom('link_clicks')
        .select('id, link_id', { count: 'exact' });

      let conversionsQuery = supabaseFrom('conversion_events')
        .select('event_type, event_value, link_id');

      if (linkId) {
        clicksQuery = clicksQuery.eq('link_id', linkId);
        conversionsQuery = conversionsQuery.eq('link_id', linkId);
      } else if (workspaceId) {
        clicksQuery = clicksQuery.eq('workspace_id', workspaceId);
        conversionsQuery = conversionsQuery.eq('workspace_id', workspaceId);
      }

      const [clicksResult, conversionsResult] = await Promise.all([
        clicksQuery,
        conversionsQuery,
      ]);

      if (clicksResult.error) throw clicksResult.error;
      if (conversionsResult.error) throw conversionsResult.error;

      const clicks = clicksResult.count || 0;
      const conversions = conversionsResult.data || [];

      const leads = conversions.filter(c => c.event_type === 'lead').length;
      const purchases = conversions.filter(c => c.event_type === 'purchase').length;
      const revenue = conversions
        .filter(c => c.event_type === 'purchase')
        .reduce((sum, c) => sum + (c.event_value || 0), 0);

      const clickToLeadRate = clicks > 0 ? (leads / clicks) * 100 : 0;
      const leadToPurchaseRate = leads > 0 ? (purchases / leads) * 100 : 0;
      const clickToPurchaseRate = clicks > 0 ? (purchases / clicks) * 100 : 0;

      return {
        clicks,
        leads,
        purchases,
        revenue,
        clickToLeadRate,
        leadToPurchaseRate,
        clickToPurchaseRate,
      };
    },
    enabled: !!linkId || !!workspaceId,
  });
}