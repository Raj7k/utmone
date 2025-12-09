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

export type TimeRange = 'auto' | '7d' | '14d' | '30d' | '90d' | 'all';

interface UseSmartInsightsParams {
  workspaceId: string;
  linkId?: string;
  scope?: 'workspace' | 'link';
  timeRange?: TimeRange;
}

interface SmartInsightsResponse {
  insights: SmartInsight[];
  generatedAt: string;
  analysisPeriod: string;
  analysisDays: number;
  clicksAnalyzed: number;
  totalAllTimeClicks: number;
}

export const useSmartInsights = ({ 
  workspaceId, 
  linkId, 
  scope = 'workspace',
  timeRange = 'auto'
}: UseSmartInsightsParams) => {
  return useQuery({
    queryKey: ['smart-insights', workspaceId, linkId, scope, timeRange],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('generate-smart-insights', {
        body: { workspaceId, linkId, scope, timeRange }
      });

      if (error) throw error;
      return data as SmartInsightsResponse;
    },
    enabled: !!workspaceId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });
};
