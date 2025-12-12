import { QueryClient } from "@tanstack/react-query";

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
 * Query key factories for consistent cache management
 */
export const queryKeys = {
  // Auth
  auth: {
    session: ['auth', 'session'] as const,
    user: ['auth', 'user'] as const,
  },
  
  // Workspaces
  workspaces: {
    all: ['client-workspaces'] as const,
    current: ['current-workspace'] as const,
  },
  
  // Links
  links: {
    all: (workspaceId: string) => ['links', workspaceId] as const,
    detail: (linkId: string) => ['link', linkId] as const,
  },
  
  // Analytics
  analytics: {
    overview: (workspaceId: string) => ['analytics', 'overview', workspaceId] as const,
    clicks: (workspaceId: string, period: string) => ['analytics', 'clicks', workspaceId, period] as const,
  },
};

/**
 * Prefetch critical data after auth
 */
export async function prefetchCriticalData() {
  // This can be called after successful auth to warm the cache
  // Implementation depends on specific data needs
}
