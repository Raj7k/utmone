import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/hooks/useWorkspace";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, User, AlertTriangle, Shield, ChevronRight } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { TimelineDiffViewer } from "./TimelineDiffViewer";

interface AuditEvent {
  id: string;
  event_type: string;
  resource_id: string | null;
  actor_id: string;
  metadata: any;
  changes: any;
  created_at: string;
}

export const TimelineAuditViewer = () => {
  const { currentWorkspace } = useWorkspace();
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const { data: events, isLoading } = useQuery({
    queryKey: ['timeline-audit-events', currentWorkspace?.id, filterType],
    queryFn: async () => {
      if (!currentWorkspace?.id) return [];

      let query = supabase
        .from('audit_events')
        .select('*')
        .eq('workspace_id', currentWorkspace.id)
        .order('created_at', { ascending: false })
        .limit(200);

      if (filterType !== 'all') {
        if (filterType === 'security') {
          query = query.like('event_type', 'security.%');
        } else {
          query = query.like('event_type', `${filterType}.%`);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as AuditEvent[];
    },
    enabled: !!currentWorkspace?.id,
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Get unique event categories for filtering
  const eventCategories = Array.from(
    new Set(events?.map(e => e.event_type.split('.')[0]) || [])
  );

  const getEventIcon = (eventType: string) => {
    if (eventType.startsWith('security')) {
      return <AlertTriangle className="w-4 h-4 text-destructive" />;
    }
    return <Shield className="w-4 h-4 text-primary" />;
  };

  const getEventColor = (eventType: string) => {
    if (eventType.includes('created')) return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20';
    if (eventType.includes('updated')) return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20';
    if (eventType.includes('deleted')) return 'bg-destructive/10 text-destructive border-destructive/20';
    if (eventType.includes('security')) return 'border-destructive/20';
    return 'bg-muted text-muted-foreground border-border';
  };

  const getEventStyle = (eventType: string) => {
    if (eventType.includes('security')) return { background: 'rgba(244,63,94,0.1)', color: 'rgba(244,63,94,0.9)' };
    return {};
  };

  const formatEventType = (type: string) => {
    return type.replace(/\./g, ' › ').replace(/_/g, ' ');
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Card>
    );
  }

  const securityEvents = events?.filter(e => e.event_type.startsWith('security')) || [];

  return (
    <>
      <Card className="p-0 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-headline font-display font-semibold text-label mb-1">
                time-travel audit log
              </h2>
              <p className="text-body-apple text-secondary-label">
                immutable flight recorder of all workspace events
              </p>
            </div>
            <div className="flex items-center gap-2">
              {securityEvents.length > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {securityEvents.length} security alerts
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {events?.length || 0} events
              </Badge>
            </div>
          </div>

          {/* Filter buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant={filterType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('all')}
            >
              all events
            </Button>
            {eventCategories.map(category => (
              <Button
                key={category}
                variant={filterType === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <ScrollArea className="h-[600px]">
          {!events || events.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Shield className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
              <h3 className="text-headline font-display font-semibold text-label">
                no events yet
              </h3>
              <p className="text-body-apple text-secondary-label">
                all workspace actions will be tracked here
              </p>
            </div>
          ) : (
            <div className="p-6 space-y-0">
              {events.map((event, index) => (
                <button
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="w-full text-left group relative"
                >
                  {/* Timeline line */}
                  {index < events.length - 1 && (
                    <div className="absolute left-[21px] top-12 bottom-0 w-px bg-border" />
                  )}

                  <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors relative">
                    {/* Timeline dot with icon */}
                    <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-card border-2 border-border">
                      {getEventIcon(event.event_type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={`${getEventColor(event.event_type)} border text-xs`} style={getEventStyle(event.event_type)}>
                          {formatEventType(event.event_type)}
                        </Badge>
                        {event.metadata?.severity && (
                          <Badge variant="destructive" className="text-xs">
                            {event.metadata.severity}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-secondary-label">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span title={format(new Date(event.created_at), 'PPpp')}>
                              {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span className="truncate max-w-[120px]">
                              {event.actor_id.slice(0, 8)}...
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </Card>

      {/* Event Detail Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-headline font-display">
              event details
            </DialogTitle>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-6">
              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/30 border border-border">
                <div>
                  <div className="text-caption-1-apple text-tertiary-label mb-1">Event Type</div>
                  <Badge className={getEventColor(selectedEvent.event_type)} style={getEventStyle(selectedEvent.event_type)}>
                    {formatEventType(selectedEvent.event_type)}
                  </Badge>
                </div>
                <div>
                  <div className="text-caption-1-apple text-tertiary-label mb-1">Timestamp</div>
                  <div className="text-body-apple text-label">
                    {format(new Date(selectedEvent.created_at), 'PPpp')}
                  </div>
                </div>
                <div>
                  <div className="text-caption-1-apple text-tertiary-label mb-1">Actor ID</div>
                  <div className="text-body-apple text-label font-mono text-xs">
                    {selectedEvent.actor_id}
                  </div>
                </div>
                {selectedEvent.resource_id && (
                  <div>
                    <div className="text-caption-1-apple text-tertiary-label mb-1">Resource ID</div>
                    <div className="text-body-apple text-label font-mono text-xs">
                      {selectedEvent.resource_id}
                    </div>
                  </div>
                )}
              </div>

              {/* Metadata */}
              {selectedEvent.metadata && Object.keys(selectedEvent.metadata).length > 0 && (
                <div className="space-y-2">
                  <div className="text-subheadline-apple font-medium text-label">Metadata</div>
                  <pre className="p-4 rounded-lg bg-muted/30 border border-border text-xs overflow-auto">
                    {JSON.stringify(selectedEvent.metadata, null, 2)}
                  </pre>
                </div>
              )}

              {/* Diff View */}
              {selectedEvent.changes && (selectedEvent.changes.before || selectedEvent.changes.after) && (
                <TimelineDiffViewer changes={selectedEvent.changes} />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
