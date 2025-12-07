import { useState, useEffect } from "react";
import { Activity, CheckCircle2, Clock, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";

interface TrackedEvent {
  id: string;
  event_type: string;
  event_name: string | null;
  visitor_id: string;
  landing_page: string | null;
  revenue: number | null;
  created_at: string;
}

export const PixelDebugger = () => {
  const { currentWorkspace } = useWorkspaceContext();
  const [status, setStatus] = useState<'waiting' | 'active'>('waiting');
  const [lastEvent, setLastEvent] = useState<TrackedEvent | null>(null);
  const [recentEvents, setRecentEvents] = useState<TrackedEvent[]>([]);

  useEffect(() => {
    // Subscribe to realtime journey_events
    const channel = supabase
      .channel('pixel-debugger')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'journey_events'
        },
        (payload) => {
          console.log('[PixelDebugger] New event received:', payload);
          const newEvent = payload.new as TrackedEvent;
          
          setStatus('active');
          setLastEvent(newEvent);
          setRecentEvents(prev => [newEvent, ...prev].slice(0, 5));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentWorkspace?.id]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const getEventBadgeVariant = (eventType: string) => {
    switch (eventType) {
      case 'pageview':
        return 'secondary';
      case 'identify':
        return 'default';
      case 'purchase':
      case 'conversion':
        return 'default';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <h3 className="text-title-3 font-semibold heading">real-time pixel debugger</h3>
        </div>
        
        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          {status === 'waiting' ? (
            <>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-muted-foreground opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-muted-foreground"></span>
              </span>
              <span className="text-sm text-muted-foreground">waiting for event...</span>
            </>
          ) : (
            <>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">active</span>
            </>
          )}
        </div>
      </div>

      {/* Last Event Summary */}
      {lastEvent && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg mb-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              pixel detected!
            </span>
            <span className="text-xs text-green-600 dark:text-green-400">
              last ping: {formatTime(lastEvent.created_at)}
            </span>
          </div>
          <div className="text-xs text-green-700 dark:text-green-300 space-y-1">
            <p><strong>Event:</strong> {lastEvent.event_name || lastEvent.event_type}</p>
            <p><strong>Visitor:</strong> {lastEvent.visitor_id}</p>
            {lastEvent.revenue && (
              <p><strong>Revenue:</strong> ${lastEvent.revenue.toFixed(2)}</p>
            )}
          </div>
        </div>
      )}

      {/* Recent Events */}
      {recentEvents.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            recent events
          </p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {recentEvents.map((event) => (
              <div 
                key={event.id} 
                className="flex items-center justify-between p-2 bg-muted/50 rounded-lg text-xs"
              >
                <div className="flex items-center gap-2">
                  <Badge variant={getEventBadgeVariant(event.event_type)} className="text-xs">
                    {event.event_name || event.event_type}
                  </Badge>
                  {event.revenue && (
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      ${event.revenue.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatTime(event.created_at)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions when waiting */}
      {status === 'waiting' && recentEvents.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">open your website with the pixel installed</p>
          <p className="text-xs">events will appear here in real-time</p>
        </div>
      )}
    </Card>
  );
};
