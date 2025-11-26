import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { CheckCircle2, XCircle, Code2, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function GTMSettings() {
  const { currentWorkspace } = useWorkspaceContext();
  const workspaceId = currentWorkspace?.id;
  const queryClient = useQueryClient();
  const [containerId, setContainerId] = useState("");
  const [ga4MeasurementId, setGa4MeasurementId] = useState("");
  const [ga4ApiSecret, setGa4ApiSecret] = useState("");
  const [isTesting, setIsTesting] = useState(false);

  const { data: workspace } = useQuery({
    queryKey: ['workspace-gtm', workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workspaces')
        .select('gtm_container_id, ga4_measurement_id, ga4_api_secret_encrypted')
        .eq('id', workspaceId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!workspaceId,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: { gtmId: string; ga4Id: string; ga4Secret: string }) => {
      // Encrypt GA4 API secret if provided
      let ga4SecretEncrypted = null;
      if (data.ga4Secret) {
        const { data: encryptData, error: encryptError } = await supabase.functions.invoke("encrypt-field", {
          body: { plaintext: data.ga4Secret },
        });
        if (encryptError) throw encryptError;
        ga4SecretEncrypted = encryptData.ciphertext;
      }

      const { error } = await supabase
        .from('workspaces')
        .update({ 
          gtm_container_id: data.gtmId || null,
          ga4_measurement_id: data.ga4Id || null,
          ga4_api_secret_encrypted: ga4SecretEncrypted
        })
        .eq('id', workspaceId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-gtm'] });
      queryClient.invalidateQueries({ queryKey: ['gtm-config'] });
      toast.success("GTM settings saved");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to save settings");
    },
  });

  const handleSave = () => {
    if (containerId && !containerId.startsWith('GTM-')) {
      toast.error("Container ID must start with GTM-");
      return;
    }
    if (ga4MeasurementId && !ga4MeasurementId.startsWith('G-')) {
      toast.error("GA4 Measurement ID must start with G-");
      return;
    }
    saveMutation.mutate({ 
      gtmId: containerId, 
      ga4Id: ga4MeasurementId,
      ga4Secret: ga4ApiSecret
    });
  };

  const handleTest = () => {
    setIsTesting(true);
    
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'test_event',
        test_data: 'utm.one gtm test',
        timestamp: new Date().toISOString(),
      });
      toast.success("Test event sent to dataLayer");
    } else {
      toast.error("GTM not loaded yet");
    }

    setTimeout(() => setIsTesting(false), 2000);
  };

  const isConfigured = !!workspace?.gtm_container_id;
  const isGA4Configured = !!workspace?.ga4_measurement_id && !!workspace?.ga4_api_secret_encrypted;

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold">Google Tag Manager</h1>
        <p className="text-muted-foreground mt-2">
          Integrate GTM for advanced conversion tracking and custom events
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
              Configuration
            </CardTitle>
            <CardDescription>
              Connect your Google Tag Manager container
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="containerId">Container ID</Label>
              <Input
                id="containerId"
                placeholder="GTM-XXXXXX"
                value={containerId || workspace?.gtm_container_id || ""}
                onChange={(e) => setContainerId(e.target.value)}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Find this in your GTM account under Admin → Container Settings
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Saving..." : "Save configuration"}
              </Button>
              
              {isConfigured && (
                <Button 
                  variant="outline" 
                  onClick={handleTest}
                  disabled={isTesting}
                >
                  {isTesting ? "Testing..." : "Test connection"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isGA4Configured ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-muted-foreground" />
              )}
              GA4 Server-Side Tracking
            </CardTitle>
            <CardDescription>
              Enable server-side event tracking for link clicks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Link clicks happen server-side (during redirects), so we can't use client-side GTM. 
                Configure GA4 Measurement Protocol to track link clicks directly to Google Analytics.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="ga4MeasurementId">GA4 Measurement ID</Label>
              <Input
                id="ga4MeasurementId"
                placeholder="G-XXXXXXXXXX"
                value={ga4MeasurementId || workspace?.ga4_measurement_id || ""}
                onChange={(e) => setGa4MeasurementId(e.target.value)}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Find this in GA4 under Admin → Data Streams → Web Stream Details
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ga4ApiSecret">GA4 API Secret</Label>
              <Input
                id="ga4ApiSecret"
                type="password"
                placeholder={workspace?.ga4_api_secret_encrypted ? "••••••••" : "Enter API Secret"}
                value={ga4ApiSecret}
                onChange={(e) => setGa4ApiSecret(e.target.value)}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Create this in GA4 under Admin → Data Streams → Measurement Protocol API Secrets
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="w-5 h-5" />
              Tracked events
            </CardTitle>
            <CardDescription>
              Events automatically sent to GTM and GA4
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Alert>
                <AlertDescription className="font-mono text-sm">
                  <strong>link_click</strong> - Fired when a short link is clicked (server-side to GA4)
                  <br />
                  <span className="text-muted-foreground">
                    Includes: link_id, destination_url, utm parameters, device, country
                  </span>
                </AlertDescription>
              </Alert>

              <Alert>
                <AlertDescription className="font-mono text-sm">
                  <strong>link_created</strong> - Fired when a new link is created (client-side to GTM)
                  <br />
                  <span className="text-muted-foreground">
                    Includes: link_id, workspace_id, domain
                  </span>
                </AlertDescription>
              </Alert>

              <Alert>
                <AlertDescription className="font-mono text-sm">
                  <strong>qr_generated</strong> - Fired when QR code created (client-side to GTM)
                  <br />
                  <span className="text-muted-foreground">
                    Includes: link_id, variant_name
                  </span>
                </AlertDescription>
              </Alert>

              <Alert>
                <AlertDescription className="font-mono text-sm">
                  <strong>conversion</strong> - Fired when conversion tracked (client-side to GTM)
                  <br />
                  <span className="text-muted-foreground">
                    Includes: link_id, event_type, event_value
                  </span>
                </AlertDescription>
              </Alert>

              <Alert>
                <AlertDescription className="font-mono text-sm">
                  <strong>page_view</strong> - Fired on dashboard navigation (client-side to GTM)
                  <br />
                  <span className="text-muted-foreground">
                    Includes: page_path
                  </span>
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Setup instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium mb-1">1. Get your Container ID</p>
              <p className="text-muted-foreground">
                Log into Google Tag Manager, go to Admin → Container Settings, and copy your Container ID (starts with GTM-)
              </p>
            </div>
            
            <div>
              <p className="font-medium mb-1">2. Set up GA4 Measurement Protocol (for link clicks)</p>
              <p className="text-muted-foreground">
                In GA4, go to Admin → Data Streams → Select your stream → Copy Measurement ID. 
                Then go to Measurement Protocol API Secrets → Create a new secret.
              </p>
            </div>
            
            <div>
              <p className="font-medium mb-1">3. Paste credentials above and save</p>
              <p className="text-muted-foreground">
                utm.one will automatically load GTM on your dashboard and send link click events to GA4 server-side
              </p>
            </div>
            
            <div>
              <p className="font-medium mb-1">4. Configure tags in GTM</p>
              <p className="text-muted-foreground">
                Create tags in GTM that listen for our custom events (link_created, qr_generated, etc.) and send data to GA4, Facebook Pixel, or any destination
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}