import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, getDay, getHours } from "date-fns";

interface HeatmapCell {
  day: number; // 0-6 (Sunday-Saturday)
  hour: number; // 0-23
  clicks: number;
  intensity: number; // 0-1 normalized value
}

interface BestTime {
  day: number;
  dayName: string;
  hour: number;
  clicks: number;
}

interface UseClickHeatmapReturn {
  heatmapData: HeatmapCell[];
  bestTimes: BestTime[];
  bestDay: { day: number; dayName: string; clicks: number };
  isLoading: boolean;
  error: Error | null;
}

interface UseClickHeatmapParams {
  workspaceId?: string;
  linkId?: string;
  days?: number;
}

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const useClickHeatmap = ({
  workspaceId,
  linkId,
  days = 30
}: UseClickHeatmapParams): UseClickHeatmapReturn => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["click-heatmap", workspaceId, linkId, days],
    queryFn: async () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      let query = supabase
        .from("link_clicks")
        .select("clicked_at, click_hour, link_id, workspace_id")
        .gte("clicked_at", startDate.toISOString())
        .lte("clicked_at", endDate.toISOString());

      if (workspaceId) {
        query = query.eq("workspace_id", workspaceId);
      }

      if (linkId) {
        query = query.eq("link_id", linkId);
      }

      const { data: clicks, error } = await query;

      if (error) throw error;

      // Initialize 7x24 grid
      const grid: Map<string, number> = new Map();
      for (let day = 0; day < 7; day++) {
        for (let hour = 0; hour < 24; hour++) {
          grid.set(`${day}-${hour}`, 0);
        }
      }

      // Aggregate clicks by day and hour
      clicks?.forEach((click) => {
        if (click.clicked_at) {
          const date = new Date(click.clicked_at);
          const day = getDay(date); // 0-6 (Sunday-Saturday)
          // Use pre-computed click_hour from database, fallback to parsing for backward compatibility
          const hour = click.click_hour ?? getHours(date); // 0-23
          const key = `${day}-${hour}`;
          grid.set(key, (grid.get(key) || 0) + 1);
        }
      });

      // Find max value for normalization
      const maxClicks = Math.max(...Array.from(grid.values()), 1);

      // Convert to array with intensity
      const heatmapData: HeatmapCell[] = [];
      for (let day = 0; day < 7; day++) {
        for (let hour = 0; hour < 24; hour++) {
          const key = `${day}-${hour}`;
          const clicks = grid.get(key) || 0;
          heatmapData.push({
            day,
            hour,
            clicks,
            intensity: clicks / maxClicks
          });
        }
      }

      // Find best times (top 3 hour-day combinations)
      const sortedCells = [...heatmapData].sort((a, b) => b.clicks - a.clicks);
      const bestTimes: BestTime[] = sortedCells.slice(0, 3).map(cell => ({
        day: cell.day,
        dayName: DAYS_OF_WEEK[cell.day],
        hour: cell.hour,
        clicks: cell.clicks
      }));

      // Find best day (total clicks per day)
      const dayTotals = new Map<number, number>();
      for (let day = 0; day < 7; day++) {
        dayTotals.set(day, 0);
      }
      heatmapData.forEach(cell => {
        dayTotals.set(cell.day, (dayTotals.get(cell.day) || 0) + cell.clicks);
      });
      const bestDayNum = Array.from(dayTotals.entries()).reduce((a, b) => 
        b[1] > a[1] ? b : a
      )[0];

      return {
        heatmapData,
        bestTimes,
        bestDay: {
          day: bestDayNum,
          dayName: DAYS_OF_WEEK[bestDayNum],
          clicks: dayTotals.get(bestDayNum) || 0
        }
      };
    },
    enabled: !!workspaceId || !!linkId
  });

  return {
    heatmapData: data?.heatmapData || [],
    bestTimes: data?.bestTimes || [],
    bestDay: data?.bestDay || { day: 0, dayName: "Sunday", clicks: 0 },
    isLoading,
    error: error as Error | null
  };
};
