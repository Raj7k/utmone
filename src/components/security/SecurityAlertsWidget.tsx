import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/hooks/useWorkspace";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export const SecurityAlertsWidget = () => {
  const { currentWorkspace } = useWorkspace();

  // Get recent security warnings
  const { data: securityEvents } = useQuery({
    queryKey: ['security-alerts', currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return [];

      const { data, error } = await supabase
        .from('audit_events')
        .select('*')
        .eq('workspace_id', currentWorkspace.id)
        .like('event_type', 'security.%')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
    enabled: !!currentWorkspace?.id,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Get velocity tracking stats
  const { data: velocityStats } = useQuery({
    queryKey: ['velocity-stats', currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return null;

      const { data, error } = await supabase
        .from('audit_velocity_tracking')
        .select('*')
        .eq('workspace_id', currentWorkspace.id)
        .eq('flagged', true)
        .order('flagged_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
    enabled: !!currentWorkspace?.id,
  });

  const criticalAlerts = securityEvents?.filter(e => {
    const metadata = e.metadata as any;
    return metadata?.severity === 'critical';
  }).length || 0;

  if (!securityEvents || securityEvents.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-headline font-display font-semibold text-label mb-1">
              security status
            </h3>
            <p className="text-body-apple text-secondary-label">
              no security alerts detected
            </p>
            <div className="mt-3">
              <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                all clear
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h3 className="text-headline font-display font-semibold text-label mb-1">
                security alerts
              </h3>
              <p className="text-body-apple text-secondary-label">
                {criticalAlerts} critical alert{criticalAlerts !== 1 ? 's' : ''} detected
              </p>
            </div>
          </div>
          <Link to="/settings?tab=security">
            <Button variant="outline" size="sm">
              view all
            </Button>
          </Link>
        </div>

        {/* Recent alerts */}
        <div className="space-y-2">
          {securityEvents.slice(0, 3).map(event => (
            <div 
              key={event.id}
              className="p-3 rounded-lg border border-destructive/20 bg-destructive/5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">
                      {event.event_type.replace('security.', '')}
                    </Badge>
                    {(event.metadata as any)?.severity && (
                      <Badge className="bg-rose-500/10 text-rose-700 dark:text-rose-400 text-xs">
                        {(event.metadata as any).severity}
                      </Badge>
                    )}
                  </div>
                  <div className="text-caption-1-apple text-secondary-label">
                    {format(new Date(event.created_at), 'MMM d, h:mm a')}
                  </div>
                  {(event.metadata as any)?.actual_count && (
                    <div className="flex items-center gap-2 text-xs text-label">
                      <TrendingUp className="w-3 h-3" />
                      <span>
                        {(event.metadata as any).actual_count} operations in {(event.metadata as any).window}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Velocity tracking summary */}
        {velocityStats && velocityStats.length > 0 && (
          <div className="pt-3 border-t border-border">
            <div className="text-caption-1-apple text-tertiary-label mb-2">
              flagged users
            </div>
            <div className="flex flex-wrap gap-2">
              {velocityStats.map(stat => (
                <Badge key={stat.id} variant="outline" className="text-xs font-mono">
                  {stat.actor_id.slice(0, 8)}... ({stat.event_count})
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
