import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { SalesforceCard } from "@/components/integrations/SalesforceCard";
import { HubSpotCard } from "@/components/integrations/HubSpotCard";
import { ZapierCard } from "@/components/integrations/ZapierCard";
import { SlackCard } from "@/components/integrations/SlackCard";
import { WebhookCard } from "@/components/integrations/WebhookCard";

export const Integrations = () => {
  const { currentWorkspace } = useWorkspaceContext();

  if (!currentWorkspace) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-tertiary-label">loading workspace...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">integrations hub</h2>
        <p className="text-sm text-tertiary-label">
          connect your revenue stack to track the full customer lifecycle
        </p>
      </div>

      {/* Hero Feature Banner */}
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">revenue attribution unlocked</h3>
            <p className="text-sm text-secondary-label mb-4">
              connect your CRM to track pipeline stages and attribute revenue to the original marketing touchpoint
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-background">
                Salesforce
              </Badge>
              <Badge variant="outline" className="bg-background">
                HubSpot
              </Badge>
              <Badge variant="outline" className="bg-background">
                Zapier
              </Badge>
              <Badge variant="outline" className="bg-background">
                5,000+ apps
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Native CRM Integrations */}
      <div>
        <h3 className="text-lg font-semibold mb-4">native crm integrations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SalesforceCard workspaceId={currentWorkspace.id} />
          <HubSpotCard workspaceId={currentWorkspace.id} />
        </div>
      </div>

      {/* Automation Platforms */}
      <div>
        <h3 className="text-lg font-semibold mb-4">automation platforms</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ZapierCard workspaceId={currentWorkspace.id} />
          <SlackCard workspaceId={currentWorkspace.id} />
        </div>
      </div>

      {/* Developer Webhook */}
      <div>
        <h3 className="text-lg font-semibold mb-4">developer tools</h3>
        <WebhookCard workspaceId={currentWorkspace.id} />
      </div>
    </div>
  );
};
