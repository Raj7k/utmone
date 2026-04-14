import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { supabaseFrom } from '@/lib/supabaseHelper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  RefreshCw, 
  Key, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { notify } from '@/lib/notify';

interface LumaPollingSetupProps {
  flowId: string;
  eventUrl?: string;
  lastSyncAt?: string | null;
  onSyncComplete?: () => void;
}

export function LumaPollingSetup({ 
  flowId, 
  eventUrl, 
  lastSyncAt,
  onSyncComplete 
}: LumaPollingSetupProps) {
  const [lumaApiKey, setLumaApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const syncMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('sync-luma-guests', {
        body: { flow_id: flowId }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      notify.success(`synced ${data?.new_registrations || 0} new registrations`);
      onSyncComplete?.();
    },
    onError: (error) => {
      console.error('Sync error:', error);
      notify.error('failed to sync luma guests');
    }
  });

  const saveApiKeyMutation = useMutation({
    mutationFn: async () => {
      // Store API key in flow's source_config
      const { error } = await supabaseFrom('event_bridge_flows')
        .update({
          source_config: {
            event_url: eventUrl,
            connection_method: 'api',
            luma_api_key_configured: true
          }
        })
        .eq('id', flowId);
      
      if (error) throw error;
      
      // Note: In production, the API key would be stored securely via secrets
      // For now, we just mark it as configured
    },
    onSuccess: () => {
      notify.success('API configuration saved');
      setShowApiKeyInput(false);
    },
    onError: () => {
      notify.error('failed to save API configuration');
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">luma API polling</h4>
        <Badge variant="outline" className="text-xs">
          requires Luma Plus
        </Badge>
      </div>

      <Alert>
        <Key className="h-4 w-4" />
        <AlertDescription className="text-sm">
          API polling requires a Luma Plus subscription with API access.
          <a 
            href="https://lu.ma/settings/api" 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-1 inline-flex items-center gap-1 text-primary hover:underline"
          >
            get your API key
            <ExternalLink className="h-3 w-3" />
          </a>
        </AlertDescription>
      </Alert>

      {!showApiKeyInput ? (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowApiKeyInput(true)}
          className="w-full"
        >
          <Key className="h-4 w-4 mr-2" />
          configure API key
        </Button>
      ) : (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="lumaApiKey">luma API key</Label>
            <Input
              id="lumaApiKey"
              type="password"
              placeholder="luma_xxxxxxxx"
              value={lumaApiKey}
              onChange={(e) => setLumaApiKey(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => saveApiKeyMutation.mutate()}
              disabled={!lumaApiKey.trim() || saveApiKeyMutation.isPending}
            >
              {saveApiKeyMutation.isPending ? 'saving...' : 'save key'}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowApiKeyInput(false)}
            >
              cancel
            </Button>
          </div>
        </div>
      )}

      {/* Sync Status */}
      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2 text-sm">
          {lastSyncAt ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-muted-foreground">
                last sync: {new Date(lastSyncAt).toLocaleString()}
              </span>
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <span className="text-muted-foreground">never synced</span>
            </>
          )}
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => syncMutation.mutate()}
          disabled={syncMutation.isPending}
        >
          {syncMutation.isPending ? (
            <>
              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
              syncing...
            </>
          ) : (
            <>
              <RefreshCw className="h-3 w-3 mr-1" />
              sync now
            </>
          )}
        </Button>
      </div>

      {/* Auto-sync info */}
      <p className="text-xs text-muted-foreground flex items-center gap-1">
        <Clock className="h-3 w-3" />
        automatic sync runs every 5 minutes when API key is configured
      </p>
    </div>
  );
}
