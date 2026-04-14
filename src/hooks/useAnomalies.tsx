import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { supabaseFrom } from '@/lib/supabaseHelper';

export const useAnomalies = (workspaceId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['anomalies', workspaceId],
    enabled: !!workspaceId,
    queryFn: async () => {
      const { data, error } = await supabaseFrom('analytics_anomalies')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('is_dismissed', false)
        .order('detected_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['anomalies', workspaceId] });
  };

  return {
    ...query,
    invalidate,
  };
};
