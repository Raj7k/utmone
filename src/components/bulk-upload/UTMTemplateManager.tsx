import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Save, Trash2, Plus, FileText } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { requireUserId } from "@/lib/getCachedUser";

type UTMTemplate = Database["public"]["Tables"]["bulk_upload_templates"]["Row"];

interface UTMTemplateManagerProps {
  workspaceId: string;
  onApplyTemplate: (template: {
    utm_source: string;
    utm_medium: string;
    utm_campaign: string;
    utm_term: string;
    utm_content: string;
  }) => void;
}

export function UTMTemplateManager({ workspaceId, onApplyTemplate }: UTMTemplateManagerProps) {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [utmDefaults, setUtmDefaults] = useState({
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_term: "",
    utm_content: "",
  });

  // Fetch templates
  const { data: templates, isLoading } = useQuery({
    queryKey: ["bulk-upload-templates", workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bulk_upload_templates")
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as UTMTemplate[];
    },
  });

  // Create template mutation
  const createMutation = useMutation({
    mutationFn: async () => {
      const userId = requireUserId();

      const { data, error } = await supabase
        .from("bulk_upload_templates")
        .insert({
          workspace_id: workspaceId,
          created_by: userId,
          name: templateName,
          description: templateDescription || null,
          domain: "utm.one", // default
          utm_defaults: utmDefaults,
          smart_options: null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bulk-upload-templates", workspaceId] });
      toast.success("template saved.");
      setIsCreating(false);
      setTemplateName("");
      setTemplateDescription("");
      setUtmDefaults({
        utm_source: "",
        utm_medium: "",
        utm_campaign: "",
        utm_term: "",
        utm_content: "",
      });
    },
    onError: (error) => {
      toast.error("failed to save template.");
      console.error("Template creation error:", error);
    },
  });

  // Delete template mutation
  const deleteMutation = useMutation({
    mutationFn: async (templateId: string) => {
      const { error } = await supabase
        .from("bulk_upload_templates")
        .delete()
        .eq("id", templateId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bulk-upload-templates", workspaceId] });
      toast.success("template deleted.");
    },
    onError: () => {
      toast.error("failed to delete template.");
    },
  });

  const handleApply = (template: UTMTemplate) => {
    const defaults = template.utm_defaults as any;
    if (defaults) {
      // Process variables: {date}, {month}, {year}, {index}
      const now = new Date();
      const processed = {
        utm_source: processVariables(defaults.utm_source || "", now),
        utm_medium: processVariables(defaults.utm_medium || "", now),
        utm_campaign: processVariables(defaults.utm_campaign || "", now),
        utm_term: processVariables(defaults.utm_term || "", now),
        utm_content: processVariables(defaults.utm_content || "", now),
      };
      onApplyTemplate(processed);
      toast.success(`applied template: ${template.name}`);
    }
  };

  const processVariables = (value: string, date: Date): string => {
    return value
      .replace(/{date}/g, date.toISOString().split("T")[0])
      .replace(/{month}/g, String(date.getMonth() + 1).padStart(2, "0"))
      .replace(/{year}/g, String(date.getFullYear()))
      .replace(/{index}/g, "1"); // default index
  };

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">loading templates...</div>;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">UTM templates</h3>
          <p className="text-sm text-muted-foreground">
            save and reuse UTM configurations with variables
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsCreating(!isCreating)}
        >
          <Plus className="w-4 h-4 mr-2" />
          new template
        </Button>
      </div>

      {isCreating && (
        <div className="mb-6 p-4 border rounded-lg bg-muted/20">
          <div className="space-y-4">
            <div>
              <Label htmlFor="template-name">template name</Label>
              <Input
                id="template-name"
                placeholder="e.g., Newsletter Campaign 2025"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="template-description">description (optional)</Label>
              <Textarea
                id="template-description"
                placeholder="describe when to use this template..."
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="template-source">utm_source</Label>
                <Input
                  id="template-source"
                  placeholder="e.g., newsletter"
                  value={utmDefaults.utm_source}
                  onChange={(e) =>
                    setUtmDefaults({ ...utmDefaults, utm_source: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="template-medium">utm_medium</Label>
                <Input
                  id="template-medium"
                  placeholder="e.g., email"
                  value={utmDefaults.utm_medium}
                  onChange={(e) =>
                    setUtmDefaults({ ...utmDefaults, utm_medium: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="template-campaign">utm_campaign</Label>
                <Input
                  id="template-campaign"
                  placeholder="e.g., q1-{year}-promo (supports variables)"
                  value={utmDefaults.utm_campaign}
                  onChange={(e) =>
                    setUtmDefaults({ ...utmDefaults, utm_campaign: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="template-term">utm_term</Label>
                <Input
                  id="template-term"
                  placeholder="e.g., feature-launch"
                  value={utmDefaults.utm_term}
                  onChange={(e) =>
                    setUtmDefaults({ ...utmDefaults, utm_term: e.target.value })
                  }
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="template-content">utm_content</Label>
                <Input
                  id="template-content"
                  placeholder="e.g., cta-button-{index}"
                  value={utmDefaults.utm_content}
                  onChange={(e) =>
                    setUtmDefaults({ ...utmDefaults, utm_content: e.target.value })
                  }
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              supported variables: {"{date}"}, {"{month}"}, {"{year}"}, {"{index}"}
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => createMutation.mutate()}
                disabled={!templateName || createMutation.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                save template
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {templates && templates.length > 0 ? (
        <div className="space-y-2">
          {templates.map((template) => (
            <div
              key={template.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/20 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-white-80" />
                  <h4 className="font-medium">{template.name}</h4>
                </div>
                {template.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {template.description}
                  </p>
                )}
                <div className="text-xs text-muted-foreground mt-2 flex flex-wrap gap-2">
                  {(template.utm_defaults as any)?.utm_source && (
                    <span className="px-2 py-0.5 bg-muted rounded">
                      source: {(template.utm_defaults as any).utm_source}
                    </span>
                  )}
                  {(template.utm_defaults as any)?.utm_medium && (
                    <span className="px-2 py-0.5 bg-muted rounded">
                      medium: {(template.utm_defaults as any).utm_medium}
                    </span>
                  )}
                  {(template.utm_defaults as any)?.utm_campaign && (
                    <span className="px-2 py-0.5 bg-muted rounded">
                      campaign: {(template.utm_defaults as any).utm_campaign}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleApply(template)}
                >
                  apply
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMutation.mutate(template.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-8">
          no templates yet. create your first one to get started.
        </p>
      )}
    </Card>
  );
}
