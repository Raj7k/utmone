import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";

/**
 * Prefetch dashboard data on hover/intent for instant navigation
 * Uses requestIdleCallback for non-blocking prefetch
 */
export const useDashboardPrefetch = () => {
  const queryClient = useQueryClient();
  const { currentWorkspace } = useWorkspaceContext();

  const prefetchLinks = useCallback(() => {
    if (!currentWorkspace?.id) return;
    
    const prefetch = () => {
      queryClient.prefetchQuery({
        queryKey: ["enhanced-links", currentWorkspace.id],
        queryFn: async () => {
          const { data } = await supabase
            .from("links")
            .select("*")
            .eq("workspace_id", currentWorkspace.id)
            .order("created_at", { ascending: false })
            .limit(20);
          return data || [];
        },
        staleTime: 60 * 1000,
      });
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(prefetch);
    } else {
      setTimeout(prefetch, 100);
    }
  }, [currentWorkspace?.id, queryClient]);

  const prefetchIntelligence = useCallback(() => {
    if (!currentWorkspace?.id) return;
    
    const prefetch = () => {
      queryClient.prefetchQuery({
        queryKey: ["intelligence-unified", currentWorkspace.id, 7],
        queryFn: async () => {
          const now = new Date();
          const startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          
          const { count } = await supabase
            .from("link_clicks")
            .select("*", { count: "exact", head: true })
            .eq("workspace_id", currentWorkspace.id)
            .gte("clicked_at", startDate.toISOString());
          
          return { totalClicks: count || 0 };
        },
        staleTime: 2 * 60 * 1000,
      });
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(prefetch);
    } else {
      setTimeout(prefetch, 100);
    }
  }, [currentWorkspace?.id, queryClient]);

  const prefetchSales = useCallback(() => {
    if (!currentWorkspace?.id) return;
    
    const prefetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      queryClient.prefetchQuery({
        queryKey: ["sales-links", currentWorkspace.id],
        queryFn: async () => {
          const { data } = await supabase
            .from("links")
            .select("*")
            .eq("workspace_id", currentWorkspace.id)
            .eq("created_by", user.id)
            .eq("link_type", "sales")
            .order("created_at", { ascending: false });
          return data || [];
        },
        staleTime: 60 * 1000,
      });
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(prefetch);
    } else {
      setTimeout(prefetch, 100);
    }
  }, [currentWorkspace?.id, queryClient]);

  const prefetchEvents = useCallback(() => {
    if (!currentWorkspace?.id) return;
    
    const prefetch = () => {
      queryClient.prefetchQuery({
        queryKey: ["field-events", currentWorkspace.id],
        queryFn: async () => {
          const { data } = await supabase
            .from("field_events")
            .select("*")
            .eq("workspace_id", currentWorkspace.id)
            .order("start_date", { ascending: false })
            .limit(10);
          return data || [];
        },
        staleTime: 60 * 1000,
      });
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(prefetch);
    } else {
      setTimeout(prefetch, 100);
    }
  }, [currentWorkspace?.id, queryClient]);

  return {
    prefetchLinks,
    prefetchIntelligence,
    prefetchSales,
    prefetchEvents,
  };
};
