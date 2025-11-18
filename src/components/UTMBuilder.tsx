import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UTMBuilderProps {
  form: UseFormReturn<any>;
  workspaceId?: string;
  onSaveTemplate?: () => void;
}

export const UTMBuilder = ({ form, workspaceId, onSaveTemplate }: UTMBuilderProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const { data: templates } = useQuery({
    queryKey: ["utm-templates", workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];
      
      const { data, error } = await supabase
        .from("utm_templates")
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!workspaceId,
  });

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates?.find(t => t.id === templateId);
    if (template) {
      form.setValue("utm_source", template.utm_source || "");
      form.setValue("utm_medium", template.utm_medium || "");
      form.setValue("utm_campaign", template.utm_campaign || "");
      form.setValue("utm_term", template.utm_term || "");
      form.setValue("utm_content", template.utm_content || "");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg font-semibold text-foreground">UTM Parameters</h3>
        {templates && templates.length > 0 && (
          <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Load template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="utm_source">Source *</Label>
          <Input
            id="utm_source"
            placeholder="e.g., linkedin, newsletter"
            {...form.register("utm_source")}
          />
          {form.formState.errors.utm_source && (
            <p className="text-sm text-destructive">
              {form.formState.errors.utm_source.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="utm_medium">Medium *</Label>
          <Input
            id="utm_medium"
            placeholder="e.g., email, social, cpc"
            {...form.register("utm_medium")}
          />
          {form.formState.errors.utm_medium && (
            <p className="text-sm text-destructive">
              {form.formState.errors.utm_medium.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="utm_campaign">Campaign *</Label>
          <Input
            id="utm_campaign"
            placeholder="e.g., summer-sale-2024"
            {...form.register("utm_campaign")}
          />
          {form.formState.errors.utm_campaign && (
            <p className="text-sm text-destructive">
              {form.formState.errors.utm_campaign.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="utm_term">Term</Label>
          <Input
            id="utm_term"
            placeholder="e.g., running+shoes (for paid search)"
            {...form.register("utm_term")}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="utm_content">Content</Label>
          <Input
            id="utm_content"
            placeholder="e.g., banner-ad, text-link"
            {...form.register("utm_content")}
          />
        </div>
      </div>

      {onSaveTemplate && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onSaveTemplate}
          className="w-full"
        >
          <Save className="h-4 w-4 mr-2" />
          Save as Template
        </Button>
      )}
    </div>
  );
};
