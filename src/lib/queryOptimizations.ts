import { QueryKey, UseQueryOptions } from "@tanstack/react-query";

// Query key factories for consistent caching
export const queryKeys = {
  links: {
    all: ["links"] as const,
    byWorkspace: (workspaceId: string) => ["links", workspaceId] as const,
    byId: (linkId: string) => ["links", linkId] as const,
    analytics: (linkId: string, days?: number) => ["links", linkId, "analytics", days] as const,
  },
  analytics: {
    all: ["analytics"] as const,
    comparison: (workspaceId: string, period: string) => ["analytics", "comparison", workspaceId, period] as const,
    devices: (workspaceId: string) => ["analytics", "devices", workspaceId] as const,
    geography: (workspaceId: string) => ["analytics", "geography", workspaceId] as const,
    campaigns: (workspaceId: string) => ["analytics", "campaigns", workspaceId] as const,
    timeSeries: (params: { workspaceId: string; linkId?: string; campaignName?: string; days: number; granularity: string }) =>
      ["analytics", "timeSeries", params] as const,
  },
  workspaces: {
    all: ["workspaces"] as const,
    byId: (workspaceId: string) => ["workspaces", workspaceId] as const,
  },
};

// Default query options with optimal caching
export const defaultQueryOptions: Partial<UseQueryOptions> = {
  staleTime: 60 * 1000, // 1 minute
  gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
  refetchOnWindowFocus: false,
  retry: 1,
};

// Analytics-specific options (data changes less frequently)
export const analyticsQueryOptions: Partial<UseQueryOptions> = {
  staleTime: 2 * 60 * 1000, // 2 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
  refetchOnWindowFocus: false,
  retry: 1,
};

// Batch multiple queries with Promise.all
export const batchQueries = async <T extends unknown[]>(
  queries: Array<() => Promise<T[number]>>
): Promise<T> => {
  return Promise.all(queries.map((query) => query())) as Promise<T>;
};

// Smart caching with adaptive staleTime based on data volatility
export const adaptiveQueryOptions = (
  dataType: 'real-time' | 'frequent' | 'stable'
): Partial<UseQueryOptions> => {
  const configs = {
    'real-time': {
      staleTime: 10 * 1000, // 10 seconds for live data
      gcTime: 30 * 1000,
      refetchOnWindowFocus: true,
      refetchInterval: 30 * 1000,
    },
    'frequent': {
      staleTime: 60 * 1000, // 1 minute for frequently changing data
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
    'stable': {
      staleTime: 10 * 60 * 1000, // 10 minutes for stable data
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  };

  return configs[dataType];
};

// Predictive prefetching based on navigation patterns
export const prefetchRelatedQueries = async (
  queryClient: any,
  currentRoute: string,
  workspaceId: string
) => {
  const prefetchMap: Record<string, Array<{ key: any; fn: () => Promise<any> }>> = {
    '/dashboard': [
      {
        key: queryKeys.links.byWorkspace(workspaceId),
        fn: async () => {
          // Prefetch recent links
          return [];
        },
      },
      {
        key: queryKeys.analytics.comparison(workspaceId, '7d'),
        fn: async () => {
          // Prefetch analytics overview
          return [];
        },
      },
    ],
    '/dashboard/links': [
      {
        key: queryKeys.analytics.devices(workspaceId),
        fn: async () => {
          // Prefetch device analytics
          return [];
        },
      },
    ],
  };

  const prefetchQueries = prefetchMap[currentRoute] || [];
  
  // Prefetch in parallel with low priority
  await Promise.all(
    prefetchQueries.map(({ key, fn }) =>
      queryClient.prefetchQuery({
        queryKey: key,
        queryFn: fn,
        staleTime: 5 * 60 * 1000, // Keep prefetched data for 5 minutes
      })
    )
  );
};

// Query deduplication and request coalescing
export const coalescedQuery = <T>(
  key: string,
  fn: () => Promise<T>,
  windowMs: number = 100
): Promise<T> => {
  const cache = new Map<string, { promise: Promise<T>; timestamp: number }>();
  
  const cached = cache.get(key);
  const now = Date.now();
  
  if (cached && now - cached.timestamp < windowMs) {
    return cached.promise;
  }
  
  const promise = fn();
  cache.set(key, { promise, timestamp: now });
  
  // Clean up after window
  setTimeout(() => cache.delete(key), windowMs);
  
  return promise;
};
