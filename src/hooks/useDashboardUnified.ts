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

export interface DashboardStats {
  clicksToday: number;
  totalRevenue: number;
  totalLinks: number;
}

export interface DashboardOnboarding {
  hasLinks: boolean;
  linkCount: number;
}

export interface DashboardData {
  links: DashboardLink[];
  events: DashboardEvent[];
  campaigns: DashboardCampaign[];
  stats: DashboardStats;
  onboarding: DashboardOnboarding;
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

export const useDashboardUnified = (range: string = "30d") => {
  const { currentWorkspace } = useWorkspace();
  const queryClient = useQueryClient();

  // Use cached workspace ID for immediate query start
  const workspaceId = currentWorkspace?.id || getCachedWorkspaceId() || "";

  const { data, isLoading, isFetching, isFetched, refetch, error } = useQuery({
    queryKey: ["dashboard-unified", workspaceId, range],
    queryFn: async (): Promise<DashboardData> => {
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
    initialData: () => getCached(workspaceId), // INSTANT render from cache
    staleTime: CACHE_TTL, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
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

  return {
    // Data slices
    links: data?.links || [],
    events: data?.events || [],
    campaigns: data?.campaigns || [],
    stats: data?.stats || { clicksToday: 0, totalRevenue: 0, totalLinks: 0 },
    onboarding: data?.onboarding || { hasLinks: false, linkCount: 0 },
    
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
