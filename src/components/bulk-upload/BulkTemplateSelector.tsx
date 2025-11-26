import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

interface BulkTemplate {
  id: string;
  name: string;
  description: string | null;
  domain: string;
  utm_defaults: any;
  smart_options: any;
  is_default: boolean;
}

interface BulkTemplateSelectorProps {
  workspaceId: string;
  onTemplateSelect: (template: BulkTemplate | null) => void;
}

export const BulkTemplateSelector = ({
  workspaceId,
  onTemplateSelect,
}: BulkTemplateSelectorProps) => {
  const [templates, setTemplates] = useState<BulkTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadTemplates();
  }, [workspaceId]);

  const loadTemplates = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bulk_upload_templates")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "failed to load templates",
        description: error.message,
      });
    } else {
      setTemplates(data || []);
      // Auto-select default template
      const defaultTemplate = data?.find((t) => t.is_default);
      if (defaultTemplate) {
        setSelectedTemplateId(defaultTemplate.id);
        onTemplateSelect(defaultTemplate);
      }
    }
    setLoading(false);
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const template = templates.find((t) => t.id === templateId);
    onTemplateSelect(template || null);
  };

  const handleDeleteTemplate = async (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    setDeleting(templateId);
    const { error } = await supabase
      .from("bulk_upload_templates")
      .delete()
      .eq("id", templateId);

    if (error) {
      toast({
        variant: "destructive",
        title: "failed to delete template",
        description: error.message,
      });
    } else {
      toast({
        title: "template deleted",
      });
      loadTemplates();
      if (selectedTemplateId === templateId) {
        setSelectedTemplateId("");
        onTemplateSelect(null);
      }
    }
    setDeleting(null);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        loading templates...
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        no saved templates yet. save your first template below.
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={selectedTemplateId} onValueChange={handleTemplateChange}>
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="select a template..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">no template (manual setup)</SelectItem>
          {templates.map((template) => (
            <SelectItem key={template.id} value={template.id}>
              <div className="flex items-center justify-between w-full">
                <div>
                  <div className="font-medium">
                    {template.name}
                    {template.is_default && (
                      <span className="ml-2 text-xs text-muted-foreground">(default)</span>
                    )}
                  </div>
                  {template.description && (
                    <div className="text-xs text-muted-foreground">{template.description}</div>
                  )}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedTemplateId && selectedTemplateId !== "none" && (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => handleDeleteTemplate(selectedTemplateId, e)}
          disabled={deleting === selectedTemplateId}
        >
          {deleting === selectedTemplateId ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
};
