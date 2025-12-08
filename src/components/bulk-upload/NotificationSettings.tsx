import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bell, Mail, Webhook, Info } from "lucide-react";

export interface NotificationPreferences {
  email: boolean;
  webhook: boolean;
  inApp: boolean;
}

interface NotificationSettingsProps {
  preferences: NotificationPreferences;
  onPreferencesChange: (preferences: NotificationPreferences) => void;
  hasWebhookConfigured?: boolean;
}

export function NotificationSettings({ 
  preferences, 
  onPreferencesChange,
  hasWebhookConfigured = false,
}: NotificationSettingsProps) {
  const handleToggle = (channel: keyof NotificationPreferences) => {
    onPreferencesChange({
      ...preferences,
      [channel]: !preferences[channel],
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-title-2">Completion notifications</CardTitle>
        <CardDescription>
          Choose how you want to be notified when bulk uploads complete
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* In-app notifications */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-white-80" />
            <div>
              <Label htmlFor="in-app" className="text-sm font-medium">
                In-app notifications
              </Label>
              <p className="text-xs text-muted-foreground">
                Show notifications in your dashboard
              </p>
            </div>
          </div>
          <Switch
            id="in-app"
            checked={preferences.inApp}
            onCheckedChange={() => handleToggle('inApp')}
          />
        </div>

        {/* Email notifications */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.8)' }} />
            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                Email notifications
              </Label>
              <p className="text-xs text-muted-foreground">
                Receive email when uploads complete
              </p>
            </div>
          </div>
          <Switch
            id="email"
            checked={preferences.email}
            onCheckedChange={() => handleToggle('email')}
          />
        </div>

        {/* Webhook notifications */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Webhook className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.8)' }} />
            <div>
              <Label htmlFor="webhook" className="text-sm font-medium">
                Webhook notifications
              </Label>
              <p className="text-xs text-muted-foreground">
                Send webhook events to your endpoints
              </p>
            </div>
          </div>
          <Switch
            id="webhook"
            checked={preferences.webhook}
            onCheckedChange={() => handleToggle('webhook')}
            disabled={!hasWebhookConfigured}
          />
        </div>

        {preferences.webhook && !hasWebhookConfigured && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              No webhooks configured. Set up webhooks in Integrations to receive completion events.
            </AlertDescription>
          </Alert>
        )}

        {!preferences.email && !preferences.webhook && !preferences.inApp && (
          <Alert variant="destructive">
            <AlertDescription>
              All notifications are disabled. You won't receive any completion alerts.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
