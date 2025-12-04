import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, ExternalLink, Webhook } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";

export const PipelineIntegration = () => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { currentWorkspace } = useWorkspaceContext();

  const webhookUrl = `${window.location.origin}/api/track/pipeline`;

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    toast({
      title: "copied",
      description: "webhook url copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const examplePayload = {
    email: "user@company.com",
    stage: "sql",
    value: 10000,
    crm_deal_id: "deal_12345",
    workspace_id: currentWorkspace?.id || "your_workspace_id",
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">pipeline sync</h2>
        <p className="text-sm text-tertiary-label">
          connect your CRM to track the full sales lifecycle from clicks to revenue
        </p>
      </div>

      {/* Webhook URL */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Webhook className="h-5 w-5" style={{ color: 'rgba(59,130,246,1)' }} />
          <h3 className="font-semibold">webhook endpoint</h3>
        </div>
        
        <div className="bg-muted/30 rounded-lg p-4 mb-4">
          <code className="text-sm break-all">{webhookUrl}</code>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={copyWebhookUrl}
          className="w-full"
        >
          {copied ? (
            <Check className="h-4 w-4 mr-2" />
          ) : (
            <Copy className="h-4 w-4 mr-2" />
          )}
          {copied ? "copied!" : "copy webhook url"}
        </Button>
      </Card>

      {/* Supported Stages */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">supported lifecycle stages</h3>
        <div className="space-y-3">
          {[
            { stage: "lead", label: "Lead", description: "Initial contact captured" },
            { stage: "sal", label: "SAL", description: "Sales Accepted Lead" },
            { stage: "sql", label: "SQL", description: "Sales Qualified Lead" },
            { stage: "opportunity", label: "Opportunity", description: "Active deal in pipeline" },
            { stage: "closed_won", label: "Closed Won", description: "Deal successfully closed" },
            { stage: "closed_lost", label: "Closed Lost", description: "Deal lost or rejected" },
          ].map((item) => (
            <div key={item.stage} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <div className="w-20 text-xs font-mono text-secondary-label">
                {item.stage}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{item.label}</div>
                <div className="text-xs text-tertiary-label">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Example Payload */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">example webhook payload</h3>
        <pre className="bg-muted/30 rounded-lg p-4 text-xs overflow-x-auto">
{JSON.stringify(examplePayload, null, 2)}
        </pre>
        <p className="text-xs text-tertiary-label mt-3">
          send POST requests to the webhook URL with this JSON structure
        </p>
      </Card>

      {/* Integration Guides */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">crm integration guides</h3>
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-between"
            onClick={() => window.open('https://developers.hubspot.com/docs/api/webhooks', '_blank')}
          >
            <span>hubspot workflow webhooks</span>
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-between"
            onClick={() => window.open('https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_rest_resources.htm', '_blank')}
          >
            <span>salesforce outbound messages</span>
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-between"
            onClick={() => window.open('https://zapier.com/apps/webhook/integrations', '_blank')}
          >
            <span>zapier webhook integration</span>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* How It Works */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">how it works</h3>
        <ol className="space-y-3 list-decimal list-inside text-sm">
          <li>User clicks your utm.one short link (we track the click)</li>
          <li>User fills out a form and provides email (we identify them)</li>
          <li>Sales rep updates deal stage in CRM</li>
          <li>CRM sends webhook to utm.one with new stage + email</li>
          <li>We match email to original click and update journey</li>
          <li>Revenue attribution is calculated automatically</li>
        </ol>
      </Card>
    </div>
  );
};
