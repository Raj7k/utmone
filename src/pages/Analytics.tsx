import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link as LinkIcon, LogOut, TrendingUp, Share2 } from "lucide-react";
import { useWorkspace } from "@/hooks/workspace";
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
import { SwipeableTabs } from "@/components/mobile/SwipeableTabs";
import { PullToRefresh } from "@/components/mobile/PullToRefresh";
import { useIsMobile } from "@/hooks/use-mobile";
import { OwnerPerformance } from "@/components/analytics/OwnerPerformance";
import { ClickHeatmap } from "@/components/analytics/ClickHeatmap";
import { BestTimeCard } from "@/components/analytics/BestTimeCard";
import { DayOfWeekChart } from "@/components/analytics/DayOfWeekChart";
import { ComparisonDashboard } from "@/components/analytics/ComparisonDashboard";
import { useComparisonMetrics } from "@/hooks/useComparisonMetrics";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { DashboardCustomizer } from "@/components/analytics/DashboardCustomizer";
import { useRealtimeClicks } from "@/hooks/useRealtimeClicks";
import { Activity } from "lucide-react";
import { FeatureHint } from "@/components/FeatureHint";
import { InfluenceGraph } from "@/components/analytics/InfluenceGraph";
import { PipelineFunnel } from "@/components/analytics/PipelineFunnel";
import { TopicAttributionView } from "@/components/attribution/TopicAttributionView";
import { LiftAnalysis } from "@/components/attribution/LiftAnalysis";
import { VelocityAnalytics } from "@/components/attribution/VelocityAnalytics";

const Analytics = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const { currentWorkspace, isLoading: workspaceLoading, createWorkspace } = useWorkspace();
  const conversionMetrics = useConversionMetrics(undefined, currentWorkspace?.id);
  const { data: anomalies, invalidate: invalidateAnomalies } = useAnomalies(currentWorkspace?.id || '');
  const { data: comparisonMetrics } = useComparisonMetrics({ workspaceId: currentWorkspace?.id || '', period: 'month' });
  const { recentClick, liveCount, isLive } = useRealtimeClicks(currentWorkspace?.id || '');
  const isMobile = useIsMobile();

  const handleRefresh = async () => {
    invalidateAnomalies();
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

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
        <div className="container mx-auto px-4 md:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-4 md:gap-8">
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
            <div className="flex items-center gap-2 md:gap-4">
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

      <PullToRefresh onRefresh={handleRefresh}>
        <main className="container mx-auto px-4 md:px-8 py-group pb-20 md:pb-group">
          {currentWorkspace && (
            <>
              {/* Feature Hint for Analytics */}
              <FeatureHint
                id="analytics-first-visit"
                title="Your Analytics Dashboard"
                description="Your click data will appear here once your links start getting traffic. Share your links to see real-time insights."
                className="mb-content"
              />
              
              {/* Hero Section with Glanceable Metrics */}
              <div className="mb-content">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                  <div>
                    <h1 className="text-large-title font-bold text-label mb-2">Analytics</h1>
                    <p className="text-body-apple text-secondary-label">
                      Real-time insights into your link performance
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {isLive && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-system-green/10 border border-system-green/20 rounded-full">
                        <Activity className="h-3 w-3 text-system-green animate-pulse" />
                        <span className="text-xs text-system-green">Live ({liveCount})</span>
                      </div>
                    )}
                    <DashboardCustomizer workspaceId={currentWorkspace.id} />
                    <Button variant="outline" size="sm" className="hidden md:flex">
                      Export PDF
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShareDialogOpen(true)}
                      className="hidden md:flex"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Dashboard
                    </Button>
                  </div>
                </div>

                {/* Hero Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="p-4 md:p-6">
                    <div className="text-sm text-secondary-label mb-2">Total Clicks</div>
                    {comparisonMetrics ? (
                      <>
                        <div className="text-3xl md:text-4xl font-bold text-label mb-2">
                          {comparisonMetrics.clicks.current.toLocaleString()}
                        </div>
                        <div className={cn(
                          "flex items-center gap-2 text-xs",
                          comparisonMetrics.clicks.change > 0 ? "text-system-green" : "text-system-red"
                        )}>
                          <TrendingUp className="h-3 w-3" />
                          <span>
                            {comparisonMetrics.clicks.change > 0 ? '↑' : '↓'} {Math.abs(comparisonMetrics.clicks.change).toFixed(1)}% vs last month
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <Skeleton className="h-10 w-32 mb-2" />
                        <Skeleton className="h-4 w-24" />
                      </>
                    )}
                  </Card>
                  <Card className="p-4 md:p-6">
                    <div className="text-sm text-secondary-label mb-2">Click Rate</div>
                    {comparisonMetrics ? (
                      <>
                        <div className="text-3xl md:text-4xl font-bold text-label mb-2">
                          {comparisonMetrics.clickRate.current.toFixed(1)}
                        </div>
                        <div className={cn(
                          "flex items-center gap-2 text-xs",
                          comparisonMetrics.clickRate.change > 0 ? "text-system-green" : "text-system-red"
                        )}>
                          <TrendingUp className="h-3 w-3" />
                          <span>
                            {comparisonMetrics.clickRate.change > 0 ? '↑' : '↓'} {Math.abs(comparisonMetrics.clickRate.change).toFixed(1)}% vs last month
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <Skeleton className="h-10 w-20 mb-2" />
                        <Skeleton className="h-4 w-24" />
                      </>
                    )}
                  </Card>
                  <Card className="p-4 md:p-6">
                    <div className="text-sm text-secondary-label mb-2">Unique Visitors</div>
                    {comparisonMetrics ? (
                      <>
                        <div className="text-3xl md:text-4xl font-bold text-label mb-2">
                          {comparisonMetrics.uniqueClicks.current.toLocaleString()}
                        </div>
                        <div className={cn(
                          "flex items-center gap-2 text-xs",
                          comparisonMetrics.uniqueClicks.change > 0 ? "text-system-green" : "text-system-red"
                        )}>
                          <TrendingUp className="h-3 w-3" />
                          <span>
                            {comparisonMetrics.uniqueClicks.change > 0 ? '↑' : '↓'} {Math.abs(comparisonMetrics.uniqueClicks.change).toFixed(1)}% vs last month
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <Skeleton className="h-10 w-32 mb-2" />
                        <Skeleton className="h-4 w-24" />
                      </>
                    )}
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

              {isMobile ? (
                <SwipeableTabs
                  defaultTab="overview"
                  tabs={[
                    {
                      id: "overview",
                      label: "Overview",
                      content: <AnalyticsOverview workspaceId={currentWorkspace.id} />,
                    },
                    {
                      id: "team",
                      label: "Team",
                      content: <OwnerPerformance workspaceId={currentWorkspace.id} />,
                    },
                    {
                      id: "conversions",
                      label: "Conversions",
                      content: (
                        <>
                          <PipelineFunnel workspaceId={currentWorkspace.id} />
                          {conversionMetrics.data && (
                            <ConversionFunnel
                              clicks={conversionMetrics.data.totalClicks}
                              leads={conversionMetrics.data.leads}
                              signups={conversionMetrics.data.signups}
                              purchases={conversionMetrics.data.purchases}
                              revenue={conversionMetrics.data.totalRevenue}
                            />
                          )}
                        </>
                      ),
                    },
                    {
                      id: "devices",
                      label: "Devices",
                      content: <DeviceBreakdown workspaceId={currentWorkspace.id} />,
                    },
                    {
                      id: "geography",
                      label: "Geography",
                      content: <GeolocationMap workspaceId={currentWorkspace.id} />,
                    },
                     {
                      id: "campaigns",
                      label: "Campaigns",
                      content: <UTMCampaignRollups workspaceId={currentWorkspace.id} />,
                    },
                    {
                      id: "attribution",
                      label: "Attribution",
                      content: (
                        <div className="space-y-6">
                          <InfluenceGraph workspaceId={currentWorkspace.id} days={30} />
                          <TopicAttributionView />
                          <LiftAnalysis />
                          <VelocityAnalytics />
                        </div>
                      ),
                    },
                    {
                      id: "timing",
                      label: "Timing",
                      content: (
                        <div className="space-y-6">
                          <ClickHeatmap workspaceId={currentWorkspace.id} />
                          <div className="grid gap-6 md:grid-cols-2">
                            <BestTimeCard workspaceId={currentWorkspace.id} />
                            <DayOfWeekChart workspaceId={currentWorkspace.id} />
                          </div>
                        </div>
                      ),
                    },
                    {
                      id: "compare",
                      label: "Compare",
                      content: <ComparisonDashboard workspaceId={currentWorkspace.id} />,
                    },
                  ]}
                />
              ) : (
                <Tabs defaultValue="overview" className="space-y-6">
                   <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="team">Team Performance</TabsTrigger>
                    <TabsTrigger value="conversions">Conversions</TabsTrigger>
                    <TabsTrigger value="attribution">Attribution</TabsTrigger>
                    <TabsTrigger value="devices">Devices</TabsTrigger>
                    <TabsTrigger value="geography">Geography</TabsTrigger>
                    <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                    <TabsTrigger value="timing">Timing</TabsTrigger>
                    <TabsTrigger value="compare">Compare</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview">
                    <AnalyticsOverview workspaceId={currentWorkspace.id} />
                  </TabsContent>

                  <TabsContent value="team">
                    <OwnerPerformance workspaceId={currentWorkspace.id} />
                  </TabsContent>

                  <TabsContent value="conversions" className="space-y-6">
                    <PipelineFunnel workspaceId={currentWorkspace.id} />
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

                  <TabsContent value="attribution" className="space-y-6">
                    <Tabs defaultValue="channels" className="w-full">
                      <TabsList className="mb-4">
                        <TabsTrigger value="channels">Channels</TabsTrigger>
                        <TabsTrigger value="topics">Topics</TabsTrigger>
                        <TabsTrigger value="lift">Lift</TabsTrigger>
                        <TabsTrigger value="velocity">Velocity</TabsTrigger>
                      </TabsList>
                      <TabsContent value="channels">
                        <InfluenceGraph workspaceId={currentWorkspace.id} days={30} />
                      </TabsContent>
                      <TabsContent value="topics">
                        <TopicAttributionView />
                      </TabsContent>
                      <TabsContent value="lift">
                        <LiftAnalysis />
                      </TabsContent>
                      <TabsContent value="velocity">
                        <VelocityAnalytics />
                      </TabsContent>
                    </Tabs>
                  </TabsContent>

                  <TabsContent value="timing" className="space-y-6">
                    <ClickHeatmap workspaceId={currentWorkspace.id} />
                    <div className="grid gap-6 md:grid-cols-2">
                      <BestTimeCard workspaceId={currentWorkspace.id} />
                      <DayOfWeekChart workspaceId={currentWorkspace.id} />
                    </div>
                  </TabsContent>

                  <TabsContent value="compare">
                    <ComparisonDashboard workspaceId={currentWorkspace.id} />
                  </TabsContent>

                  <TabsContent value="reports">
                    <ReportScheduler workspaceId={currentWorkspace.id} />
                  </TabsContent>
                </Tabs>
              )}

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
      </PullToRefresh>

      <MobileNav />
    </div>
  );
};

export default Analytics;
