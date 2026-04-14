import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, Loader2 } from "lucide-react";

interface SaveBulkTemplateDialogProps {
  workspaceId: string;
  domain: string;
  utmDefaults: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
  };
  smartOptions: {
    autoAlias?: boolean;
    utmTracking?: boolean;
    cleanQueryParams?: boolean;
    groupByDomain?: boolean;
  };
  onTemplateSaved: () => void;
}

export const SaveBulkTemplateDialog = ({
  workspaceId,
  domain,
  utmDefaults,
  smartOptions,
  onTemplateSaved,
}: SaveBulkTemplateDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        variant: "destructive",
        title: "name required",
        description: "please enter a template name",
      });
      return;
    }

    setSaving(true);

    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      toast({
        variant: "destructive",
        title: "authentication required",
        description: "please sign in to save templates",
      });
      setSaving(false);
      return;
    }

    // If setting as default, unset other defaults first
    if (isDefault) {
      await supabaseFrom('bulk_upload_templates')
        .update({ is_default: false })
        .eq("workspace_id", workspaceId);
    }

    const { error } = await supabaseFrom('bulk_upload_templates').insert({
      workspace_id: workspaceId,
      name: name.trim(),
      description: description.trim() || null,
      domain,
      utm_defaults: utmDefaults,
      smart_options: smartOptions,
      is_default: isDefault,
      created_by: user.user.id,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "failed to save template",
        description: error.message,
      });
    } else {
      toast({
        title: "template saved",
        description: `"${name}" has been saved successfully`,
      });
      setOpen(false);
      setName("");
      setDescription("");
      setIsDefault(false);
      onTemplateSaved();
    }

    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Save className="h-4 w-4 mr-2" />
          save as template
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>save bulk upload template</DialogTitle>
          <DialogDescription>
            save your current configuration for future bulk uploads
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="template-name">template name</Label>
            <Input
              id="template-name"
              placeholder="e.g., Marketing Campaign Default"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="template-description">description (optional)</Label>
            <Textarea
              id="template-description"
              placeholder="what is this template for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="default-template"
              checked={isDefault}
              onCheckedChange={(checked) => setIsDefault(checked === true)}
            />
            <Label
              htmlFor="default-template"
              className="text-sm font-normal cursor-pointer"
            >
              set as default template
            </Label>
          </div>

          <div className="rounded-lg border p-3 space-y-2 bg-muted/20">
            <div className="text-sm font-medium">template will save:</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• domain: {domain}</li>
              {Object.keys(utmDefaults).length > 0 && (
                <li>• utm defaults: {Object.keys(utmDefaults).length} parameters</li>
              )}
              {Object.keys(smartOptions).length > 0 && (
                <li>• smart options: {Object.keys(smartOptions).filter(k => smartOptions[k as keyof typeof smartOptions]).length} enabled</li>
              )}
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
            cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                save template
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
