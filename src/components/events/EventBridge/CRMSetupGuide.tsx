import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useWorkspaceContext } from '@/contexts/WorkspaceContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  ExternalLink, 
  Eye, 
  EyeOff,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { notify } from '@/lib/notify';

interface CRMConfig {
  id: string;
  name: string;
  provider: string;
  description: string;
  apiKeyLabel: string;
  apiKeyPlaceholder: string;
  docsUrl: string;
  testEndpoint?: string;
}

const CRM_CONFIGS: CRMConfig[] = [
  {
    id: 'hubspot',
    name: 'HubSpot',
    provider: 'hubspot',
    description: 'sync leads to contacts and deals',
    apiKeyLabel: 'Private App Access Token',
    apiKeyPlaceholder: 'pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    docsUrl: 'https://developers.hubspot.com/docs/api/private-apps',
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    provider: 'salesforce',
    description: 'create leads and opportunities',
    apiKeyLabel: 'Connected App Credentials',
    apiKeyPlaceholder: 'consumer key + secret',
    docsUrl: 'https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/',
  },
  {
    id: 'zoho',
    name: 'Zoho CRM',
    provider: 'zoho',
    description: 'sync to leads and contacts',
    apiKeyLabel: 'API Key',
    apiKeyPlaceholder: 'your-zoho-api-key',
    docsUrl: 'https://www.zoho.com/crm/developer/docs/api/v2/',
  },
  {
    id: 'pipedrive',
    name: 'Pipedrive',
    provider: 'pipedrive',
    description: 'create persons and deals',
    apiKeyLabel: 'API Token',
    apiKeyPlaceholder: 'your-pipedrive-api-token',
    docsUrl: 'https://developers.pipedrive.com/docs/api/v1',
  },
  {
    id: 'kylas',
    name: 'Kylas CRM',
    provider: 'kylas',
    description: 'sync leads for immediate calling',
    apiKeyLabel: 'API Key',
    apiKeyPlaceholder: 'your-kylas-api-key',
    docsUrl: 'https://kylas.io/api-docs',
  },
];

interface CRMConnectionStatus {
  provider: string;
  isConnected: boolean;
  lastTested?: string;
}

export function CRMSetupGuide() {
  const { currentWorkspace } = useWorkspaceContext();
  const queryClient = useQueryClient();
  const [selectedCRM, setSelectedCRM] = useState<string>('hubspot');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [testingConnection, setTestingConnection] = useState<string | null>(null);

  // Query existing integrations
  const { data: integrations, isLoading: loadingIntegrations } = useQuery({
    queryKey: ['crm-integrations', currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return [];
      
      const { data, error } = await supabase
        .from('integrations')
        .select('provider, is_active, created_at')
        .eq('workspace_id', currentWorkspace.id)
        .in('provider', CRM_CONFIGS.map(c => c.provider));

      if (error) throw error;
      return data || [];
    },
    enabled: !!currentWorkspace?.id,
  });

  const getConnectionStatus = (provider: string): CRMConnectionStatus => {
    const integration = integrations?.find(i => i.provider === provider);
    return {
      provider,
      isConnected: !!integration?.is_active,
      lastTested: integration?.created_at,
    };
  };

  const saveCRMMutation = useMutation({
    mutationFn: async ({ provider, apiKey }: { provider: string; apiKey: string }) => {
      if (!currentWorkspace?.id) throw new Error('No workspace selected');

      // Call edge function to securely save and test credentials
      const { data, error } = await supabase.functions.invoke('save-crm-credentials', {
        body: {
          workspace_id: currentWorkspace.id,
          provider,
          api_key: apiKey,
        },
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Failed to save credentials');
      
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['crm-integrations'] });
      notify.success(`${data.provider} connected successfully`);
      setApiKey('');
    },
    onError: (error: Error) => {
      notify.error(error.message || 'Failed to connect CRM');
    },
  });

  const testConnectionMutation = useMutation({
    mutationFn: async (provider: string) => {
      if (!currentWorkspace?.id) throw new Error('No workspace selected');

      const { data, error } = await supabase.functions.invoke('test-crm-connection', {
        body: {
          workspace_id: currentWorkspace.id,
          provider,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        notify.success('Connection verified');
      } else {
        notify.error(data?.error || 'Connection test failed');
      }
      setTestingConnection(null);
    },
    onError: (error: Error) => {
      notify.error(error.message || 'Connection test failed');
      setTestingConnection(null);
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async (provider: string) => {
      if (!currentWorkspace?.id) throw new Error('No workspace selected');

      const { error } = await supabase
        .from('integrations')
        .update({ is_active: false })
        .eq('workspace_id', currentWorkspace.id)
        .eq('provider', provider);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-integrations'] });
      notify.success('CRM disconnected');
    },
    onError: () => {
      notify.error('Failed to disconnect');
    },
  });

  const handleSave = () => {
    if (!apiKey.trim()) {
      notify.error('Please enter API key');
      return;
    }
    saveCRMMutation.mutate({ provider: selectedCRM, apiKey });
  };

  const handleTestConnection = (provider: string) => {
    setTestingConnection(provider);
    testConnectionMutation.mutate(provider);
  };

  const selectedConfig = CRM_CONFIGS.find(c => c.id === selectedCRM);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg">CRM integrations</CardTitle>
        <CardDescription>
          connect your CRM to automatically sync event registrations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connection Status Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CRM_CONFIGS.map((crm) => {
            const status = getConnectionStatus(crm.provider);
            return (
              <button
                key={crm.id}
                onClick={() => setSelectedCRM(crm.id)}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  selectedCRM === crm.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{crm.name}</span>
                  {status.isConnected ? (
                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <XCircle className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
                <Badge 
                  variant={status.isConnected ? 'default' : 'secondary'}
                  className="text-[10px]"
                >
                  {status.isConnected ? 'connected' : 'not connected'}
                </Badge>
              </button>
            );
          })}
        </div>

        {/* Selected CRM Configuration */}
        {selectedConfig && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">{selectedConfig.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedConfig.description}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-xs"
              >
                <a href={selectedConfig.docsUrl} target="_blank" rel="noopener noreferrer">
                  docs <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
            </div>

            {getConnectionStatus(selectedConfig.provider).isConnected ? (
              /* Connected State */
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  <span className="text-sm text-emerald-700 dark:text-emerald-300">
                    {selectedConfig.name} is connected and ready to receive leads
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTestConnection(selectedConfig.provider)}
                    disabled={testingConnection === selectedConfig.provider}
                  >
                    {testingConnection === selectedConfig.provider ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    test connection
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => disconnectMutation.mutate(selectedConfig.provider)}
                    className="text-destructive hover:text-destructive"
                  >
                    disconnect
                  </Button>
                </div>
              </div>
            ) : (
              /* Setup Form */
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">{selectedConfig.apiKeyLabel}</Label>
                  <div className="relative">
                    <Input
                      id="api-key"
                      type={showApiKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder={selectedConfig.apiKeyPlaceholder}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    your API key is encrypted before storage. we never store plaintext credentials.
                  </p>
                </div>

                <Button 
                  onClick={handleSave}
                  disabled={saveCRMMutation.isPending || !apiKey.trim()}
                  className="w-full"
                >
                  {saveCRMMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  connect {selectedConfig.name}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Setup Instructions */}
        <Tabs defaultValue="hubspot" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="hubspot">HubSpot</TabsTrigger>
            <TabsTrigger value="salesforce">Salesforce</TabsTrigger>
            <TabsTrigger value="zoho">Zoho</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hubspot" className="space-y-3 mt-4">
            <h5 className="font-medium text-sm">HubSpot setup steps</h5>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
              <li>go to Settings → Integrations → Private Apps</li>
              <li>click "Create a private app"</li>
              <li>name it "utm.one Event Bridge"</li>
              <li>under Scopes, enable: crm.objects.contacts.write, crm.objects.deals.write</li>
              <li>create the app and copy the access token</li>
              <li>paste the token above and click connect</li>
            </ol>
          </TabsContent>

          <TabsContent value="salesforce" className="space-y-3 mt-4">
            <h5 className="font-medium text-sm">Salesforce setup steps</h5>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
              <li>go to Setup → Apps → App Manager</li>
              <li>click "New Connected App"</li>
              <li>enable OAuth and set callback URL to: https://utm.one/oauth/callback</li>
              <li>select scopes: api, refresh_token, offline_access</li>
              <li>save and copy Consumer Key + Consumer Secret</li>
              <li>paste credentials above in format: key:secret</li>
            </ol>
          </TabsContent>

          <TabsContent value="zoho" className="space-y-3 mt-4">
            <h5 className="font-medium text-sm">Zoho CRM setup steps</h5>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
              <li>go to Zoho API Console</li>
              <li>create a Self Client application</li>
              <li>generate an authorization code with scopes: ZohoCRM.modules.ALL</li>
              <li>exchange for refresh token using the API</li>
              <li>paste the refresh token above</li>
            </ol>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
