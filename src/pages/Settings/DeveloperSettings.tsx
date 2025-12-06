import { useState } from 'react';
import { Copy, Plus, Key, Trash2, AlertCircle, Code2, Check, ExternalLink, BookOpen, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { useAPIKeys } from '@/hooks/useAPIKeys';
import { useToast } from '@/hooks/use-toast';
import { maskAPIKey } from '@/lib/apiKeyUtils';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

interface DeveloperSettingsProps {
  workspaceId: string;
}

export default function DeveloperSettings({ workspaceId }: DeveloperSettingsProps) {
  const { apiKeys, isLoading: apiKeysLoading, createAPIKey, revokeAPIKey, deleteAPIKey } = useAPIKeys();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAPIKeyDialogOpen, setIsAPIKeyDialogOpen] = useState(false);
  const [newKeyData, setNewKeyData] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedPixel, setCopiedPixel] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [formData, setFormData] = useState({
    key_name: '',
    scopes: ['links:read'],
    rate_limit: 600,
  });

  // Fetch pixel configs
  const { data: pixelConfigs, isLoading: pixelLoading } = useQuery({
    queryKey: ['pixel-configs', workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pixel_configs')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Create pixel mutation
  const createPixelMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const pixelId = `utm_${Math.random().toString(36).substring(2, 10)}`;
      
      const { error } = await supabase
        .from('pixel_configs')
        .insert({
          workspace_id: workspaceId,
          pixel_id: pixelId,
          created_by: user.id,
          domain_whitelist: [],
        });

      if (error) throw error;
      return pixelId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pixel-configs', workspaceId] });
      toast({
        title: 'pixel created',
        description: 'your tracking pixel has been created successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Add domain mutation
  const addDomainMutation = useMutation({
    mutationFn: async ({ pixelId, domain }: { pixelId: string; domain: string }) => {
      const pixel = pixelConfigs?.find(p => p.pixel_id === pixelId);
      if (!pixel) throw new Error('Pixel not found');

      const currentDomains = pixel.domain_whitelist || [];
      const { error } = await supabase
        .from('pixel_configs')
        .update({ domain_whitelist: [...currentDomains, domain] })
        .eq('id', pixel.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pixel-configs', workspaceId] });
      setNewDomain('');
      toast({
        title: 'domain added',
        description: 'domain has been added to whitelist.',
      });
    },
  });

  const activePixel = pixelConfigs?.[0];

  const handleCreateAPIKey = async () => {
    try {
      const result = await new Promise((resolve, reject) => {
        createAPIKey({
          key_name: formData.key_name,
          scopes: formData.scopes,
        }, {
          onSuccess: (data) => resolve(data),
          onError: (error) => reject(error),
        });
      });

      setNewKeyData((result as any).full_key);
      setFormData({
        key_name: '',
        scopes: ['links:read'],
        rate_limit: 600,
      });
    } catch (error) {
      toast({
        title: 'failed to create api key',
        description: error instanceof Error ? error.message : 'unknown error',
        variant: 'destructive',
      });
    }
  };

  const handleCopyAPIKey = () => {
    if (newKeyData) {
      navigator.clipboard.writeText(newKeyData);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
      toast({ title: 'api key copied to clipboard' });
    }
  };

  const toggleScope = (scope: string) => {
    setFormData(prev => ({
      ...prev,
      scopes: prev.scopes.includes(scope)
        ? prev.scopes.filter(s => s !== scope)
        : [...prev.scopes, scope],
    }));
  };

  const getPixelSnippet = (pixelId: string) => {
    return `<!-- utm.one Tracking Pixel -->
<script>
(function(w,d,p){
  w.utmone=w.utmone||function(){(w.utmone.q=w.utmone.q||[]).push(arguments)};
  var s=d.createElement('script');s.async=1;
  s.src='https://whgnsmjdubnvbmarnjfx.supabase.co/functions/v1/pixel-js?id='+p;
  d.head.appendChild(s);
})(window,document,'${pixelId}');

// Track conversion events:
// utmone('track', 'lead');
// utmone('track', 'purchase', { revenue: 99.99 });
</script>`;
  };

  const copyPixelSnippet = () => {
    if (!activePixel) return;
    navigator.clipboard.writeText(getPixelSnippet(activePixel.pixel_id));
    setCopiedPixel(true);
    setTimeout(() => setCopiedPixel(false), 2000);
    toast({
      title: 'copied!',
      description: 'tracking code copied to clipboard.',
    });
  };

  if (apiKeysLoading || pixelLoading) {
    return (
      <div className="container max-w-5xl py-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <Skeleton className="h-64 w-full mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="container max-w-5xl py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold hero-gradient">
          developer settings
        </h1>
        <p className="text-secondary-label mt-2">
          manage api credentials, tracking pixel, and integration tools
        </p>
      </div>

      {/* Section A: API Keys */}
      <Card className="bg-system-background border-separator">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Key className="h-5 w-5 text-primary" />
                <CardTitle>api keys</CardTitle>
              </div>
              <CardDescription>
                create and manage api keys for programmatic access
              </CardDescription>
            </div>
            <Dialog open={isAPIKeyDialogOpen} onOpenChange={(open) => {
              setIsAPIKeyDialogOpen(open);
              if (!open) setNewKeyData(null);
            }}>
              <DialogTrigger asChild>
                <Button className="bg-blazeOrange hover:bg-blazeOrange/90">
                  <Plus className="w-4 h-4 mr-2" />
                  create api key
                </Button>
              </DialogTrigger>
              <DialogContent>
                {!newKeyData ? (
                  <>
                    <DialogHeader>
                      <DialogTitle>create new api key</DialogTitle>
                      <DialogDescription>
                        configure permissions and rate limits for your new api key
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="key_name">key name</Label>
                        <Input
                          id="key_name"
                          value={formData.key_name}
                          onChange={(e) => setFormData({ ...formData, key_name: e.target.value })}
                          placeholder="Zapier Integration"
                        />
                      </div>
                      <div>
                        <Label>permissions</Label>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="links_read"
                              checked={formData.scopes.includes('links:read')}
                              onCheckedChange={() => toggleScope('links:read')}
                            />
                            <label htmlFor="links_read" className="text-sm">read links</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="links_write"
                              checked={formData.scopes.includes('links:write')}
                              onCheckedChange={() => toggleScope('links:write')}
                            />
                            <label htmlFor="links_write" className="text-sm">create/update links</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="analytics_read"
                              checked={formData.scopes.includes('analytics:read')}
                              onCheckedChange={() => toggleScope('analytics:read')}
                            />
                            <label htmlFor="analytics_read" className="text-sm">read analytics</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="events_write"
                              checked={formData.scopes.includes('events:write')}
                              onCheckedChange={() => toggleScope('events:write')}
                            />
                            <label htmlFor="events_write" className="text-sm">track events</label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCreateAPIKey} className="bg-blazeOrange hover:bg-blazeOrange/90">
                        create key
                      </Button>
                    </DialogFooter>
                  </>
                ) : (
                  <>
                    <DialogHeader>
                      <DialogTitle>api key created</DialogTitle>
                      <DialogDescription>
                        copy this key now. you won't see it again.
                      </DialogDescription>
                    </DialogHeader>
                    <Alert className="bg-amber-500/10 border-amber-500/20">
                      <AlertCircle className="h-4 w-4 text-amber-400" />
                      <AlertTitle className="text-amber-400">your api key</AlertTitle>
                      <AlertDescription className="space-y-4">
                        <div className="bg-zinc-900/60 p-3 rounded-md font-mono text-sm break-all border border-white/10 text-white">
                          {newKeyData}
                        </div>
                        <Button onClick={handleCopyAPIKey} className="w-full bg-blazeOrange hover:bg-blazeOrange/90">
                          {copiedKey ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                          {copiedKey ? 'copied' : 'copy to clipboard'}
                        </Button>
                      </AlertDescription>
                    </Alert>
                    <DialogFooter>
                      <Button onClick={() => setIsAPIKeyDialogOpen(false)} variant="outline">
                        done
                      </Button>
                    </DialogFooter>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {apiKeys && apiKeys.length > 0 ? (
            <div className="space-y-3">
              {apiKeys.map((key) => (
                <div
                  key={key.id}
                  className="flex items-center justify-between p-4 border border-separator rounded-lg bg-fill-tertiary"
                >
                  <div className="flex items-center gap-4">
                    <Key className="w-5 h-5 text-secondary-label" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-label">{key.key_name}</p>
                        <Badge variant={key.is_active ? 'default' : 'secondary'} className="text-xs">
                          {key.is_active ? 'active' : 'revoked'}
                        </Badge>
                      </div>
                      <p className="text-sm text-secondary-label font-mono">
                        {maskAPIKey(key.key_prefix)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-tertiary-label">
                          scopes: {key.scopes.join(', ')}
                        </p>
                      </div>
                      {key.last_used_at && (
                        <p className="text-xs text-tertiary-label mt-1">
                          last used: {new Date(key.last_used_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {key.is_active && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => revokeAPIKey(key.id)}
                      >
                        revoke
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteAPIKey(key.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Key className="w-12 h-12 text-secondary-label mx-auto mb-4" />
              <p className="text-secondary-label">no api keys yet</p>
              <p className="text-sm text-tertiary-label">
                create your first api key to start building integrations
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section B: Tracking Pixel */}
      <Card className="bg-system-background border-separator">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Code2 className="h-5 w-5 text-primary" />
                <CardTitle>tracking pixel</CardTitle>
              </div>
              <CardDescription>
                install this code on your website to track conversions
              </CardDescription>
            </div>
            {!activePixel && (
              <Button
                onClick={() => createPixelMutation.mutate()}
                disabled={createPixelMutation.isPending}
                className="bg-blazeOrange hover:bg-blazeOrange/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                create pixel
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!activePixel ? (
            <div className="text-center py-8">
              <Alert className="bg-amber-500/10 border-amber-500/20 mb-6">
                <AlertCircle className="h-4 w-4 text-amber-400" />
                <AlertDescription className="text-white/80">
                  <strong>⚠️ critical for tracking:</strong> without the tracking pixel, you won't be able to track 
                  conversions, page views, or any analytics data.
                </AlertDescription>
              </Alert>
              <Code2 className="h-12 w-12 text-tertiary-label mx-auto mb-3" />
              <p className="text-secondary-label mb-4">
                track conversions on your website with the utm.one pixel
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Pixel ID */}
              <div>
                <Label className="text-sm font-medium text-label mb-2">pixel id</Label>
                <div className="flex items-center gap-2 mt-2">
                  <code className="flex-1 px-3 py-2 bg-fill-tertiary rounded-md text-sm font-mono text-label border border-separator">
                    {activePixel.pixel_id}
                  </code>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    active
                  </Badge>
                </div>
              </div>

              {/* Installation Code */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium text-label">installation code</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyPixelSnippet}
                  >
                    {copiedPixel ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copiedPixel ? 'copied' : 'copy code'}
                  </Button>
                </div>
                <div className="relative">
                  <pre className="p-4 bg-fill-tertiary rounded-lg overflow-x-auto text-xs font-mono text-label border border-separator">
                    {getPixelSnippet(activePixel.pixel_id)}
                  </pre>
                </div>
                <p className="text-xs text-tertiary-label mt-2">
                  paste this code in your website's <code className="bg-fill-tertiary px-1 py-0.5 rounded">&lt;head&gt;</code> tag
                </p>
              </div>

              {/* Domain Whitelist */}
              <div>
                <Label className="text-sm font-medium text-label mb-2">domain whitelist (optional)</Label>
                <p className="text-xs text-secondary-label mb-3">
                  only allow tracking from specific domains
                </p>
                
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="example.com"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => addDomainMutation.mutate({ pixelId: activePixel.pixel_id, domain: newDomain })}
                    disabled={!newDomain || addDomainMutation.isPending}
                    size="sm"
                    variant="outline"
                  >
                    add
                  </Button>
                </div>

                {activePixel.domain_whitelist && activePixel.domain_whitelist.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {activePixel.domain_whitelist.map((domain) => (
                      <Badge key={domain} variant="outline" className="gap-1">
                        {domain}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-tertiary-label italic">
                    all domains allowed
                  </p>
                )}
              </div>

              {/* Usage Example */}
              <div className="p-4 rounded-lg border bg-primary/5 border-primary/20">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-label mb-1">usage example</p>
                    <code className="text-xs font-mono text-secondary-label block">
                      utmone('track', 'purchase', &#123; revenue: 99.99 &#125;);
                    </code>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section C: Documentation Links */}
      <Card className="bg-system-background border-separator">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle>documentation & resources</CardTitle>
          </div>
          <CardDescription>
            guides and references to help you integrate utm.one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {/* API Reference */}
            <a
              href="/docs/api"
              target="_blank"
              className="flex items-start gap-3 p-4 border border-separator rounded-lg bg-fill-tertiary hover:bg-fill-secondary transition-all"
            >
              <FileText className="h-5 w-5 flex-shrink-0 mt-0.5 text-primary" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-label">api reference</h3>
                  <ExternalLink className="h-3 w-3 text-tertiary-label" />
                </div>
                <p className="text-xs text-secondary-label mt-1">
                  complete api documentation with examples
                </p>
              </div>
            </a>

            {/* Pixel Guide */}
            <a
              href="/docs/pixel-installation"
              target="_blank"
              className="flex items-start gap-3 p-4 border border-separator rounded-lg bg-fill-tertiary hover:bg-fill-secondary transition-all"
            >
              <Code2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-primary" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-label">pixel installation guide</h3>
                  <ExternalLink className="h-3 w-3 text-tertiary-label" />
                </div>
                <p className="text-xs text-secondary-label mt-1">
                  step-by-step pixel setup and tracking events
                </p>
              </div>
            </a>
          </div>

          {/* Quick API Reference */}
          <div className="mt-6 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-label mb-2">authentication</h3>
              <p className="text-xs text-secondary-label mb-2">
                include your api key in the request header:
              </p>
              <pre className="bg-fill-tertiary p-3 rounded-md text-xs font-mono overflow-x-auto border border-separator">
                {`Authorization: Bearer utm_your_api_key_here`}
              </pre>
            </div>
            <div>
              <h3 className="text-sm font-medium text-label mb-2">base url</h3>
              <pre className="bg-fill-tertiary p-3 rounded-md text-xs font-mono overflow-x-auto border border-separator">
                {`https://whgnsmjdubnvbmarnjfx.supabase.co/functions/v1/api`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
