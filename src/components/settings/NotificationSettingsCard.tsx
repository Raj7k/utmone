import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/hooks/useWorkspace";
import { notify } from "@/lib/notify";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bell, Mail, Slack, TrendingUp, TrendingDown, Globe, Clock, TestTube, Loader2, AlertTriangle, Check, Plus, X } from "lucide-react";

interface NotificationSettings {
  id?: string;
  workspace_id: string;
  email_enabled: boolean;
  email_recipients: string[];
  slack_enabled: boolean;
  slack_webhook_url_encrypted?: string;
  anomaly_threshold: number;
  quiet_hours_start: number | null;
  quiet_hours_end: number | null;
  debounce_hours: number;
  spike_alerts_enabled: boolean;
  drop_alerts_enabled: boolean;
  new_source_alerts_enabled: boolean;
}

export function NotificationSettingsCard() {
  const { currentWorkspace } = useWorkspace();
  const queryClient = useQueryClient();
  
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [slackWebhookUrl, setSlackWebhookUrl] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [isTesting, setIsTesting] = useState(false);

  // Fetch current settings
  const { data: fetchedSettings, isLoading } = useQuery({
    queryKey: ["notification-settings", currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return null;
      
      const { data, error } = await supabase
        .from("workspace_notification_settings")
        .select("*")
        .eq("workspace_id", currentWorkspace.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
    enabled: !!currentWorkspace?.id,
  });

  // Initialize settings when fetched
  useEffect(() => {
    if (fetchedSettings) {
      setSettings(fetchedSettings as NotificationSettings);
    } else if (currentWorkspace?.id && !isLoading) {
      // Set defaults for new workspaces
      setSettings({
        workspace_id: currentWorkspace.id,
        email_enabled: true,
        email_recipients: [],
        slack_enabled: false,
        anomaly_threshold: 3.0,
        quiet_hours_start: null,
        quiet_hours_end: null,
        debounce_hours: 24,
        spike_alerts_enabled: true,
        drop_alerts_enabled: true,
        new_source_alerts_enabled: true,
      });
    }
  }, [fetchedSettings, currentWorkspace?.id, isLoading]);

  // Save settings mutation
  const saveMutation = useMutation({
    mutationFn: async (newSettings: NotificationSettings) => {
      if (!currentWorkspace?.id) throw new Error("No workspace selected");

      // Encrypt Slack webhook if provided
      let webhookEncrypted = newSettings.slack_webhook_url_encrypted;
      if (slackWebhookUrl && slackWebhookUrl !== "••••••••") {
        const { data: encrypted } = await supabase.rpc("encrypt_sensitive_data", {
          plaintext: slackWebhookUrl,
          encryption_key: "notification-settings",
        });
        webhookEncrypted = encrypted;
      }

      const payload = {
        ...newSettings,
        workspace_id: currentWorkspace.id,
        slack_webhook_url_encrypted: webhookEncrypted,
      };

      if (newSettings.id) {
        const { error } = await supabase
          .from("workspace_notification_settings")
          .update(payload)
          .eq("id", newSettings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("workspace_notification_settings")
          .insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-settings"] });
      notify.success("settings saved", { description: "your notification preferences have been updated." });
    },
    onError: (error: Error) => {
      notify.error("failed to save", { description: error.message });
    },
  });

  // Test notification
  const handleTestNotification = async () => {
    if (!currentWorkspace?.id || !settings) return;
    
    setIsTesting(true);
    try {
      const { error } = await supabase.functions.invoke("send-anomaly-alert", {
        body: {
          workspaceId: currentWorkspace.id,
          workspaceName: currentWorkspace.name || "Test Workspace",
          anomaly: {
            id: "test-" + Date.now(),
            anomaly_type: "traffic_spike",
            severity: "medium",
            title: "🧪 test alert: this is a test notification",
            description: "this is a test notification from pulse watchdog to verify your alert settings are working correctly.",
            baseline_value: 50,
            current_value: 150,
            change_percent: 200,
          },
          link: {
            id: "test-link",
            title: "Test Link",
            short_url: "https://utm.one/test",
          },
          settings: {
            email_enabled: settings.email_enabled,
            email_recipients: settings.email_recipients,
            slack_enabled: settings.slack_enabled,
            slack_webhook_url_encrypted: settings.slack_webhook_url_encrypted,
          },
        },
      });

      if (error) throw error;
      notify.success("test sent", { description: "check your configured channels for the test notification." });
    } catch (error) {
      notify.error("test failed", { description: error instanceof Error ? error.message : "Unknown error" });
    } finally {
      setIsTesting(false);
    }
  };

  const addEmail = () => {
    if (!newEmail || !settings) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      notify.error("invalid email");
      return;
    }
    if (settings.email_recipients.includes(newEmail)) {
      notify.error("email already added");
      return;
    }
    setSettings({ ...settings, email_recipients: [...settings.email_recipients, newEmail] });
    setNewEmail("");
  };

  const removeEmail = (email: string) => {
    if (!settings) return;
    setSettings({ ...settings, email_recipients: settings.email_recipients.filter(e => e !== email) });
  };

  if (isLoading || !settings) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-12 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-display">pulse watchdog alerts</CardTitle>
            <CardDescription>get notified when your links behave unexpectedly</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Alert Types */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">alert types</h3>
          <div className="grid gap-3">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-foreground">traffic spikes</p>
                  <p className="text-sm text-muted-foreground">when a link goes viral (3σ above normal)</p>
                </div>
              </div>
              <Switch
                checked={settings.spike_alerts_enabled}
                onCheckedChange={(checked) => setSettings({ ...settings, spike_alerts_enabled: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center gap-3">
                <TrendingDown className="h-5 w-5 text-red-500" />
                <div>
                  <p className="font-medium text-foreground">traffic drops</p>
                  <p className="text-sm text-muted-foreground">when a link suddenly loses traffic</p>
                </div>
              </div>
              <Switch
                checked={settings.drop_alerts_enabled}
                onCheckedChange={(checked) => setSettings({ ...settings, drop_alerts_enabled: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium text-foreground">new traffic sources</p>
                  <p className="text-sm text-muted-foreground">when traffic arrives from a new referrer</p>
                </div>
              </div>
              <Switch
                checked={settings.new_source_alerts_enabled}
                onCheckedChange={(checked) => setSettings({ ...settings, new_source_alerts_enabled: checked })}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Email Notifications */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">email notifications</h3>
              </div>
            </div>
            <Switch
              checked={settings.email_enabled}
              onCheckedChange={(checked) => setSettings({ ...settings, email_enabled: checked })}
            />
          </div>
          
          {settings.email_enabled && (
            <div className="space-y-3 pl-8">
              <div className="flex gap-2">
                <Input
                  placeholder="add recipient email..."
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addEmail()}
                  className="flex-1"
                />
                <Button variant="outline" size="icon" onClick={addEmail}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {settings.email_recipients.map((email) => (
                  <Badge key={email} variant="secondary" className="gap-1">
                    {email}
                    <button onClick={() => removeEmail(email)} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {settings.email_recipients.length === 0 && (
                  <p className="text-sm text-muted-foreground">no recipients added yet</p>
                )}
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Slack Notifications */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Slack className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">slack notifications</h3>
              </div>
            </div>
            <Switch
              checked={settings.slack_enabled}
              onCheckedChange={(checked) => setSettings({ ...settings, slack_enabled: checked })}
            />
          </div>
          
          {settings.slack_enabled && (
            <div className="space-y-3 pl-8">
              <div>
                <Label className="text-sm text-muted-foreground">webhook url</Label>
                <Input
                  type="password"
                  placeholder="https://hooks.slack.com/services/..."
                  value={slackWebhookUrl}
                  onChange={(e) => setSlackWebhookUrl(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  get your webhook url from slack → apps → incoming webhooks
                </p>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Sensitivity & Timing */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">sensitivity & timing</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm text-foreground">detection sensitivity</Label>
                <Badge variant="outline">{settings.anomaly_threshold}σ</Badge>
              </div>
              <Slider
                value={[settings.anomaly_threshold]}
                onValueChange={([value]) => setSettings({ ...settings, anomaly_threshold: value })}
                min={2}
                max={4}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>more alerts (2σ)</span>
                <span>fewer alerts (4σ)</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm text-foreground">alert cooldown</Label>
                <Badge variant="outline">{settings.debounce_hours}h</Badge>
              </div>
              <Slider
                value={[settings.debounce_hours]}
                onValueChange={([value]) => setSettings({ ...settings, debounce_hours: value })}
                min={1}
                max={72}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                minimum hours between alerts for the same link
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-sm text-foreground">quiet hours (UTC)</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="number"
                    min={0}
                    max={23}
                    placeholder="Start"
                    value={settings.quiet_hours_start ?? ""}
                    onChange={(e) => setSettings({ 
                      ...settings, 
                      quiet_hours_start: e.target.value ? parseInt(e.target.value) : null 
                    })}
                    className="w-20"
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="number"
                    min={0}
                    max={23}
                    placeholder="End"
                    value={settings.quiet_hours_end ?? ""}
                    onChange={(e) => setSettings({ 
                      ...settings, 
                      quiet_hours_end: e.target.value ? parseInt(e.target.value) : null 
                    })}
                    className="w-20"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleTestNotification}
            disabled={isTesting || (!settings.email_enabled && !settings.slack_enabled)}
          >
            {isTesting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                sending...
              </>
            ) : (
              <>
                <TestTube className="h-4 w-4 mr-2" />
                send test alert
              </>
            )}
          </Button>
          
          <Button onClick={() => saveMutation.mutate(settings)} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                saving...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                save settings
              </>
            )}
          </Button>
        </div>

        {/* Status */}
        {(!settings.email_enabled && !settings.slack_enabled) && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              enable at least one notification channel to receive alerts
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}