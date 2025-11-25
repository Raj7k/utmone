import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Key, Plus, Copy, Trash2, Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface APIKey {
  id: string;
  key_name: string;
  key_prefix: string;
  rate_limit: number;
  rate_limit_window: string;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
}

interface APIKeyManagerProps {
  workspaceId: string;
}

export const APIKeyManager = ({ workspaceId }: APIKeyManagerProps) => {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showNewKey, setShowNewKey] = useState(false);
  const [newKeyValue, setNewKeyValue] = useState("");
  const [keyName, setKeyName] = useState("");
  const [rateLimit, setRateLimit] = useState("600");
  const [rateLimitWindow, setRateLimitWindow] = useState("1 minute");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAPIKeys();
  }, [workspaceId]);

  const fetchAPIKeys = async () => {
    const { data, error } = await supabase
      .from("api_keys")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setApiKeys(data);
    }
  };

  const generateAPIKey = () => {
    const prefix = "utm_";
    const key = prefix + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return key;
  };

  const hashKey = async (key: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  const handleCreate = async () => {
    if (!keyName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a name for the API key",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const fullKey = generateAPIKey();
    const keyHash = await hashKey(fullKey);
    const keyPrefix = fullKey.substring(0, 12) + "...";

    const { error } = await supabase.from("api_keys").insert({
      workspace_id: workspaceId,
      key_name: keyName,
      key_hash: keyHash,
      key_prefix: keyPrefix,
      rate_limit: parseInt(rateLimit),
      rate_limit_window: rateLimitWindow,
      created_by: (await supabase.auth.getUser()).data.user?.id,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create API key",
        variant: "destructive",
      });
    } else {
      setNewKeyValue(fullKey);
      setShowNewKey(true);
      toast({
        title: "API Key Created",
        description: "Copy your key now - you won't see it again",
      });
      setKeyName("");
      fetchAPIKeys();
    }
    setIsSubmitting(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("api_keys").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete API key",
        variant: "destructive",
      });
    } else {
      toast({
        title: "API Key Deleted",
        description: "API key has been removed",
      });
      fetchAPIKeys();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Key className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-lg">API Keys</h3>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>Generate a new API key for programmatic access</DialogDescription>
            </DialogHeader>

            {showNewKey ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <Label>Your API Key (Save this now!)</Label>
                  <div className="flex gap-2">
                    <Input value={newKeyValue} readOnly className="font-mono text-sm" />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(newKeyValue)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-destructive">
                    ⚠️ This key will only be shown once. Copy it now!
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setShowCreateDialog(false);
                    setShowNewKey(false);
                    setNewKeyValue("");
                  }}
                  className="w-full"
                >
                  Done
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="keyName">Key Name</Label>
                  <Input
                    id="keyName"
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                    placeholder="Production API Key"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rateLimit">Rate Limit</Label>
                  <Input
                    id="rateLimit"
                    type="number"
                    value={rateLimit}
                    onChange={(e) => setRateLimit(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="window">Window</Label>
                  <Select value={rateLimitWindow} onValueChange={setRateLimitWindow}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1 minute">1 Minute</SelectItem>
                      <SelectItem value="1 hour">1 Hour</SelectItem>
                      <SelectItem value="1 day">1 Day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleCreate} disabled={isSubmitting} className="w-full">
                  Generate Key
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {apiKeys.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <Key className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-20" />
          <h3 className="font-semibold mb-1">No API Keys</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create an API key to access the utm.one API
          </p>
          <Button onClick={() => setShowCreateDialog(true)} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Create Your First API Key
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {apiKeys.map((key) => (
            <div key={key.id} className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{key.key_name}</p>
                  <p className="text-sm text-muted-foreground font-mono">{key.key_prefix}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant={key.is_active ? "default" : "secondary"}>
                    {key.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(key.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  Rate Limit: {key.rate_limit} / {key.rate_limit_window}
                </span>
                <span>
                  Last Used: {key.last_used_at ? new Date(key.last_used_at).toLocaleString() : "Never"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
