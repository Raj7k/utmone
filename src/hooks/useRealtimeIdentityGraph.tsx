import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface IdentityEdge {
  id: string;
  source_visitor_id: string;
  target_visitor_id: string;
  match_type: 'deterministic' | 'probabilistic';
  confidence: number;
  signals: Record<string, boolean>;
  created_at: string;
  workspace_id: string;
}

interface RealtimeIdentityState {
  recentMatch: IdentityEdge | null;
  liveCount: number;
  isConnected: boolean;
  isLive: boolean;
  clearRecentMatch: () => void;
}

export function useRealtimeIdentityGraph(workspaceId: string | undefined): RealtimeIdentityState {
  const [recentMatch, setRecentMatch] = useState<IdentityEdge | null>(null);
  const [liveCount, setLiveCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();

  const clearRecentMatch = useCallback(() => {
    setRecentMatch(null);
  }, []);

  useEffect(() => {
    if (!workspaceId) return;

    console.log("[RealtimeIdentityGraph] Subscribing to identity_edges for workspace:", workspaceId);

    const channel = supabase
      .channel(`identity-graph-${workspaceId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'identity_edges',
          filter: `workspace_id=eq.${workspaceId}`
        },
        (payload) => {
          console.log("[RealtimeIdentityGraph] New identity edge detected:", payload);
          const newEdge = payload.new as IdentityEdge;

          // Only process high confidence matches
          if (newEdge.confidence >= 0.5) {
            setRecentMatch(newEdge);
            setLiveCount(prev => prev + 1);

            // Show toast notification
            toast.success("new cross-device match detected", {
              description: `${Math.round(newEdge.confidence * 100)}% confidence • ${newEdge.match_type}`,
              duration: 4000,
            });

            // Invalidate the identity graph query to refresh the list
            queryClient.invalidateQueries({ queryKey: ['identity-graph'] });

            // Clear the highlight after 5 seconds
            setTimeout(() => {
              setRecentMatch(null);
            }, 5000);
          }
        }
      )
      .subscribe((status) => {
        console.log("[RealtimeIdentityGraph] Subscription status:", status);
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      console.log("[RealtimeIdentityGraph] Unsubscribing from channel");
      supabase.removeChannel(channel);
    };
  }, [workspaceId, queryClient]);

  return {
    recentMatch,
    liveCount,
    isConnected,
    isLive: !!recentMatch,
    clearRecentMatch,
  };
}
