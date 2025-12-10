import { useState } from "react";
import { useWorkspace } from "@/hooks/useWorkspace";
import { PageContentWrapper } from "@/components/layout/PageContentWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Network, TrendingUp, Activity } from "lucide-react";
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
import { IdentityGraphView } from "@/components/attribution/IdentityGraphView";
import { OfflineImporter } from "@/components/attribution/OfflineImporter";
import { LiftAnalysis } from "@/components/attribution/LiftAnalysis";
import { VelocityAnalytics } from "@/components/attribution/VelocityAnalytics";
import { TopicAttributionView } from "@/components/attribution/TopicAttributionView";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Intelligence() {
  const { currentWorkspace } = useWorkspace();
  const [period, setPeriod] = useState<PeriodOption>("7d");
  const [customRange, setCustomRange] = useState<{ from: Date; to: Date } | undefined>();
  const [context, setContext] = useState<IntelligenceContext>("all");
  const [attributionSheetOpen, setAttributionSheetOpen] = useState(false);
  const [campaignSheetOpen, setCampaignSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate days based on period or custom range
  const days = period === "custom" && customRange 
    ? Math.ceil((customRange.to.getTime() - customRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1
    : periodDays[period];

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
        />
      </div>

      {/* Main Content based on Tab */}
      {activeTab === "overview" && (
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-6 min-w-0">
            {/* Pulse Hero - Live Activity Bar */}
            <PulseHero
              workspaceId={currentWorkspace?.id}
              period={period}
              hidePeriodSelector
              customDays={days}
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
                />
              </div>

              {/* Performance Snapshot - Medium Card */}
              <div className="lg:col-span-1">
                <PerformanceSnapshot
                  workspaceId={currentWorkspace?.id}
                  days={days}
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
                />
              </div>
              <ChannelMixDonut
                workspaceId={currentWorkspace?.id}
                days={days}
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
                  <IdentityGraphView />
                </CardContent>
              </Card>
            )}

            {/* Tertiary Row - Geo */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <GeoHeatTiles
                workspaceId={currentWorkspace?.id}
                days={days}
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
              <LiveActivityRail workspaceId={currentWorkspace?.id} />
            </div>
          </div>
        </div>
      )}

      {activeTab === "attribution" && (
        <AttributionTabContent workspaceId={currentWorkspace?.id} />
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
                <IdentityGraphView />
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
