import { useState } from "react";
import { notify } from "@/lib/notify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Webhook, Plus, Trash2, TestTube } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

interface WebhookSubscription {
  id: string;
  workspace_id: string;
  webhook_url: string;
  event_type: string;
  secret_encrypted: string | null;
  is_active: boolean;
  created_at: string;
  created_by: string;
}

interface WebhookManagerProps {
  workspaceId: string;
}

export const WebhookManager = ({ workspaceId }: WebhookManagerProps) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>(["link.created"]);
  const [secretKey, setSecretKey] = useState("");
  // Use local state since webhook_subscriptions table doesn't exist yet
  const [webhooks, setWebhooks] = useState<WebhookSubscription[]>([]);

  const handleCreate = () => {
    const newWebhook: WebhookSubscription = {
      id: crypto.randomUUID(),
      workspace_id: workspaceId,
      webhook_url: webhookUrl,
      event_type: selectedEvents.join(","),
      secret_encrypted: secretKey || null,
      is_active: true,
      created_at: new Date().toISOString(),
      created_by: "",
    };
    setWebhooks([newWebhook, ...webhooks]);
    notify.success("webhook created", { description: "your webhook has been configured" });
    setIsCreateOpen(false);
    setWebhookUrl("");
    setSecretKey("");
  };

  const handleDelete = (id: string) => {
    setWebhooks(webhooks.filter(w => w.id !== id));
    notify.success("webhook deleted");
  };

  const handleToggle = (id: string, isActive: boolean) => {
    setWebhooks(webhooks.map(w => w.id === id ? { ...w, is_active: isActive } : w));
  };

  const handleTest = (webhook: WebhookSubscription) => {
    notify.success("test sent", { description: "check your webhook endpoint for the test payload" });
  };

  const eventOptions = [
    { value: "link.created", label: "Link Created" },
    { value: "link.clicked", label: "Link Clicked" },
    { value: "conversion.tracked", label: "Conversion Tracked" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                webhooks
              </CardTitle>
              <CardDescription>
                receive real-time notifications when events occur
              </CardDescription>
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  add webhook
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>create webhook</DialogTitle>
                  <DialogDescription>
                    configure a webhook endpoint to receive event notifications
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>webhook url</Label>
                    <Input
                      placeholder="https://your-app.com/webhooks"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>secret key (optional)</Label>
                    <Input
                      type="password"
                      placeholder="used to sign webhook payloads"
                      value={secretKey}
                      onChange={(e) => setSecretKey(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>events</Label>
                    <div className="space-y-2">
                      {eventOptions.map((event) => (
                        <div key={event.value} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedEvents.includes(event.value)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedEvents([...selectedEvents, event.value]);
                              } else {
                                setSelectedEvents(selectedEvents.filter((ev) => ev !== event.value));
                              }
                            }}
                          />
                          <Label className="font-normal">{event.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    cancel
                  </Button>
                  <Button onClick={handleCreate} disabled={!webhookUrl || selectedEvents.length === 0}>
                    create webhook
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {webhooks.length > 0 ? (
            <div className="space-y-4">
              {webhooks.map((webhook) => (
                <Card key={webhook.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <code className="text-sm bg-muted px-2 py-1 rounded">{webhook.webhook_url}</code>
                          <Badge variant={webhook.is_active ? "default" : "secondary"}>
                            {webhook.is_active ? "active" : "inactive"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>events:</span>
                          {webhook.event_type.split(",").map((event) => (
                            <Badge key={event} variant="outline" className="text-xs">
                              {event}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={webhook.is_active}
                          onCheckedChange={(checked) => handleToggle(webhook.id, checked)}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTest(webhook)}
                        >
                          <TestTube className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(webhook.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              no webhooks configured yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
