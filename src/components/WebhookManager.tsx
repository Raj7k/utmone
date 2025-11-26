import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Webhook, Plus, Trash2, TestTube } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>(["link.created"]);
  const [secretKey, setSecretKey] = useState("");

  const { data: webhooks, isLoading } = useQuery({
    queryKey: ["webhooks", workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("webhook_subscriptions")
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as WebhookSubscription[];
    },
  });

  const createWebhook = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Encrypt secret if provided
      let secretEncrypted = null;
      if (secretKey) {
        const { data: encryptData, error: encryptError } = await supabase.functions.invoke("encrypt-field", {
          body: { plaintext: secretKey },
        });
        if (encryptError) throw encryptError;
        secretEncrypted = encryptData.ciphertext;
      }

      const { data, error } = await supabase
        .from("webhook_subscriptions")
        .insert({
          workspace_id: workspaceId,
          created_by: user.id,
          webhook_url: webhookUrl,
          event_type: selectedEvents.join(","),
          secret_encrypted: secretEncrypted,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks", workspaceId] });
      toast({ title: "webhook created", description: "your webhook has been configured" });
      setIsCreateOpen(false);
      setWebhookUrl("");
      setSecretKey("");
    },
    onError: (error) => {
      toast({ title: "failed to create webhook", description: error.message, variant: "destructive" });
    },
  });

  const deleteWebhook = useMutation({
    mutationFn: async (webhookId: string) => {
      const { error } = await supabase
        .from("webhook_subscriptions")
        .delete()
        .eq("id", webhookId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks", workspaceId] });
      toast({ title: "webhook deleted" });
    },
  });

  const testWebhook = useMutation({
    mutationFn: async (webhook: WebhookSubscription) => {
      const { data, error } = await supabase.functions.invoke("send-webhook", {
        body: {
          event: "test.ping",
          data: { message: "test webhook from utm.one", timestamp: new Date().toISOString() },
          webhookUrl: webhook.webhook_url,
          secretEncrypted: webhook.secret_encrypted,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "test sent", description: "check your webhook endpoint for the test payload" });
    },
    onError: (error) => {
      toast({ title: "test failed", description: error.message, variant: "destructive" });
    },
  });

  const toggleWebhook = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from("webhook_subscriptions")
        .update({ is_active: isActive })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks", workspaceId] });
    },
  });

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
                  <Button onClick={() => createWebhook.mutate()} disabled={!webhookUrl || selectedEvents.length === 0}>
                    create webhook
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">loading webhooks...</div>
          ) : webhooks && webhooks.length > 0 ? (
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
                          onCheckedChange={(checked) => toggleWebhook.mutate({ id: webhook.id, isActive: checked })}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => testWebhook.mutate(webhook)}
                        >
                          <TestTube className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteWebhook.mutate(webhook.id)}
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
