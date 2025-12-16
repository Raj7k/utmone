import { useEffect, useState, lazy, Suspense, useMemo } from "react";
import { useWorkspace } from "@/hooks/workspace";
import { getCachedWorkspaceId } from "@/contexts/AppSessionContext";
import { useActivationTracking } from "@/hooks/useActivationTracking";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Activity, Link as LinkIcon, BarChart3, Globe, Users, Clock, DollarSign } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useAnalyticsData } from "@/hooks/dashboard";
import { LazyPieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, LazyChartContainer } from "@/components/charts/LazyCharts";
import { Link } from "react-router-dom";
import { TrafficForecastChart } from "@/components/analytics/TrafficForecastChart";
import { ParetoFrontier } from "@/components/analytics/ParetoFrontier";
import { PageContentWrapper } from "@/components/layout/PageContentWrapper";
import { ExecutiveMetricsBar } from "@/components/analytics/ExecutiveMetricsBar";
// Lazy load PerformanceTrendChart - below fold, heavy chart
const PerformanceTrendChart = lazy(() => 
  import("@/components/analytics/PerformanceTrendChart")
    .then(mod => ({ default: mod.PerformanceTrendChart }))
);
import { AICommandCenter } from "@/components/analytics/AICommandCenter";
import { ChannelPerformanceGrid } from "@/components/analytics/ChannelPerformanceGrid";
import { TopCampaignsTable } from "@/components/analytics/TopCampaignsTable";
import { QuickActionsPanel } from "@/components/analytics/QuickActionsPanel";
import { AnalyticsShareDialog } from "@/components/analytics/AnalyticsShareDialog";
import { ScheduleReportDialog } from "@/components/analytics/ScheduleReportDialog";
import { useQueryClient } from "@tanstack/react-query";
import { completeNavigation } from "@/hooks/useNavigationProgress";
import { DashboardContentLoader } from "@/components/loading/DashboardContentLoader";
import { StaleIndicator } from "@/components/loading/CardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { LazySection } from "@/components/loading/LazySection";

// Lazy load heavy Attribution tab (575 lines, 6+ queries)
const AttributionTabContent = lazy(() => 
  import("@/components/analytics/AttributionTabContent")
    .then(mod => ({ default: mod.AttributionTabContent }))
);

const COLORS = {
  mobile: "hsl(var(--primary))",
  desktop: "hsl(var(--accent))",
  tablet: "hsl(var(--secondary))",
  unknown: "hsl(var(--muted))"
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Skeleton for progressive loading
const AnalyticsSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => (
        <Skeleton key={i} className="h-24 rounded-xl" />
      ))}
    </div>
    <div className="grid lg:grid-cols-3 gap-6">
      <Skeleton className="lg:col-span-2 h-80 rounded-xl" />
      <Skeleton className="h-80 rounded-xl" />
    </div>
  </div>
);

export default function Analytics() {
  const { currentWorkspace, hasTimedOut } = useWorkspace();
  const { trackFirstAnalyticsView } = useActivationTracking();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);

  // Memoize workspace ID to prevent query key instability
  const effectiveWorkspaceId = useMemo(() => {
    return currentWorkspace?.id || getCachedWorkspaceId() || '';
  }, [currentWorkspace?.id]);
  
  // Get active tab from URL params, default to "overview"
  const activeTab = searchParams.get("tab") || "overview";
  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
  };

  // OPTIMIZED: Analytics-focused hook (3 queries instead of 10)
  const { 
    analytics, 
    executiveMetrics, 
    isLoading, 
    isFetching, 
    isStale,
    error,
    refetch 
  } = useAnalyticsData("30d");

  useEffect(() => {
    trackFirstAnalyticsView();
  }, [trackFirstAnalyticsView]);

  // Complete navigation when data loads or times out
  useEffect(() => {
    if (!isLoading || hasTimedOut) {
      completeNavigation();
    }
  }, [isLoading, hasTimedOut]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["dashboard-direct", effectiveWorkspaceId, "30d"] });
    setIsRefreshing(false);
  };

  // Non-blocking: show content immediately, use isFetching for subtle indicator
  const showLoadingIndicator = isFetching;

  // Show loading state when data is loading
  if (isLoading && !analytics) {
    return (
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <DashboardContentLoader context="analytics" minHeight="60vh" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <PageContentWrapper
        title="intelligence hub"
        description="analytics, attribution, and revenue insights in one place"
        breadcrumbs={[{ label: "intelligence" }]}
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-sm text-destructive">failed to load analytics</p>
        </div>
      </PageContentWrapper>
    );
  }

  // Empty state - only show after data loads
  if (!isLoading && analytics?.isEmpty) {
    return (
      <PageContentWrapper
        title="analytics command center"
        description="executive insights into your link performance"
        breadcrumbs={[{ label: "analytics" }]}
      >
        <Card className="p-12 text-center border-dashed">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Activity className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">no data yet</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                your analytics dashboard will come alive once your links start getting traffic. create and share your first link to see real-time insights.
              </p>
            </div>
            <Button asChild className="mt-4" size="lg">
              <Link to="/dashboard">
                <LinkIcon className="h-4 w-4 mr-2" />
                create your first link
              </Link>
            </Button>
          </div>
        </Card>
      </PageContentWrapper>
    );
  }

  return (
    <div className="animate-fade-in">
    <PageContentWrapper
      title="intelligence hub"
      description="analytics, attribution, and revenue insights in one place"
      breadcrumbs={[{ label: "intelligence" }]}
      action={
        effectiveWorkspaceId && (
          <QuickActionsPanel 
            workspaceId={effectiveWorkspaceId}
            onRefresh={handleRefresh} 
            isRefreshing={isRefreshing}
            onShare={() => setShareDialogOpen(true)}
            onSchedule={() => setScheduleDialogOpen(true)}
          />
        )
      }
    >
      {/* Share & Schedule Dialogs */}
      {effectiveWorkspaceId && (
        <>
          <AnalyticsShareDialog
            open={shareDialogOpen}
            onOpenChange={setShareDialogOpen}
            workspaceId={effectiveWorkspaceId}
          />
          <ScheduleReportDialog
            open={scheduleDialogOpen}
            onOpenChange={setScheduleDialogOpen}
            workspaceId={effectiveWorkspaceId}
          />
        </>
      )}

      {/* Stale data indicator */}
      <div className="mb-4">
        <StaleIndicator visible={isStale || showLoadingIndicator} />
      </div>
      
      {/* Executive Metrics Hero Bar */}
      <ExecutiveMetricsBar
        totalClicks={executiveMetrics?.totalClicks || analytics?.totalClicks || 0}
        uniqueVisitors={executiveMetrics?.uniqueVisitors || analytics?.uniqueVisitors || 0}
        conversionRate={executiveMetrics?.conversionRate || 0}
        revenue={executiveMetrics?.revenue || 0}
        clicksChange={executiveMetrics?.clicksChange || 0}
        visitorsChange={executiveMetrics?.visitorsChange || 0}
        conversionChange={executiveMetrics?.conversionChange || 0}
        revenueChange={executiveMetrics?.revenueChange || 0}
        clicksTrend={executiveMetrics?.clicksTrend || []}
        visitorsTrend={executiveMetrics?.visitorsTrend || []}
        isLoading={isLoading && !analytics}
      />

          {/* Main Dashboard Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PerformanceTrendChart workspaceId={effectiveWorkspaceId} />
            </div>
            <div className="lg:col-span-1">
              <AICommandCenter
                workspaceId={effectiveWorkspaceId}
                insights={analytics?.insights || []}
                topChannel={executiveMetrics?.topChannel}
                topChannelClicks={executiveMetrics?.topChannelClicks}
                peakDay={executiveMetrics?.peakDay}
                peakDayClicks={executiveMetrics?.peakDayClicks}
                avgClicksPerDay={executiveMetrics?.avgClicksPerDay}
              />
            </div>
          </div>

          {/* Channel Performance & Top Campaigns - Lazy loaded */}
          <LazySection fallback={<Skeleton className="h-80 rounded-xl" />}>
            <div className="grid lg:grid-cols-2 gap-6">
              <ChannelPerformanceGrid workspaceId={effectiveWorkspaceId} />
              <TopCampaignsTable workspaceId={effectiveWorkspaceId} />
            </div>
          </LazySection>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 rounded-2xl h-12">
              <TabsTrigger value="overview" className="gap-2">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">overview</span>
              </TabsTrigger>
              <TabsTrigger value="timing" className="gap-2">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">timing</span>
              </TabsTrigger>
              <TabsTrigger value="audience" className="gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">audience</span>
              </TabsTrigger>
              <TabsTrigger value="forecast" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">forecast</span>
              </TabsTrigger>
              <TabsTrigger value="attribution" className="gap-2">
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">attribution</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <ExecutiveMetricsBar
                totalClicks={executiveMetrics?.totalClicks || analytics?.totalClicks || 0}
                uniqueVisitors={executiveMetrics?.uniqueVisitors || analytics?.uniqueVisitors || 0}
                conversionRate={executiveMetrics?.conversionRate || 0}
                revenue={executiveMetrics?.revenue || 0}
                clicksChange={executiveMetrics?.clicksChange || 0}
                visitorsChange={executiveMetrics?.visitorsChange || 0}
                conversionChange={executiveMetrics?.conversionChange || 0}
                revenueChange={executiveMetrics?.revenueChange || 0}
                clicksTrend={executiveMetrics?.clicksTrend || []}
                visitorsTrend={executiveMetrics?.visitorsTrend || []}
                isLoading={isLoading}
              />
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <PerformanceTrendChart workspaceId={effectiveWorkspaceId} />
                </div>
                <div className="lg:col-span-1">
                  <AICommandCenter
                    workspaceId={effectiveWorkspaceId}
                    insights={analytics?.insights || []}
                    topChannel={executiveMetrics?.topChannel}
                    topChannelClicks={executiveMetrics?.topChannelClicks}
                    peakDay={executiveMetrics?.peakDay}
                    peakDayClicks={executiveMetrics?.peakDayClicks}
                    avgClicksPerDay={executiveMetrics?.avgClicksPerDay}
                  />
                </div>
              </div>
              <LazySection fallback={<Skeleton className="h-80 rounded-xl" />}>
                <div className="grid lg:grid-cols-2 gap-6">
                  <ChannelPerformanceGrid workspaceId={effectiveWorkspaceId} />
                  <TopCampaignsTable workspaceId={effectiveWorkspaceId} />
                </div>
              </LazySection>
            </TabsContent>

            <TabsContent value="timing">
              <Card className="rounded-2xl shadow-sm border-border">
                <CardHeader>
                  <CardTitle>activity heatmap</CardTitle>
                  <CardDescription>when your audience is most active - optimize your posting schedule</CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics?.heatmapData && analytics.heatmapData.length > 0 ? (
                    <div className="overflow-x-auto">
                      <div className="inline-block min-w-full">
                        <div className="flex mb-2">
                          <div className="w-16" />
                          {Array.from({ length: 24 }, (_, i) => (
                            <div key={i} className="w-8 text-center text-xs text-muted-foreground">
                              {i % 3 === 0 ? `${i}` : ""}
                            </div>
                          ))}
                        </div>
                        {DAYS.map((day, dayIndex) => (
                          <div key={dayIndex} className="flex items-center mb-1">
                            <div className="w-16 text-xs font-medium text-muted-foreground">{day}</div>
                            <div className="flex gap-1">
                              {Array.from({ length: 24 }, (_, hourIndex) => {
                                const cell = analytics.heatmapData.find(
                                  c => c.day === dayIndex && c.hour === hourIndex
                                );
                                const clicks = cell?.clicks || 0;
                                const intensity = cell?.intensity || 0;
                                const getColor = (intensity: number) => {
                                  if (intensity === 0) return "bg-muted";
                                  if (intensity < 0.25) return "opacity-20";
                                  if (intensity < 0.5) return "opacity-40";
                                  if (intensity < 0.75) return "opacity-60";
                                  return "opacity-100";
                                };
                                const baseStyle = { background: intensity > 0 ? 'hsl(var(--primary))' : undefined };
                                return (
                                  <div
                                    key={hourIndex}
                                    className={`w-8 h-8 rounded ${getColor(intensity)} transition-all hover:ring-2 hover:ring-offset-1 cursor-pointer relative group`}
                                    style={{ ...baseStyle, '--tw-ring-color': 'hsl(var(--primary))' } as React.CSSProperties}
                                    title={`${day}, ${hourIndex}:00 - ${clicks} clicks`}
                                  >
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                                      {day}, {hourIndex}:00<br />
                                      <span className="font-semibold">{clicks} clicks</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t mt-4">
                        <span>less</span>
                        <div className="flex gap-1">
                          <div className="w-4 h-4 rounded bg-muted" />
                          <div className="w-4 h-4 rounded bg-primary/20" />
                          <div className="w-4 h-4 rounded bg-primary/40" />
                          <div className="w-4 h-4 rounded bg-primary/60" />
                          <div className="w-4 h-4 rounded bg-primary" />
                        </div>
                        <span>more</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">no timing data available</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audience" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="rounded-2xl shadow-sm border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-primary" />
                      top countries
                    </CardTitle>
                    <CardDescription>where your audience is clicking from</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {analytics?.topCountries && analytics.topCountries.length > 0 ? (
                      <div className="space-y-3">
                        {analytics.topCountries.slice(0, 5).map((country, index) => (
                          <div key={country.name} className="flex items-center justify-between">
                            <span className="font-medium text-foreground">{country.name}</span>
                            <span className="text-sm text-muted-foreground">{country.clicks}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">no country data available</p>
                    )}
                  </CardContent>
                </Card>
                <Card className="rounded-2xl shadow-sm border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      device breakdown
                    </CardTitle>
                    <CardDescription>how your audience accesses your links</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {analytics?.devices && analytics.devices.length > 0 ? (
                      <div className="space-y-3">
                        {analytics.devices.map((device, index) => (
                          <div key={device.name} className="flex items-center justify-between">
                            <span className="font-medium text-foreground">{device.name}</span>
                            <span className="text-sm text-muted-foreground">{device.value}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">no device data available</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="forecast" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <TrafficForecastChart 
                  historical={[]} 
                  forecast={[]} 
                  needsMoreData={true} 
                />
                <ParetoFrontier links={[]} />
              </div>
            </TabsContent>

            <TabsContent value="attribution">
              <Suspense fallback={
                <div className="space-y-6">
                  <Skeleton className="h-40 rounded-xl" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
                  </div>
                  <Skeleton className="h-80 rounded-xl" />
                </div>
              }>
                <AttributionTabContent workspaceId={currentWorkspace?.id} />
              </Suspense>
            </TabsContent>
          </Tabs>

      {/* Error state with retry */}
      {hasTimedOut && !currentWorkspace && (
        <div className="flex flex-col items-center gap-4 py-12">
          <p className="text-sm text-muted-foreground">couldn't load workspace data</p>
          <button 
            onClick={() => refetch()}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            try again
          </button>
        </div>
      )}
    </PageContentWrapper>
    </div>
  );
}
