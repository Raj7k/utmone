import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { CheckCircle2, XCircle, Code2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function GTMSettings() {
  const { currentWorkspace } = useWorkspaceContext();
  const workspaceId = currentWorkspace?.id;
  const queryClient = useQueryClient();
  const [containerId, setContainerId] = useState("");
  const [isTesting, setIsTesting] = useState(false);

  const { data: workspace } = useQuery({
    queryKey: ['workspace-gtm', workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workspaces')
        .select('gtm_container_id')
        .eq('id', workspaceId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!workspaceId,
  });

  const saveMutation = useMutation({
    mutationFn: async (gtmId: string) => {
      const { error } = await supabase
        .from('workspaces')
        .update({ gtm_container_id: gtmId || null })
        .eq('id', workspaceId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-gtm'] });
      queryClient.invalidateQueries({ queryKey: ['gtm-config'] });
      toast.success("gtm settings saved");
    },
    onError: (error: any) => {
      toast.error(error.message || "failed to save settings");
    },
  });

  const handleSave = () => {
    if (containerId && !containerId.startsWith('GTM-')) {
      toast.error("container id must start with GTM-");
      return;
    }
    saveMutation.mutate(containerId);
  };

  const handleTest = () => {
    setIsTesting(true);
    
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'test_event',
        test_data: 'utm.one gtm test',
        timestamp: new Date().toISOString(),
      });
      toast.success("test event sent to dataLayer");
    } else {
      toast.error("gtm not loaded yet");
    }

    setTimeout(() => setIsTesting(false), 2000);
  };

  const isConfigured = !!workspace?.gtm_container_id;

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold">google tag manager</h1>
        <p className="text-muted-foreground mt-2">
          integrate gtm for advanced conversion tracking and custom events
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isConfigured ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-muted-foreground" />
              )}
              configuration
            </CardTitle>
            <CardDescription>
              connect your google tag manager container
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="containerId">container id</Label>
              <Input
                id="containerId"
                placeholder="GTM-XXXXXX"
                value={containerId || workspace?.gtm_container_id || ""}
                onChange={(e) => setContainerId(e.target.value)}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                find this in your gtm account under admin → container settings
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "saving..." : "save configuration"}
              </Button>
              
              {isConfigured && (
                <Button 
                  variant="outline" 
                  onClick={handleTest}
                  disabled={isTesting}
                >
                  {isTesting ? "testing..." : "test connection"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="w-5 h-5" />
              tracked events
            </CardTitle>
            <CardDescription>
              events automatically sent to your gtm dataLayer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Alert>
                <AlertDescription className="font-mono text-sm">
                  <strong>link_click</strong> - fired when a short link is clicked
                  <br />
                  <span className="text-muted-foreground">
                    includes: link_id, destination_url, utm parameters
                  </span>
                </AlertDescription>
              </Alert>

              <Alert>
                <AlertDescription className="font-mono text-sm">
                  <strong>conversion</strong> - fired when conversion tracked
                  <br />
                  <span className="text-muted-foreground">
                    includes: link_id, event_type, event_value
                  </span>
                </AlertDescription>
              </Alert>

              <Alert>
                <AlertDescription className="font-mono text-sm">
                  <strong>qr_generated</strong> - fired when qr code created
                  <br />
                  <span className="text-muted-foreground">
                    includes: link_id, variant_name
                  </span>
                </AlertDescription>
              </Alert>

              <Alert>
                <AlertDescription className="font-mono text-sm">
                  <strong>page_view</strong> - fired on dashboard navigation
                  <br />
                  <span className="text-muted-foreground">
                    includes: page_path
                  </span>
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>setup instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium mb-1">1. get your container id</p>
              <p className="text-muted-foreground">
                log into google tag manager, go to admin → container settings, and copy your container id (starts with GTM-)
              </p>
            </div>
            
            <div>
              <p className="font-medium mb-1">2. paste it above and save</p>
              <p className="text-muted-foreground">
                utm.one will automatically load gtm on your dashboard and start sending events
              </p>
            </div>
            
            <div>
              <p className="font-medium mb-1">3. configure tags in gtm</p>
              <p className="text-muted-foreground">
                create tags in gtm that listen for our custom events (link_click, conversion, etc.) and send data to ga4, facebook pixel, or any destination
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
