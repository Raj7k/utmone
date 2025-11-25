import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Palette, Upload, Save } from "lucide-react";

interface BrandingSettings {
  logo_url: string | null;
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
    primary_color: "#217BF6",
    secondary_color: "#16232A",
    company_name: null,
    support_email: null,
    hide_utm_one_branding: false,
    custom_footer_text: null,
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

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
      setSettings(data);
    }
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
      toast({
        title: "Error",
        description: "Failed to save branding settings",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Saved",
        description: "Branding settings have been updated",
      });
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
          <Label htmlFor="logo_url">Logo URL</Label>
          <div className="flex gap-2">
            <Input
              id="logo_url"
              value={settings.logo_url || ""}
              onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
              placeholder="https://example.com/logo.png"
            />
            <Button variant="outline" size="icon">
              <Upload className="h-4 w-4" />
            </Button>
          </div>
          {settings.logo_url && (
            <div className="mt-2 p-4 border rounded-lg bg-muted/50">
              <img src={settings.logo_url} alt="Logo preview" className="h-12 object-contain" />
            </div>
          )}
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
