import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { subDays, startOfDay } from "date-fns";

export interface LinkPageStats {
  totalViews: number;
  uniqueVisitors: number;
  totalClicks: number;
  clickThroughRate: number;
}

export interface BlockClickStat {
  blockId: string;
  blockType: string;
  blockTitle: string;
  clicks: number;
}

export interface DailyViewStat {
  date: string;
  views: number;
  clicks: number;
}

export function useLinkPageStats(pageId: string | undefined, days: number = 30) {
  return useQuery({
    queryKey: ["link-page-stats", pageId, days],
    queryFn: async () => {
      if (!pageId) return null;

      const startDate = startOfDay(subDays(new Date(), days)).toISOString();

      // Get all events for this page
      const { data: events, error } = await supabase
        .from("link_page_events")
        .select("event_type, visitor_hash")
        .eq("page_id", pageId)
        .gte("created_at", startDate);

      if (error) throw error;

      const pageViews = events?.filter((e) => e.event_type === "page_view") || [];
      const blockClicks = events?.filter((e) => e.event_type === "block_click") || [];
      
      const uniqueVisitors = new Set(pageViews.map((e) => e.visitor_hash).filter(Boolean)).size;
      const totalViews = pageViews.length;
      const totalClicks = blockClicks.length;
      const clickThroughRate = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;

      return {
        totalViews,
        uniqueVisitors,
        totalClicks,
        clickThroughRate,
      } as LinkPageStats;
    },
    enabled: !!pageId,
  });
}

export function useBlockClickStats(pageId: string | undefined, days: number = 30) {
  return useQuery({
    queryKey: ["link-page-block-clicks", pageId, days],
    queryFn: async () => {
      if (!pageId) return [];

      const startDate = startOfDay(subDays(new Date(), days)).toISOString();

      // Get click events with block info
      const { data: events, error } = await supabase
        .from("link_page_events")
        .select(`
          block_id,
          link_page_blocks!inner(id, type, data)
        `)
        .eq("page_id", pageId)
        .eq("event_type", "block_click")
        .gte("created_at", startDate);

      if (error) throw error;

      // Aggregate clicks by block
      const blockClicks = new Map<string, { type: string; title: string; clicks: number }>();
      
      events?.forEach((event) => {
        const block = event.link_page_blocks as unknown as { id: string; type: string; data: Record<string, unknown> };
        if (!block) return;
        
        const existing = blockClicks.get(block.id);
        if (existing) {
          existing.clicks++;
        } else {
          blockClicks.set(block.id, {
            type: block.type,
            title: (block.data?.title as string) || (block.data?.text as string) || block.type,
            clicks: 1,
          });
        }
      });

      return Array.from(blockClicks.entries())
        .map(([blockId, stats]) => ({
          blockId,
          blockType: stats.type,
          blockTitle: stats.title,
          clicks: stats.clicks,
        }))
        .sort((a, b) => b.clicks - a.clicks) as BlockClickStat[];
    },
    enabled: !!pageId,
  });
}

export function usePageViewsTimeSeries(pageId: string | undefined, days: number = 30) {
  return useQuery({
    queryKey: ["link-page-views-timeseries", pageId, days],
    queryFn: async () => {
      if (!pageId) return [];

      const startDate = startOfDay(subDays(new Date(), days)).toISOString();

      const { data: events, error } = await supabase
        .from("link_page_events")
        .select("event_type, created_at")
        .eq("page_id", pageId)
        .gte("created_at", startDate)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Group by date
      const dailyStats = new Map<string, { views: number; clicks: number }>();
      
      events?.forEach((event) => {
        const date = new Date(event.created_at).toISOString().split("T")[0];
        const existing = dailyStats.get(date) || { views: 0, clicks: 0 };
        
        if (event.event_type === "page_view") {
          existing.views++;
        } else if (event.event_type === "block_click") {
          existing.clicks++;
        }
        
        dailyStats.set(date, existing);
      });

      return Array.from(dailyStats.entries())
        .map(([date, stats]) => ({
          date,
          views: stats.views,
          clicks: stats.clicks,
        }))
        .sort((a, b) => a.date.localeCompare(b.date)) as DailyViewStat[];
    },
    enabled: !!pageId,
  });
}
