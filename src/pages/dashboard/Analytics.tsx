import { useEffect, useState } from "react";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useActivationTracking } from "@/hooks/useActivationTracking";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Activity, Link as LinkIcon, BarChart3, Globe, Users, Clock, DollarSign } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useRealAnalytics } from "@/hooks/useRealAnalytics";
import { useExecutiveMetrics } from "@/hooks/useExecutiveMetrics";
import { LazyPieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, LazyChartContainer } from "@/components/charts/LazyCharts";
import { Link } from "react-router-dom";
import { TrafficForecastChart } from "@/components/analytics/TrafficForecastChart";
import { ParetoFrontier } from "@/components/analytics/ParetoFrontier";
import { useTrafficForecast } from "@/hooks/useTrafficForecast";
import { useCampaignPerformance } from "@/hooks/useCampaignPerformance";
import { PageContentWrapper } from "@/components/layout/PageContentWrapper";
import { ExecutiveMetricsBar } from "@/components/analytics/ExecutiveMetricsBar";
import { PerformanceTrendChart } from "@/components/analytics/PerformanceTrendChart";
import { AICommandCenter } from "@/components/analytics/AICommandCenter";
import { ChannelPerformanceGrid } from "@/components/analytics/ChannelPerformanceGrid";
import { TopCampaignsTable } from "@/components/analytics/TopCampaignsTable";
import { QuickActionsPanel } from "@/components/analytics/QuickActionsPanel";
import { AnalyticsShareDialog } from "@/components/analytics/AnalyticsShareDialog";
import { ScheduleReportDialog } from "@/components/analytics/ScheduleReportDialog";
import { AttributionTabContent } from "@/components/analytics/AttributionTabContent";
import { useQueryClient } from "@tanstack/react-query";
import { completeNavigation } from "@/hooks/useNavigationProgress";

const COLORS = {
  mobile: "hsl(var(--primary))",
  desktop: "hsl(var(--accent))",
  tablet: "hsl(var(--secondary))",
  unknown: "hsl(var(--muted))"
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Analytics() {
  const { currentWorkspace, hasTimedOut, retry } = useWorkspace();
  const { trackFirstAnalyticsView } = useActivationTracking();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  
  // Get active tab from URL params, default to "overview"
  const activeTab = searchParams.get("tab") || "overview";
  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
  };

  const { data: analytics, isLoading, error } = useRealAnalytics({ 
    workspaceId: currentWorkspace?.id || '',
    dateRange: 30 
  });

  const { data: executiveMetrics, isLoading: metricsLoading } = useExecutiveMetrics({
    workspaceId: currentWorkspace?.id || '',
    dateRange: 30
  });
  
  const { data: forecastData } = useTrafficForecast(currentWorkspace?.id || '', 7);
  const { data: campaignPerformance } = useCampaignPerformance(currentWorkspace?.id || '');

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
    await queryClient.invalidateQueries({ queryKey: ["real-analytics"] });
    await queryClient.invalidateQueries({ queryKey: ["executive-metrics"] });
    await queryClient.invalidateQueries({ queryKey: ["performance-trend"] });
    await queryClient.invalidateQueries({ queryKey: ["channel-performance"] });
    await queryClient.invalidateQueries({ queryKey: ["top-campaigns"] });
    setIsRefreshing(false);
  };

  // Show error/timeout state if no workspace
  if (!currentWorkspace && hasTimedOut) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4 text-center max-w-md px-4">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-1">couldn't load workspace</h3>
            <p className="text-sm text-muted-foreground">
              the request took too long. this might be a temporary issue.
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => retry?.()}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              try again
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
            >
              refresh page
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentWorkspace || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-secondary-label">loading analytics…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-sm text-destructive">failed to load analytics</p>
      </div>
    );
  }

  // Empty state
  if (analytics?.isEmpty) {
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
    <PageContentWrapper
      title="intelligence hub"
      description="analytics, attribution, and revenue insights in one place"
      breadcrumbs={[{ label: "intelligence" }]}
      action={
        <QuickActionsPanel 
          workspaceId={currentWorkspace.id}
          onRefresh={handleRefresh} 
          isRefreshing={isRefreshing}
          onShare={() => setShareDialogOpen(true)}
          onSchedule={() => setScheduleDialogOpen(true)}
        />
      }
    >

      {/* Share & Schedule Dialogs */}
      <AnalyticsShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        workspaceId={currentWorkspace.id}
      />
      <ScheduleReportDialog
        open={scheduleDialogOpen}
        onOpenChange={setScheduleDialogOpen}
        workspaceId={currentWorkspace.id}
      />

      {/* Executive Metrics Hero Bar */}
      <ExecutiveMetricsBar
        totalClicks={executiveMetrics?.totalClicks || analytics.totalClicks}
        uniqueVisitors={executiveMetrics?.uniqueVisitors || analytics.uniqueVisitors}
        conversionRate={executiveMetrics?.conversionRate || 0}
        revenue={executiveMetrics?.revenue || 0}
        clicksChange={executiveMetrics?.clicksChange || 0}
        visitorsChange={executiveMetrics?.visitorsChange || 0}
        conversionChange={executiveMetrics?.conversionChange || 0}
        revenueChange={executiveMetrics?.revenueChange || 0}
        clicksTrend={executiveMetrics?.clicksTrend || []}
        visitorsTrend={executiveMetrics?.visitorsTrend || []}
        isLoading={metricsLoading}
      />

      {/* Main Dashboard Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Performance Trend - Takes 2 columns */}
        <div className="lg:col-span-2">
          <PerformanceTrendChart workspaceId={currentWorkspace.id} />
        </div>
        
        {/* AI Command Center - Takes 1 column */}
        <div className="lg:col-span-1">
          <AICommandCenter
            workspaceId={currentWorkspace.id}
            insights={analytics.insights || []}
            topChannel={executiveMetrics?.topChannel}
            topChannelClicks={executiveMetrics?.topChannelClicks}
            peakDay={executiveMetrics?.peakDay}
            peakDayClicks={executiveMetrics?.peakDayClicks}
            avgClicksPerDay={executiveMetrics?.avgClicksPerDay}
          />
        </div>
      </div>

      {/* Channel Performance & Top Campaigns */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ChannelPerformanceGrid workspaceId={currentWorkspace.id} />
        <TopCampaignsTable workspaceId={currentWorkspace.id} />
      </div>

      {/* Main Tabs - Now includes Attribution */}
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

        {/* OVERVIEW TAB - Previous main content */}
        <TabsContent value="overview" className="space-y-6">
          {/* Executive Metrics Hero Bar */}
          <ExecutiveMetricsBar
            totalClicks={executiveMetrics?.totalClicks || analytics.totalClicks}
            uniqueVisitors={executiveMetrics?.uniqueVisitors || analytics.uniqueVisitors}
            conversionRate={executiveMetrics?.conversionRate || 0}
            revenue={executiveMetrics?.revenue || 0}
            clicksChange={executiveMetrics?.clicksChange || 0}
            visitorsChange={executiveMetrics?.visitorsChange || 0}
            conversionChange={executiveMetrics?.conversionChange || 0}
            revenueChange={executiveMetrics?.revenueChange || 0}
            clicksTrend={executiveMetrics?.clicksTrend || []}
            visitorsTrend={executiveMetrics?.visitorsTrend || []}
            isLoading={metricsLoading}
          />

          {/* Main Dashboard Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PerformanceTrendChart workspaceId={currentWorkspace.id} />
            </div>
            <div className="lg:col-span-1">
              <AICommandCenter
                workspaceId={currentWorkspace.id}
                insights={analytics.insights || []}
                topChannel={executiveMetrics?.topChannel}
                topChannelClicks={executiveMetrics?.topChannelClicks}
                peakDay={executiveMetrics?.peakDay}
                peakDayClicks={executiveMetrics?.peakDayClicks}
                avgClicksPerDay={executiveMetrics?.avgClicksPerDay}
              />
            </div>
          </div>

          {/* Channel Performance & Top Campaigns */}
          <div className="grid lg:grid-cols-2 gap-6">
            <ChannelPerformanceGrid workspaceId={currentWorkspace.id} />
            <TopCampaignsTable workspaceId={currentWorkspace.id} />
          </div>
        </TabsContent>

        <TabsContent value="timing">
          <Card className="rounded-2xl shadow-sm border-border">
            <CardHeader>
              <CardTitle>activity heatmap</CardTitle>
              <CardDescription>when your audience is most active - optimize your posting schedule</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.heatmapData.length > 0 ? (
                <div className="overflow-x-auto">
                  <div className="inline-block min-w-full">
                    {/* Hour labels */}
                    <div className="flex mb-2">
                      <div className="w-16" />
                      {Array.from({ length: 24 }, (_, i) => (
                        <div key={i} className="w-8 text-center text-xs text-secondary-label">
                          {i % 3 === 0 ? `${i}` : ""}
                        </div>
                      ))}
                    </div>

                    {/* Heatmap rows */}
                    {DAYS.map((day, dayIndex) => (
                      <div key={dayIndex} className="flex items-center mb-1">
                        <div className="w-16 text-xs font-medium text-secondary-label">
                          {day}
                        </div>
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
                                className={`w-8 h-8 rounded ${getColor(intensity)} 
                                  transition-all hover:ring-2 hover:ring-offset-1 
                                  cursor-pointer relative group`}
                                style={{ ...baseStyle, '--tw-ring-color': 'hsl(var(--primary))' } as React.CSSProperties}
                                title={`${day}, ${hourIndex}:00 - ${clicks} clicks`}
                              >
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                                  hidden group-hover:block bg-popover text-popover-foreground 
                                  text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                                  {day}, {hourIndex}:00
                                  <br />
                                  <span className="font-semibold">{clicks} clicks</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-4 text-xs text-secondary-label pt-4 border-t mt-4">
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
                <p className="text-sm text-secondary-label text-center py-8">no timing data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AUDIENCE TAB - Combined Geography + Devices */}
        <TabsContent value="audience" className="space-y-6">
          {/* Geography Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="rounded-2xl shadow-sm border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  top countries
                </CardTitle>
                <CardDescription>where your audience is located</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.topCountries.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.topCountries.map((country, index) => (
                      <div key={country.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-secondary-label w-6">
                            #{index + 1}
                          </span>
                          <span className="text-sm text-label">{country.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-label">
                          {country.clicks.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-secondary-label text-center py-8">no geographic data available</p>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm border-border">
              <CardHeader>
                <CardTitle>top cities</CardTitle>
                <CardDescription>most active cities</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.topCities.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.topCities.slice(0, 5).map((city, index) => (
                      <div key={city.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-secondary-label w-6">
                            #{index + 1}
                          </span>
                          <span className="text-sm text-label">{city.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-label">
                          {city.clicks.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-secondary-label text-center py-8">no city data available</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Devices & Referrers Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="rounded-2xl shadow-sm border-border">
              <CardHeader>
                <CardTitle>devices</CardTitle>
                <CardDescription>mobile vs desktop breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.devices.length > 0 ? (
                  <LazyChartContainer height={300}>
                    <ResponsiveContainer width="100%" height={300}>
                      <LazyPieChart>
                        <Pie
                          data={analytics.devices}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {analytics.devices.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS] || COLORS.unknown} 
                            />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </LazyPieChart>
                    </ResponsiveContainer>
                  </LazyChartContainer>
                ) : (
                  <p className="text-sm text-secondary-label text-center py-8">no device data available</p>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm border-border">
              <CardHeader>
                <CardTitle>top referrers</CardTitle>
                <CardDescription>where your traffic comes from</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.topReferrers.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.topReferrers.map((referrer, index) => (
                      <div key={referrer.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-secondary-label w-6">
                            #{index + 1}
                          </span>
                          <span className="text-sm text-label truncate max-w-[200px]">
                            {referrer.name}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-label">
                          {referrer.value.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-secondary-label text-center py-8">no referrer data available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forecast">
          <div className="space-y-6">
            <TrafficForecastChart
              historical={forecastData?.historical || []}
              forecast={forecastData?.forecast || []}
              needsMoreData={forecastData?.needsMoreData || true}
            />
            
            {campaignPerformance && campaignPerformance.length > 0 && (
              <ParetoFrontier links={campaignPerformance} />
            )}
          </div>
        </TabsContent>

        {/* ATTRIBUTION TAB - New unified tab */}
        <TabsContent value="attribution">
          <AttributionTabContent workspaceId={currentWorkspace.id} />
        </TabsContent>
      </Tabs>
    </PageContentWrapper>
  );
}
