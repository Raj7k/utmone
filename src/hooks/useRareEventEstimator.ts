import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { estimateConversionProbability, ProbabilityEstimate } from "@/lib/crossEntropy";

interface RareEventEstimate {
  linkId?: string;
  linkTitle?: string;
  estimate: ProbabilityEstimate;
}

export function useRareEventEstimator(linkId?: string, workspaceId?: string) {
  return useQuery({
    queryKey: ['rare-event-estimator', linkId, workspaceId],
    queryFn: async (): Promise<RareEventEstimate | null> => {
      if (linkId) {
        // Single link estimation
        const { data: link, error: linkError } = await supabase
          .from('links')
          .select('id, title, slug')
          .eq('id', linkId)
          .single();

        if (linkError) throw linkError;

        // Get click count
        const { count: clicks } = await supabaseFrom('link_clicks')
          .select('*', { count: 'exact', head: true })
          .eq('link_id', linkId);

        // Get conversion count
        const { count: conversions } = await supabaseFrom('conversion_events')
          .select('*', { count: 'exact', head: true })
          .eq('link_id', linkId)
          .eq('event_type', 'purchase');

        const estimate = estimateConversionProbability(
          clicks || 0,
          conversions || 0,
          { minSampleSize: 100 }
        );

        return {
          linkId: link.id,
          linkTitle: link.title || link.slug,
          estimate
        };
      } else if (workspaceId) {
        // Workspace-wide estimation
        const { count: clicks } = await supabaseFrom('link_clicks')
          .select('*', { count: 'exact', head: true })
          .eq('workspace_id', workspaceId);

        const { count: conversions } = await supabaseFrom('conversion_events')
          .select('*', { count: 'exact', head: true })
          .eq('workspace_id', workspaceId)
          .eq('event_type', 'purchase');

        const estimate = estimateConversionProbability(
          clicks || 0,
          conversions || 0,
          { minSampleSize: 100 }
        );

        return {
          estimate
        };
      }

      return null;
    },
    enabled: !!linkId || !!workspaceId
  });
}
