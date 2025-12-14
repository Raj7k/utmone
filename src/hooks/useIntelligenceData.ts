import { useQuery, useQueries } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface IntelligenceData {
  // Clicks data
  totalClicks: number;
  previousPeriodClicks: number;
  clicksTrend: "up" | "down" | "neutral";
  clicksTrendPercent: number;
  
  // Revenue data
  totalRevenue: number;
  conversionsCount: number;
  topChannels: Array<{
    source: string;
    revenue: number;
    percentage: number;
  }>;
  
  // Campaign data
  topCampaigns: Array<{
    id: string;
    name: string;
    clicks: number;
  }>;
  
  // Channel mix data
  channelMix: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
  
  // Geo data
  topCities: Array<{
    city: string;
    country: string;
    clicks: number;
    percentage: number;
  }>;
  
  // Recent clicks for live feed
  recentClicks: Array<{
    id: string;
    slug: string;
    city: string;
    country: string;
    device: string;
    timestamp: Date;
  }>;
}

// Cache helpers
const CACHE_KEY = 'intelligence-data-cache';
const DASHBOARD_CACHE_KEY = 'dashboard-unified-cache';
const CACHE_TTL = 2 * 60 * 1000; // 2 min full cache
const STALE_TTL = 30 * 1000; // 30 sec stale threshold

function getCachedIntelligence(workspaceId: string, days: number): { data: IntelligenceData; isStale: boolean } | undefined {
  try {
    const cached = localStorage.getItem(`${CACHE_KEY}-${workspaceId}-${days}`);
    if (!cached) return undefined;
    const { data, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;
    if (age > CACHE_TTL) return undefined;
    return { data, isStale: age > STALE_TTL };
  } catch { return undefined; }
}

function setCachedIntelligence(workspaceId: string, days: number, data: IntelligenceData): void {
  try {
    localStorage.setItem(`${CACHE_KEY}-${workspaceId}-${days}`, JSON.stringify({
      data,
      timestamp: Date.now(),
    }));
  } catch {}
}

// Read from dashboard unified cache for shared data
function getDashboardCacheData(workspaceId: string | undefined): { totalClicks?: number; campaigns?: Array<{ id: string; name: string }> } | undefined {
  if (!workspaceId) return undefined;
  try {
    const cached = localStorage.getItem(`${DASHBOARD_CACHE_KEY}-${workspaceId}`);
    if (!cached) return undefined;
    const { data, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;
    if (age > CACHE_TTL) return undefined;
    
    // Extract clicks total from links
    const totalClicks = data?.links?.reduce((sum: number, link: any) => sum + (link.total_clicks || 0), 0) || 0;
    const campaigns = data?.campaigns?.map((c: any) => ({ id: c.id, name: c.name })) || [];
    
    return { totalClicks, campaigns };
  } catch { return undefined; }
}

interface PreloadedData {
  totalClicks?: number;
  campaigns?: Array<{ id: string; name: string }>;
}

export function useIntelligenceData(
  workspaceId: string | undefined, 
  days: number = 7,
  preloaded?: PreloadedData
) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString();
  
  const prevStartDate = new Date(startDate);
  prevStartDate.setDate(prevStartDate.getDate() - days);
  const prevStartDateStr = prevStartDate.toISOString();

  // Check dashboard unified cache for shared data
  const dashboardCache = getDashboardCacheData(workspaceId);
  const preloadedClicks = preloaded?.totalClicks ?? dashboardCache?.totalClicks;
  const preloadedCampaigns = preloaded?.campaigns ?? dashboardCache?.campaigns;

  // Get cached data with stale check
  const cachedResult = workspaceId ? getCachedIntelligence(workspaceId, days) : undefined;
  const cachedData = cachedResult?.data;
  const isCacheStale = cachedResult?.isStale ?? true;

  // Single optimized query that gets all essential data
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["intelligence-unified", workspaceId, days],
    queryFn: async (): Promise<IntelligenceData> => {
      if (!workspaceId) {
        return getEmptyData();
      }

      // Execute queries in parallel - skip redundant ones when preloaded
      const [
        prevClickCountResult,
        revenueResult,
        channelMixResult,
        geoResult,
        recentClicksResult,
      ] = await Promise.all([
        // 1. Previous period click COUNT (always needed for trend)
        supabase
          .from("link_clicks")
          .select("*", { count: "exact", head: true })
          .eq("workspace_id", workspaceId)
          .gte("clicked_at", prevStartDateStr)
          .lt("clicked_at", startDateStr),
        
        // 2. Revenue - direct workspace_id query (no JOIN)
        supabase
          .from("conversion_events")
          .select("event_value, link_id")
          .eq("workspace_id", workspaceId)
          .gte("attributed_at", startDateStr),
        
        // 3. Channel mix - use links table with total_clicks
        supabase
          .from("links")
          .select("utm_source, total_clicks")
          .eq("workspace_id", workspaceId)
          .not("utm_source", "is", null)
          .order("total_clicks", { ascending: false })
          .limit(10),
        
        // 4. Geo data - limit to top 50 most recent
        supabase
          .from("link_clicks")
          .select("city, country")
          .eq("workspace_id", workspaceId)
          .gte("clicked_at", startDateStr)
          .not("city", "is", null)
          .order("clicked_at", { ascending: false })
          .limit(50),
        
        // 5. Recent clicks for live feed - only last 10
        supabase
          .from("link_clicks")
          .select("id, city, country, device_type, clicked_at, link_id")
          .eq("workspace_id", workspaceId)
          .order("clicked_at", { ascending: false })
          .limit(10),
      ]);

      // Use preloaded clicks or fetch if not available
      let totalClicks = preloadedClicks ?? 0;
      if (preloadedClicks === undefined) {
        const clickCountResult = await supabase
          .from("link_clicks")
          .select("*", { count: "exact", head: true })
          .eq("workspace_id", workspaceId)
          .gte("clicked_at", startDateStr);
        totalClicks = clickCountResult.count || 0;
      }

      const previousPeriodClicks = prevClickCountResult.count || 0;
      
      let clicksTrend: "up" | "down" | "neutral" = "neutral";
      let clicksTrendPercent = 0;
      if (previousPeriodClicks > 0) {
        const change = ((totalClicks - previousPeriodClicks) / previousPeriodClicks) * 100;
        clicksTrendPercent = Math.abs(Math.round(change));
        clicksTrend = change > 0 ? "up" : change < 0 ? "down" : "neutral";
      }

      // Process channel mix first (needed for topChannels)
      const channelData = (channelMixResult.data || []).filter((link: any) => link.utm_source);
      const channelTotal = channelData.reduce((sum: number, link: any) => sum + (link.total_clicks || 0), 0);

      // Process revenue data
      let totalRevenue = 0;
      (revenueResult.data || []).forEach((conv: any) => {
        totalRevenue += conv.event_value || 0;
      });

      // Top channels - use channel mix from links
      const topChannels = channelData.slice(0, 3).map((link: any) => ({
        source: link.utm_source || "direct",
        revenue: 0,
        percentage: channelTotal > 0 ? ((link.total_clicks || 0) / channelTotal) * 100 : 0,
      }));

      // Use preloaded campaigns or fetch if not available
      let topCampaigns: Array<{ id: string; name: string; clicks: number }> = [];
      if (preloadedCampaigns && preloadedCampaigns.length > 0) {
        topCampaigns = preloadedCampaigns.map(c => ({ ...c, clicks: 0 }));
      } else {
        const campaignsResult = await supabase
          .from("campaigns")
          .select("id, name")
          .eq("workspace_id", workspaceId)
          .eq("status", "active")
          .limit(5);
        topCampaigns = (campaignsResult.data || []).map((c: any) => ({
          id: c.id,
          name: c.name,
          clicks: 0,
        }));
      }

      // Channel mix for donut chart
      const channelMix = channelData
        .slice(0, 5)
        .map((link: any) => ({
          name: link.utm_source,
          value: link.total_clicks || 0,
          percentage: channelTotal > 0 ? ((link.total_clicks || 0) / channelTotal) * 100 : 0,
        }));

      // Process geo data
      const cityMap = new Map<string, { country: string; clicks: number }>();
      (geoResult.data || []).forEach((click: any) => {
        const city = click.city || "Unknown";
        const existing = cityMap.get(city);
        if (existing) {
          existing.clicks++;
        } else {
          cityMap.set(city, { country: click.country || "", clicks: 1 });
        }
      });
      const geoTotal = geoResult.data?.length || 0;
      const topCities = Array.from(cityMap.entries())
        .sort((a, b) => b[1].clicks - a[1].clicks)
        .slice(0, 5)
        .map(([city, data]) => ({
          city,
          country: data.country,
          clicks: data.clicks,
          percentage: geoTotal > 0 ? (data.clicks / geoTotal) * 100 : 0,
        }));

      // Process recent clicks (link_id used as fallback for slug display)
      const recentClicks = (recentClicksResult.data || []).map((click: any) => ({
        id: click.id,
        slug: click.link_id?.substring(0, 8) || "unknown",
        city: click.city || "Unknown",
        country: click.country || "",
        device: click.device_type || "desktop",
        timestamp: new Date(click.clicked_at),
      }));

      const result: IntelligenceData = {
        totalClicks,
        previousPeriodClicks,
        clicksTrend,
        clicksTrendPercent,
        totalRevenue,
        conversionsCount: revenueResult.data?.length || 0,
        topChannels,
        topCampaigns,
        channelMix,
        topCities,
        recentClicks,
      };
      
      // Cache for next load
      if (workspaceId) {
        setCachedIntelligence(workspaceId, days, result);
      }
      
      return result;
    },
    enabled: !!workspaceId,
    staleTime: STALE_TTL,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: isCacheStale, // Only refetch if stale
    initialData: () => cachedData,
  });

  // Use cached data immediately if available
  const effectiveData = data || cachedData;
  const hasData = !!effectiveData;

  return {
    data: effectiveData || getEmptyData(),
    isLoading: isLoading && !hasData,
    isFetching,
    isStale: isCacheStale && hasData,
    error,
  };
}

function getEmptyData(): IntelligenceData {
  return {
    totalClicks: 0,
    previousPeriodClicks: 0,
    clicksTrend: "neutral",
    clicksTrendPercent: 0,
    totalRevenue: 0,
    conversionsCount: 0,
    topChannels: [],
    topCampaigns: [],
    channelMix: [],
    topCities: [],
    recentClicks: [],
  };
}
