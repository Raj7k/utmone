import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link as LinkIcon, LogOut, TrendingUp, Share2 } from "lucide-react";
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
import { AnalyticsShareDialog } from "@/components/analytics/AnalyticsShareDialog";
import { WorkspaceSwitcher } from "@/components/navigation/WorkspaceSwitcher";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { KeyboardShortcutsHelp } from "@/components/KeyboardShortcutsHelp";
import { useAnomalies } from "@/hooks/useAnomalies";
import { MobileNav } from "@/components/mobile/MobileNav";

const Analytics = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
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
              <WorkspaceSwitcher />
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

      <main className="container mx-auto px-8 py-group pb-20 md:pb-group">
        {currentWorkspace && (
          <>
            {/* Hero Section with Glanceable Metrics */}
            <div className="mb-content">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-large-title font-bold text-label mb-2">Analytics</h1>
                  <p className="text-body-apple text-secondary-label">
                    Real-time insights into your link performance
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Export PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShareDialogOpen(true)}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Dashboard
                  </Button>
                </div>
              </div>

              {/* Hero Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="p-6">
                  <div className="text-sm text-secondary-label mb-2">Total Clicks</div>
                  <div className="text-4xl font-bold text-label mb-2">12,847</div>
                  <div className="flex items-center gap-2 text-xs text-system-green">
                    <TrendingUp className="h-3 w-3" />
                    <span>↑ 23% vs last week</span>
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="text-sm text-secondary-label mb-2">Click-through Rate</div>
                  <div className="text-4xl font-bold text-label mb-2">4.2%</div>
                  <div className="flex items-center gap-2 text-xs text-system-green">
                    <TrendingUp className="h-3 w-3" />
                    <span>↑ 0.5% improvement</span>
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="text-sm text-secondary-label mb-2">Top Performing Link</div>
                  <div className="text-lg font-semibold text-label mb-1">Summer Sale 2025</div>
                  <div className="text-xs text-secondary-label">3,421 clicks this week</div>
                </Card>
              </div>
            </div>

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

          {/* Analytics Share Dialog */}
          <AnalyticsShareDialog
            open={shareDialogOpen}
            onOpenChange={setShareDialogOpen}
            workspaceId={currentWorkspace.id}
          />
        </>
        )}
      </main>

      <MobileNav />
    </div>
  );
};

export default Analytics;
