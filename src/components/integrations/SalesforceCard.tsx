import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, ExternalLink, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SalesforceCardProps {
  workspaceId: string;
}

export const SalesforceCard = ({ workspaceId }: SalesforceCardProps) => {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const webhookUrl = `${window.location.origin}/api/webhooks/salesforce/${workspaceId}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    toast({
      title: "copied",
      description: "webhook url copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-[#00A1E0]/10 flex items-center justify-center">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#00A1E0">
              <path d="M10.005 5.331v6.69h6.689v-6.69h-6.689zm7.5 0v6.69h6.689v-6.69h-6.689zm-7.5 7.5v6.689h6.689v-6.689h-6.689zm7.5 0v6.689h6.689v-6.689h-6.689z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold">Salesforce</h3>
            <p className="text-xs text-tertiary-label">sync opportunities & pipeline stages</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-muted/30">
          webhook
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="text-sm text-secondary-label">
          track closed/won deals and attribute revenue to the original marketing touchpoint
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              connect salesforce
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>connect salesforce via webhook</DialogTitle>
              <DialogDescription>
                set up an outbound message in salesforce to sync opportunity stages
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Webhook URL */}
              <div>
                <label className="text-sm font-medium mb-2 block">your webhook url</label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-muted/30 rounded-lg p-3">
                    <code className="text-xs break-all">{webhookUrl}</code>
                  </div>
                  <Button variant="outline" size="sm" onClick={copyUrl}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Setup Instructions */}
              <div className="space-y-4">
                <h4 className="font-semibold">setup instructions</h4>
                
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold bg-primary/10 text-primary">
                      1
                    </div>
                    <div>
                      <p className="text-sm font-medium">create outbound message</p>
                      <p className="text-xs text-tertiary-label mt-1">
                        go to Salesforce Setup → Workflow Rules → Create New Rule on Opportunity object
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold bg-primary/10 text-primary">
                      2
                    </div>
                    <div>
                      <p className="text-sm font-medium">set trigger criteria</p>
                      <p className="text-xs text-tertiary-label mt-1">
                        trigger: "created or edited" | criteria: "StageName ISCHANGED"
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold bg-primary/10 text-primary">
                      3
                    </div>
                    <div>
                      <p className="text-sm font-medium">add immediate workflow action</p>
                      <p className="text-xs text-tertiary-label mt-1">
                        action type: "New Outbound Message"
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold bg-primary/10 text-primary">
                      4
                    </div>
                    <div>
                      <p className="text-sm font-medium">configure outbound message</p>
                      <div className="bg-muted/30 rounded p-3 mt-2 space-y-2 text-xs font-mono">
                        <div><strong>Endpoint URL:</strong> {webhookUrl}</div>
                        <div><strong>Fields to send:</strong> Email, StageName, Amount, CloseDate</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold bg-primary/10 text-primary">
                      5
                    </div>
                    <div>
                      <p className="text-sm font-medium">activate workflow</p>
                      <p className="text-xs text-tertiary-label mt-1">
                        save and activate the workflow rule
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Field Mapping */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  <strong>Field Mapping:</strong> Salesforce will send StageName → utm.one stage, Amount → deal value. 
                  We automatically map Closed Won → closed_won, SQL → sql, etc.
                </AlertDescription>
              </Alert>

              {/* Documentation Link */}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open('https://help.salesforce.com/s/articleView?id=sf.workflow_outbound_messages.htm', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                salesforce documentation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
};
