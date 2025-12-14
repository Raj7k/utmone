import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useWorkspace } from '@/hooks/workspace';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { notify } from '@/lib/notify';
import { Zap, ArrowRight, Link2, Key, FileSpreadsheet, Info, ExternalLink } from 'lucide-react';
import { 
  LumaIcon, 
  AirmeetIcon, 
  GoldcastIcon, 
  EventbriteIcon, 
  WebhookIcon,
  getPlatformIcon 
} from '@/components/icons/EventPlatformIcons';
import { 
  EVENT_PLATFORMS, 
  getEventPlatform, 
  getConnectionMethodDescription,
  type ConnectionMethod 
} from '@/config/eventPlatforms';

interface CreateFlowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateFlowDialog({ open, onOpenChange }: CreateFlowDialogProps) {
  const { currentWorkspace } = useWorkspace();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [sourceType, setSourceType] = useState('luma');
  const [connectionMethod, setConnectionMethod] = useState<ConnectionMethod>('zapier');
  const [eventUrl, setEventUrl] = useState('');
  const [enrichmentEnabled, setEnrichmentEnabled] = useState(true);
  const [enrichmentProvider, setEnrichmentProvider] = useState('apollo');
  const [magicLinkEnabled, setMagicLinkEnabled] = useState(true);

  const platform = getEventPlatform(sourceType);
  const PlatformIcon = getPlatformIcon(sourceType);

  // Reset connection method when platform changes
  const handlePlatformChange = (newPlatform: string) => {
    setSourceType(newPlatform);
    const newPlatformConfig = getEventPlatform(newPlatform);
    // Set to first available method for the platform
    if (newPlatformConfig.connectionMethods.length > 0) {
      setConnectionMethod(newPlatformConfig.connectionMethods[0]);
    }
  };

  const createFlowMutation = useMutation({
    mutationFn: async () => {
      if (!currentWorkspace?.id) throw new Error('No workspace selected');

      const { data, error } = await supabase
        .from('event_bridge_flows')
        .insert({
          workspace_id: currentWorkspace.id,
          name,
          source_type: sourceType,
          source_config: { 
            event_url: eventUrl,
            connection_method: connectionMethod,
          },
          enrichment_enabled: enrichmentEnabled,
          enrichment_provider: enrichmentEnabled ? enrichmentProvider : null,
          magic_link_enabled: magicLinkEnabled,
          routing_rules: [],
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-bridge-flows'] });
      notify.success('flow created successfully');
      onOpenChange(false);
      resetForm();
    },
    onError: (error) => {
      notify.error('failed to create flow');
      console.error('Create flow error:', error);
    },
  });

  const resetForm = () => {
    setName('');
    setSourceType('luma');
    setConnectionMethod('zapier');
    setEventUrl('');
    setEnrichmentEnabled(true);
    setEnrichmentProvider('apollo');
    setMagicLinkEnabled(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      notify.error('please enter a flow name');
      return;
    }
    createFlowMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            create event bridge flow
          </DialogTitle>
          <DialogDescription>
            connect your event platform to your CRM with automatic enrichment
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Flow Name */}
          <div className="space-y-2">
            <Label htmlFor="name">flow name</Label>
            <Input
              id="name"
              placeholder="e.g., AI Summit 2025 Registrations"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Source Type with Branded Icons */}
          <div className="space-y-2">
            <Label>event source</Label>
            <Select value={sourceType} onValueChange={handlePlatformChange}>
              <SelectTrigger>
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <PlatformIcon className="h-4 w-4" />
                    {platform.name}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="luma">
                  <div className="flex items-center gap-2">
                    <LumaIcon className="h-4 w-4" />
                    <div>
                      <span>Luma</span>
                      <span className="text-xs text-muted-foreground ml-2">modern event hosting</span>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="airmeet">
                  <div className="flex items-center gap-2">
                    <AirmeetIcon className="h-4 w-4" />
                    <div>
                      <span>Airmeet</span>
                      <span className="text-xs text-muted-foreground ml-2">virtual & hybrid events</span>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="goldcast">
                  <div className="flex items-center gap-2">
                    <GoldcastIcon className="h-4 w-4" />
                    <div>
                      <span>Goldcast</span>
                      <span className="text-xs text-muted-foreground ml-2">B2B event marketing</span>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="eventbrite">
                  <div className="flex items-center gap-2">
                    <EventbriteIcon className="h-4 w-4" />
                    <div>
                      <span>Eventbrite</span>
                      <span className="text-xs text-muted-foreground ml-2">ticketing & registration</span>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="generic">
                  <div className="flex items-center gap-2">
                    <WebhookIcon className="h-4 w-4" />
                    <div>
                      <span>Generic Webhook</span>
                      <span className="text-xs text-muted-foreground ml-2">custom integration</span>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Connection Method - Dynamic based on platform */}
          {platform.connectionMethods.length > 1 && (
            <div className="space-y-2">
              <Label>connection method</Label>
              <Select value={connectionMethod} onValueChange={(v) => setConnectionMethod(v as ConnectionMethod)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {platform.connectionMethods.includes('zapier') && (
                    <SelectItem value="zapier">
                      <div className="flex items-center gap-2">
                        <Link2 className="h-4 w-4" />
                        Zapier Bridge {sourceType === 'luma' ? '(recommended)' : ''}
                      </div>
                    </SelectItem>
                  )}
                  {platform.connectionMethods.includes('api') && (
                    <SelectItem value="api">
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4" />
                        {platform.name} API {platform.supportsWebhook ? '+ Webhook' : 'Polling'}
                      </div>
                    </SelectItem>
                  )}
                  {platform.connectionMethods.includes('manual') && (
                    <SelectItem value="manual">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4" />
                        Manual CSV Import
                      </div>
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              
              {/* Connection method description */}
              <Alert className="mt-2">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  {getConnectionMethodDescription(sourceType, connectionMethod)}
                </AlertDescription>
              </Alert>

              {/* API setup requirements */}
              {connectionMethod === 'api' && platform.setupDocsUrl && (
                <div className="bg-muted/50 border border-border rounded-lg p-3 mt-2">
                  <p className="text-xs font-medium mb-2">setup requirements:</p>
                  <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>get your {platform.name} API key from their dashboard</li>
                    <li>add the API key to utm.one secrets after creating this flow</li>
                    <li>configure the webhook URL in {platform.name}</li>
                  </ol>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="px-0 h-auto mt-2 text-xs"
                    onClick={() => window.open(platform.setupDocsUrl, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    view {platform.name} API docs
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Event URL */}
          <div className="space-y-2">
            <Label htmlFor="eventUrl">
              event URL {connectionMethod === 'api' ? '(required)' : '(optional)'}
            </Label>
            <Input
              id="eventUrl"
              placeholder={`https://${sourceType === 'luma' ? 'lu.ma' : sourceType + '.com'}/your-event`}
              value={eventUrl}
              onChange={(e) => setEventUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {connectionMethod === 'api' 
                ? `required to fetch guests from ${platform.name} API`
                : 'used for magic link redirects'}
            </p>
          </div>

          {/* Enrichment */}
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <Label>lead enrichment</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  automatically find phone numbers and job titles
                </p>
              </div>
              <Switch
                checked={enrichmentEnabled}
                onCheckedChange={setEnrichmentEnabled}
              />
            </div>

            {enrichmentEnabled && (
              <div className="space-y-2">
                <Label>enrichment provider</Label>
                <Select value={enrichmentProvider} onValueChange={setEnrichmentProvider}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apollo">Apollo.io</SelectItem>
                    <SelectItem value="clay">Clay</SelectItem>
                    <SelectItem value="zoominfo">ZoomInfo</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  you'll need to add your {enrichmentProvider === 'apollo' ? 'Apollo.io' : enrichmentProvider === 'clay' ? 'Clay' : 'ZoomInfo'} API key in settings after creation
                </p>
              </div>
            )}
          </div>

          {/* Magic Link */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div>
              <Label>attribution magic link</Label>
              <p className="text-xs text-muted-foreground mt-1">
                cookie visitors for future website attribution
              </p>
            </div>
            <Switch
              checked={magicLinkEnabled}
              onCheckedChange={setMagicLinkEnabled}
            />
          </div>

          {/* Flow Preview */}
          <div className="flex items-center justify-between bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center gap-2 text-sm">
              <div className="p-1.5 rounded bg-primary/10">
                <PlatformIcon className="h-3 w-3" />
              </div>
              <span>{platform.name}</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2 text-sm">
              <div className="p-1.5 rounded bg-primary/10">
                <Zap className="h-3 w-3" />
              </div>
              <span>{enrichmentEnabled ? enrichmentProvider : 'skip'}</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">configure destinations →</span>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              cancel
            </Button>
            <Button type="submit" disabled={createFlowMutation.isPending}>
              {createFlowMutation.isPending ? 'creating...' : 'create flow'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
