import { QueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Optimized QueryClient configuration for performance
 * 
 * Key optimizations:
 * - Long staleTime prevents unnecessary refetches
 * - Disabled refetchOnWindowFocus for most queries
 * - Minimal retries to fail fast
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data stays fresh for 5 minutes - prevents most refetches
      staleTime: 5 * 60 * 1000,
      
      // Keep data in cache for 30 minutes
      gcTime: 30 * 60 * 1000,
      
      // Don't refetch when window regains focus
      refetchOnWindowFocus: false,
      
      // Don't refetch when network reconnects
      refetchOnReconnect: false,
      
      // Only retry once on failure
      retry: 1,
      
      // Fast retry delay
      retryDelay: 1000,
      
      // Use cached data while fetching
      networkMode: 'offlineFirst',
    },
    mutations: {
      // Don't retry mutations
      retry: 0,
    },
  },
});

/**
 * Standardized query key factories for consistent cache management
 */
export const queryKeys = {
  // User & Profile
  user: {
    current: ['user', 'current'] as const,
    profile: (userId: string) => ['user', 'profile', userId] as const,
  },
  
  // Auth
  auth: {
    session: ['auth', 'session'] as const,
  },
  
  // Workspaces
  workspaces: {
    all: ['client-workspaces'] as const,
    current: ['current-workspace'] as const,
    members: (workspaceId: string) => ['workspace', workspaceId, 'members'] as const,
  },
  
  // Links
  links: {
    all: (workspaceId: string) => ['links', workspaceId] as const,
    detail: (linkId: string) => ['link', linkId] as const,
    count: (workspaceId: string) => ['links', 'count', workspaceId] as const,
  },
  
  // Dashboard
  dashboard: {
    activityFeed: (workspaceId: string) => ['activity-feed', workspaceId] as const,
    clicksWeek: (workspaceId: string) => ['dashboard-clicks-week', workspaceId] as const,
    linksCount: (workspaceId: string) => ['dashboard-links-count', workspaceId] as const,
    onboarding: (workspaceId: string) => ['onboarding-progress', workspaceId] as const,
  },
  
  // Analytics
  analytics: {
    overview: (workspaceId: string) => ['analytics', 'overview', workspaceId] as const,
    clicks: (workspaceId: string, period: string) => ['analytics', 'clicks', workspaceId, period] as const,
  },
};

/**
 * Prefetch critical data after auth to warm the cache
 */
export async function prefetchCriticalData(userId: string) {
  try {
    // Prefetch user profile and workspaces in parallel
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: queryKeys.user.current,
        queryFn: async () => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, email, full_name, avatar_url, timezone')
            .eq('id', userId)
            .single();
          return { user: { id: userId }, profile };
        },
        staleTime: 10 * 60 * 1000,
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.workspaces.all,
        queryFn: async () => {
          const [ownedResult, memberResult] = await Promise.all([
            supabase.from('workspaces').select('*').eq('owner_id', userId),
            supabase.from('workspace_members').select('workspace:workspaces(*)').eq('user_id', userId),
          ]);
          const owned = ownedResult.data || [];
          const memberWs = memberResult.data?.map((m: any) => m.workspace).filter(Boolean) || [];
          return [...owned, ...memberWs];
        },
        staleTime: 5 * 60 * 1000,
      }),
    ]);
  } catch (error) {
    console.error('[prefetchCriticalData] Failed:', error);
  }
}
