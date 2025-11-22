import { useState } from 'react';
import { Copy, Plus, Key, Trash2, AlertCircle } from 'lucide-react';
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

export default function APIKeysSettings() {
  const { apiKeys, isLoading, createAPIKey, revokeAPIKey, deleteAPIKey } = useAPIKeys();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newKeyData, setNewKeyData] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    key_name: '',
    scopes: ['links:read'],
    rate_limit: 600,
  });

  const handleCreateKey = async () => {
    // Generate key on client side
    const key = `utm_${Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')}`;
    
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    const prefix = key.substring(0, 12);

    createAPIKey({
      key_name: formData.key_name,
      key_hash: hash,
      key_prefix: prefix,
      scopes: formData.scopes,
      rate_limit: formData.rate_limit,
    });

    setNewKeyData(key);
    setFormData({
      key_name: '',
      scopes: ['links:read'],
      rate_limit: 600,
    });
  };

  const handleCopyKey = () => {
    if (newKeyData) {
      navigator.clipboard.writeText(newKeyData);
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

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="text-muted-foreground">loading api keys...</div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">api keys</h1>
        <p className="text-muted-foreground mt-2">
          manage api keys for programmatic access to your workspace
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>your api keys</CardTitle>
              <CardDescription>
                create and manage api keys for integrations
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) setNewKeyData(null);
            }}>
              <DialogTrigger asChild>
                <Button>
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
                          placeholder="Production API Key"
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
                      <div>
                        <Label htmlFor="rate_limit">rate limit (requests per minute)</Label>
                        <Input
                          id="rate_limit"
                          type="number"
                          value={formData.rate_limit}
                          onChange={(e) => setFormData({ ...formData, rate_limit: parseInt(e.target.value) || 600 })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCreateKey}>create key</Button>
                    </DialogFooter>
                  </>
                ) : (
                  <>
                    <DialogHeader>
                      <DialogTitle>api key created</DialogTitle>
                      <DialogDescription>
                        save this key now. you won't be able to see it again.
                      </DialogDescription>
                    </DialogHeader>
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>your api key</AlertTitle>
                      <AlertDescription className="space-y-4">
                        <div className="bg-muted p-3 rounded-md font-mono text-sm break-all">
                          {newKeyData}
                        </div>
                        <Button onClick={handleCopyKey} className="w-full">
                          <Copy className="w-4 h-4 mr-2" />
                          copy to clipboard
                        </Button>
                      </AlertDescription>
                    </Alert>
                    <DialogFooter>
                      <Button onClick={() => setIsDialogOpen(false)}>close</Button>
                    </DialogFooter>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {apiKeys && apiKeys.length > 0 ? (
            <div className="space-y-4">
              {apiKeys.map((key) => (
                <div
                  key={key.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Key className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{key.key_name}</p>
                        <Badge variant={key.is_active ? 'default' : 'secondary'}>
                          {key.is_active ? 'active' : 'revoked'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground font-mono">
                        {maskAPIKey(key.key_prefix)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-muted-foreground">
                          scopes: {key.scopes.join(', ')}
                        </p>
                        <span className="text-xs text-muted-foreground">•</span>
                        <p className="text-xs text-muted-foreground">
                          {key.rate_limit} req/min
                        </p>
                      </div>
                      {key.last_used_at && (
                        <p className="text-xs text-muted-foreground mt-1">
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
              <Key className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">no api keys yet</p>
              <p className="text-sm text-muted-foreground">
                create your first api key to start building integrations
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>api documentation</CardTitle>
          <CardDescription>
            learn how to use the utm.one api
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">authentication</h3>
              <p className="text-sm text-muted-foreground">
                include your api key in the request header:
              </p>
              <pre className="bg-muted p-3 rounded-md text-sm mt-2 overflow-x-auto">
                {`Authorization: Bearer utm_your_api_key_here`}
              </pre>
            </div>
            <div>
              <h3 className="font-medium mb-2">base url</h3>
              <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                {`https://whgnsmjdubnvbmarnjfx.supabase.co/functions/v1/api`}
              </pre>
            </div>
            <div>
              <h3 className="font-medium mb-2">example request</h3>
              <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                {`curl -X POST https://whgnsmjdubnvbmarnjfx.supabase.co/functions/v1/api/links \\
  -H "Authorization: Bearer utm_your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "destination_url": "https://example.com",
    "slug": "my-link"
  }'`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
