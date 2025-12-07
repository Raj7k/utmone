import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SmartInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'anomaly' | 'optimization' | 'trend';
  category: 'revenue' | 'traffic' | 'campaign' | 'channel' | 'conversion' | 'timing';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impactScore: number;
  actionLabel: string;
  actionUrl: string;
  metadata?: Record<string, any>;
}

interface UseSmartInsightsParams {
  workspaceId: string;
  linkId?: string;
  scope?: 'workspace' | 'link';
}

export const useSmartInsights = ({ workspaceId, linkId, scope = 'workspace' }: UseSmartInsightsParams) => {
  return useQuery({
    queryKey: ['smart-insights', workspaceId, linkId, scope],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('generate-smart-insights', {
        body: { workspaceId, linkId, scope }
      });

      if (error) throw error;
      return data as { insights: SmartInsight[]; generatedAt: string };
    },
    enabled: !!workspaceId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });
};
