import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, ExternalLink, Lock } from "lucide-react";
import { useState } from "react";
import { notify } from "@/lib/notify";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CrmProvider } from "@/config/crmProviders";

interface CrmCardProps {
  provider: CrmProvider;
  workspaceId: string;
  userTier?: string;
  onConnect?: (providerId: string, credentials: Record<string, string>) => void;
}

// CRM Icons mapping
const CrmIcon = ({ providerId, color }: { providerId: string; color: string }) => {
  const icons: Record<string, React.ReactNode> = {
    hubspot: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill={color}>
        <path d="M18.164 7.93V5.084a.75.75 0 0 0-.957-.721l-5.43 1.528a.75.75 0 0 0-.539.721v8.196c-.332-.108-.672-.202-1.023-.27a4.5 4.5 0 1 0 4.28 7.725 4.5 4.5 0 0 0 1.908-3.662V9.665l2.719-.766a.75.75 0 0 0 .539-.721V7.93z"/>
      </svg>
    ),
    salesforce: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill={color}>
        <path d="M10.005 5.331v6.69h6.689v-6.69h-6.689zm7.5 0v6.69h6.689v-6.69h-6.689zm-7.5 7.5v6.689h6.689v-6.689h-6.689zm7.5 0v6.689h6.689v-6.689h-6.689z"/>
      </svg>
    ),
    zoho: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill={color}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"/>
      </svg>
    ),
    pipedrive: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill={color}>
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  };

  return icons[providerId] || <div className="w-6 h-6 rounded bg-muted" />;
};

export const CrmCard = ({ provider, workspaceId, userTier = 'free', onConnect }: CrmCardProps) => {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const webhookUrl = `${window.location.origin}/api/webhooks/${provider.id}/${workspaceId}`;
  
  // Check if user has access based on tier
  const tierOrder = ['free', 'starter', 'growth', 'business', 'enterprise'];
  const userTierIndex = tierOrder.indexOf(userTier);
  const requiredTierIndex = tierOrder.indexOf(provider.tier);
  const hasAccess = userTierIndex >= requiredTierIndex;

  const copyUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    notify.success("webhook url copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnect = () => {
    if (provider.authType === 'api_key' && apiKey) {
      onConnect?.(provider.id, { apiKey });
      setOpen(false);
      notify.success(`${provider.name} connected`);
    } else if (provider.authType === 'oauth') {
      // Trigger OAuth flow
      window.open(`/api/oauth/${provider.id}/authorize?workspace_id=${workspaceId}`, '_blank');
    }
  };

  return (
    <Card className={`p-6 ${!hasAccess ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${provider.color}15` }}
          >
            <CrmIcon providerId={provider.id} color={provider.color} />
          </div>
          <div>
            <h3 className="font-semibold">{provider.name}</h3>
            <p className="text-xs text-tertiary-label">{provider.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!hasAccess && (
            <Badge variant="outline" className="bg-muted/30 text-xs">
              <Lock className="h-3 w-3 mr-1" />
              {provider.tier}
            </Badge>
          )}
          <Badge variant="outline" className="bg-muted/30">
            {provider.authType === 'oauth' ? 'oauth' : 'api key'}
          </Badge>
        </div>
      </div>

      <div className="space-y-3">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button 
              className="w-full" 
              variant={hasAccess ? "default" : "outline"}
              disabled={!hasAccess}
            >
              {hasAccess ? `connect ${provider.name.toLowerCase()}` : `upgrade to ${provider.tier}`}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>connect {provider.name.toLowerCase()}</DialogTitle>
              <DialogDescription>
                {provider.authType === 'oauth' 
                  ? `authorize utm.one to access your ${provider.name} account`
                  : `enter your ${provider.name} API key to connect`
                }
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {provider.authType === 'api_key' ? (
                <>
                  <div>
                    <label className="text-sm font-medium mb-2 block">API key</label>
                    <Input
                      type="password"
                      placeholder={`enter your ${provider.name} API key`}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                    <p className="text-xs text-tertiary-label mt-2">
                      find your API key in {provider.name} Settings → API
                    </p>
                  </div>
                  <Button className="w-full" onClick={handleConnect} disabled={!apiKey}>
                    connect {provider.name.toLowerCase()}
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-sm text-secondary-label">
                    clicking "authorize" will open {provider.name}'s OAuth flow in a new window.
                    after authorizing, you'll be redirected back to utm.one.
                  </div>
                  <Button className="w-full" onClick={handleConnect}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    authorize {provider.name.toLowerCase()}
                  </Button>
                </>
              )}

              {/* Webhook URL */}
              <div>
                <label className="text-sm font-medium mb-2 block">webhook url (optional)</label>
                <p className="text-xs text-tertiary-label mb-2">
                  use this if you want to receive data from {provider.name} via webhook
                </p>
                <div className="flex gap-2">
                  <div className="flex-1 bg-muted/30 rounded-lg p-3">
                    <code className="text-xs break-all">{webhookUrl}</code>
                  </div>
                  <Button variant="outline" size="sm" onClick={copyUrl}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Field Mapping Info */}
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="text-sm font-medium mb-2">field mapping</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-tertiary-label">first name →</div>
                  <div className="font-mono">{provider.fieldMapping.firstName}</div>
                  <div className="text-tertiary-label">last name →</div>
                  <div className="font-mono">{provider.fieldMapping.lastName}</div>
                  <div className="text-tertiary-label">email →</div>
                  <div className="font-mono">{provider.fieldMapping.email}</div>
                  <div className="text-tertiary-label">company →</div>
                  <div className="font-mono">{provider.fieldMapping.company}</div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
};
