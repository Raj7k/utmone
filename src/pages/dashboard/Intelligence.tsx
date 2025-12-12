import { useState, useEffect, lazy, Suspense } from "react";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useIntelligenceData } from "@/hooks/useIntelligenceData";
import { completeNavigation } from "@/hooks/useNavigationProgress";
import { PageContentWrapper } from "@/components/layout/PageContentWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Network, TrendingUp, Activity, Shield } from "lucide-react";
import PulseHero from "@/components/intelligence/PulseHero";
import ContextSwitcher, { IntelligenceContext } from "@/components/intelligence/ContextSwitcher";
import { PeriodSelector, PeriodOption, periodDays } from "@/components/intelligence/PeriodSelector";
import RevenueBentoCard from "@/components/intelligence/RevenueBentoCard";
import PerformanceSnapshot from "@/components/intelligence/PerformanceSnapshot";
import TopCampaignsCard from "@/components/intelligence/TopCampaignsCard";
import EventImpactRow from "@/components/intelligence/EventImpactRow";
import ChannelMixDonut from "@/components/intelligence/ChannelMixDonut";
import GeoHeatTiles from "@/components/intelligence/GeoHeatTiles";
import LiveActivityRail from "@/components/intelligence/LiveActivityRail";
import AttributionSheet from "@/components/intelligence/AttributionSheet";
import CampaignSheet from "@/components/intelligence/CampaignSheet";
import MobileActivitySheet from "@/components/intelligence/MobileActivitySheet";
import { AttributionTabContent } from "@/components/analytics/AttributionTabContent";
import { OfflineImporter } from "@/components/attribution/OfflineImporter";
import { LiftAnalysis } from "@/components/attribution/LiftAnalysis";
import { VelocityAnalytics } from "@/components/attribution/VelocityAnalytics";
import { TopicAttributionView } from "@/components/attribution/TopicAttributionView";
import { SentinelSavesWidget } from "@/components/analytics/SentinelSavesWidget";
import { useSentinelStats } from "@/hooks/useSentinelSaves";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IntelligenceOverviewSkeleton } from "@/components/intelligence/IntelligenceOverviewSkeleton";

// Lazy load heavy visualization components
const IdentityGraphView = lazy(() => import("@/components/attribution/IdentityGraphView").then(m => ({ default: m.IdentityGraphView })));

export default function Intelligence() {
  const { currentWorkspace, hasTimedOut, retry } = useWorkspace();
  const workspaceId = currentWorkspace?.id;
  const [period, setPeriod] = useState<PeriodOption>("7d");
  const [customRange, setCustomRange] = useState<{ from: Date; to: Date } | undefined>();
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [context, setContext] = useState<IntelligenceContext>("all");
  const [attributionSheetOpen, setAttributionSheetOpen] = useState(false);
  const [campaignSheetOpen, setCampaignSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate days based on period or custom range
  const days = period === "custom" && customRange 
    ? Math.ceil((customRange.to.getTime() - customRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1
    : periodDays[period];

  // Use unified data hook for fast loading
  const { data: intelligenceData, isLoading } = useIntelligenceData(currentWorkspace?.id, days);

  // Signal navigation complete when data loads or times out
  useEffect(() => {
    if (!isLoading || hasTimedOut) {
      completeNavigation();
    }
  }, [isLoading, hasTimedOut]);

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

  return (
    <PageContentWrapper
      title="intelligence"
      description="your unified analytics command center"
    >
      {/* Period Selector & Tabs Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList className="h-10 bg-muted/50">
            <TabsTrigger value="overview" className="gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">overview</span>
            </TabsTrigger>
            <TabsTrigger value="attribution" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">attribution</span>
            </TabsTrigger>
            <TabsTrigger value="sentinel" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">sentinel</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="gap-2">
              <Network className="h-4 w-4" />
              <span className="hidden sm:inline">advanced</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <PeriodSelector 
          value={period} 
          onChange={setPeriod} 
          customRange={customRange}
          onCustomRangeChange={setCustomRange}
          compareEnabled={compareEnabled}
          onCompareChange={setCompareEnabled}
        />
      </div>

      {/* Main Content based on Tab */}
      {activeTab === "overview" && (
        isLoading ? (
          <IntelligenceOverviewSkeleton />
        ) : (
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-6 min-w-0">
            {/* Pulse Hero - Live Activity Bar */}
            <PulseHero
              workspaceId={currentWorkspace?.id}
              period={period}
              hidePeriodSelector
              customDays={days}
              initialClicks={intelligenceData.totalClicks}
              initialTrend={intelligenceData.clicksTrend}
              initialTrendPercent={intelligenceData.clicksTrendPercent}
            />

            {/* Context Switcher */}
            <ContextSwitcher value={context} onChange={setContext} />

            {/* Primary Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Revenue Attribution - Large Card (spans 2 columns) */}
              <div 
                className="lg:col-span-2 cursor-pointer"
                onClick={() => setAttributionSheetOpen(true)}
              >
                <RevenueBentoCard
                  workspaceId={currentWorkspace?.id}
                  days={days}
                  context={context}
                  preloadedData={{
                    totalRevenue: intelligenceData.totalRevenue,
                    conversions: intelligenceData.conversionsCount,
                    channels: intelligenceData.topChannels,
                  }}
                />
              </div>

              {/* Performance Snapshot - Medium Card */}
              <div className="lg:col-span-1">
                <PerformanceSnapshot
                  workspaceId={currentWorkspace?.id}
                  days={days}
                  preloadedClicks={intelligenceData.totalClicks}
                />
              </div>
            </div>

            {/* Secondary Row - Campaigns & Channel Mix */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div 
                className="cursor-pointer"
                onClick={() => setCampaignSheetOpen(true)}
              >
                <TopCampaignsCard
                  workspaceId={currentWorkspace?.id}
                  days={days}
                  context={context}
                  preloadedCampaigns={intelligenceData.topCampaigns}
                />
              </div>
              <ChannelMixDonut
                workspaceId={currentWorkspace?.id}
                days={days}
                preloadedData={intelligenceData.channelMix}
              />
            </div>

            {/* Event Impact Row */}
            {(context === "all" || context === "events") && (
              <EventImpactRow
                workspaceId={currentWorkspace?.id}
                days={days}
              />
            )}

            {/* Customers Context - Identity Graph Preview */}
            {context === "customers" && (
              <Card className="rounded-2xl border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="h-5 w-5 text-primary" />
                    cross-device identity
                  </CardTitle>
                  <CardDescription>
                    unified customer view across devices and sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={
                    <div className="flex items-center justify-center py-12">
                      <Network className="w-8 h-8 text-muted-foreground animate-pulse" />
                    </div>
                  }>
                    <IdentityGraphView />
                  </Suspense>
                </CardContent>
              </Card>
            )}

            {/* Tertiary Row - Geo */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <GeoHeatTiles
                workspaceId={currentWorkspace?.id}
                days={days}
                preloadedData={intelligenceData.topCities}
              />
              {/* Placeholder for Sales Velocity */}
              <div className="rounded-2xl border border-border bg-card/50 p-6 flex items-center justify-center min-h-[200px]">
                <p className="text-muted-foreground text-sm">sales velocity coming soon</p>
              </div>
            </div>
          </div>

          {/* Live Activity Rail - Right Sidebar (hidden on mobile) */}
          <div className="hidden xl:block w-80 shrink-0">
            <div className="sticky top-6">
              <LiveActivityRail 
                workspaceId={currentWorkspace?.id}
                preloadedClicks={intelligenceData.recentClicks}
              />
            </div>
          </div>
        </div>
        )
      )}

      {activeTab === "attribution" && (
        <AttributionTabContent workspaceId={currentWorkspace?.id} />
      )}

      {activeTab === "sentinel" && (
        <div className="space-y-6">
          {/* Sentinel Saves Overview */}
          <SentinelSavesWidget workspaceId={currentWorkspace?.id} days={days} />

          {/* Sentinel Stats Cards */}
          <div className="grid lg:grid-cols-3 gap-4">
            <Card className="rounded-2xl border-border">
              <CardHeader className="pb-2">
                <CardDescription>total clicks saved</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-display font-bold text-foreground">
                  protecting visitors from dead ends
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-border">
              <CardHeader className="pb-2">
                <CardDescription>links with sentinel</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-display font-bold text-foreground">
                  configure sentinel on individual links
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-border">
              <CardHeader className="pb-2">
                <CardDescription>value protected</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-display font-bold text-emerald-500">
                  estimated revenue saved
                </p>
              </CardContent>
            </Card>
          </div>

          {/* How Sentinel Works */}
          <Card className="rounded-2xl border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                how sentinel protects your links
              </CardTitle>
              <CardDescription>
                intelligent preflight checks before every redirect
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <h4 className="font-semibold text-foreground mb-2">stock-aware routing</h4>
                  <p className="text-sm text-muted-foreground">
                    check shopify inventory and redirect to alternatives when out of stock
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <h4 className="font-semibold text-foreground mb-2">health preflight</h4>
                  <p className="text-sm text-muted-foreground">
                    verify destination is reachable before redirecting visitors
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <h4 className="font-semibold text-foreground mb-2">AI bot detection</h4>
                  <p className="text-sm text-muted-foreground">
                    serve structured JSON to GPT, Claude, and Perplexity crawlers
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <h4 className="font-semibold text-foreground mb-2">auto-heal</h4>
                  <p className="text-sm text-muted-foreground">
                    automatically find replacement URLs via sitemap when links break
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "advanced" && (
        <div className="space-y-6">
          {/* Advanced Features Grid */}
          <div className="grid gap-6">
            {/* Identity Graph - Full Width */}
            <Card className="rounded-2xl border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-emerald-500" />
                  identity graph
                </CardTitle>
                <CardDescription>
                  cross-device visitor identification and journey unification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={
                  <div className="flex items-center justify-center py-12">
                    <Network className="w-8 h-8 text-muted-foreground animate-pulse" />
                  </div>
                }>
                  <IdentityGraphView />
                </Suspense>
              </CardContent>
            </Card>

            {/* Lift Analysis & Velocity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="rounded-2xl border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    lift analysis
                  </CardTitle>
                  <CardDescription>
                    measure incremental impact of each channel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LiftAnalysis />
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-amber-500" />
                    velocity analytics
                  </CardTitle>
                  <CardDescription>
                    conversion speed and pipeline momentum
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <VelocityAnalytics />
                </CardContent>
              </Card>
            </div>

            {/* Topic Attribution */}
            <Card className="rounded-2xl border-border">
              <CardHeader>
                <CardTitle>topic attribution</CardTitle>
                <CardDescription>
                  content topic performance and engagement metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TopicAttributionView />
              </CardContent>
            </Card>

            {/* Offline Import */}
            <Card className="rounded-2xl border-border">
              <CardHeader>
                <CardTitle>offline import</CardTitle>
                <CardDescription>
                  reconcile CRM conversions and offline sales data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OfflineImporter />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Mobile Activity FAB */}
      <MobileActivitySheet workspaceId={currentWorkspace?.id} />

      {/* Detail Sheets */}
      <AttributionSheet
        isOpen={attributionSheetOpen}
        onClose={() => setAttributionSheetOpen(false)}
        workspaceId={currentWorkspace?.id}
        days={days}
      />
      <CampaignSheet
        isOpen={campaignSheetOpen}
        onClose={() => setCampaignSheetOpen(false)}
        workspaceId={currentWorkspace?.id}
        days={days}
      />
    </PageContentWrapper>
  );
}
