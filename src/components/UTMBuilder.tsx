import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
        <h3 className="font-display text-lg font-semibold text-foreground">utm parameters</h3>
        {templates && templates.length > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="load template" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border border-border z-50">
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-popover border border-border">
                <p className="text-sm">choose a template to create links faster.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="utm_source">utm source *</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="inline-flex items-center justify-center rounded-full w-4 h-4 bg-muted hover:bg-muted/80 transition-colors">
                    <span className="text-[10px] text-muted-foreground font-medium">?</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs bg-popover border border-border">
                  <p className="text-sm">your source of traffic</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
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
          <div className="flex items-center gap-2">
            <Label htmlFor="utm_medium">utm medium *</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="inline-flex items-center justify-center rounded-full w-4 h-4 bg-muted hover:bg-muted/80 transition-colors">
                    <span className="text-[10px] text-muted-foreground font-medium">?</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs bg-popover border border-border">
                  <p className="text-sm">channel or traffic type</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
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
          <div className="flex items-center gap-2">
            <Label htmlFor="utm_campaign">utm campaign *</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="inline-flex items-center justify-center rounded-full w-4 h-4 bg-muted hover:bg-muted/80 transition-colors">
                    <span className="text-[10px] text-muted-foreground font-medium">?</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs bg-popover border border-border">
                  <p className="text-sm">keeps your utms consistent across the team.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
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
          <Label htmlFor="utm_term">utm term</Label>
          <Input
            id="utm_term"
            placeholder="e.g., running+shoes"
            {...form.register("utm_term")}
          />
          <p className="text-xs text-muted-foreground mt-1">use for keywords or variations</p>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="utm_content">utm content</Label>
          <Input
            id="utm_content"
            placeholder="e.g., banner-ad, text-link"
            {...form.register("utm_content")}
          />
          <p className="text-xs text-muted-foreground mt-1">customise the end of the link</p>
        </div>
      </div>

      {onSaveTemplate && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onSaveTemplate}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                save as template
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-popover border border-border">
              <p className="text-sm">this link follows your workspace rules.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
