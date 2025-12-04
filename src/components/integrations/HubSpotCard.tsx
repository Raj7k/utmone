import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, ExternalLink } from "lucide-react";
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

interface HubSpotCardProps {
  workspaceId: string;
}

export const HubSpotCard = ({ workspaceId }: HubSpotCardProps) => {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const webhookUrl = `${window.location.origin}/api/webhooks/hubspot/${workspaceId}`;

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
          <div className="w-12 h-12 rounded-lg bg-[#FF7A59]/10 flex items-center justify-center">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#FF7A59">
              <path d="M18.164 7.93V5.084a.75.75 0 0 0-.957-.721l-5.43 1.528a.75.75 0 0 0-.539.721v8.196c-.332-.108-.672-.202-1.023-.27a4.5 4.5 0 1 0 4.28 7.725 4.5 4.5 0 0 0 1.908-3.662V9.665l2.719-.766a.75.75 0 0 0 .539-.721V7.93z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold">HubSpot</h3>
            <p className="text-xs text-tertiary-label">sync lifecycle stages & deals</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-muted/30">
          webhook
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="text-sm text-secondary-label">
          map lifecycle stages (MQL, SQL) and deal pipeline to utm.one attribution
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline">
              connect hubspot
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>connect hubspot via webhook</DialogTitle>
              <DialogDescription>
                use hubspot workflows to sync contact lifecycle stages and deals
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
                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold" style={{ background: 'rgba(59,130,246,0.1)', color: 'rgba(59,130,246,1)' }}>
                      1
                    </div>
                    <div>
                      <p className="text-sm font-medium">create workflow</p>
                      <p className="text-xs text-tertiary-label mt-1">
                        go to Automation → Workflows → Create workflow (contact-based or deal-based)
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold" style={{ background: 'rgba(59,130,246,0.1)', color: 'rgba(59,130,246,1)' }}>
                      2
                    </div>
                    <div>
                      <p className="text-sm font-medium">set enrollment trigger</p>
                      <p className="text-xs text-tertiary-label mt-1">
                        trigger: "Lifecycle stage is any of SQL, Opportunity, Customer" OR "Deal stage has changed"
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold" style={{ background: 'rgba(59,130,246,0.1)', color: 'rgba(59,130,246,1)' }}>
                      3
                    </div>
                    <div>
                      <p className="text-sm font-medium">add webhook action</p>
                      <p className="text-xs text-tertiary-label mt-1">
                        action: "Send a webhook" → Method: POST → URL: paste webhook above
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold" style={{ background: 'rgba(59,130,246,0.1)', color: 'rgba(59,130,246,1)' }}>
                      4
                    </div>
                    <div>
                      <p className="text-sm font-medium">configure JSON body</p>
                      <div className="bg-muted/30 rounded p-3 mt-2 text-xs font-mono">
{`{
  "email": "{{contact.email}}",
  "stage": "{{contact.lifecyclestage}}",
  "value": "{{deal.amount}}",
  "crm_deal_id": "{{deal.id}}"
}`}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold" style={{ background: 'rgba(59,130,246,0.1)', color: 'rgba(59,130,246,1)' }}>
                      5
                    </div>
                    <div>
                      <p className="text-sm font-medium">activate workflow</p>
                      <p className="text-xs text-tertiary-label mt-1">
                        review settings and turn on the workflow
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documentation Link */}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open('https://knowledge.hubspot.com/workflows/create-workflows', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                hubspot workflows documentation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
};
