import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { supabaseFrom } from '@/lib/supabaseHelper';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Copy, 
  Zap, 
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  HelpCircle,
  AlertCircle,
  Link2,
  Key,
  FileSpreadsheet,
} from 'lucide-react';
import { notify } from '@/lib/notify';
import { RoutingRulesEditor } from './RoutingRulesEditor';
import { ZapierSetupGuide } from './ZapierSetupGuide';
import { AirmeetSetupGuide } from './AirmeetSetupGuide';
import { GoldcastSetupGuide } from './GoldcastSetupGuide';
import { LumaPollingSetup } from './LumaPollingSetup';
import { getPlatformIcon } from '@/components/icons/EventPlatformIcons';
import { getEventPlatform } from '@/config/eventPlatforms';
import {
  Collapsible,
  CollapsibleContent,
} from '@/components/ui/collapsible';

interface EventBridgeFlow {
  id: string;
  name: string;
  source_type: string;
  source_config?: {
    event_url?: string;
    connection_method?: 'zapier' | 'api' | 'manual';
    last_sync_at?: string;
    luma_api_key_configured?: boolean;
  };
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
  const platform = getEventPlatform(flow.source_type);
  const PlatformIcon = getPlatformIcon(flow.source_type);

  // Check if flow has received any registrations
  const { data: registrationCount } = useQuery({
    queryKey: ['flow-registrations', flow.id],
    queryFn: async () => {
      const { count, error } = await supabaseFrom('event_bridge_registrations')
        .select('*', { count: 'exact', head: true })
        .eq('flow_id', flow.id);
      
      if (error) throw error;
      return count || 0;
    },
  });

  const hasRegistrations = (registrationCount || 0) > 0;

  const toggleActiveMutation = useMutation({
    mutationFn: async (isActive: boolean) => {
      const { error } = await supabaseFrom('event_bridge_flows')
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

  const enrichmentLabels: Record<string, string> = {
    apollo: 'Apollo.io',
    clay: 'Clay',
    zoominfo: 'ZoomInfo',
  };

  const connectionMethod = flow.source_config?.connection_method || 'zapier';

  // Render platform-specific setup guide
  const renderSetupGuide = () => {
    switch (flow.source_type) {
      case 'luma':
        return (
          <ZapierSetupGuide 
            webhookUrl={webhookUrl} 
            flowName={flow.name}
            onComplete={() => setShowSetupGuide(false)}
          />
        );
      case 'airmeet':
        return (
          <AirmeetSetupGuide 
            webhookUrl={webhookUrl} 
            flowName={flow.name}
            onComplete={() => setShowSetupGuide(false)}
          />
        );
      case 'goldcast':
        return (
          <GoldcastSetupGuide 
            webhookUrl={webhookUrl} 
            flowName={flow.name}
            onComplete={() => setShowSetupGuide(false)}
          />
        );
      default:
        return (
          <ZapierSetupGuide 
            webhookUrl={webhookUrl} 
            flowName={flow.name}
            onComplete={() => setShowSetupGuide(false)}
          />
        );
    }
  };

  return (
    <Card className="bg-card/50 border-border">
      <CardContent className="p-4">
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <PlatformIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{flow.name}</h3>
                {/* Connection Status Badge - Fixed readability */}
                {hasRegistrations ? (
                  <Badge variant="default" className="text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
                    connected
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700">
                    awaiting setup
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <PlatformIcon className="h-3 w-3" />
                  {platform.name}
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
            {/* Connection Method Badge */}
            {flow.source_config?.connection_method && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {connectionMethod === 'zapier' && (
                  <><Link2 className="h-3 w-3" /> Zapier Bridge</>
                )}
                {connectionMethod === 'api' && (
                  <><Key className="h-3 w-3" /> {platform.name} API {platform.supportsWebhook ? '+ Webhook' : 'Polling'}</>
                )}
                {connectionMethod === 'manual' && (
                  <><FileSpreadsheet className="h-3 w-3" /> Manual Import</>
                )}
              </div>
            )}

            {/* Setup Guide Alert - Fixed readability (no yellow on white) */}
            {!hasRegistrations && connectionMethod === 'zapier' && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                      {flow.source_type === 'luma' ? 'Zapier setup required' : `${platform.name} webhook setup required`}
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                      {flow.source_type === 'luma' 
                        ? "Luma doesn't support native webhooks. use Zapier to bridge your event registrations."
                        : `configure the webhook in your ${platform.name} dashboard to start receiving registrations.`}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2 gap-2 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/40"
                      onClick={() => setShowSetupGuide(true)}
                    >
                      <HelpCircle className="h-4 w-4" />
                      view setup guide
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* API Polling Setup for platforms that support it */}
            {connectionMethod === 'api' && (
              <LumaPollingSetup
                flowId={flow.id}
                eventUrl={flow.source_config?.event_url}
                lastSyncAt={flow.source_config?.last_sync_at}
                onSyncComplete={() => queryClient.invalidateQueries({ queryKey: ['flow-registrations', flow.id] })}
              />
            )}

            {/* Manual Import Instructions */}
            {connectionMethod === 'manual' && (
              <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-3">
                <h4 className="text-sm font-medium">manual CSV import</h4>
                <ol className="text-xs text-muted-foreground space-y-2 list-decimal list-inside">
                  <li>export attendees from your {platform.name} event dashboard</li>
                  <li>save as CSV with columns: email, first_name, last_name, company</li>
                  <li>upload the CSV below to import registrations</li>
                </ol>
                <Button variant="outline" size="sm" disabled>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  import CSV (coming soon)
                </Button>
              </div>
            )}

            {/* Setup Guide (Collapsible) */}
            {showSetupGuide && (
              <Collapsible open={showSetupGuide} onOpenChange={setShowSetupGuide}>
                <CollapsibleContent>
                  <div className="bg-muted/30 rounded-lg p-4 border border-border">
                    {renderSetupGuide()}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Webhook URL */}
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                webhook URL {connectionMethod === 'zapier' ? '(paste in Zapier)' : `(paste in ${platform.name})`}
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

            {/* Flow Visualization with branded icons */}
            <div className="flex items-center justify-between bg-muted/30 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded bg-background">
                  <PlatformIcon className="h-4 w-4" />
                </div>
                <span className="text-sm">{platform.name}</span>
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
