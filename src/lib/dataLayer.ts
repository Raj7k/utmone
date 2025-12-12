import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { queryKeys, defaultQueryOptions } from "./queryOptimizations";

/**
 * Centralized data fetching layer
 * Ensures query deduplication and consistent caching across components
 */

// Workspace links with deduplication
export const useWorkspaceLinks = (workspaceId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.links.byWorkspace(workspaceId || ""),
    queryFn: async () => {
      if (!workspaceId) return [];
      
      const { data, error } = await supabase
        .from("links")
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!workspaceId,
    ...defaultQueryOptions,
  });
};

// User profile with deduplication
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
  });
};

// Workspace analytics summary
export const useWorkspaceAnalytics = (workspaceId: string | undefined, days: number = 7) => {
  return useQuery({
    queryKey: ["analytics", "summary", workspaceId, days],
    queryFn: async () => {
      if (!workspaceId) return null;

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { count: totalClicks } = await supabase
        .from("link_clicks")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspaceId)
        .gte("clicked_at", startDate.toISOString());

      const { count: uniqueClicks } = await supabase
        .from("link_clicks")
        .select("visitor_id", { count: "exact", head: true })
        .eq("workspace_id", workspaceId)
        .gte("clicked_at", startDate.toISOString());

      return {
        totalClicks: totalClicks || 0,
        uniqueClicks: uniqueClicks || 0,
        period: days,
      };
    },
    enabled: !!workspaceId,
    staleTime: 2 * 60 * 1000, // 2 minutes for analytics
    gcTime: 5 * 60 * 1000,
  });
};

// Optimistic update helper
export const useOptimisticUpdate = () => {
  const queryClient = useQueryClient();

  const optimisticDelete = async <T extends { id: string }>(
    queryKey: unknown[],
    itemId: string,
    deleteFn: () => Promise<void>
  ): Promise<{ previousData: T[] | undefined }> => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey });

    // Snapshot previous value
    const previousData = queryClient.getQueryData<T[]>(queryKey);

    // Optimistically remove the item
    queryClient.setQueryData<T[]>(queryKey, (old) =>
      old?.filter((item) => item.id !== itemId)
    );

    try {
      await deleteFn();
    } catch (error) {
      // Rollback on error
      queryClient.setQueryData(queryKey, previousData);
      throw error;
    }

    return { previousData };
  };

  const optimisticUpdate = async <T extends { id: string }>(
    queryKey: unknown[],
    itemId: string,
    updates: Partial<T>,
    updateFn: () => Promise<void>
  ): Promise<{ previousData: T[] | undefined }> => {
    await queryClient.cancelQueries({ queryKey });

    const previousData = queryClient.getQueryData<T[]>(queryKey);

    queryClient.setQueryData<T[]>(queryKey, (old) =>
      old?.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item
      )
    );

    try {
      await updateFn();
    } catch (error) {
      queryClient.setQueryData(queryKey, previousData);
      throw error;
    }

    return { previousData };
  };

  return { optimisticDelete, optimisticUpdate };
};
