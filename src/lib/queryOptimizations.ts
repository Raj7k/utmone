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
