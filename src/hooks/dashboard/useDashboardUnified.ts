import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { useWorkspace } from "@/hooks/workspace/useWorkspace";
import { getCachedWorkspaceId, getCachedUserId } from "@/contexts/AppSessionContext";
import { startOfDay, subDays } from "date-fns";
import { useRef, useEffect } from "react";

const CACHE_KEY = "DASHBOARD_UNIFIED_CACHE";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const STALE_TTL = 30 * 1000; // 30 seconds - show cached, refresh in background

export interface DashboardLink {
  id: string;
  title: string;
  slug: string;
  short_url: string;
  destination_url: string;
  status: string;
  total_clicks: number;
  created_at: string;
}

export interface DashboardEvent {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  location_city: string;
  location_country: string;
  direct_scans: number;
  halo_visitors: number;
  lift_percentage: number;
  status: string;
}

export interface DashboardCampaign {
  id: string;
  name: string;
  status: "active" | "archived" | "draft";
  color: string;
  created_at: string;
  stats: {
    linkCount: number;
    totalClicks: number;
  };
}

export interface DashboardSalesLink {
  id: string;
  title: string;
  slug: string;
  domain: string;
  short_url: string;
  destination_url: string;
  status: string;
  total_clicks: number;
  created_at: string;
  last_clicked_at: string | null;
  link_type: string;
  prospect_name?: string;
  alert_on_click?: boolean;
}

export interface DashboardStats {
  clicksToday: number;
  totalRevenue: number;
  totalLinks: number;
}

export interface DashboardOnboarding {
  hasLinks: boolean;
  hasQrCodes: boolean;
  hasViewedAnalytics: boolean;
  hasInvitedTeam: boolean;
  hasCustomDomain: boolean;
  hasInstalledPixel: boolean;
  linkCount: number;
}

export interface DashboardAnalytics {
  isEmpty: boolean;
  totalClicks: number;
  uniqueVisitors: number;
  heatmapData: Array<{ day: number; hour: number; clicks: number; intensity: number }>;
  topCountries: Array<{ name: string; clicks: number }>;
  topCities: Array<{ name: string; clicks: number }>;
  devices: Array<{ name: string; value: number }>;
  browsers: Array<{ name: string; value: number }>;
  topReferrers: Array<{ name: string; value: number }>;
  insights: string[];
}

export interface DashboardExecutiveMetrics {
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

export interface DashboardData {
  links: DashboardLink[];
  salesLinks: DashboardSalesLink[];
  events: DashboardEvent[];
  campaigns: DashboardCampaign[];
  stats: DashboardStats;
  onboarding: DashboardOnboarding;
  analytics: DashboardAnalytics;
  executiveMetrics: DashboardExecutiveMetrics;
  fetchedAt: string;
}

// Get cached data for INSTANT render (stale-while-revalidate)
function getCached(workspaceId: string): { data: DashboardData; isStale: boolean } | undefined {
  try {
    const cached = localStorage.getItem(`${CACHE_KEY}-${workspaceId}`);
    if (!cached) return undefined;
    const { data, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;
    // Return stale data up to full TTL, mark as stale after STALE_TTL
    if (age > CACHE_TTL) return undefined;
    return { data: data as DashboardData, isStale: age > STALE_TTL };
  } catch {
    return undefined;
  }
}

// Save to cache
function setCache(workspaceId: string, data: DashboardData) {
  try {
    localStorage.setItem(
      `${CACHE_KEY}-${workspaceId}`,
      JSON.stringify({ data, timestamp: Date.now() })
    );
  } catch {
    // Ignore storage errors
  }
}

export const useDashboardUnified = (range: string = "30d") => {
  const { currentWorkspace } = useWorkspace();
  const queryClient = useQueryClient();
  const hasTriggeredRefresh = useRef(false);

  const workspaceId = currentWorkspace?.id || getCachedWorkspaceId() || "";
  
  // Get cached data with stale check
  const cachedResult = getCached(workspaceId);
  const cachedData = cachedResult?.data;
  const isCacheStale = cachedResult?.isStale ?? true;

  // Trigger background refresh ONCE per mount if cache is stale
  // Empty dependency array prevents re-running on every render
  useEffect(() => {
    if (cachedData && isCacheStale && !hasTriggeredRefresh.current && workspaceId) {
      hasTriggeredRefresh.current = true;
      queryClient.invalidateQueries({ 
        queryKey: ["dashboard-direct", workspaceId, range],
        refetchType: 'active'
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data, isLoading, isFetching, isFetched, refetch, error } = useQuery({
    queryKey: ["dashboard-direct", workspaceId, range],
    queryFn: async (): Promise<DashboardData> => {
      console.log("[useDashboardUnified] Fetching directly from tables...");
      
      const today = startOfDay(new Date());
      const daysBack = range === "7d" ? 7 : range === "90d" ? 90 : 30;
      const startDate = subDays(today, daysBack);

      // OPTIMIZED: Use cached userId from context, no network call
      const userId = getCachedUserId() || "";

      // PARALLEL: Fetch all data at once from tables directly
      const [
        linksResult,
        salesLinksResult,
        eventsResult,
        campaignsResult,
        clicksTodayResult,
        qrCodesResult,
        domainsResult,
        pixelsResult,
        totalLinksResult,
        profileResult
      ] = await Promise.all([
        // 1. Regular links
        supabase
          .from("links")
          .select("id, title, slug, short_url, destination_url, status, total_clicks, created_at")
          .eq("workspace_id", workspaceId)
          .is("deleted_at", null)
          .neq("link_type", "sales")
          .order("created_at", { ascending: false })
          .limit(20),

        // 2. Sales links
        supabase
          .from("links")
          .select("id, title, slug, short_url, destination_url, status, total_clicks, created_at, last_clicked_at, link_type, prospect_name, alert_on_click")
          .eq("workspace_id", workspaceId)
          .eq("link_type", "sales")
          .is("deleted_at", null)
          .order("created_at", { ascending: false })
          .limit(50),

        // 3. Events
        supabaseFrom('field_events')
          .select("id, name, start_date, end_date, location_city, location_country, direct_scans, halo_visitors, lift_percentage, status")
          .eq("workspace_id", workspaceId)
          .order("start_date", { ascending: false })
          .limit(10),

        // 4. Campaigns with link counts
        supabaseFrom('campaigns')
          .select(`
            id, name, status, color, created_at,
            links:links(count)
          `)
          .eq("workspace_id", workspaceId)
          .order("created_at", { ascending: false })
          .limit(10),

        // 5. Clicks today (simple count)
        supabaseFrom('link_clicks')
          .select("id", { count: "exact", head: true })
          .eq("workspace_id", workspaceId)
          .gte("clicked_at", today.toISOString()),
        
        // 6. QR codes count (for onboarding)
        supabase
          .from("qr_codes")
          .select("id", { count: "exact", head: true })
          .eq("workspace_id", workspaceId),
        
        // 7. Custom domains count (for onboarding)
        supabaseFrom('domains')
          .select("id", { count: "exact", head: true })
          .eq("workspace_id", workspaceId)
          .eq("is_verified", true)
          .not("domain", "in", "(go.utm.one,utm.click)"),
        
        // 8. Pixel configs count (for onboarding)
        supabaseFrom('pixel_configs')
          .select("id", { count: "exact", head: true })
          .eq("workspace_id", workspaceId),

        // 9. Total links count
        supabase
          .from("links")
          .select("id", { count: "exact", head: true })
          .eq("workspace_id", workspaceId)
          .is("deleted_at", null),

        // 10. Profile data for onboarding (hasViewedAnalytics, hasInvitedTeam)
        userId ? supabaseFrom('profiles')
          .select("first_analytics_viewed_at, team_members_invited_count")
          .eq("id", userId)
          .single() : Promise.resolve({ data: null, error: null })
      ]);

      // Process links
      const links: DashboardLink[] = (linksResult.data || []).map(l => ({
        id: l.id,
        title: l.title || "",
        slug: l.slug || "",
        short_url: l.short_url || "",
        destination_url: l.destination_url || "",
        status: l.status || "active",
        total_clicks: l.total_clicks || 0,
        created_at: l.created_at || ""
      }));

      // Process sales links
      const salesLinks: DashboardSalesLink[] = (salesLinksResult.data || []).map(l => ({
        id: l.id,
        title: l.title || "",
        slug: l.slug || "",
        domain: "",
        short_url: l.short_url || "",
        destination_url: l.destination_url || "",
        status: l.status || "active",
        total_clicks: l.total_clicks || 0,
        created_at: l.created_at || "",
        last_clicked_at: l.last_clicked_at,
        link_type: l.link_type || "sales",
        prospect_name: l.prospect_name,
        alert_on_click: l.alert_on_click
      }));

      // Process events
      const events: DashboardEvent[] = (eventsResult.data || []).map(e => ({
        id: e.id,
        name: e.name || "",
        start_date: e.start_date || "",
        end_date: e.end_date || "",
        location_city: e.location_city || "",
        location_country: e.location_country || "",
        direct_scans: e.direct_scans || 0,
        halo_visitors: e.halo_visitors || 0,
        lift_percentage: Number(e.lift_percentage) || 0,
        status: e.status || "upcoming"
      }));

      // Process campaigns
      const campaigns: DashboardCampaign[] = (campaignsResult.data || []).map(c => ({
        id: c.id,
        name: c.name || "",
        status: (c.status as "active" | "archived" | "draft") || "active",
        color: c.color || "#3b82f6",
        created_at: c.created_at || "",
        stats: {
          linkCount: Array.isArray(c.links) ? c.links.length : 0,
          totalClicks: 0
        }
      }));

      // Stats
      const stats: DashboardStats = {
        clicksToday: clicksTodayResult.count || 0,
        totalRevenue: 0,
        totalLinks: totalLinksResult.count || 0
      };

      // Onboarding - consolidated from useOnboardingProgress
      const linkCount = totalLinksResult.count || 0;
      const qrCount = qrCodesResult.count || 0;
      const domainCount = domainsResult.count || 0;
      const pixelCount = pixelsResult.count || 0;
      
      const onboarding: DashboardOnboarding = {
        hasLinks: linkCount > 0,
        hasQrCodes: qrCount > 0,
        hasViewedAnalytics: !!profileResult.data?.first_analytics_viewed_at,
        hasInvitedTeam: (profileResult.data?.team_members_invited_count || 0) > 0,
        hasCustomDomain: domainCount > 0,
        hasInstalledPixel: pixelCount > 0,
        linkCount
      };

      // Minimal analytics (avoid heavy queries)
      const analytics: DashboardAnalytics = {
        isEmpty: linkCount === 0,
        totalClicks: links.reduce((sum, l) => sum + (l.total_clicks || 0), 0),
        uniqueVisitors: 0,
        heatmapData: [],
        topCountries: [],
        topCities: [],
        devices: [],
        browsers: [],
        topReferrers: [],
        insights: []
      };

      // Minimal executive metrics
      const executiveMetrics: DashboardExecutiveMetrics = {
        totalClicks: analytics.totalClicks,
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
        avgClicksPerDay: 0
      };

      const result: DashboardData = {
        links,
        salesLinks,
        events,
        campaigns,
        stats,
        onboarding,
        analytics,
        executiveMetrics,
        fetchedAt: new Date().toISOString()
      };

      // Cache on success
      setCache(workspaceId, result);
      console.log("[useDashboardUnified] Data fetched and cached");

      return result;
    },
    enabled: !!workspaceId,
    initialData: () => cachedData,
    staleTime: 5 * 60 * 1000, // 5 minutes - prevents refetching on every mount
    gcTime: 10 * 60 * 1000,
    refetchOnMount: isCacheStale, // Only refetch on mount if stale
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  // No need to reset - hasTriggeredRefresh persists for component lifetime

  // Invalidate helpers
  const invalidateLinks = () => {
    queryClient.invalidateQueries({ queryKey: ["dashboard-direct", workspaceId] });
  };

  const invalidateEvents = () => {
    queryClient.invalidateQueries({ queryKey: ["dashboard-direct", workspaceId] });
  };

  const invalidateCampaigns = () => {
    queryClient.invalidateQueries({ queryKey: ["dashboard-direct", workspaceId] });
  };

  // Defaults
  const defaultAnalytics: DashboardAnalytics = {
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

  const defaultExecutiveMetrics: DashboardExecutiveMetrics = {
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

  // Use cached data immediately if available, even if stale
  const effectiveData = data || cachedData;
  const hasData = !!effectiveData;

  return {
    links: effectiveData?.links || [],
    salesLinks: effectiveData?.salesLinks || [],
    events: effectiveData?.events || [],
    campaigns: effectiveData?.campaigns || [],
    stats: effectiveData?.stats || { clicksToday: 0, totalRevenue: 0, totalLinks: 0 },
    onboarding: effectiveData?.onboarding || { hasLinks: false, linkCount: 0 },
    analytics: effectiveData?.analytics || defaultAnalytics,
    executiveMetrics: effectiveData?.executiveMetrics || defaultExecutiveMetrics,
    data: effectiveData,
    isLoading: isLoading && !hasData, // Only show loading if no cached data
    isFetching,
    isFetched: isFetched || hasData, // Consider fetched if we have cached data
    isStale: isCacheStale && hasData, // New: indicate if showing stale data
    error,
    refetch,
    invalidateLinks,
    invalidateEvents,
    invalidateCampaigns,
  };
};
