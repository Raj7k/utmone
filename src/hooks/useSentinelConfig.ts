import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export interface SentinelConfig {
  inventory_check?: {
    enabled: boolean;
    shopify_sku?: string;
    threshold?: number;
    fallback_url?: string;
    fallback_type?: 'category' | 'similar' | 'custom';
  };
  health_preflight?: {
    enabled: boolean;
    timeout_ms?: number;
    fallback_url?: string;
  };
  ai_bot_mode?: {
    enabled: boolean;
    json_payload?: Record<string, unknown>;
  };
  auto_heal?: {
    enabled: boolean;
    sitemap_url?: string;
  };
}

interface LinkSentinelData {
  id: string;
  sentinel_enabled: boolean;
  sentinel_config: SentinelConfig;
  destination_url: string;
  title: string;
}

// UUID validation helper - prevents invalid queries like "create" being passed as linkId
const isValidUUID = (id: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

export function useSentinelConfig(linkId: string | undefined) {
  const validId = linkId && isValidUUID(linkId);
  
  return useQuery({
    queryKey: ["sentinel-config", linkId],
    queryFn: async (): Promise<LinkSentinelData | null> => {
      if (!linkId) return null;

      const { data, error } = await supabase
        .from("links")
        .select("id, sentinel_enabled, sentinel_config, destination_url, title")
        .eq("id", linkId)
        .single();

      if (error) throw error;
      
      return {
        ...data,
        sentinel_config: (data.sentinel_config as SentinelConfig) || {},
      };
    },
    enabled: !!validId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useUpdateSentinelConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      linkId,
      sentinel_enabled,
      sentinel_config,
    }: {
      linkId: string;
      sentinel_enabled: boolean;
      sentinel_config: SentinelConfig;
    }) => {
      const { error } = await supabase
        .from("links")
        .update({
          sentinel_enabled,
          sentinel_config: sentinel_config as Json,
        })
        .eq("id", linkId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ["sentinel-config", variables.linkId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["enhanced-links"] 
      });
    },
  });
}
