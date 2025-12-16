import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { IntelligenceContext } from "@/components/intelligence/ContextSwitcher";

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

function getCachedIntelligence(workspaceId: string, days: number, context: IntelligenceContext): { data: IntelligenceData; isStale: boolean } | undefined {
  try {
    const cached = localStorage.getItem(`${CACHE_KEY}-${workspaceId}-${days}-${context}`);
    if (!cached) return undefined;
    const { data, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;
    if (age > CACHE_TTL) return undefined;
    return { data, isStale: age > STALE_TTL };
  } catch { return undefined; }
}

function setCachedIntelligence(workspaceId: string, days: number, context: IntelligenceContext, data: IntelligenceData): void {
  try {
    localStorage.setItem(`${CACHE_KEY}-${workspaceId}-${days}-${context}`, JSON.stringify({
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

// Build context-specific filters for links table
function getContextLinkFilter(context: IntelligenceContext) {
  switch (context) {
    case "campaigns":
      return { field: "campaign_id", condition: "not.is.null" };
    case "events":
      return { field: "event_id", condition: "not.is.null" };
    case "sales":
      return { field: "link_type", condition: "eq.sales" };
    case "customers":
      return { field: "has_conversion", condition: "eq.true" };
    default:
      return null;
  }
}

export function useIntelligenceData(
  workspaceId: string | undefined, 
  days: number = 7,
  preloaded?: PreloadedData,
  context: IntelligenceContext = "all"
) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString();
  
  const prevStartDate = new Date(startDate);
  prevStartDate.setDate(prevStartDate.getDate() - days);
  const prevStartDateStr = prevStartDate.toISOString();

  // Check dashboard unified cache for shared data (only for "all" context)
  const dashboardCache = context === "all" ? getDashboardCacheData(workspaceId) : undefined;
  const preloadedCampaigns = preloaded?.campaigns ?? dashboardCache?.campaigns;

  // Get cached data with stale check
  const cachedResult = workspaceId ? getCachedIntelligence(workspaceId, days, context) : undefined;
  const cachedData = cachedResult?.data;
  const isCacheStale = cachedResult?.isStale ?? true;

  // Clear cache when context changes
  useEffect(() => {
    // Invalidate old cache entries for other contexts
  }, [context, workspaceId, days]);

  // Single optimized query that gets all essential data
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["intelligence-unified", workspaceId, days, context],
    queryFn: async (): Promise<IntelligenceData> => {
      if (!workspaceId) {
        return getEmptyData();
      }

      // Get link IDs filtered by context first (if context filtering needed)
      let contextLinkIds: string[] | null = null;
      if (context !== "all") {
        const contextFilter = getContextLinkFilter(context);
        if (contextFilter) {
          let query = supabase
            .from("links")
            .select("id")
            .eq("workspace_id", workspaceId);
          
          if (context === "campaigns") {
            query = query.not("campaign_id", "is", null);
          } else if (context === "events") {
            query = query.not("event_id", "is", null);
          } else if (context === "sales") {
            // Filter by utm_content containing "sales" or specific tag
            query = query.or("utm_content.ilike.%sales%,tags.cs.{sales}");
          } else if (context === "customers") {
            // Links that have conversions
            const { data: convLinks } = await supabase
              .from("conversion_events")
              .select("link_id")
              .eq("workspace_id", workspaceId)
              .not("link_id", "is", null);
            contextLinkIds = [...new Set(convLinks?.map(c => c.link_id).filter(Boolean))] as string[];
          }
          
          if (context !== "customers") {
            const { data: links } = await query;
            contextLinkIds = links?.map(l => l.id) || [];
          }
        }
      }

      // Build base click query with optional link filter
      const buildClickQuery = (baseQuery: any) => {
        if (contextLinkIds && contextLinkIds.length > 0) {
          return baseQuery.in("link_id", contextLinkIds);
        } else if (contextLinkIds && contextLinkIds.length === 0 && context !== "all") {
          // No matching links for this context - return empty
          return null;
        }
        return baseQuery;
      };

      // Execute queries in parallel
      const [
        clickCountResult,
        prevClickCountResult,
        revenueResult,
        channelMixResult,
        geoResult,
        recentClicksResult,
      ] = await Promise.all([
        // 1. Current period click COUNT with context filter
        (async () => {
          let query = supabase
            .from("link_clicks")
            .select("*", { count: "exact", head: true })
            .eq("workspace_id", workspaceId)
            .gte("clicked_at", startDateStr);
          
          if (contextLinkIds && contextLinkIds.length > 0) {
            query = query.in("link_id", contextLinkIds);
          } else if (contextLinkIds && contextLinkIds.length === 0 && context !== "all") {
            return { count: 0 };
          }
          return query;
        })(),

        // 2. Previous period click COUNT
        (async () => {
          let query = supabase
            .from("link_clicks")
            .select("*", { count: "exact", head: true })
            .eq("workspace_id", workspaceId)
            .gte("clicked_at", prevStartDateStr)
            .lt("clicked_at", startDateStr);
          
          if (contextLinkIds && contextLinkIds.length > 0) {
            query = query.in("link_id", contextLinkIds);
          } else if (contextLinkIds && contextLinkIds.length === 0 && context !== "all") {
            return { count: 0 };
          }
          return query;
        })(),
        
        // 3. Revenue - direct workspace_id query
        (async () => {
          let query = supabase
            .from("conversion_events")
            .select("event_value, link_id")
            .eq("workspace_id", workspaceId)
            .gte("attributed_at", startDateStr);
          
          if (contextLinkIds && contextLinkIds.length > 0) {
            query = query.in("link_id", contextLinkIds);
          } else if (contextLinkIds && contextLinkIds.length === 0 && context !== "all") {
            return { data: [] };
          }
          return query;
        })(),
        
        // 4. Channel mix - query ALL link_clicks (include direct traffic)
        (async () => {
          let query = supabase
            .from("link_clicks")
            .select("link_id, referrer, links(utm_source)")
            .eq("workspace_id", workspaceId)
            .gte("clicked_at", startDateStr)
            .limit(5000);
          
          if (contextLinkIds && contextLinkIds.length > 0) {
            query = query.in("link_id", contextLinkIds);
          } else if (contextLinkIds && contextLinkIds.length === 0 && context !== "all") {
            return { data: [] };
          }
          return query;
        })(),
        
        // 5. Geo data - increased limit for better accuracy
        (async () => {
          let query = supabase
            .from("link_clicks")
            .select("city, country")
            .eq("workspace_id", workspaceId)
            .gte("clicked_at", startDateStr)
            .not("city", "is", null)
            .order("clicked_at", { ascending: false })
            .limit(500);
          
          if (contextLinkIds && contextLinkIds.length > 0) {
            query = query.in("link_id", contextLinkIds);
          } else if (contextLinkIds && contextLinkIds.length === 0 && context !== "all") {
            return { data: [] };
          }
          return query;
        })(),
        
        // 6. Recent clicks for live feed
        (async () => {
          let query = supabase
            .from("link_clicks")
            .select("id, city, country, device_type, clicked_at, link_id")
            .eq("workspace_id", workspaceId)
            .order("clicked_at", { ascending: false })
            .limit(10);
          
          if (contextLinkIds && contextLinkIds.length > 0) {
            query = query.in("link_id", contextLinkIds);
          } else if (contextLinkIds && contextLinkIds.length === 0 && context !== "all") {
            return { data: [] };
          }
          return query;
        })(),
      ]);

      // FIX: Properly use click count result
      const totalClicks = clickCountResult?.count || 0;
      const previousPeriodClicks = prevClickCountResult?.count || 0;
      
      let clicksTrend: "up" | "down" | "neutral" = "neutral";
      let clicksTrendPercent = 0;
      if (previousPeriodClicks > 0) {
        const change = ((totalClicks - previousPeriodClicks) / previousPeriodClicks) * 100;
        clicksTrendPercent = Math.abs(Math.round(change));
        clicksTrend = change > 0 ? "up" : change < 0 ? "down" : "neutral";
      }

      // FIX: Process channel mix - include "direct" for clicks without utm_source
      const channelAggregated: Record<string, number> = {};
      (channelMixResult.data || []).forEach((click: any) => {
        // Use utm_source, fallback to referrer domain, then "direct"
        let source = click.links?.utm_source;
        if (!source && click.referrer) {
          try {
            const hostname = new URL(click.referrer).hostname;
            source = hostname.replace("www.", "").split(".")[0];
          } catch {}
        }
        source = source || "direct";
        channelAggregated[source] = (channelAggregated[source] || 0) + 1;
      });
      const channelTotal = Object.values(channelAggregated).reduce((sum, c) => sum + c, 0);

      // Process revenue data
      let totalRevenue = 0;
      (revenueResult.data || []).forEach((conv: any) => {
        totalRevenue += conv.event_value || 0;
      });

      // Top channels sorted by click count
      const topChannels = Object.entries(channelAggregated)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([source, clicks]) => ({
          source,
          revenue: 0,
          percentage: channelTotal > 0 ? (clicks / channelTotal) * 100 : 0,
        }));

      // Get campaigns with actual click counts (only for campaigns/all context)
      let topCampaigns: Array<{ id: string; name: string; clicks: number }> = [];
      if (context === "all" || context === "campaigns") {
        const campaignNames = preloadedCampaigns || [];
        
        // Fetch campaigns if not preloaded
        let campaignsToProcess = campaignNames;
        if (!preloadedCampaigns || preloadedCampaigns.length === 0) {
          const campaignsResult = await supabase
            .from("campaigns")
            .select("id, name")
            .eq("workspace_id", workspaceId)
            .eq("status", "active")
            .limit(5);
          campaignsToProcess = (campaignsResult.data || []).map((c: any) => ({ id: c.id, name: c.name }));
        }
        
        // Get actual click counts for each campaign
        if (campaignsToProcess.length > 0) {
          const campaignIds = campaignsToProcess.map(c => c.id);
          const { data: campaignLinks } = await supabase
            .from("links")
            .select("id, campaign_id")
            .eq("workspace_id", workspaceId)
            .in("campaign_id", campaignIds);
          
          if (campaignLinks && campaignLinks.length > 0) {
            const linkIds = campaignLinks.map(l => l.id);
            const { data: campaignClicks } = await supabase
              .from("link_clicks")
              .select("link_id")
              .eq("workspace_id", workspaceId)
              .gte("clicked_at", startDateStr)
              .in("link_id", linkIds);
            
            // Aggregate clicks by campaign
            const clicksByCampaign: Record<string, number> = {};
            campaignClicks?.forEach((click: any) => {
              const link = campaignLinks.find(l => l.id === click.link_id);
              if (link?.campaign_id) {
                clicksByCampaign[link.campaign_id] = (clicksByCampaign[link.campaign_id] || 0) + 1;
              }
            });
            
            topCampaigns = campaignsToProcess.map(c => ({
              id: c.id,
              name: c.name,
              clicks: clicksByCampaign[c.id] || 0,
            })).sort((a, b) => b.clicks - a.clicks);
          } else {
            topCampaigns = campaignsToProcess.map(c => ({ id: c.id, name: c.name, clicks: 0 }));
          }
        }
      }

      // Channel mix for donut chart - using date-filtered data with direct traffic
      const channelMix = Object.entries(channelAggregated)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, value]) => ({
          name,
          value,
          percentage: channelTotal > 0 ? (value / channelTotal) * 100 : 0,
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
        setCachedIntelligence(workspaceId, days, context, result);
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
