import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useWorkspace } from '@/hooks/useWorkspace';
import { usePlanLimits } from '@/hooks/usePlanLimits';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Zap, Activity, ArrowRight, Lock, Sparkles } from 'lucide-react';
import { notify } from '@/lib/notify';
import { EventBridgeFlowCard } from './EventBridgeFlowCard';
import { CreateFlowDialog } from './CreateFlowDialog';
import { PLAN_CONFIG, PlanTier } from '@/lib/planConfig';
import { Link } from 'react-router-dom';

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
  const { planTier } = usePlanLimits();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const currentPlan = PLAN_CONFIG[planTier as PlanTier] || PLAN_CONFIG.free;
  const hasEventBridgeAccess = currentPlan.features.eventBridge;
  const flowLimit = currentPlan.features.eventBridgeFlows;

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
    enabled: !!currentWorkspace?.id && hasEventBridgeAccess,
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
    enabled: !!currentWorkspace?.id && hasEventBridgeAccess,
  });

  // Check if user can create more flows
  const canCreateFlow = flowLimit === 'unlimited' || (flows?.length || 0) < (flowLimit as number);

  const handleCreateFlow = () => {
    if (!canCreateFlow) {
      notify.error(`flow limit reached. upgrade to enterprise for unlimited flows. current limit: ${flowLimit}`);
      return;
    }
    setShowCreateDialog(true);
  };

  // Feature gated - show upgrade CTA
  if (!hasEventBridgeAccess) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="max-w-md text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">event bridge automation</h2>
            <p className="text-muted-foreground">
              connect Luma, Airmeet, or Goldcast to your CRM. leads auto-enrich and sync in real-time.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">available on business & enterprise</span>
            </div>
            <ul className="text-sm text-muted-foreground space-y-2 text-left">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                connect event platforms (Luma, Airmeet, Goldcast)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                auto-enrich leads with Apollo, Clay, ZoomInfo
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                route leads to HubSpot, Salesforce, Pipedrive
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                business: 5 flows | enterprise: unlimited
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link to="/pricing">
                upgrade to business
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/features/event-halo">learn more</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">loading event bridge...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Flow Limit Indicator */}
      {flowLimit !== 'unlimited' && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
          <span className="text-sm text-muted-foreground">
            event bridge flows: <span className="font-medium text-foreground">{flows?.length || 0} / {flowLimit}</span>
          </span>
          {!canCreateFlow && (
            <Button variant="outline" size="sm" asChild>
              <Link to="/pricing">upgrade for more</Link>
            </Button>
          )}
        </div>
      )}

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
          <Button onClick={handleCreateFlow} disabled={!canCreateFlow}>
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
