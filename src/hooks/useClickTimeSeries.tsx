import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, subDays, format, eachDayOfInterval, startOfWeek, startOfMonth, eachWeekOfInterval, eachMonthOfInterval } from "date-fns";

export type TimeSeriesGranularity = "daily" | "weekly" | "monthly";

interface TimeSeriesDataPoint {
  date: string;
  totalClicks: number;
  uniqueClicks: number;
}

interface UseClickTimeSeriesParams {
  workspaceId?: string;
  linkId?: string;
  campaignName?: string;
  days?: number;
  granularity?: TimeSeriesGranularity;
}

export const useClickTimeSeries = ({
  workspaceId,
  linkId,
  campaignName,
  days = 30,
  granularity = "daily"
}: UseClickTimeSeriesParams) => {
  return useQuery({
    queryKey: ["click-time-series", workspaceId, linkId, campaignName, days, granularity],
    queryFn: async () => {
      const endDate = new Date();
      const startDate = subDays(endDate, days);

      let query = supabase
        .from("link_clicks")
        .select("clicked_at, is_unique, link_id, workspace_id, links!inner(utm_campaign)")
        .gte("clicked_at", startDate.toISOString())
        .lte("clicked_at", endDate.toISOString());

      if (workspaceId) {
        query = query.eq("workspace_id", workspaceId);
      }

      if (linkId) {
        query = query.eq("link_id", linkId);
      }

      if (campaignName) {
        query = query.eq("links.utm_campaign", campaignName);
      }

      const { data: clicks, error } = await query;

      if (error) throw error;

      // Generate date intervals based on granularity
      let intervals: Date[];
      let formatString: string;
      let startFn: (date: Date) => Date;

      switch (granularity) {
        case "weekly":
          intervals = eachWeekOfInterval({ start: startDate, end: endDate }, { weekStartsOn: 1 });
          formatString = "MMM dd, yyyy";
          startFn = startOfWeek;
          break;
        case "monthly":
          intervals = eachMonthOfInterval({ start: startDate, end: endDate });
          formatString = "MMM yyyy";
          startFn = startOfMonth;
          break;
        case "daily":
        default:
          intervals = eachDayOfInterval({ start: startDate, end: endDate });
          formatString = "MMM dd";
          startFn = startOfDay;
          break;
      }

      // Initialize data structure with all dates
      const timeSeriesMap = new Map<string, TimeSeriesDataPoint>();
      intervals.forEach(date => {
        const key = format(date, formatString);
        timeSeriesMap.set(key, {
          date: key,
          totalClicks: 0,
          uniqueClicks: 0
        });
      });

      // Aggregate clicks by date
      clicks?.forEach(click => {
        const clickDate = new Date(click.clicked_at || "");
        const intervalStart = startFn(clickDate);
        const key = format(intervalStart, formatString);

        const existing = timeSeriesMap.get(key);
        if (existing) {
          existing.totalClicks += 1;
          if (click.is_unique) {
            existing.uniqueClicks += 1;
          }
        }
      });

      const timeSeries = Array.from(timeSeriesMap.values());

      // Calculate velocity (average clicks per day/week/month)
      const totalClicks = timeSeries.reduce((sum, point) => sum + point.totalClicks, 0);
      const velocity = intervals.length > 0 ? totalClicks / intervals.length : 0;

      return {
        timeSeries,
        velocity,
        totalClicks,
        totalUnique: timeSeries.reduce((sum, point) => sum + point.uniqueClicks, 0)
      };
    },
    enabled: !!workspaceId || !!linkId
  });
};
