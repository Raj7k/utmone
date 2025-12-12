import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { notify } from "@/lib/notify";
import { Palette, Upload, Save } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface BrandingSettings {
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string;
  secondary_color: string;
  company_name: string | null;
  support_email: string | null;
  hide_utm_one_branding: boolean;
  custom_footer_text: string | null;
}

interface WorkspaceBrandingProps {
  workspaceId: string;
}

export const WorkspaceBranding = ({ workspaceId }: WorkspaceBrandingProps) => {
  const [settings, setSettings] = useState<BrandingSettings>({
    logo_url: null,
    favicon_url: null,
    primary_color: "#217BF6",
    secondary_color: "#16232A",
    company_name: null,
    support_email: null,
    hide_utm_one_branding: false,
    custom_footer_text: null,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchBranding();
  }, [workspaceId]);

  const fetchBranding = async () => {
    const { data, error } = await supabase
      .from("workspace_branding")
      .select("*")
      .eq("workspace_id", workspaceId)
      .single();

    if (!error && data) {
      setSettings({
        ...data,
        favicon_url: data.favicon_url || null,
      });
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${workspaceId}/logo-${Date.now()}.${fileExt}`;

    const { error: uploadError, data } = await supabase.storage
      .from('qr-codes')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      notify.error("Upload Failed", {
        description: uploadError.message,
      });
      setIsUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('qr-codes')
      .getPublicUrl(fileName);

    setSettings({ ...settings, logo_url: publicUrl });
    setIsUploading(false);
    
    notify.success("Logo has been uploaded successfully");
  };

  const handleSave = async () => {
    setIsSaving(true);
    const { error } = await supabase
      .from("workspace_branding")
      .upsert({
        workspace_id: workspaceId,
        ...settings,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      notify.error("Failed to save branding settings");
    } else {
      notify.success("Branding settings have been updated");
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Palette className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-semibold text-lg">White-Label Branding</h3>
      </div>

      <div className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="company_name">Company Name</Label>
          <Input
            id="company_name"
            value={settings.company_name || ""}
            onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
            placeholder="Your Company Name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="logo_url">Logo</Label>
          <div className="flex gap-2">
            <Input
              id="logo_url"
              value={settings.logo_url || ""}
              onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
              placeholder="https://example.com/logo.png or upload below"
            />
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => document.getElementById('logo-upload')?.click()}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4" />
            </Button>
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
            />
          </div>
          {settings.logo_url && (
            <div className="mt-2 p-4 border rounded-lg bg-muted/50">
              <OptimizedImage src={settings.logo_url} alt="Logo preview" height={48} className="h-12 w-auto object-contain" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="favicon_url">Favicon URL</Label>
          <Input
            id="favicon_url"
            value={settings.favicon_url || ""}
            onChange={(e) => setSettings({ ...settings, favicon_url: e.target.value })}
            placeholder="https://example.com/favicon.ico"
          />
          <p className="text-sm text-muted-foreground">
            Icon displayed in browser tabs (16x16 or 32x32 pixels recommended)
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primary_color">Primary Color</Label>
            <div className="flex gap-2">
              <Input
                id="primary_color"
                type="color"
                value={settings.primary_color}
                onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                className="w-20 h-10 p-1 cursor-pointer"
              />
              <Input
                value={settings.primary_color}
                onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                placeholder="#217BF6"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondary_color">Secondary Color</Label>
            <div className="flex gap-2">
              <Input
                id="secondary_color"
                type="color"
                value={settings.secondary_color}
                onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                className="w-20 h-10 p-1 cursor-pointer"
              />
              <Input
                value={settings.secondary_color}
                onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                placeholder="#16232A"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="support_email">Support Email</Label>
          <Input
            id="support_email"
            type="email"
            value={settings.support_email || ""}
            onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
            placeholder="support@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="custom_footer_text">Custom Footer Text</Label>
          <Textarea
            id="custom_footer_text"
            value={settings.custom_footer_text || ""}
            onChange={(e) => setSettings({ ...settings, custom_footer_text: e.target.value })}
            placeholder="Powered by your company..."
            rows={3}
          />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <Label htmlFor="hide_branding">Hide utm.one Branding</Label>
            <p className="text-sm text-muted-foreground">
              Remove utm.one branding from client-facing pages
            </p>
          </div>
          <Switch
            id="hide_branding"
            checked={settings.hide_utm_one_branding}
            onCheckedChange={(checked) => setSettings({ ...settings, hide_utm_one_branding: checked })}
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
