import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";

interface SentinelSave {
  id: string;
  link_id: string;
  workspace_id: string;
  save_type: 'inventory' | 'health' | 'ai_bot' | 'auto_heal';
  original_destination: string;
  redirected_to: string;
  estimated_value: number;
  visitor_info: Record<string, unknown>;
  metadata: Record<string, unknown>;
  saved_at: string;
}

interface SentinelStats {
  total_saves: number;
  total_value: number;
  by_type: {
    inventory: { count: number; value: number };
    health: { count: number; value: number };
    ai_bot: { count: number; value: number };
    auto_heal: { count: number; value: number };
  };
}

export function useSentinelSaves(workspaceId: string | undefined, days: number = 7) {
  return useQuery({
    queryKey: ["sentinel-saves", workspaceId, days],
    queryFn: async (): Promise<SentinelSave[]> => {
      if (!workspaceId) return [];

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabaseFrom('sentinel_saves')
        .select("*")
        .eq("workspace_id", workspaceId)
        .gte("saved_at", startDate.toISOString())
        .order("saved_at", { ascending: false });

      if (error) throw error;
      return data as SentinelSave[];
    },
    enabled: !!workspaceId,
  });
}

export function useSentinelStats(workspaceId: string | undefined, days: number = 7) {
  const { data: saves, ...rest } = useSentinelSaves(workspaceId, days);

  const stats: SentinelStats = {
    total_saves: 0,
    total_value: 0,
    by_type: {
      inventory: { count: 0, value: 0 },
      health: { count: 0, value: 0 },
      ai_bot: { count: 0, value: 0 },
      auto_heal: { count: 0, value: 0 },
    },
  };

  if (saves) {
    saves.forEach((save) => {
      stats.total_saves++;
      stats.total_value += save.estimated_value || 0;
      
      const typeStats = stats.by_type[save.save_type];
      if (typeStats) {
        typeStats.count++;
        typeStats.value += save.estimated_value || 0;
      }
    });
  }

  return { stats, saves, ...rest };
}

export function useLinkSentinelSaves(linkId: string | undefined) {
  return useQuery({
    queryKey: ["sentinel-saves-link", linkId],
    queryFn: async (): Promise<SentinelSave[]> => {
      if (!linkId) return [];

      const { data, error } = await supabaseFrom('sentinel_saves')
        .select("*")
        .eq("link_id", linkId)
        .order("saved_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as SentinelSave[];
    },
    enabled: !!linkId,
  });
}
