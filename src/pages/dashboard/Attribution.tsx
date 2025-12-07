import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AttributionModelSelector } from "@/components/analytics/AttributionModelSelector";
import { AttributionTable } from "@/components/analytics/AttributionTable";
import { JourneySankey } from "@/components/analytics/JourneySankey";
import { JourneyGraphViewer } from "@/components/analytics/JourneyGraphViewer";
import { StateValueHeatmap } from "@/components/analytics/StateValueHeatmap";
import { GoldenPathChart } from "@/components/analytics/GoldenPathChart";
import { IdentityGraphView } from "@/components/attribution/IdentityGraphView";
import { OfflineImporter } from "@/components/attribution/OfflineImporter";
import { TopicAttributionView } from "@/components/attribution/TopicAttributionView";
import { VelocityAnalytics } from "@/components/attribution/VelocityAnalytics";
import { LiftAnalysis } from "@/components/attribution/LiftAnalysis";
import { RevenueHeroCard } from "@/components/attribution/RevenueHeroCard";
import { TopChannelsChart } from "@/components/attribution/TopChannelsChart";
import { QuickInsightsCard } from "@/components/attribution/QuickInsightsCard";
import { TestDataGenerator } from "@/components/attribution/TestDataGenerator";
import { useAttribution, useJourneyFlow, useIdentityGraph, useTopicAttribution, type AttributionModel } from "@/hooks/useAttribution";
import { useJourneyGraph, useDiscoverStructure } from "@/hooks/useJourneyGraph";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useRealtimeIdentityGraph } from "@/hooks/useRealtimeIdentityGraph";
import { useQueryClient } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { 
  Sparkles, Radio, Network, TrendingUp, Clock, Upload, Tag, 
  BarChart3, GitBranch, Route, Star, PieChart, Map, ArrowRight,
  Eye, ChevronRight, DollarSign, FlaskConical, ChevronDown
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Attribution = () => {
  const { currentWorkspace } = useWorkspace();
  const queryClient = useQueryClient();
  const [model, setModel] = useState<AttributionModel>("linear");
  const [dateRangeDays, setDateRangeDays] = useState<number>(30);
  const [activeTab, setActiveTab] = useState("overview");
  const [showTestGenerator, setShowTestGenerator] = useState(true);
  
  const dateRange = {
    from: subDays(new Date(), dateRangeDays),
    to: new Date(),
  };

  const { data: attributionData, isLoading: isLoadingAttribution } = useAttribution(
    currentWorkspace?.id,
    model,
    dateRange.from,
    dateRange.to
  );

  const { data: flowData, isLoading: isLoadingFlow } = useJourneyFlow(
    currentWorkspace?.id,
    dateRange.from,
    dateRange.to
  );

  const { data: graphData, isLoading: isLoadingGraph } = useJourneyGraph(
    currentWorkspace?.id,
    0.5
  );

  const { mutate: discoverStructure, isPending: isDiscovering } = useDiscoverStructure();

  // Advanced attribution data
  const { data: edges } = useIdentityGraph(currentWorkspace?.id);
  const { data: topics } = useTopicAttribution(currentWorkspace?.id);
  const { isConnected, liveCount } = useRealtimeIdentityGraph(currentWorkspace?.id);

  // Lift data for summary
  const { data: liftData } = useQuery({
    queryKey: ['lift-analysis', currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return [];
      const { data, error } = await supabase.rpc('get_channel_lift', {
        p_workspace_id: currentWorkspace.id
      });
      if (error) throw error;
      return data || [];
    },
    enabled: !!currentWorkspace?.id,
  });

  // Calculate summary stats
  const totalConversions = attributionData?.reduce((sum, row) => sum + row.total_conversions, 0) || 0;
  const totalRevenue = attributionData?.reduce((sum, row) => sum + row.total_revenue, 0) || 0;
  const uniqueSources = new Set(attributionData?.map(row => row.source)).size;

  // Advanced stats
  const identityCount = edges?.length || 0;
  const topicCount = topics?.length || 0;
  const demandCreators = liftData?.filter((l: any) => l.lift_category === 'positive')?.length || 0;
  const churnDrivers = liftData?.filter((l: any) => l.lift_category === 'negative')?.length || 0;

  // Top channel
  const topChannel = attributionData && attributionData.length > 0
    ? [...attributionData].sort((a, b) => b.total_revenue - a.total_revenue)[0]?.source
    : undefined;

  // Navigate to tab helper
  const navigateToTab = (tab: string) => setActiveTab(tab);

  // Refresh all attribution data
  const handleTestDataComplete = () => {
    queryClient.invalidateQueries({ queryKey: ['attribution'] });
    queryClient.invalidateQueries({ queryKey: ['journey-flow'] });
    queryClient.invalidateQueries({ queryKey: ['journey-graph'] });
    queryClient.invalidateQueries({ queryKey: ['identity-graph'] });
    queryClient.invalidateQueries({ queryKey: ['topic-attribution'] });
    queryClient.invalidateQueries({ queryKey: ['lift-analysis'] });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">revenue attribution</h1>
          <p className="text-muted-foreground">
            track which touchpoints drive revenue across the customer journey
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isConnected && (
            <Badge variant="default" className="bg-emerald-500 text-white">
              <Radio className="h-3 w-3 mr-1 animate-pulse" />
              live
            </Badge>
          )}
          {liveCount > 0 && (
            <Badge variant="secondary">+{liveCount} this session</Badge>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <AttributionModelSelector value={model} onChange={setModel} />
        <Select value={dateRangeDays.toString()} onValueChange={(v) => setDateRangeDays(parseInt(v))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">last 7 days</SelectItem>
            <SelectItem value="30">last 30 days</SelectItem>
            <SelectItem value="90">last 90 days</SelectItem>
          <SelectItem value="365">last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Test Data Generator - Collapsible */}
      {totalConversions === 0 && (
        <Collapsible open={showTestGenerator} onOpenChange={setShowTestGenerator}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-transparent">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FlaskConical className="h-4 w-4 text-amber-500" />
                <span>no attribution data yet? generate sample data to explore features</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showTestGenerator ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <TestDataGenerator 
              workspaceId={currentWorkspace?.id}
              onComplete={handleTestDataComplete}
            />
          </CollapsibleContent>
        </Collapsible>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="overview" className="gap-2">
            <PieChart className="h-4 w-4" />
            overview
          </TabsTrigger>
          <TabsTrigger value="models" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            models
          </TabsTrigger>
          <TabsTrigger value="journey" className="gap-2">
            <GitBranch className="h-4 w-4" />
            journey
          </TabsTrigger>
          <TabsTrigger value="advanced" className="gap-2">
            <Network className="h-4 w-4" />
            advanced
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB - Redesigned Bento Layout */}
        <TabsContent value="overview" className="space-y-6">
          {/* Revenue Hero Card - Full Width */}
          <RevenueHeroCard 
            totalRevenue={totalRevenue}
            conversions={totalConversions}
            isLoading={isLoadingAttribution}
          />

          {/* Stat Cards Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-card border-border hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <DollarSign className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">active sources</p>
                    <p className="text-2xl font-bold text-foreground">{uniqueSources}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <Network className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">cross-device</p>
                    <p className="text-2xl font-bold text-foreground">{identityCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">demand creators</p>
                    <p className="text-2xl font-bold text-emerald-500">{demandCreators}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <Tag className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">content topics</p>
                    <p className="text-2xl font-bold text-foreground">{topicCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Two Column: Charts + Quick Insights */}
          <div className="grid md:grid-cols-5 gap-6">
            <div className="md:col-span-3">
              <TopChannelsChart data={attributionData || []} isLoading={isLoadingAttribution} />
            </div>
            <div className="md:col-span-2">
              <QuickInsightsCard 
                demandCreators={demandCreators}
                churnDrivers={churnDrivers}
                topChannel={topChannel}
                isLoading={isLoadingAttribution}
              />
            </div>
          </div>

          {/* Quick Access Cards - Clickable Navigation */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <button 
              onClick={() => navigateToTab("models")}
              className="text-left"
            >
              <Card className="bg-card border-border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group h-full">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <BarChart3 className="h-5 w-5 text-primary" />
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="font-medium text-foreground mb-1">attribution models</p>
                  <p className="text-xs text-muted-foreground">linear, time-decay, position-based</p>
                </CardContent>
              </Card>
            </button>

            <button 
              onClick={() => navigateToTab("journey")}
              className="text-left"
            >
              <Card className="bg-card border-border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group h-full">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                      <GitBranch className="h-5 w-5 text-purple-500" />
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-purple-500 transition-colors" />
                  </div>
                  <p className="font-medium text-foreground mb-1">journey flow</p>
                  <p className="text-xs text-muted-foreground">visualize customer paths</p>
                </CardContent>
              </Card>
            </button>

            <button 
              onClick={() => navigateToTab("advanced")}
              className="text-left"
            >
              <Card className="bg-card border-border hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer group h-full">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                      <Network className="h-5 w-5 text-emerald-500" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {identityCount}
                    </Badge>
                  </div>
                  <p className="font-medium text-foreground mb-1">cross-device identity</p>
                  <p className="text-xs text-muted-foreground">{identityCount} connections found</p>
                </CardContent>
              </Card>
            </button>

            <button 
              onClick={() => navigateToTab("advanced")}
              className="text-left"
            >
              <Card className="bg-card border-border hover:border-amber-500/50 hover:shadow-md transition-all cursor-pointer group h-full">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors">
                      <Upload className="h-5 w-5 text-amber-500" />
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-amber-500 transition-colors" />
                  </div>
                  <p className="font-medium text-foreground mb-1">offline import</p>
                  <p className="text-xs text-muted-foreground">reconcile CRM conversions</p>
                </CardContent>
              </Card>
            </button>
          </div>

          {/* Attribution Table Preview */}
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-foreground">attribution by source</CardTitle>
                <CardDescription className="text-muted-foreground">
                  top performing channels based on {model} model
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigateToTab("models")} className="gap-1">
                view all <ArrowRight className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent>
              <AttributionTable data={attributionData?.slice(0, 5) || []} isLoading={isLoadingAttribution} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* MODELS TAB */}
        <TabsContent value="models" className="space-y-4">
          <AttributionTable data={attributionData || []} isLoading={isLoadingAttribution} />
          
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">about attribution models</CardTitle>
              <CardDescription className="text-muted-foreground">
                how we calculate credit for each touchpoint
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6">
              <div className="p-4 rounded-lg bg-muted/30 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-primary/10">
                    <BarChart3 className="h-4 w-4 text-primary" />
                  </div>
                  <h4 className="font-medium text-foreground">linear attribution</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  gives equal credit to all touchpoints. best for understanding overall contribution.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-amber-500/10">
                    <Clock className="h-4 w-4 text-amber-500" />
                  </div>
                  <h4 className="font-medium text-foreground">time decay</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  gives more credit to recent touchpoints (7-day half-life). best for final decision analysis.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-purple-500/10">
                    <Star className="h-4 w-4 text-purple-500" />
                  </div>
                  <h4 className="font-medium text-foreground">position-based</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  40% first, 40% last, 20% middle. best for balancing awareness and conversion.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* JOURNEY TAB */}
        <TabsContent value="journey" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                journey flow
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                visualize how users move through touchpoints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <JourneySankey data={flowData || []} isLoading={isLoadingFlow} />
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Route className="h-5 w-5" />
                    journey graph
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    automatic structure learning discovers nodes and edges from journey events
                  </CardDescription>
                </div>
                <Button
                  onClick={() =>
                    currentWorkspace?.id &&
                    discoverStructure({
                      workspaceId: currentWorkspace.id,
                      lookbackDays: dateRangeDays,
                    })
                  }
                  disabled={isDiscovering || !currentWorkspace?.id}
                  variant="outline"
                  size="sm"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isDiscovering ? "discovering..." : "discover structure"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <JourneyGraphViewer
                nodes={graphData?.nodes || []}
                edges={graphData?.edges || []}
                isLoading={isLoadingGraph}
                workspaceId={currentWorkspace?.id}
              />
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <StateValueHeatmap workspaceId={currentWorkspace?.id} />
            <GoldenPathChart workspaceId={currentWorkspace?.id} />
          </div>
        </TabsContent>

        {/* ADVANCED TAB - 2-Column Grid Layout */}
        <TabsContent value="advanced" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Identity Graph */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10">
                      <Network className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <CardTitle className="text-foreground text-base">identity graph</CardTitle>
                      <CardDescription className="text-muted-foreground text-sm">
                        {identityCount} cross-device connections
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary">{identityCount}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <IdentityGraphView />
              </CardContent>
            </Card>

            {/* Topic Attribution */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Tag className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-foreground text-base">topic attribution</CardTitle>
                      <CardDescription className="text-muted-foreground text-sm">
                        {topicCount} content topics tracked
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary">{topicCount}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <TopicAttributionView />
              </CardContent>
            </Card>

            {/* Lift Analysis */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10">
                      <TrendingUp className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <CardTitle className="text-foreground text-base">lift analysis</CardTitle>
                      <CardDescription className="text-muted-foreground text-sm">
                        {demandCreators} demand creators, {churnDrivers} need review
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Badge variant="default" className="bg-emerald-500">{demandCreators}</Badge>
                    {churnDrivers > 0 && <Badge variant="destructive">{churnDrivers}</Badge>}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <LiftAnalysis />
              </CardContent>
            </Card>

            {/* Velocity Analytics */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10">
                      <Clock className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <CardTitle className="text-foreground text-base">velocity analytics</CardTitle>
                      <CardDescription className="text-muted-foreground text-sm">
                        time-to-convert by channel
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <VelocityAnalytics />
              </CardContent>
            </Card>
          </div>

          {/* Offline Import - Full Width */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Upload className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <CardTitle className="text-foreground">offline import</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    upload CRM data to reconcile offline conversions with web journeys
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <OfflineImporter />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Attribution;
