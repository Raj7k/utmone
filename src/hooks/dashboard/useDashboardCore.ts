/**
 * useDashboardCore - Lightweight hook for DashboardHome
 * Uses single RPC call instead of 10 parallel queries
 */

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/hooks/workspace/useWorkspace";
import { getCachedWorkspaceId, getCachedUserId } from "@/contexts/AppSessionContext";

const CACHE_KEY = "DASHBOARD_CORE_CACHE";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const STALE_TTL = 30 * 1000; // 30 seconds

export interface DashboardCoreLink {
  id: string;
  title: string;
  slug: string;
  short_url: string;
  destination_url: string;
  status: string;
  total_clicks: number;
  created_at: string;
}

export interface DashboardCoreStats {
  clicksToday: number;
  totalLinks: number;
  totalRevenue: number;
}

export interface DashboardCoreOnboarding {
  hasLinks: boolean;
  hasQrCodes: boolean;
  hasViewedAnalytics: boolean;
  hasInvitedTeam: boolean;
  hasCustomDomain: boolean;
  hasInstalledPixel: boolean;
  linkCount: number;
}

export interface DashboardCoreData {
  links: DashboardCoreLink[];
  stats: DashboardCoreStats;
  onboarding: DashboardCoreOnboarding;
  fetchedAt: string;
}

// Get cached data for instant render
function getCached(workspaceId: string): { data: DashboardCoreData; isStale: boolean } | undefined {
  try {
    const cached = localStorage.getItem(`${CACHE_KEY}-${workspaceId}`);
    if (!cached) return undefined;
    const { data, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;
    if (age > CACHE_TTL) return undefined;
    return { data: data as DashboardCoreData, isStale: age > STALE_TTL };
  } catch {
    return undefined;
  }
}

// Save to cache
function setCache(workspaceId: string, data: DashboardCoreData) {
  try {
    localStorage.setItem(
      `${CACHE_KEY}-${workspaceId}`,
      JSON.stringify({ data, timestamp: Date.now() })
    );
  } catch {
    // Ignore storage errors
  }
}

export const useDashboardCore = () => {
  const { currentWorkspace } = useWorkspace();
  const queryClient = useQueryClient();

  const workspaceId = currentWorkspace?.id || getCachedWorkspaceId() || "";

  // Get userId from context cache - NO network call
  const userId = getCachedUserId() || "";

  // Get cached data (only if we have a workspaceId)
  const cachedResult = workspaceId ? getCached(workspaceId) : undefined;
  const cachedData = cachedResult?.data;
  const isCacheStale = cachedResult?.isStale ?? true;

  // IMPORTANT: Always call useQuery unconditionally (React rules of hooks)
  // Use `enabled` to control when it actually fetches
  const { data, isLoading, isFetching, isFetched, refetch, error } = useQuery({
    queryKey: ["dashboard-core", workspaceId],
    queryFn: async (): Promise<DashboardCoreData> => {
      console.log("[useDashboardCore] Calling RPC get_dashboard_summary...");
      
      // SINGLE RPC call - replaces 10 parallel queries
      const { data: rpcData, error: rpcError } = await supabase.rpc(
        "get_dashboard_summary",
        { p_workspace_id: workspaceId, p_user_id: userId || null }
      );
      
      if (rpcError) {
        console.error("[useDashboardCore] RPC error:", rpcError);
        throw rpcError;
      }

      const summary = rpcData as {
        linksCount: number;
        clicksToday: number;
        qrCount: number;
        domainsCount: number;
        pixelCount: number;
        hasViewedAnalytics: boolean;
        hasInvitedTeam: boolean;
        recentLinks: Array<{
          id: string;
          title: string;
          slug: string;
          short_url: string;
          destination_url: string;
          status: string;
          total_clicks: number;
          created_at: string;
        }>;
      };

      // Map to our interface
      const links: DashboardCoreLink[] = (summary.recentLinks || []).map(l => ({
        id: l.id,
        title: l.title || "",
        slug: l.slug || "",
        short_url: l.short_url || "",
        destination_url: l.destination_url || "",
        status: l.status || "active",
        total_clicks: l.total_clicks || 0,
        created_at: l.created_at || ""
      }));

      const stats: DashboardCoreStats = {
        clicksToday: summary.clicksToday || 0,
        totalLinks: summary.linksCount || 0,
        totalRevenue: 0
      };

      const onboarding: DashboardCoreOnboarding = {
        hasLinks: summary.linksCount > 0,
        hasQrCodes: summary.qrCount > 0,
        hasViewedAnalytics: summary.hasViewedAnalytics || false,
        hasInvitedTeam: summary.hasInvitedTeam || false,
        hasCustomDomain: summary.domainsCount > 0,
        hasInstalledPixel: summary.pixelCount > 0,
        linkCount: summary.linksCount || 0
      };

      const result: DashboardCoreData = {
        links,
        stats,
        onboarding,
        fetchedAt: new Date().toISOString()
      };

      // Cache on success
      setCache(workspaceId, result);
      console.log("[useDashboardCore] Data fetched via RPC (1 call)");

      return result;
    },
    // Only fetch when we have a workspaceId
    enabled: !!workspaceId,
    initialData: () => cachedData,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: isCacheStale,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  const invalidate = () => {
    if (workspaceId) {
      queryClient.invalidateQueries({ queryKey: ["dashboard-core", workspaceId] });
    }
  };

  // If no workspaceId yet, return safe loading shape
  if (!workspaceId) {
    return {
      links: [],
      stats: { clicksToday: 0, totalLinks: 0, totalRevenue: 0 },
      onboarding: {
        hasLinks: true, // Default true to avoid FirstRunExperience flash
        hasQrCodes: false,
        hasViewedAnalytics: false,
        hasInvitedTeam: false,
        hasCustomDomain: false,
        hasInstalledPixel: false,
        linkCount: 0,
      },
      isLoading: true,
      isFetching: false,
      isFetched: false,
      isStale: false,
      error: null,
      refetch: () => Promise.resolve({ data: undefined } as any),
      invalidate,
    };
  }

  // Use cached data immediately if available
  const effectiveData = data || cachedData;
  const hasData = !!effectiveData;

  return {
    links: effectiveData?.links || [],
    stats: effectiveData?.stats || { clicksToday: 0, totalLinks: 0, totalRevenue: 0 },
    onboarding: effectiveData?.onboarding || { 
      hasLinks: false, 
      hasQrCodes: false,
      hasViewedAnalytics: false,
      hasInvitedTeam: false,
      hasCustomDomain: false,
      hasInstalledPixel: false,
      linkCount: 0 
    },
    isLoading: isLoading && !hasData,
    isFetching,
    isFetched: isFetched || hasData,
    isStale: isCacheStale && hasData,
    error,
    refetch,
    invalidate,
  };
};
