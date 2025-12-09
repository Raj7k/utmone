import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, 
  Check, 
  ExternalLink, 
  Loader2,
  AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface EnrichmentCardProps {
  workspaceId: string;
}

export const EnrichmentCard = ({ workspaceId }: EnrichmentCardProps) => {
  const [apolloKey, setApolloKey] = useState("");
  const [clayWebhook, setClayWebhook] = useState("");
  const [zoomInfoClientId, setZoomInfoClientId] = useState("");
  const [zoomInfoClientSecret, setZoomInfoClientSecret] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [activeTab, setActiveTab] = useState("apollo");

  const saveSettings = async (provider: string) => {
    setIsSaving(true);
    try {
      const settings: Record<string, string> = {};
      
      if (provider === "apollo" && apolloKey) {
        settings.apollo_api_key = apolloKey;
        settings.enrichment_provider = "apollo";
      } else if (provider === "clay" && clayWebhook) {
        settings.clay_webhook_url = clayWebhook;
        settings.enrichment_provider = "clay";
      } else if (provider === "zoominfo" && zoomInfoClientId && zoomInfoClientSecret) {
        settings.zoominfo_client_id = zoomInfoClientId;
        settings.zoominfo_client_secret = zoomInfoClientSecret;
        settings.enrichment_provider = "zoominfo";
      }

      // Store in workspace metadata using raw SQL update via RPC or direct update
      // For now, we'll use the existing settings pattern with type assertion
      const { data: currentWorkspace } = await supabase
        .from('workspaces')
        .select('*')
        .eq('id', workspaceId)
        .single();

      const currentSettings = (currentWorkspace as any)?.settings || {};
      const newSettings = { ...currentSettings, ...settings };

      const { error } = await supabase
        .from('workspaces')
        .update({ settings: newSettings } as any)
        .eq('id', workspaceId);

      if (error) throw error;

      toast({
        title: "settings saved",
        description: `${provider} enrichment configured successfully`,
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "failed to save",
        description: "please try again",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const testConnection = async (provider: string) => {
    setIsTesting(true);
    try {
      const { data, error } = await supabase.functions.invoke('enrich-lead', {
        body: {
          firstName: "Test",
          lastName: "User",
          company: "Acme Corp",
          workspaceId
        }
      });

      if (error) throw error;

      if (data?.error) {
        toast({
          title: "connection issue",
          description: data.message || data.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "connection successful",
          description: `${provider} API is working correctly`,
        });
      }
    } catch (error) {
      console.error('Test failed:', error);
      toast({
        title: "test failed",
        description: "could not connect to enrichment service",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">lead enrichment</h3>
          <p className="text-sm text-muted-foreground">
            automatically find missing emails, phones & linkedin profiles from badge scans
          </p>
        </div>
      </div>

      <div className="mb-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
        <div className="flex items-center gap-2 text-sm">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-foreground font-medium">save $3,000+ per trade show</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          enrich badge scans instead of renting expensive hardware scanners
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="apollo">Apollo.io</TabsTrigger>
          <TabsTrigger value="clay">Clay</TabsTrigger>
          <TabsTrigger value="zoominfo">ZoomInfo</TabsTrigger>
        </TabsList>

        <TabsContent value="apollo" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apollo-key">api key</Label>
            <Input
              id="apollo-key"
              type="password"
              placeholder="your apollo api key"
              value={apolloKey}
              onChange={(e) => setApolloKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              find your key at{" "}
              <a 
                href="https://app.apollo.io/#/settings/integrations/api" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                apollo settings <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => saveSettings("apollo")} 
              disabled={!apolloKey || isSaving}
              className="flex-1"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              save
            </Button>
            <Button 
              variant="outline" 
              onClick={() => testConnection("apollo")}
              disabled={isTesting}
            >
              {isTesting ? <Loader2 className="h-4 w-4 animate-spin" /> : "test"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="clay" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clay-webhook">webhook url</Label>
            <Input
              id="clay-webhook"
              type="url"
              placeholder="https://api.clay.com/v1/..."
              value={clayWebhook}
              onChange={(e) => setClayWebhook(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              create a webhook workflow in{" "}
              <a 
                href="https://app.clay.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                clay <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>

          <div className="p-3 rounded-lg bg-muted/50 space-y-2">
            <p className="text-xs font-medium text-foreground">clay setup steps:</p>
            <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
              <li>go to clay → workflows → create new</li>
              <li>add "http request" as trigger</li>
              <li>configure enrichment steps</li>
              <li>copy webhook url and paste above</li>
            </ol>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => saveSettings("clay")} 
              disabled={!clayWebhook || isSaving}
              className="flex-1"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              save
            </Button>
            <Button 
              variant="outline" 
              onClick={() => testConnection("clay")}
              disabled={isTesting}
            >
              {isTesting ? <Loader2 className="h-4 w-4 animate-spin" /> : "test"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="zoominfo" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="zoominfo-client">client id</Label>
            <Input
              id="zoominfo-client"
              type="text"
              placeholder="your zoominfo client id"
              value={zoomInfoClientId}
              onChange={(e) => setZoomInfoClientId(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zoominfo-secret">client secret</Label>
            <Input
              id="zoominfo-secret"
              type="password"
              placeholder="your zoominfo client secret"
              value={zoomInfoClientSecret}
              onChange={(e) => setZoomInfoClientSecret(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              get credentials from{" "}
              <a 
                href="https://developer.zoominfo.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                zoominfo developer portal <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>

          <Badge variant="outline" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            enterprise plan required
          </Badge>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => saveSettings("zoominfo")} 
              disabled={!zoomInfoClientId || !zoomInfoClientSecret || isSaving}
              className="flex-1"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              save
            </Button>
            <Button 
              variant="outline" 
              onClick={() => testConnection("zoominfo")}
              disabled={isTesting}
            >
              {isTesting ? <Loader2 className="h-4 w-4 animate-spin" /> : "test"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
