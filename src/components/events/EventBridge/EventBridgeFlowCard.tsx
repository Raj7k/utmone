import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Copy, 
  Settings, 
  Zap, 
  Database, 
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { notify } from '@/lib/notify';
import { RoutingRulesEditor } from './RoutingRulesEditor';
import { ZapierSetupGuide } from './ZapierSetupGuide';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

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

interface EventBridgeFlowCardProps {
  flow: EventBridgeFlow;
}

export function EventBridgeFlowCard({ flow }: EventBridgeFlowCardProps) {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  const webhookUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/webhook-luma/${flow.id}`;

  // Check if flow has received any registrations
  const { data: registrationCount } = useQuery({
    queryKey: ['flow-registrations', flow.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('event_bridge_registrations')
        .select('*', { count: 'exact', head: true })
        .eq('flow_id', flow.id);
      
      if (error) throw error;
      return count || 0;
    },
  });

  const hasRegistrations = (registrationCount || 0) > 0;

  const toggleActiveMutation = useMutation({
    mutationFn: async (isActive: boolean) => {
      const { error } = await supabase
        .from('event_bridge_flows')
        .update({ is_active: isActive })
        .eq('id', flow.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-bridge-flows'] });
      notify.success(flow.is_active ? 'flow deactivated' : 'flow activated');
    },
    onError: () => {
      notify.error('failed to update flow');
    },
  });

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    notify.success('webhook URL copied');
  };

  const sourceLabels: Record<string, string> = {
    luma: 'Luma',
    eventbrite: 'Eventbrite',
    generic: 'Generic Webhook',
  };

  const enrichmentLabels: Record<string, string> = {
    apollo: 'Apollo.io',
    clay: 'Clay',
    zoominfo: 'ZoomInfo',
  };

  return (
    <Card className="bg-card/50 border-border">
      <CardContent className="p-4">
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{flow.name}</h3>
                {/* Connection Status Badge */}
                {hasRegistrations ? (
                  <Badge variant="default" className="text-[10px] bg-green-500/20 text-green-400 border-green-500/30">
                    connected
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-[10px] bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    awaiting setup
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {sourceLabels[flow.source_type] || flow.source_type}
                </Badge>
                {flow.enrichment_enabled && flow.enrichment_provider && (
                  <>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <Badge variant="outline" className="text-xs">
                      {enrichmentLabels[flow.enrichment_provider] || flow.enrichment_provider}
                    </Badge>
                  </>
                )}
                {flow.routing_rules?.length > 0 && (
                  <>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <Badge variant="outline" className="text-xs">
                      {flow.routing_rules.length} destination{flow.routing_rules.length !== 1 ? 's' : ''}
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={flow.is_active}
              onCheckedChange={(checked) => toggleActiveMutation.mutate(checked)}
              disabled={toggleActiveMutation.isPending}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Expanded Content */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-border space-y-4">
            {/* Setup Guide Alert for Luma */}
            {flow.source_type === 'luma' && !hasRegistrations && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-200">Zapier setup required</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Luma doesn't support native webhooks. use Zapier to bridge your event registrations.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2 gap-2"
                      onClick={() => setShowSetupGuide(true)}
                    >
                      <HelpCircle className="h-4 w-4" />
                      view setup guide
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Zapier Setup Guide (Collapsible) */}
            {showSetupGuide && flow.source_type === 'luma' && (
              <Collapsible open={showSetupGuide} onOpenChange={setShowSetupGuide}>
                <CollapsibleContent>
                  <div className="bg-muted/30 rounded-lg p-4 border border-border">
                    <ZapierSetupGuide 
                      webhookUrl={webhookUrl} 
                      flowName={flow.name}
                      onComplete={() => setShowSetupGuide(false)}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Webhook URL */}
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                webhook URL {flow.source_type === 'luma' ? '(paste in Zapier)' : '(paste in ' + sourceLabels[flow.source_type] + ')'}
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-muted/50 px-3 py-2 rounded text-xs font-mono truncate">
                  {webhookUrl}
                </code>
                <Button variant="outline" size="sm" onClick={copyWebhookUrl}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Registration Stats */}
            {hasRegistrations && (
              <div className="flex items-center justify-between text-sm bg-muted/30 rounded-lg p-3">
                <span className="text-muted-foreground">registrations received</span>
                <Badge variant="default">{registrationCount}</Badge>
              </div>
            )}

            {/* Flow Visualization */}
            <div className="flex items-center justify-between bg-muted/30 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded bg-background">
                  <Database className="h-4 w-4" />
                </div>
                <span className="text-sm">{sourceLabels[flow.source_type]}</span>
              </div>

              <ArrowRight className="h-4 w-4 text-muted-foreground" />

              <div className="flex items-center gap-2">
                <div className="p-2 rounded bg-background">
                  <Zap className="h-4 w-4" />
                </div>
                <span className="text-sm">
                  {flow.enrichment_enabled 
                    ? enrichmentLabels[flow.enrichment_provider!] 
                    : 'No Enrichment'}
                </span>
              </div>

              <ArrowRight className="h-4 w-4 text-muted-foreground" />

              <div className="flex items-center gap-2">
                <div className="p-2 rounded bg-background">
                  <ExternalLink className="h-4 w-4" />
                </div>
                <span className="text-sm">
                  {flow.routing_rules?.length || 0} CRM{flow.routing_rules?.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Routing Rules */}
            <RoutingRulesEditor flowId={flow.id} rules={flow.routing_rules || []} />

            {/* Magic Link Status */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">attribution magic link</span>
              <Badge variant={flow.magic_link_enabled ? 'default' : 'secondary'}>
                {flow.magic_link_enabled ? 'enabled' : 'disabled'}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
