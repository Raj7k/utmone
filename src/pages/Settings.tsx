import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Globe, ArrowLeft, Key, Webhook, Shield } from "lucide-react";
import { useWorkspace } from "@/hooks/useWorkspace";
import Domains from "./Settings/Domains";
import APIKeysSettings from "./Settings/APIKeys";
import { WebhookManager } from "@/components/WebhookManager";
import { IntegrationsManager } from "@/components/IntegrationsManager";
import { NavLink } from "@/components/NavLink";
import { supabase } from "@/integrations/supabase/client";
import { DataPrivacySettings } from "@/components/DataPrivacySettings";

export default function Settings() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentWorkspace } = useWorkspace();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("domains");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        navigate("/auth");
      } else {
        setUser(user);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (location.pathname.includes("/domains")) {
      setActiveTab("domains");
    }
  }, [location]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <SettingsIcon className="w-6 h-6" />
                <h1 className="text-xl font-bold">Settings</h1>
              </div>
              <nav className="hidden md:flex gap-6">
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/links">Links</NavLink>
                <NavLink to="/analytics">Analytics</NavLink>
                <NavLink to="/settings">Settings</NavLink>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <Button variant="outline" onClick={handleSignOut}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Manage your workspace settings, domains, and preferences
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="domains" className="gap-2">
                <Globe className="w-4 h-4" />
                Domains
              </TabsTrigger>
              <TabsTrigger value="api" className="gap-2">
                <Key className="w-4 h-4" />
                API Keys
              </TabsTrigger>
              <TabsTrigger value="integrations" className="gap-2">
                <Webhook className="w-4 h-4" />
                Integrations
              </TabsTrigger>
              <TabsTrigger value="privacy" className="gap-2">
                <Shield className="w-4 h-4" />
                Data & Privacy
              </TabsTrigger>
            </TabsList>

            <TabsContent value="domains" className="space-y-6">
              {currentWorkspace && <Domains workspaceId={currentWorkspace.id} />}
            </TabsContent>

            <TabsContent value="api" className="space-y-6">
              {currentWorkspace && <APIKeysSettings />}
            </TabsContent>

            <TabsContent value="integrations" className="space-y-6">
              {currentWorkspace && (
                <>
                  <WebhookManager workspaceId={currentWorkspace.id} />
                  <IntegrationsManager />
                </>
              )}
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <DataPrivacySettings />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
