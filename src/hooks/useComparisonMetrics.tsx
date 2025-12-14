import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, subDays, startOfMonth, startOfWeek, subMonths, subWeeks } from "date-fns";
import { analyticsQueryOptions } from "@/lib/queryOptimizations";

type ComparisonPeriod = "day" | "week" | "month";

interface UseComparisonMetricsParams {
  workspaceId: string;
  period?: ComparisonPeriod;
}

export const useComparisonMetrics = ({ workspaceId, period = "month" }: UseComparisonMetricsParams) => {
  return useQuery({
    queryKey: ["comparison-metrics", workspaceId, period],
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes  
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const now = new Date();
      let currentStart: Date;
      let previousStart: Date;
      let previousEnd: Date;

      switch (period) {
        case "day":
          currentStart = startOfDay(now);
          previousStart = startOfDay(subDays(now, 1));
          previousEnd = currentStart;
          break;
        case "week":
          currentStart = startOfWeek(now, { weekStartsOn: 1 });
          previousStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
          previousEnd = currentStart;
          break;
        case "month":
        default:
          currentStart = startOfMonth(now);
          previousStart = startOfMonth(subMonths(now, 1));
          previousEnd = currentStart;
          break;
      }

      // Batch all queries with Promise.all for better performance
      const [
        { data: currentClicks },
        { data: previousClicks },
        { data: currentLinks },
        { data: previousLinks },
      ] = await Promise.all([
        supabase
          .from("link_clicks")
          .select("id, is_unique, link_id, workspace_id")
          .eq("workspace_id", workspaceId)
          .gte("clicked_at", currentStart.toISOString())
          .limit(5000),
        supabase
          .from("link_clicks")
          .select("id, is_unique, link_id, workspace_id")
          .eq("workspace_id", workspaceId)
          .gte("clicked_at", previousStart.toISOString())
          .lt("clicked_at", previousEnd.toISOString())
          .limit(5000),
        supabase
          .from("links")
          .select("id")
          .eq("workspace_id", workspaceId)
          .gte("created_at", currentStart.toISOString()),
        supabase
          .from("links")
          .select("id")
          .eq("workspace_id", workspaceId)
          .gte("created_at", previousStart.toISOString())
          .lt("created_at", previousEnd.toISOString()),
      ]);

      const currentTotal = currentClicks?.length || 0;
      const currentUnique = currentClicks?.filter(c => c.is_unique).length || 0;
      const currentLinkCount = currentLinks?.length || 0;

      const previousTotal = previousClicks?.length || 0;
      const previousUnique = previousClicks?.filter(c => c.is_unique).length || 0;
      const previousLinkCount = previousLinks?.length || 0;

      const calculateChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
      };

      return {
        clicks: {
          current: currentTotal,
          previous: previousTotal,
          change: calculateChange(currentTotal, previousTotal)
        },
        uniqueClicks: {
          current: currentUnique,
          previous: previousUnique,
          change: calculateChange(currentUnique, previousUnique)
        },
        links: {
          current: currentLinkCount,
          previous: previousLinkCount,
          change: calculateChange(currentLinkCount, previousLinkCount)
        },
        clickRate: {
          current: currentLinkCount > 0 ? currentTotal / currentLinkCount : 0,
          previous: previousLinkCount > 0 ? previousTotal / previousLinkCount : 0,
          change: calculateChange(
            currentLinkCount > 0 ? currentTotal / currentLinkCount : 0,
            previousLinkCount > 0 ? previousTotal / previousLinkCount : 0
          )
        }
      };
    },
    enabled: !!workspaceId
  });
};
