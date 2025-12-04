import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APIKeyManager } from "@/components/developer/APIKeyManager";
import { WebhookManager } from "@/components/developer/WebhookManager";
import { RateLimitMonitor } from "@/components/developer/RateLimitMonitor";
import { Code, Webhook, Activity, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function DeveloperSettings() {
  const [workspaceId, setWorkspaceId] = useState<string>("");

  useEffect(() => {
    fetchWorkspace();
  }, []);

  const fetchWorkspace = async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;

    const { data: workspaces } = await supabase
      .from("workspaces")
      .select("id")
      .eq("owner_id", user.user.id)
      .limit(1)
      .single();

    if (workspaces) {
      setWorkspaceId(workspaces.id);
    }
  };

  if (!workspaceId) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container max-w-6xl mx-auto px-6 pt-32 pb-20">
          <p>Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container max-w-6xl mx-auto px-6 pt-32 pb-20">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Developer Settings</h1>
            <p className="text-lg" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Manage API keys, webhooks, and monitor your usage
            </p>
          </div>
          <Button asChild variant="outline" className="gap-2">
            <Link to="/docs/api">
              <Book className="h-4 w-4" />
              API Documentation
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="api-keys" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="api-keys" className="gap-2">
              <Code className="h-4 w-4" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="gap-2">
              <Webhook className="h-4 w-4" />
              Webhooks
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="gap-2">
              <Activity className="h-4 w-4" />
              Monitoring
            </TabsTrigger>
          </TabsList>

          <TabsContent value="api-keys" className="space-y-6">
            <APIKeyManager workspaceId={workspaceId} />
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-6">
            <WebhookManager workspaceId={workspaceId} />
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <RateLimitMonitor workspaceId={workspaceId} />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
