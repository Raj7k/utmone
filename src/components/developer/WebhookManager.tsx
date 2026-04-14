import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { notify } from "@/lib/notify";
import { Webhook, Plus, Trash2, Activity, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface WebhookSubscription {
  id: string;
  webhook_url: string;
  event_type: string;
  is_active: boolean;
  created_at: string;
}

interface WebhookManagerProps {
  workspaceId: string;
}

const AVAILABLE_EVENTS = [
  { value: "link.created", label: "Link Created" },
  { value: "link.clicked", label: "Link Clicked" },
  { value: "link.updated", label: "Link Updated" },
  { value: "conversion.tracked", label: "Conversion Tracked" },
  { value: "qr.generated", label: "QR Generated" },
];

export const WebhookManager = ({ workspaceId }: WebhookManagerProps) => {
  const [webhooks, setWebhooks] = useState<WebhookSubscription[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [endpointUrl, setEndpointUrl] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("link.created");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchWebhooks();
  }, [workspaceId]);

  const fetchWebhooks = async () => {
    const { data, error } = await supabaseFrom('webhook_subscriptions')
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setWebhooks(data);
    }
  };

  const handleCreate = async () => {
    if (!endpointUrl.trim()) {
      notify.error("Validation Error", {
        description: "Please provide endpoint URL",
      });
      return;
    }

    setIsSubmitting(true);
    const secretKey = `whsec_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

    const { error } = await supabaseFrom('webhook_subscriptions').insert({
      workspace_id: workspaceId,
      webhook_url: endpointUrl,
      event_type: selectedEvent,
      secret: secretKey,
      created_by: (await supabase.auth.getUser()).data.user?.id,
    });

    if (error) {
      notify.error("Error", {
        description: "Failed to create webhook",
      });
    } else {
      notify.success("Webhook Created", {
        description: "Your webhook endpoint has been configured",
      });
      setShowCreateDialog(false);
      setEndpointUrl("");
      setSelectedEvent("link.created");
      fetchWebhooks();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabaseFrom('webhook_subscriptions').delete().eq("id", id);

    if (error) {
      notify.error("Error", {
        description: "Failed to delete webhook",
      });
    } else {
      notify.success("Webhook Deleted", {
        description: "Webhook endpoint has been removed",
      });
      fetchWebhooks();
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabaseFrom('webhook_subscriptions')
      .update({ is_active: !currentStatus })
      .eq("id", id);

    if (error) {
      notify.error("Error", {
        description: "Failed to update webhook",
      });
    } else {
      fetchWebhooks();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Webhook className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-lg">Webhook Endpoints</h3>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Endpoint
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Webhook Endpoint</DialogTitle>
              <DialogDescription>Configure a webhook to receive real-time events</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="endpoint">Endpoint URL</Label>
                <Input
                  id="endpoint"
                  value={endpointUrl}
                  onChange={(e) => setEndpointUrl(e.target.value)}
                  placeholder="https://api.example.com/webhooks"
                />
              </div>

              <div className="space-y-2">
                <Label>Event to Subscribe</Label>
                <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_EVENTS.map((event) => (
                      <SelectItem key={event.value} value={event.value}>
                        {event.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleCreate} disabled={isSubmitting} className="w-full">
                Create Webhook
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {webhooks.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <Webhook className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-20" />
          <h3 className="font-semibold mb-1">No Webhooks Configured</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create a webhook endpoint to receive real-time events
          </p>
          <Button onClick={() => setShowCreateDialog(true)} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Your First Webhook
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Endpoint</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {webhooks.map((webhook) => (
              <TableRow key={webhook.id}>
                <TableCell className="font-mono text-sm">{webhook.webhook_url}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {webhook.event_type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={webhook.is_active ? "default" : "secondary"}>
                    {webhook.is_active ? "Active" : "Paused"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {webhook.created_at ? new Date(webhook.created_at).toLocaleString() : "Never"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleActive(webhook.id, webhook.is_active)}
                    >
                      <Activity className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(webhook.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
