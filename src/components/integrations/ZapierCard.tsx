import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, ExternalLink, Zap } from "lucide-react";
import { useState } from "react";
import { notify } from "@/lib/notify";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ZapierCardProps {
  workspaceId: string;
}

export const ZapierCard = ({ workspaceId }: ZapierCardProps) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [open, setOpen] = useState(false);

  const webhookUrl = `${window.location.origin}/api/track/pipeline`;

  // Fetch API key for this workspace
  const { data: apiKeys } = useQuery({
    queryKey: ["api-keys", workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("api_keys")
        .select("*")
        .eq("workspace_id", workspaceId)
        .eq("is_active", true)
        .limit(1);
      
      if (error) throw error;
      return data;
    },
  });

  const apiKey = apiKeys?.[0]?.key_prefix || "Create an API key in Developer Settings";

  const copyUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedUrl(true);
    notify.success("copied", {
      description: "api endpoint copied to clipboard",
    });
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    notify.success("copied", {
      description: "api key copied to clipboard",
    });
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-[#FF4A00]/10 flex items-center justify-center">
            <Zap className="w-6 h-6 text-[#FF4A00]" />
          </div>
          <div>
            <h3 className="font-semibold">Zapier</h3>
            <p className="text-xs text-tertiary-label">connect 5,000+ apps</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-system-green/10 text-system-green border-system-green/20">
          recommended
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="text-sm text-secondary-label">
          use zapier to connect pipedrive, zoho, microsoft dynamics, and thousands more
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" variant="default">
              connect via zapier
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>connect via zapier</DialogTitle>
              <DialogDescription>
                use these credentials in your zapier webhook action
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* API Endpoint */}
              <div>
                <label className="text-sm font-medium mb-2 block">api endpoint</label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-muted/30 rounded-lg p-3">
                    <code className="text-xs break-all">{webhookUrl}</code>
                  </div>
                  <Button variant="outline" size="sm" onClick={copyUrl}>
                    {copiedUrl ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* API Key */}
              <div>
                <label className="text-sm font-medium mb-2 block">your api key</label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-muted/30 rounded-lg p-3">
                    <code className="text-xs break-all">{apiKey}</code>
                  </div>
                  <Button variant="outline" size="sm" onClick={copyKey}>
                    {copiedKey ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                {!apiKeys?.[0] && (
                  <p className="text-xs text-tertiary-label mt-2">
                    create an API key in Settings → Developer → API Keys
                  </p>
                )}
              </div>

              {/* Setup Instructions */}
              <div className="space-y-4">
                <h4 className="font-semibold">zapier setup</h4>
                
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold bg-primary/10 text-primary">
                      1
                    </div>
                    <div>
                      <p className="text-sm font-medium">create a new zap</p>
                      <p className="text-xs text-tertiary-label mt-1">
                        trigger: select your CRM (Salesforce, Pipedrive, Zoho, etc.) + "Deal Stage Changed"
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold bg-primary/10 text-primary">
                      2
                    </div>
                    <div>
                      <p className="text-sm font-medium">add webhooks action</p>
                      <p className="text-xs text-tertiary-label mt-1">
                        action: "Webhooks by Zapier" → "POST"
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold bg-primary/10 text-primary">
                      3
                    </div>
                    <div>
                      <p className="text-sm font-medium">configure request</p>
                      <div className="bg-muted/30 rounded p-3 mt-2 space-y-2 text-xs">
                        <div><strong>URL:</strong> {webhookUrl}</div>
                        <div><strong>Payload Type:</strong> JSON</div>
                        <div><strong>Data:</strong></div>
                        <pre className="mt-1 text-xs">
{`{
  "email": "<contact email>",
  "stage": "<deal stage>",
  "value": "<deal amount>",
  "crm_deal_id": "<deal id>",
  "workspace_id": "${workspaceId}"
}`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold bg-primary/10 text-primary">
                      4
                    </div>
                    <div>
                      <p className="text-sm font-medium">test & activate</p>
                      <p className="text-xs text-tertiary-label mt-1">
                        test the zap with a sample deal, then turn it on
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documentation Link */}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open('https://zapier.com/apps/webhook/integrations', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                zapier webhooks documentation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
};
