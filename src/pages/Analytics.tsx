import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Link as LinkIcon, LogOut, TrendingUp } from "lucide-react";
import { useWorkspace } from "@/hooks/useWorkspace";
import type { User } from "@supabase/supabase-js";
import { AnalyticsOverview } from "@/components/analytics/AnalyticsOverview";
import { DeviceBreakdown } from "@/components/analytics/DeviceBreakdown";
import { GeolocationMap } from "@/components/analytics/GeolocationMap";
import { UTMCampaignRollups } from "@/components/analytics/UTMCampaignRollups";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Analytics = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentWorkspace, isLoading: workspaceLoading, createWorkspace } = useWorkspace();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const initWorkspace = async () => {
      if (!workspaceLoading && !currentWorkspace && user) {
        createWorkspace("My Workspace");
      }
    };
    initWorkspace();
  }, [workspaceLoading, currentWorkspace, user, createWorkspace]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (isLoading || workspaceLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <LinkIcon className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  LinkHub
                </span>
              </div>
              <nav className="hidden md:flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                  Dashboard
                </Button>
                <Button variant="ghost" onClick={() => navigate("/links")}>
                  Links
                </Button>
                <Button variant="default">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden md:block">
                {user?.email}
              </span>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">analytics</h1>
          <p className="text-muted-foreground">
            analytics appear once your links get clicks.
          </p>
        </div>

        {currentWorkspace && (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="devices">Devices</TabsTrigger>
              <TabsTrigger value="geography">Geography</TabsTrigger>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <AnalyticsOverview workspaceId={currentWorkspace.id} />
            </TabsContent>

            <TabsContent value="devices">
              <DeviceBreakdown workspaceId={currentWorkspace.id} />
            </TabsContent>

            <TabsContent value="geography">
              <GeolocationMap workspaceId={currentWorkspace.id} />
            </TabsContent>

            <TabsContent value="campaigns">
              <UTMCampaignRollups workspaceId={currentWorkspace.id} />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default Analytics;
