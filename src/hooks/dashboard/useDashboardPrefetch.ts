import { useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { getCachedWorkspaceId } from "@/contexts/AppSessionContext";

/**
 * Prefetch dashboard data on hover/intent for instant navigation
 * Uses requestIdleCallback for non-blocking prefetch
 * Debounces to prevent excessive prefetching
 */
export const useDashboardPrefetch = () => {
  const queryClient = useQueryClient();
  const { currentWorkspace } = useWorkspaceContext();
  
  // Debounce refs to prevent multiple prefetches
  const lastPrefetch = useRef<Record<string, number>>({});
  const DEBOUNCE_MS = 2000; // Don't re-prefetch same data within 2s

  const shouldPrefetch = useCallback((key: string) => {
    const now = Date.now();
    const last = lastPrefetch.current[key] || 0;
    if (now - last < DEBOUNCE_MS) return false;
    lastPrefetch.current[key] = now;
    return true;
  }, []);

  const getWorkspaceId = useCallback(() => {
    return currentWorkspace?.id || getCachedWorkspaceId();
  }, [currentWorkspace?.id]);

  const prefetchLinks = useCallback(() => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId || !shouldPrefetch('links')) return;
    
    const prefetch = () => {
      queryClient.prefetchQuery({
        queryKey: ["enhanced-links", workspaceId],
        queryFn: async () => {
          const { data } = await supabase
            .from("links")
            .select("id, title, slug, short_url, destination_url, status, total_clicks, created_at")
            .eq("workspace_id", workspaceId)
            .is("deleted_at", null)
            .order("created_at", { ascending: false })
            .limit(20);
          return data || [];
        },
        staleTime: 60 * 1000,
      });
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(prefetch, { timeout: 500 });
    } else {
      setTimeout(prefetch, 50);
    }
  }, [getWorkspaceId, shouldPrefetch, queryClient]);

  const prefetchIntelligence = useCallback(() => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId || !shouldPrefetch('intelligence')) return;
    
    const prefetch = () => {
      // Prefetch basic click stats
      queryClient.prefetchQuery({
        queryKey: ["intelligence-unified", workspaceId, 7],
        queryFn: async () => {
          const now = new Date();
          const startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          
          const { count } = await supabaseFrom('link_clicks')
            .select("*", { count: "exact", head: true })
            .eq("workspace_id", workspaceId)
            .gte("clicked_at", startDate.toISOString());
          
          return { totalClicks: count || 0 };
        },
        staleTime: 2 * 60 * 1000,
      });
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(prefetch, { timeout: 500 });
    } else {
      setTimeout(prefetch, 50);
    }
  }, [getWorkspaceId, shouldPrefetch, queryClient]);

  const prefetchSales = useCallback(() => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId || !shouldPrefetch('sales')) return;
    
    const prefetch = async () => {
      queryClient.prefetchQuery({
        queryKey: ["sales-links", workspaceId],
        queryFn: async () => {
          const { data } = await (supabase as any)
            .from("links")
            .select("id, title, slug, short_url, destination_url, status, total_clicks, created_at")
            .eq("workspace_id", workspaceId)
            .order("created_at", { ascending: false })
            .limit(50);
          return data || [];
        },
        staleTime: 60 * 1000,
      });
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(prefetch, { timeout: 500 });
    } else {
      setTimeout(prefetch, 50);
    }
  }, [getWorkspaceId, shouldPrefetch, queryClient]);

  const prefetchEvents = useCallback(() => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId || !shouldPrefetch('events')) return;
    
    const prefetch = () => {
      queryClient.prefetchQuery({
        queryKey: ["field-events", workspaceId],
        queryFn: async () => {
          const { data } = await supabaseFrom('field_events')
            .select("id, name, start_date, end_date, location_city, location_country, status")
            .eq("workspace_id", workspaceId)
            .order("start_date", { ascending: false })
            .limit(10);
          return data || [];
        },
        staleTime: 60 * 1000,
      });
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(prefetch, { timeout: 500 });
    } else {
      setTimeout(prefetch, 50);
    }
  }, [getWorkspaceId, shouldPrefetch, queryClient]);

  // Prefetch dashboard unified data (most important) - aligned with actual query key
  const prefetchDashboard = useCallback(() => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId || !shouldPrefetch('dashboard')) return;
    
    const prefetch = () => {
      // Prefetch recent links for dashboard - use correct query key
      queryClient.prefetchQuery({
        queryKey: ["dashboard-direct", workspaceId, "30d"],
        queryFn: async () => {
          const { data } = await supabase
            .from("links")
            .select("id, title, slug, short_url, destination_url, status, total_clicks, created_at")
            .eq("workspace_id", workspaceId)
            .is("deleted_at", null)
            .order("created_at", { ascending: false })
            .limit(10);
          return { links: data || [], fetchedAt: new Date().toISOString() };
        },
        staleTime: 60 * 1000,
      });
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(prefetch, { timeout: 500 });
    } else {
      setTimeout(prefetch, 50);
    }
  }, [getWorkspaceId, shouldPrefetch, queryClient]);

  const prefetchQRCodes = useCallback(() => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId || !shouldPrefetch('qr-codes')) return;
    
    const prefetch = () => {
      queryClient.prefetchQuery({
        queryKey: ["qr-codes", workspaceId],
        queryFn: async () => {
          const { data } = await supabase
            .from("qr_codes")
            .select("id, name, link_id, primary_color, secondary_color, corner_style, created_at")
            .eq("workspace_id", workspaceId)
            .order("created_at", { ascending: false })
            .limit(20);
          return data || [];
        },
        staleTime: 60 * 1000,
      });
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(prefetch, { timeout: 500 });
    } else {
      setTimeout(prefetch, 50);
    }
  }, [getWorkspaceId, shouldPrefetch, queryClient]);
  const prefetchAnalytics = useCallback(() => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId || !shouldPrefetch('analytics')) return;
    
    const prefetch = () => {
      queryClient.prefetchQuery({
        queryKey: ["analytics-data", workspaceId],
        queryFn: async () => {
          const { count } = await supabaseFrom('link_clicks')
            .select("*", { count: "exact", head: true })
            .eq("workspace_id", workspaceId);
          return { totalClicks: count || 0 };
        },
        staleTime: 2 * 60 * 1000,
      });
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(prefetch, { timeout: 500 });
    } else {
      setTimeout(prefetch, 50);
    }
  }, [getWorkspaceId, shouldPrefetch, queryClient]);

  const prefetchCampaigns = useCallback(() => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId || !shouldPrefetch('campaigns')) return;
    
    const prefetch = () => {
      queryClient.prefetchQuery({
        queryKey: ["campaigns", workspaceId],
        queryFn: async () => {
          const { data } = await supabaseFrom('campaigns')
            .select("id, name, status, color, created_at")
            .eq("workspace_id", workspaceId)
            .order("created_at", { ascending: false })
            .limit(20);
          return data || [];
        },
        staleTime: 60 * 1000,
      });
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(prefetch, { timeout: 500 });
    } else {
      setTimeout(prefetch, 50);
    }
  }, [getWorkspaceId, shouldPrefetch, queryClient]);

  const prefetchSettings = useCallback(() => {
    const userId = supabase.auth.getUser().then(({ data }) => data.user?.id);
    if (!shouldPrefetch('settings')) return;
    
    const prefetch = async () => {
      const id = await userId;
      if (!id) return;
      
      queryClient.prefetchQuery({
        queryKey: ["user-profile", id],
        queryFn: async () => {
          const { data } = await supabaseFrom('profiles')
            .select("id, full_name, email, avatar_url, timezone, language")
            .eq("id", id)
            .single();
          return data;
        },
        staleTime: 5 * 60 * 1000,
      });
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(prefetch, { timeout: 500 });
    } else {
      setTimeout(prefetch, 50);
    }
  }, [shouldPrefetch, queryClient]);

  return {
    prefetchLinks,
    prefetchIntelligence,
    prefetchSales,
    prefetchEvents,
    prefetchDashboard,
    prefetchQRCodes,
    prefetchAnalytics,
    prefetchCampaigns,
    prefetchSettings,
  };
};
