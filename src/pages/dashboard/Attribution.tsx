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
import { useAttribution, useJourneyFlow, useIdentityGraph, useTopicAttribution, type AttributionModel } from "@/hooks/useAttribution";
import { useJourneyGraph, useDiscoverStructure } from "@/hooks/useJourneyGraph";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useRealtimeIdentityGraph } from "@/hooks/useRealtimeIdentityGraph";
import { subDays } from "date-fns";
import { Sparkles, Radio, Network, TrendingUp, AlertCircle, ChevronDown, Upload, Clock, Tag, BarChart3, GitBranch, Route, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Attribution = () => {
  const { currentWorkspace } = useWorkspace();
  const [model, setModel] = useState<AttributionModel>("linear");
  const [dateRangeDays, setDateRangeDays] = useState<number>(30);
  
  // Collapsible states for Advanced tab
  const [identityOpen, setIdentityOpen] = useState(true);
  const [topicOpen, setTopicOpen] = useState(false);
  const [liftOpen, setLiftOpen] = useState(false);
  const [velocityOpen, setVelocityOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  
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

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">clean-track attribution</h1>
          <p className="text-muted-foreground">
            understand which touchpoints drive conversions across the customer journey
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isConnected && (
            <Badge variant="default" className="bg-green-500 text-white">
              <Radio className="h-3 w-3 mr-1 animate-pulse" />
              live
            </Badge>
          )}
          {liveCount > 0 && (
            <Badge variant="secondary">+{liveCount} this session</Badge>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <AttributionModelSelector value={model} onChange={setModel} />
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">date range</label>
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
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">overview</TabsTrigger>
          <TabsTrigger value="models">models</TabsTrigger>
          <TabsTrigger value="journey">journey</TabsTrigger>
          <TabsTrigger value="advanced">advanced</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  total conversions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{totalConversions}</div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  total revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">${totalRevenue.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  active sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{uniqueSources}</div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Network className="h-3 w-3" />
                  cross-device
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{identityCount}</div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  demand creators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">{demandCreators}</div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  needs review
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">{churnDrivers}</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Access Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">attribution models</p>
                    <p className="text-xs text-muted-foreground">linear, time-decay, position-based</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <GitBranch className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">journey flow</p>
                    <p className="text-xs text-muted-foreground">visualize customer paths</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                    <Network className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">cross-device identity</p>
                    <p className="text-xs text-muted-foreground">{identityCount} connections found</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors">
                    <Upload className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">offline import</p>
                    <p className="text-xs text-muted-foreground">reconcile CRM conversions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Attribution Table Preview */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">attribution by source</CardTitle>
              <CardDescription className="text-muted-foreground">
                top performing channels based on {model} model
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AttributionTable data={attributionData || []} isLoading={isLoadingAttribution} />
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
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-1 text-foreground">linear attribution</h4>
                <p className="text-sm text-muted-foreground">
                  gives equal credit to all touchpoints in the customer journey. best for understanding overall contribution.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1 text-foreground">time decay</h4>
                <p className="text-sm text-muted-foreground">
                  gives more credit to recent touchpoints using a 7-day half-life. best for understanding what drove the final decision.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1 text-foreground">position-based (u-shaped)</h4>
                <p className="text-sm text-muted-foreground">
                  gives 40% credit to first touchpoint, 40% to last touchpoint, and splits remaining 20% among middle touchpoints. best for balancing awareness and conversion.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* JOURNEY TAB */}
        <TabsContent value="journey" className="space-y-6">
          {/* Journey Flow */}
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

          {/* Journey Graph */}
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

          {/* Page Valuation & Golden Path */}
          <div className="grid gap-4 md:grid-cols-2">
            <StateValueHeatmap workspaceId={currentWorkspace?.id} />
            <GoldenPathChart workspaceId={currentWorkspace?.id} />
          </div>
        </TabsContent>

        {/* ADVANCED TAB - Collapsible Sections */}
        <TabsContent value="advanced" className="space-y-4">
          {/* Identity Graph */}
          <Collapsible open={identityOpen} onOpenChange={setIdentityOpen}>
            <Card className="bg-card border-border">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Network className="h-5 w-5 text-green-500" />
                      <div>
                        <CardTitle className="text-foreground">identity graph</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {identityCount} cross-device connections
                        </CardDescription>
                      </div>
                    </div>
                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${identityOpen ? 'rotate-180' : ''}`} />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <IdentityGraphView />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Topic Attribution */}
          <Collapsible open={topicOpen} onOpenChange={setTopicOpen}>
            <Card className="bg-card border-border">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Tag className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-foreground">topic attribution</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {topicCount} content topics tracked
                        </CardDescription>
                      </div>
                    </div>
                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${topicOpen ? 'rotate-180' : ''}`} />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <TopicAttributionView />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Lift Analysis */}
          <Collapsible open={liftOpen} onOpenChange={setLiftOpen}>
            <Card className="bg-card border-border">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      <div>
                        <CardTitle className="text-foreground">lift analysis</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {demandCreators} demand creators, {churnDrivers} need review
                        </CardDescription>
                      </div>
                    </div>
                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${liftOpen ? 'rotate-180' : ''}`} />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <LiftAnalysis />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Velocity Analytics */}
          <Collapsible open={velocityOpen} onOpenChange={setVelocityOpen}>
            <Card className="bg-card border-border">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-amber-500" />
                      <div>
                        <CardTitle className="text-foreground">velocity analytics</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          time-to-convert by channel
                        </CardDescription>
                      </div>
                    </div>
                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${velocityOpen ? 'rotate-180' : ''}`} />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <VelocityAnalytics />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Offline Import */}
          <Collapsible open={importOpen} onOpenChange={setImportOpen}>
            <Card className="bg-card border-border">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Upload className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-foreground">offline import</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          upload CRM data to reconcile offline conversions
                        </CardDescription>
                      </div>
                    </div>
                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${importOpen ? 'rotate-180' : ''}`} />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <OfflineImporter />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Attribution;
