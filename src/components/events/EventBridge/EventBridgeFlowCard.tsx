import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
  ExternalLink
} from 'lucide-react';
import { notify } from '@/lib/notify';
import { RoutingRulesEditor } from './RoutingRulesEditor';

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

  const webhookUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/webhook-luma/${flow.id}`;

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
              <h3 className="font-medium">{flow.name}</h3>
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
            {/* Webhook URL */}
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                webhook URL (paste in Luma)
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
