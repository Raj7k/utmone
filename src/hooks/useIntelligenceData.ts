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

function getCachedIntelligence(workspaceId: string, days: number): IntelligenceData | undefined {
  try {
    const cached = localStorage.getItem(`${CACHE_KEY}-${workspaceId}-${days}`);
    if (!cached) return undefined;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > 2 * 60 * 1000) return undefined; // 2 min expiry
    return data;
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

export function useIntelligenceData(workspaceId: string | undefined, days: number = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString();
  
  const prevStartDate = new Date(startDate);
  prevStartDate.setDate(prevStartDate.getDate() - days);
  const prevStartDateStr = prevStartDate.toISOString();

  // Single optimized query that gets all essential data
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["intelligence-unified", workspaceId, days],
    queryFn: async (): Promise<IntelligenceData> => {
      if (!workspaceId) {
        return getEmptyData();
      }

      // Execute all queries in parallel with optimized COUNT queries
      const [
        clickCountResult,
        prevClickCountResult,
        revenueResult,
        campaignsResult,
        channelMixResult,
        geoResult,
        recentClicksResult,
      ] = await Promise.all([
        // 1. Current period click COUNT (optimized - no data fetch)
        supabase
          .from("link_clicks")
          .select("*", { count: "exact", head: true })
          .eq("workspace_id", workspaceId)
          .gte("clicked_at", startDateStr),
        
        // 2. Previous period click COUNT (optimized - no data fetch)
        supabase
          .from("link_clicks")
          .select("*", { count: "exact", head: true })
          .eq("workspace_id", workspaceId)
          .gte("clicked_at", prevStartDateStr)
          .lt("clicked_at", startDateStr),
        
        // 3. Revenue - only fetch aggregated data
        supabase
          .from("conversion_events")
          .select("event_value, link_id, links!inner(workspace_id, utm_source)")
          .eq("links.workspace_id", workspaceId)
          .gte("attributed_at", startDateStr),
        
        // 4. Campaigns with click counts - limit to top 5
        supabase
          .from("campaigns")
          .select("id, name")
          .eq("workspace_id", workspaceId)
          .eq("status", "active")
          .limit(5),
        
        // 5. Channel mix - use links table with total_clicks (database-side aggregation)
        supabase
          .from("links")
          .select("utm_source, total_clicks")
          .eq("workspace_id", workspaceId)
          .not("utm_source", "is", null)
          .order("total_clicks", { ascending: false })
          .limit(10),
        
        // 6. Geo data - limit to top 50 most recent, ordered
        supabase
          .from("link_clicks")
          .select("city, country")
          .eq("workspace_id", workspaceId)
          .gte("clicked_at", startDateStr)
          .not("city", "is", null)
          .order("clicked_at", { ascending: false })
          .limit(50),
        
        // 7. Recent clicks for live feed - only last 10
        supabase
          .from("link_clicks")
          .select("id, city, country, device_type, clicked_at, links!inner(slug, workspace_id)")
          .eq("links.workspace_id", workspaceId)
          .order("clicked_at", { ascending: false })
          .limit(10),
      ]);

      // Process click counts
      const totalClicks = clickCountResult.count || 0;
      const previousPeriodClicks = prevClickCountResult.count || 0;
      
      let clicksTrend: "up" | "down" | "neutral" = "neutral";
      let clicksTrendPercent = 0;
      if (previousPeriodClicks > 0) {
        const change = ((totalClicks - previousPeriodClicks) / previousPeriodClicks) * 100;
        clicksTrendPercent = Math.abs(Math.round(change));
        clicksTrend = change > 0 ? "up" : change < 0 ? "down" : "neutral";
      }

      // Process revenue data
      let totalRevenue = 0;
      const sourceRevenueMap = new Map<string, number>();
      (revenueResult.data || []).forEach((conv: any) => {
        const value = conv.event_value || 0;
        totalRevenue += value;
        const source = conv.links?.utm_source || "direct";
        sourceRevenueMap.set(source, (sourceRevenueMap.get(source) || 0) + value);
      });

      const topChannels = Array.from(sourceRevenueMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([source, revenue]) => ({
          source,
          revenue,
          percentage: totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0,
        }));

      // Process campaigns (simple list, clicks calculated separately if needed)
      const topCampaigns = (campaignsResult.data || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        clicks: 0, // Would need separate query if needed
      }));

      // Process channel mix - already aggregated from links table
      const channelData = (channelMixResult.data || []).filter((link: any) => link.utm_source);
      const channelTotal = channelData.reduce((sum: number, link: any) => sum + (link.total_clicks || 0), 0);
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

      // Process recent clicks
      const recentClicks = (recentClicksResult.data || []).map((click: any) => ({
        id: click.id,
        slug: click.links?.slug || "unknown",
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
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Trust cache
    initialData: () => workspaceId ? getCachedIntelligence(workspaceId, days) : undefined,
  });

  return {
    data: data || getEmptyData(),
    isLoading,
    isFetching,
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
