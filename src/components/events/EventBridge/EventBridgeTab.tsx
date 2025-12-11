import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useWorkspace } from '@/hooks/useWorkspace';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Zap, Activity, ArrowRight } from 'lucide-react';
import { notify } from '@/lib/notify';
import { EventBridgeFlowCard } from './EventBridgeFlowCard';
import { CreateFlowDialog } from './CreateFlowDialog';

interface EventBridgeFlow {
  id: string;
  name: string;
  source_type: string;
  enrichment_enabled: boolean;
  enrichment_provider: string | null;
  routing_rules: any[];
  magic_link_enabled: boolean;
  is_active: boolean;
  created_at: string;
}

export function EventBridgeTab() {
  const { currentWorkspace } = useWorkspace();
  const queryClient = useQueryClient();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data: flows, isLoading } = useQuery({
    queryKey: ['event-bridge-flows', currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return [];
      
      const { data, error } = await supabase
        .from('event_bridge_flows')
        .select('*')
        .eq('workspace_id', currentWorkspace.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as EventBridgeFlow[];
    },
    enabled: !!currentWorkspace?.id,
  });

  const { data: registrationStats } = useQuery({
    queryKey: ['event-bridge-stats', currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return { total: 0, enriched: 0, routed: 0 };

      const { data, error } = await supabase
        .from('event_bridge_registrations')
        .select('enrichment_status, routing_status')
        .eq('workspace_id', currentWorkspace.id);

      if (error) throw error;

      const total = data?.length || 0;
      const enriched = data?.filter(r => r.enrichment_status === 'enriched').length || 0;
      const routed = data?.filter(r => {
        const status = r.routing_status as Record<string, string>;
        return Object.values(status).some(s => s === 'success');
      }).length || 0;

      return { total, enriched, routed };
    },
    enabled: !!currentWorkspace?.id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">loading event bridge...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">total registrations</p>
                <p className="text-2xl font-bold">{registrationStats?.total || 0}</p>
              </div>
              <Zap className="h-8 w-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">enriched leads</p>
                <p className="text-2xl font-bold">{registrationStats?.enriched || 0}</p>
              </div>
              <Activity className="h-8 w-8 text-success/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">synced to CRM</p>
                <p className="text-2xl font-bold">{registrationStats?.routed || 0}</p>
              </div>
              <ArrowRight className="h-8 w-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Flows List */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">event bridge flows</CardTitle>
            <CardDescription>
              automate registration → enrichment → CRM sync
            </CardDescription>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            create flow
          </Button>
        </CardHeader>
        <CardContent>
          {flows && flows.length > 0 ? (
            <div className="space-y-4">
              {flows.map((flow) => (
                <EventBridgeFlowCard key={flow.id} flow={flow} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="mb-2">no flows created yet</p>
              <p className="text-sm">create your first event bridge flow to automate lead capture</p>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateFlowDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}
