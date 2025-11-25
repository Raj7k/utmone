import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface RealtimeClick {
  link_id: string;
  clicked_at: string;
  country?: string;
  device_type?: string;
}

export function useRealtimeClicks(workspaceId: string) {
  const [recentClick, setRecentClick] = useState<RealtimeClick | null>(null);
  const [liveCount, setLiveCount] = useState(0);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!workspaceId) return;

    // Subscribe to link_clicks table changes
    const channel = supabase
      .channel(`clicks-${workspaceId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'link_clicks',
        },
        async (payload) => {
          const newClick = payload.new as RealtimeClick;

          // Verify this click belongs to workspace
          const { data: link } = await supabase
            .from('links')
            .select('workspace_id')
            .eq('id', newClick.link_id)
            .single();

          if (link?.workspace_id === workspaceId) {
            setRecentClick(newClick);
            setLiveCount(prev => prev + 1);

            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ['analytics'] });
            queryClient.invalidateQueries({ queryKey: ['comparison-metrics'] });

            // Clear recent click after 3 seconds
            setTimeout(() => setRecentClick(null), 3000);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [workspaceId, queryClient]);

  return {
    recentClick,
    liveCount,
    isLive: !!recentClick,
  };
}
