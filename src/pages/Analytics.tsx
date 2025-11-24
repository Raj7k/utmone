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
import { ConversionFunnel } from "@/components/analytics/ConversionFunnel";
import { useConversionMetrics } from "@/hooks/useConversionMetrics";
import { AIInsightCard } from "@/components/analytics/AIInsightCard";
import { AnomalyAlert } from "@/components/analytics/AnomalyAlert";
import { ReportScheduler } from "@/components/analytics/ReportScheduler";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { KeyboardShortcutsHelp } from "@/components/KeyboardShortcutsHelp";
import { useAnomalies } from "@/hooks/useAnomalies";

const Analytics = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const { currentWorkspace, isLoading: workspaceLoading, createWorkspace } = useWorkspace();
  const conversionMetrics = useConversionMetrics(undefined, currentWorkspace?.id);
  const { data: anomalies, invalidate: invalidateAnomalies } = useAnomalies(currentWorkspace?.id || '');

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onShowHelp: () => setShowShortcutsHelp(true),
  });

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
        <div className="animate-pulse">loading analytics…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grouped-background">
      <header className="h-[72px] border-b border-separator bg-system-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <img 
                  src="/src/assets/utm-one-logo.svg" 
                  alt="utm.one" 
                  className="h-7 w-auto"
                />
              </div>
              <nav className="hidden md:flex items-center gap-2">
                <Button variant="system-tertiary" size="sm" onClick={() => navigate("/dashboard")}>
                  dashboard
                </Button>
                <Button variant="system-tertiary" size="sm" onClick={() => navigate("/links")}>
                  links
                </Button>
                <Button variant="system" size="sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  analytics
                </Button>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-footnote text-secondary-label hidden md:block">
                {user?.email}
              </span>
              <Button variant="system-tertiary" size="icon" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-8 py-group">
        <div className="mb-content">
          <h1 className="text-large-title font-bold text-label mb-2">analytics</h1>
          <p className="text-body-apple text-secondary-label">
            analytics appear once your links get clicks.
          </p>
        </div>

        {currentWorkspace && (
          <>
            {/* AI Insights */}
            <div className="mb-content">
              <AIInsightCard workspaceId={currentWorkspace.id} />
            </div>

            {/* Anomalies */}
            {anomalies && anomalies.length > 0 && (
              <div className="space-y-4 mb-content">
                <h2 className="text-title-2 font-semibold text-label">anomalies detected</h2>
                {anomalies.slice(0, 3).map((anomaly) => (
                  <AnomalyAlert 
                    key={anomaly.id} 
                    anomaly={anomaly as any}
                    onDismiss={invalidateAnomalies}
                  />
                ))}
              </div>
            )}

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="conversions">Conversions</TabsTrigger>
                <TabsTrigger value="devices">Devices</TabsTrigger>
                <TabsTrigger value="geography">Geography</TabsTrigger>
                <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <AnalyticsOverview workspaceId={currentWorkspace.id} />
              </TabsContent>

            <TabsContent value="conversions" className="space-y-6">
              {conversionMetrics.data && (
                <ConversionFunnel
                  clicks={conversionMetrics.data.totalClicks}
                  leads={conversionMetrics.data.leads}
                  signups={conversionMetrics.data.signups}
                  purchases={conversionMetrics.data.purchases}
                  revenue={conversionMetrics.data.totalRevenue}
                />
              )}
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

            <TabsContent value="reports">
              <ReportScheduler workspaceId={currentWorkspace.id} />
            </TabsContent>
          </Tabs>

          {/* Keyboard Shortcuts Help */}
          <KeyboardShortcutsHelp 
            open={showShortcutsHelp}
            onOpenChange={setShowShortcutsHelp}
          />
        </>
        )}
      </main>
    </div>
  );
};

export default Analytics;
