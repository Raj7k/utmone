import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/hooks/useWorkspace";
import { getCachedWorkspaceId } from "@/contexts/AppSessionContext";

const CACHE_KEY = "DASHBOARD_UNIFIED_CACHE";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

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

// Get cached data for INSTANT render
function getCached(workspaceId: string): DashboardData | undefined {
  try {
    const cached = localStorage.getItem(`${CACHE_KEY}-${workspaceId}`);
    if (!cached) return undefined;
    const { data, timestamp } = JSON.parse(cached);
    // Check if cache is still valid (5 min)
    if (Date.now() - timestamp > CACHE_TTL) return undefined;
    return data as DashboardData;
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

// Check for prefetched data from index.html pre-warm script
function getPrefetchedData(workspaceId: string): DashboardData | undefined {
  try {
    const prefetch = (window as any).__DASHBOARD_PREFETCH__;
    if (prefetch?.status === 'ready' && prefetch.workspaceId === workspaceId && prefetch.data) {
      console.log("[useDashboardUnified] Using prefetched data from pre-warm script");
      return prefetch.data as DashboardData;
    }
  } catch {
    // Ignore
  }
  return undefined;
}

export const useDashboardUnified = (range: string = "30d") => {
  const { currentWorkspace } = useWorkspace();
  const queryClient = useQueryClient();

  // Use cached workspace ID for immediate query start
  const workspaceId = currentWorkspace?.id || getCachedWorkspaceId() || "";

  const { data, isLoading, isFetching, isFetched, refetch, error } = useQuery({
    queryKey: ["dashboard-unified", workspaceId, range],
    queryFn: async (): Promise<DashboardData> => {
      // Phase 1: Check if pre-warm script already fetched data
      const prefetched = getPrefetchedData(workspaceId);
      if (prefetched) {
        setCache(workspaceId, prefetched);
        return prefetched;
      }
      
      console.log("[useDashboardUnified] Fetching from edge function...");
      
      const { data, error } = await supabase.functions.invoke("get-dashboard-data", {
        body: { workspaceId, range },
      });

      if (error) {
        console.error("[useDashboardUnified] Edge function error:", error);
        throw error;
      }

      // Cache on success
      setCache(workspaceId, data);
      console.log("[useDashboardUnified] Data cached successfully");

      return data as DashboardData;
    },
    enabled: !!workspaceId,
    // INSTANT render: Check prefetch first, then localStorage cache
    initialData: () => getPrefetchedData(workspaceId) || getCached(workspaceId),
    staleTime: CACHE_TTL, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  // Invalidate specific subsets if needed
  const invalidateLinks = () => {
    queryClient.invalidateQueries({ queryKey: ["dashboard-unified", workspaceId] });
  };

  const invalidateEvents = () => {
    queryClient.invalidateQueries({ queryKey: ["dashboard-unified", workspaceId] });
  };

  const invalidateCampaigns = () => {
    queryClient.invalidateQueries({ queryKey: ["dashboard-unified", workspaceId] });
  };

  // Default analytics structure
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

  return {
    // Data slices
    links: data?.links || [],
    salesLinks: data?.salesLinks || [],
    events: data?.events || [],
    campaigns: data?.campaigns || [],
    stats: data?.stats || { clicksToday: 0, totalRevenue: 0, totalLinks: 0 },
    onboarding: data?.onboarding || { hasLinks: false, linkCount: 0 },
    analytics: data?.analytics || defaultAnalytics,
    executiveMetrics: data?.executiveMetrics || defaultExecutiveMetrics,
    
    // Full data object
    data,
    
    // Loading states
    isLoading: isLoading && !data, // Only true if no cached data
    isFetching, // True during background refresh
    isFetched,
    error,
    
    // Actions
    refetch,
    invalidateLinks,
    invalidateEvents,
    invalidateCampaigns,
  };
};
