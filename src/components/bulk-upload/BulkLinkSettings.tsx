import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar, Lock, ExternalLink, Image } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

export interface BulkLinkSettingsData {
  expires_at?: string | null;
  max_clicks?: number | null;
  custom_expiry_message?: string | null;
  password?: string | null;
  password_hint?: string | null;
  redirect_type?: "301" | "302" | "307";
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
}

interface BulkLinkSettingsProps {
  settings: BulkLinkSettingsData;
  onChange: (settings: BulkLinkSettingsData) => void;
}

export function BulkLinkSettings({ settings, onChange }: BulkLinkSettingsProps) {
  const [expirationEnabled, setExpirationEnabled] = useState(!!settings.expires_at || !!settings.max_clicks);
  const [passwordEnabled, setPasswordEnabled] = useState(!!settings.password);
  const [ogMetaEnabled, setOgMetaEnabled] = useState(!!settings.og_title || !!settings.og_description || !!settings.og_image);

  const handleExpirationToggle = (enabled: boolean) => {
    setExpirationEnabled(enabled);
    if (!enabled) {
      onChange({
        ...settings,
        expires_at: null,
        max_clicks: null,
        custom_expiry_message: null,
      });
    }
  };

  const handlePasswordToggle = (enabled: boolean) => {
    setPasswordEnabled(enabled);
    if (!enabled) {
      onChange({
        ...settings,
        password: null,
        password_hint: null,
      });
    }
  };

  const handleOgMetaToggle = (enabled: boolean) => {
    setOgMetaEnabled(enabled);
    if (!enabled) {
      onChange({
        ...settings,
        og_title: null,
        og_description: null,
        og_image: null,
      });
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">advanced link settings</h3>
      <p className="text-sm text-muted-foreground mb-6">
        these settings will be applied to all links in this bulk upload
      </p>

      <div className="space-y-6">
        {/* Expiration Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-white-80" />
              <Label>link expiration</Label>
            </div>
            <Switch checked={expirationEnabled} onCheckedChange={handleExpirationToggle} />
          </div>

          {expirationEnabled && (
            <div className="space-y-3 pl-6 border-l-2 border-white/20">
              <div>
                <Label htmlFor="expires-at" className="text-sm">expiration date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal mt-1"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {settings.expires_at ? format(new Date(settings.expires_at), "PPP") : "select date..."}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={settings.expires_at ? new Date(settings.expires_at) : undefined}
                      onSelect={(date) =>
                        onChange({ ...settings, expires_at: date ? date.toISOString() : null })
                      }
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="max-clicks" className="text-sm">max clicks (optional)</Label>
                <Input
                  id="max-clicks"
                  type="number"
                  placeholder="e.g., 1000"
                  value={settings.max_clicks || ""}
                  onChange={(e) =>
                    onChange({ ...settings, max_clicks: e.target.value ? parseInt(e.target.value) : null })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="expiry-message" className="text-sm">custom expiry message</Label>
                <Textarea
                  id="expiry-message"
                  placeholder="this link has expired. contact us for more information."
                  value={settings.custom_expiry_message || ""}
                  onChange={(e) => onChange({ ...settings, custom_expiry_message: e.target.value || null })}
                  rows={2}
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </div>

        {/* Security Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-white-80" />
              <Label>password protection</Label>
            </div>
            <Switch checked={passwordEnabled} onCheckedChange={handlePasswordToggle} />
          </div>

          {passwordEnabled && (
            <div className="space-y-3 pl-6 border-l-2 border-white/20">
              <div>
                <Label htmlFor="password" className="text-sm">password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="enter password..."
                  value={settings.password || ""}
                  onChange={(e) => onChange({ ...settings, password: e.target.value || null })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="password-hint" className="text-sm">password hint (optional)</Label>
                <Input
                  id="password-hint"
                  placeholder="e.g., team name + year"
                  value={settings.password_hint || ""}
                  onChange={(e) => onChange({ ...settings, password_hint: e.target.value || null })}
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </div>

        {/* Redirect Type */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-white-80" />
            <Label>redirect type</Label>
          </div>
          <Select
            value={settings.redirect_type || "302"}
            onValueChange={(value) => onChange({ ...settings, redirect_type: value as "301" | "302" | "307" })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="301">301 - permanent redirect</SelectItem>
              <SelectItem value="302">302 - temporary redirect (default)</SelectItem>
              <SelectItem value="307">307 - temporary redirect (preserves method)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            302 is recommended for tracking and analytics
          </p>
        </div>

        {/* Open Graph Meta */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image className="w-4 h-4 text-white-80" />
              <Label>social preview (open graph)</Label>
            </div>
            <Switch checked={ogMetaEnabled} onCheckedChange={handleOgMetaToggle} />
          </div>

          {ogMetaEnabled && (
            <div className="space-y-3 pl-6 border-l-2 border-white/20">
              <div>
                <Label htmlFor="og-title" className="text-sm">og:title</Label>
                <Input
                  id="og-title"
                  placeholder="custom title for social sharing"
                  value={settings.og_title || ""}
                  onChange={(e) => onChange({ ...settings, og_title: e.target.value || null })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="og-description" className="text-sm">og:description</Label>
                <Textarea
                  id="og-description"
                  placeholder="custom description for social sharing"
                  value={settings.og_description || ""}
                  onChange={(e) => onChange({ ...settings, og_description: e.target.value || null })}
                  rows={2}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="og-image" className="text-sm">og:image URL</Label>
                <Input
                  id="og-image"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={settings.og_image || ""}
                  onChange={(e) => onChange({ ...settings, og_image: e.target.value || null })}
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
