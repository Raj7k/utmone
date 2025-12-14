import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWorkspace } from "@/hooks/workspace";
import { useZapierWebhooks } from "@/hooks/useZapierWebhooks";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Zap, Trash2, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function ZapierWebhooksManager() {
  const { currentWorkspace } = useWorkspace();
  const { webhooks, isLoading, createWebhook, updateWebhook, deleteWebhook } = useZapierWebhooks(currentWorkspace?.id || "");
  const [open, setOpen] = useState(false);
  const [webhookName, setWebhookName] = useState("");
  const [triggerType, setTriggerType] = useState("link.created");
  const [targetUrl, setTargetUrl] = useState("");

  const handleCreate = () => {
    createWebhook.mutate({
      workspace_id: currentWorkspace?.id || "",
      webhook_name: webhookName,
      trigger_type: triggerType,
      target_url: targetUrl,
      is_active: true,
    });
    setOpen(false);
    setWebhookName("");
    setTargetUrl("");
  };

  const toggleWebhook = (webhookId: string, currentStatus: boolean) => {
    updateWebhook.mutate({
      webhookId,
      updates: { is_active: !currentStatus },
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Zapier Webhooks
            </CardTitle>
            <CardDescription>
              Automate workflows by connecting utm.one with Zapier
            </CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Webhook
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Zapier Webhook</DialogTitle>
                <DialogDescription>
                  Connect a Zapier workflow to trigger on link events
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Webhook Name</Label>
                  <Input
                    value={webhookName}
                    onChange={(e) => setWebhookName(e.target.value)}
                    placeholder="New Link Notification"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Trigger Event</Label>
                  <Select value={triggerType} onValueChange={setTriggerType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="link.created">Link Created</SelectItem>
                      <SelectItem value="link.clicked">Link Clicked</SelectItem>
                      <SelectItem value="conversion.tracked">Conversion Tracked</SelectItem>
                      <SelectItem value="link.expired">Link Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Zapier Webhook URL</Label>
                  <Input
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="https://hooks.zapier.com/hooks/catch/..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Get this URL from your Zapier webhook trigger setup
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={!webhookName || !targetUrl}>
                  Create Webhook
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading webhooks...</div>
          ) : webhooks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No webhooks configured yet. Add your first Zapier webhook to get started.
            </div>
          ) : (
            <div className="space-y-3">
              {webhooks.map((webhook) => (
                <div
                  key={webhook.id}
                  className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{webhook.webhook_name}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {webhook.trigger_type.replace(".", " → ")}
                      </div>
                      <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        {webhook.target_url.substring(0, 50)}...
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={webhook.is_active}
                        onCheckedChange={() => toggleWebhook(webhook.id, webhook.is_active)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteWebhook.mutate(webhook.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <Badge variant="secondary">
                      {webhook.total_triggers} triggers
                    </Badge>
                    <span className="text-muted-foreground">
                      {webhook.last_triggered_at
                        ? `Last: ${new Date(webhook.last_triggered_at).toLocaleDateString()}`
                        : "Never triggered"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
