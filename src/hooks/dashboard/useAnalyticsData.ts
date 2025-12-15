/**
 * useAnalyticsData - Focused hook for Analytics page
 * 
 * Fetches only analytics-specific data (clicks, heatmap, devices, countries)
 * instead of the full dashboard payload. Reduces from 10 queries to 3-4.
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getCachedWorkspaceId } from "@/contexts/AppSessionContext";
import { useWorkspace } from "@/hooks/workspace/useWorkspace";
import { startOfDay, subDays, format } from "date-fns";

export interface AnalyticsHeatmapCell {
  day: number;
  hour: number;
  clicks: number;
  intensity: number;
}

export interface AnalyticsData {
  isEmpty: boolean;
  totalClicks: number;
  uniqueVisitors: number;
  heatmapData: AnalyticsHeatmapCell[];
  topCountries: Array<{ name: string; clicks: number }>;
  topCities: Array<{ name: string; clicks: number }>;
  devices: Array<{ name: string; value: number }>;
  browsers: Array<{ name: string; value: number }>;
  topReferrers: Array<{ name: string; value: number }>;
  insights: string[];
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
  topChannel: string | null;
  topChannelClicks: number;
  peakDay: string | null;
  peakDayClicks: number;
  avgClicksPerDay: number;
}

const CACHE_KEY = "ANALYTICS_DATA_CACHE";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const STALE_TTL = 30 * 1000; // 30 seconds

function getCached(workspaceId: string, range: string): { data: { analytics: AnalyticsData; executiveMetrics: ExecutiveMetrics }; isStale: boolean } | undefined {
  try {
    const cached = localStorage.getItem(`${CACHE_KEY}-${workspaceId}-${range}`);
    if (!cached) return undefined;
    const { data, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;
    if (age > CACHE_TTL) return undefined;
    return { data, isStale: age > STALE_TTL };
  } catch {
    return undefined;
  }
}

function setCache(workspaceId: string, range: string, data: { analytics: AnalyticsData; executiveMetrics: ExecutiveMetrics }) {
  try {
    localStorage.setItem(
      `${CACHE_KEY}-${workspaceId}-${range}`,
      JSON.stringify({ data, timestamp: Date.now() })
    );
  } catch {
    // Ignore storage errors
  }
}

export const useAnalyticsData = (range: string = "30d") => {
  const { currentWorkspace } = useWorkspace();
  const workspaceId = currentWorkspace?.id || getCachedWorkspaceId() || "";

  const cachedResult = getCached(workspaceId, range);
  const cachedData = cachedResult?.data;
  const isCacheStale = cachedResult?.isStale ?? true;

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["analytics-data", workspaceId, range],
    queryFn: async () => {
      console.log("[useAnalyticsData] Fetching analytics-specific data...");

      const daysBack = range === "7d" ? 7 : range === "90d" ? 90 : 30;
      const startDate = subDays(new Date(), daysBack);
      const prevStartDate = subDays(startDate, daysBack);

      // Fetch only analytics-relevant data (3 queries instead of 10)
      const [clicksResult, linksResult, clicksDetailsResult] = await Promise.all([
        // 1. Click aggregates for current period
        supabase
          .from("link_clicks")
          .select("id, clicked_at, device_type, browser, country, city, referrer, visitor_id", { count: "exact" })
          .eq("workspace_id", workspaceId)
          .gte("clicked_at", startDate.toISOString())
          .limit(5000),

        // 2. Links count for isEmpty check
        supabase
          .from("links")
          .select("id, total_clicks", { count: "exact", head: false })
          .eq("workspace_id", workspaceId)
          .is("deleted_at", null)
          .limit(100),

        // 3. Previous period clicks for comparison
        supabase
          .from("link_clicks")
          .select("id", { count: "exact", head: true })
          .eq("workspace_id", workspaceId)
          .gte("clicked_at", prevStartDate.toISOString())
          .lt("clicked_at", startDate.toISOString()),
      ]);

      const clicks = clicksResult.data || [];
      const links = linksResult.data || [];
      const prevClicks = clicksDetailsResult.count || 0;
      const totalClicks = clicks.length;

      // Calculate unique visitors
      const uniqueVisitorIds = new Set(clicks.map(c => c.visitor_id).filter(Boolean));
      const uniqueVisitors = uniqueVisitorIds.size;

      // Calculate heatmap data
      const heatmapMap: Record<string, number> = {};
      let maxClicks = 0;
      clicks.forEach(click => {
        if (click.clicked_at) {
          const date = new Date(click.clicked_at);
          const day = date.getDay();
          const hour = date.getHours();
          const key = `${day}-${hour}`;
          heatmapMap[key] = (heatmapMap[key] || 0) + 1;
          maxClicks = Math.max(maxClicks, heatmapMap[key]);
        }
      });

      const heatmapData: AnalyticsHeatmapCell[] = [];
      for (let day = 0; day < 7; day++) {
        for (let hour = 0; hour < 24; hour++) {
          const key = `${day}-${hour}`;
          const clickCount = heatmapMap[key] || 0;
          heatmapData.push({
            day,
            hour,
            clicks: clickCount,
            intensity: maxClicks > 0 ? clickCount / maxClicks : 0,
          });
        }
      }

      // Aggregate devices
      const deviceCounts: Record<string, number> = {};
      clicks.forEach(c => {
        const device = c.device_type || "unknown";
        deviceCounts[device] = (deviceCounts[device] || 0) + 1;
      });
      const devices = Object.entries(deviceCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

      // Aggregate browsers
      const browserCounts: Record<string, number> = {};
      clicks.forEach(c => {
        const browser = c.browser || "unknown";
        browserCounts[browser] = (browserCounts[browser] || 0) + 1;
      });
      const browsers = Object.entries(browserCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);

      // Aggregate countries
      const countryCounts: Record<string, number> = {};
      clicks.forEach(c => {
        const country = c.country || "unknown";
        countryCounts[country] = (countryCounts[country] || 0) + 1;
      });
      const topCountries = Object.entries(countryCounts)
        .map(([name, clicks]) => ({ name, clicks }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 10);

      // Aggregate cities
      const cityCounts: Record<string, number> = {};
      clicks.forEach(c => {
        const city = c.city || "unknown";
        cityCounts[city] = (cityCounts[city] || 0) + 1;
      });
      const topCities = Object.entries(cityCounts)
        .map(([name, clicks]) => ({ name, clicks }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 10);

      // Aggregate referrers
      const referrerCounts: Record<string, number> = {};
      clicks.forEach(c => {
        const referrer = c.referrer || "direct";
        referrerCounts[referrer] = (referrerCounts[referrer] || 0) + 1;
      });
      const topReferrers = Object.entries(referrerCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);

      // Calculate trends by day
      const dailyCounts: Record<string, number> = {};
      clicks.forEach(c => {
        if (c.clicked_at) {
          const dateKey = format(new Date(c.clicked_at), "yyyy-MM-dd");
          dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1;
        }
      });
      const clicksTrend = Object.values(dailyCounts);
      const avgClicksPerDay = clicksTrend.length > 0 
        ? Math.round(clicksTrend.reduce((a, b) => a + b, 0) / clicksTrend.length) 
        : 0;

      // Find peak day
      let peakDay: string | null = null;
      let peakDayClicks = 0;
      Object.entries(dailyCounts).forEach(([day, count]) => {
        if (count > peakDayClicks) {
          peakDayClicks = count;
          peakDay = day;
        }
      });

      // Find top channel (referrer)
      const topChannel = topReferrers.length > 0 ? topReferrers[0].name : null;
      const topChannelClicks = topReferrers.length > 0 ? topReferrers[0].value : 0;

      // Calculate change percentages
      const clicksChange = prevClicks > 0 
        ? Math.round(((totalClicks - prevClicks) / prevClicks) * 100) 
        : 0;

      const analytics: AnalyticsData = {
        isEmpty: links.length === 0,
        totalClicks,
        uniqueVisitors,
        heatmapData,
        topCountries,
        topCities,
        devices,
        browsers,
        topReferrers,
        insights: [],
      };

      const executiveMetrics: ExecutiveMetrics = {
        totalClicks,
        uniqueVisitors,
        conversionRate: 0,
        revenue: 0,
        clicksChange,
        visitorsChange: 0,
        conversionChange: 0,
        revenueChange: 0,
        clicksTrend,
        visitorsTrend: [],
        topChannel,
        topChannelClicks,
        peakDay,
        peakDayClicks,
        avgClicksPerDay,
      };

      const result = { analytics, executiveMetrics };
      setCache(workspaceId, range, result);
      console.log("[useAnalyticsData] Fetched and cached analytics data");
      
      return result;
    },
    enabled: !!workspaceId,
    initialData: () => cachedData,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: isCacheStale,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const effectiveData = data || cachedData;

  const defaultAnalytics: AnalyticsData = {
    isEmpty: true,
    totalClicks: 0,
    uniqueVisitors: 0,
    heatmapData: [],
    topCountries: [],
    topCities: [],
    devices: [],
    browsers: [],
    topReferrers: [],
    insights: [],
  };

  const defaultExecutiveMetrics: ExecutiveMetrics = {
    totalClicks: 0,
    uniqueVisitors: 0,
    conversionRate: 0,
    revenue: 0,
    clicksChange: 0,
    visitorsChange: 0,
    conversionChange: 0,
    revenueChange: 0,
    clicksTrend: [],
    visitorsTrend: [],
    topChannel: null,
    topChannelClicks: 0,
    peakDay: null,
    peakDayClicks: 0,
    avgClicksPerDay: 0,
  };

  return {
    analytics: effectiveData?.analytics || defaultAnalytics,
    executiveMetrics: effectiveData?.executiveMetrics || defaultExecutiveMetrics,
    isLoading: isLoading && !effectiveData,
    isFetching,
    isStale: isCacheStale && !!effectiveData,
    error,
    refetch,
  };
};
