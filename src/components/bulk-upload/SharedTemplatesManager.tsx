import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Lock, Globe } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { toast } from "sonner";

interface SharedTemplatesManagerProps {
  workspaceId: string;
  onApplyTemplate?: (template: any) => void;
}

export function SharedTemplatesManager({
  workspaceId,
  onApplyTemplate,
}: SharedTemplatesManagerProps) {
  const queryClient = useQueryClient();

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["bulk-upload-templates", workspaceId],
    queryFn: async () => {
      const { data, error } = await supabaseFrom('bulk_upload_templates')
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const toggleSharing = useMutation({
    mutationFn: async ({ templateId, shared }: { templateId: string; shared: boolean }) => {
      const { error } = await supabaseFrom('bulk_upload_templates')
        .update({ is_shared: shared, shared_with_workspace: shared })
        .eq("id", templateId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bulk-upload-templates", workspaceId] });
      toast.success("Template sharing updated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const sharedTemplates = templates.filter((t) => t.is_shared);
  const privateTemplates = templates.filter((t) => !t.is_shared);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display text-title-3">
          <Users className="w-5 h-5 text-white-80" />
          Shared Templates
        </CardTitle>
        <CardDescription>
          Manage templates available to your team
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
            <div className="text-sm text-muted-foreground text-center py-8">
              Loading templates...
            </div>
          ) : templates.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-8">
              No templates saved yet
            </div>
          ) : (
            <div className="space-y-6">
              {/* Shared Templates Section */}
              {sharedTemplates.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-4 h-4 text-white-80" />
                    <h3 className="font-medium text-sm">Team Templates</h3>
                    <Badge variant="secondary">{sharedTemplates.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {sharedTemplates.map((template) => (
                      <div
                        key={template.id}
                        className="p-4 rounded-lg border bg-card space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{template.name}</h4>
                            {template.description && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {template.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {template.domain}
                              </Badge>
                              {template.is_default && (
                                <Badge variant="secondary" className="text-xs">
                                  Default
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-2">
                            <Switch
                              id={`share-${template.id}`}
                              checked={template.is_shared}
                              onCheckedChange={(checked) =>
                                toggleSharing.mutate({ templateId: template.id, shared: checked })
                              }
                            />
                            <Label htmlFor={`share-${template.id}`} className="text-xs">
                              Share with team
                            </Label>
                          </div>
                          {onApplyTemplate && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onApplyTemplate(template)}
                            >
                              Apply
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Private Templates Section */}
              {privateTemplates.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-medium text-sm">Private Templates</h3>
                    <Badge variant="secondary">{privateTemplates.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {privateTemplates.map((template) => (
                      <div
                        key={template.id}
                        className="p-4 rounded-lg border bg-card space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{template.name}</h4>
                            {template.description && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {template.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {template.domain}
                              </Badge>
                              {template.is_default && (
                                <Badge variant="secondary" className="text-xs">
                                  Default
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-2">
                            <Switch
                              id={`share-${template.id}`}
                              checked={template.is_shared}
                              onCheckedChange={(checked) =>
                                toggleSharing.mutate({ templateId: template.id, shared: checked })
                              }
                            />
                            <Label htmlFor={`share-${template.id}`} className="text-xs">
                              Share with team
                            </Label>
                          </div>
                          {onApplyTemplate && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onApplyTemplate(template)}
                            >
                              Apply
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
