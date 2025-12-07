import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, subDays, format } from "date-fns";

interface UseExecutiveMetricsParams {
  workspaceId: string;
  dateRange?: number;
}

export interface ExecutiveMetrics {
  totalClicks: number;
  uniqueVisitors: number;
  conversionRate: number;
  revenue: number;
  clicksChange: number;
  visitorsChange: number;
  conversionChange: number;
  revenueChange: number;
  clicksTrend: number[];
  visitorsTrend: number[];
  topChannel: string;
  topChannelClicks: number;
  avgClicksPerDay: number;
  peakDay: string;
  peakDayClicks: number;
}

export const useExecutiveMetrics = ({ workspaceId, dateRange = 30 }: UseExecutiveMetricsParams) => {
  return useQuery({
    queryKey: ["executive-metrics", workspaceId, dateRange],
    queryFn: async (): Promise<ExecutiveMetrics> => {
      const currentStart = startOfDay(subDays(new Date(), dateRange));
      const previousStart = startOfDay(subDays(new Date(), dateRange * 2));
      const previousEnd = currentStart;

      // Fetch current and previous period data in parallel
      const [
        { data: currentClicks },
        { data: previousClicks },
        { data: conversions },
        { data: links }
      ] = await Promise.all([
        supabase
          .from("link_clicks")
          .select("id, is_unique, clicked_at, referrer, links!inner(workspace_id)")
          .eq("links.workspace_id", workspaceId)
          .gte("clicked_at", currentStart.toISOString()),
        supabase
          .from("link_clicks")
          .select("id, is_unique, links!inner(workspace_id)")
          .eq("links.workspace_id", workspaceId)
          .gte("clicked_at", previousStart.toISOString())
          .lt("clicked_at", previousEnd.toISOString()),
        supabase
          .from("conversion_events")
          .select("id, event_value")
          .eq("workspace_id", workspaceId)
          .gte("created_at", currentStart.toISOString()),
        supabase
          .from("links")
          .select("id, total_clicks")
          .eq("workspace_id", workspaceId)
      ]);

      // Calculate current metrics
      const totalClicks = currentClicks?.length || 0;
      const uniqueVisitors = currentClicks?.filter(c => c.is_unique).length || 0;
      const totalConversions = conversions?.length || 0;
      const revenue = conversions?.reduce((sum, c) => sum + (c.event_value || 0), 0) || 0;
      const conversionRate = uniqueVisitors > 0 ? (totalConversions / uniqueVisitors) * 100 : 0;

      // Calculate previous metrics for comparison
      const prevTotalClicks = previousClicks?.length || 0;
      const prevUniqueVisitors = previousClicks?.filter(c => c.is_unique).length || 0;

      // Calculate changes
      const calculateChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
      };

      const clicksChange = calculateChange(totalClicks, prevTotalClicks);
      const visitorsChange = calculateChange(uniqueVisitors, prevUniqueVisitors);

      // Build daily trend data (last 7 days for sparklines)
      const clicksByDay = new Map<string, number>();
      const visitorsByDay = new Map<string, number>();
      
      currentClicks?.forEach(click => {
        const day = format(new Date(click.clicked_at), 'yyyy-MM-dd');
        clicksByDay.set(day, (clicksByDay.get(day) || 0) + 1);
        if (click.is_unique) {
          visitorsByDay.set(day, (visitorsByDay.get(day) || 0) + 1);
        }
      });

      // Get last 7 days trend
      const last7Days = Array.from({ length: 7 }, (_, i) => 
        format(subDays(new Date(), 6 - i), 'yyyy-MM-dd')
      );
      
      const clicksTrend = last7Days.map(day => clicksByDay.get(day) || 0);
      const visitorsTrend = last7Days.map(day => visitorsByDay.get(day) || 0);

      // Find top channel from referrers
      const channelMap = new Map<string, number>();
      currentClicks?.forEach(click => {
        let channel = 'Direct';
        if (click.referrer) {
          try {
            const url = new URL(click.referrer);
            const domain = url.hostname.replace('www.', '');
            if (domain.includes('google')) channel = 'Google';
            else if (domain.includes('linkedin')) channel = 'LinkedIn';
            else if (domain.includes('twitter') || domain.includes('x.com')) channel = 'Twitter/X';
            else if (domain.includes('facebook')) channel = 'Facebook';
            else if (domain.includes('instagram')) channel = 'Instagram';
            else channel = domain;
          } catch {
            channel = click.referrer;
          }
        }
        channelMap.set(channel, (channelMap.get(channel) || 0) + 1);
      });

      const sortedChannels = Array.from(channelMap.entries()).sort((a, b) => b[1] - a[1]);
      const topChannel = sortedChannels[0]?.[0] || 'N/A';
      const topChannelClicks = sortedChannels[0]?.[1] || 0;

      // Find peak day
      const sortedDays = Array.from(clicksByDay.entries()).sort((a, b) => b[1] - a[1]);
      const peakDay = sortedDays[0]?.[0] || 'N/A';
      const peakDayClicks = sortedDays[0]?.[1] || 0;

      // Average clicks per day
      const avgClicksPerDay = dateRange > 0 ? Math.round(totalClicks / dateRange) : 0;

      return {
        totalClicks,
        uniqueVisitors,
        conversionRate,
        revenue,
        clicksChange,
        visitorsChange,
        conversionChange: 0, // Would need previous period conversion data
        revenueChange: 0,
        clicksTrend,
        visitorsTrend,
        topChannel,
        topChannelClicks,
        avgClicksPerDay,
        peakDay,
        peakDayClicks
      };
    },
    enabled: !!workspaceId,
    staleTime: 2 * 60 * 1000
  });
};
