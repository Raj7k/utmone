import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Code2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";

interface WebhookCardProps {
  workspaceId: string;
}

export const WebhookCard = ({ workspaceId }: WebhookCardProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const webhookUrl = `${window.location.origin}/api/track/pipeline`;

  // Fetch API key
  const { data: apiKeys } = useQuery({
    queryKey: ["api-keys", workspaceId],
    queryFn: async () => {
      const { data, error } = await supabaseFrom('api_keys')
        .select("*")
        .eq("workspace_id", workspaceId)
        .eq("is_active", true)
        .limit(1);
      
      if (error) throw error;
      return data;
    },
  });

  const apiKey = apiKeys?.[0]?.key_prefix || "Create API key in Developer Settings";

  const exampleCurl = `curl -X POST ${webhookUrl} \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -d '{
    "email": "customer@company.com",
    "stage": "closed_won",
    "value": 15000,
    "crm_deal_id": "deal_12345",
    "workspace_id": "${workspaceId}"
  }'`;

  const copyExample = () => {
    navigator.clipboard.writeText(exampleCurl);
    setCopied(true);
    toast({
      title: "copied",
      description: "curl example copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-primary/10">
            <Code2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">direct api access</h3>
            <p className="text-xs text-tertiary-label">for custom integrations</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-sm text-secondary-label">
          use our REST API for custom CRMs or internal systems
        </div>

        {/* Endpoint */}
        <div>
          <label className="text-xs text-tertiary-label mb-1 block">endpoint</label>
          <code className="text-xs bg-muted/30 px-3 py-2 rounded block">
            POST {webhookUrl}
          </code>
        </div>

        {/* API Key */}
        <div>
          <label className="text-xs text-tertiary-label mb-1 block">authentication</label>
          <code className="text-xs bg-muted/30 px-3 py-2 rounded block break-all">
            Bearer {apiKey}
          </code>
        </div>

        {/* Example */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-tertiary-label">example request</label>
            <Button variant="ghost" size="sm" onClick={copyExample}>
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
          <pre className="text-xs bg-muted/30 p-3 rounded overflow-x-auto">
{exampleCurl}
          </pre>
        </div>

        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => window.open('/settings/developers', '_self')}
        >
          manage api keys
        </Button>
      </div>
    </Card>
  );
};
