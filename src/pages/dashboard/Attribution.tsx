import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
import { Sparkles, Radio, Network, TrendingUp, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Attribution = () => {
  const { currentWorkspace } = useWorkspace();
  const [model, setModel] = useState<AttributionModel>("linear");
  const [dateRangeDays, setDateRangeDays] = useState<number>(30);
  
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

      <Tabs defaultValue="attribution" className="space-y-4">
        <TabsList className="flex-wrap">
          <TabsTrigger value="attribution">models</TabsTrigger>
          <TabsTrigger value="flow">journey flow</TabsTrigger>
          <TabsTrigger value="graph">journey graph</TabsTrigger>
          <TabsTrigger value="valuation">page valuation</TabsTrigger>
          <TabsTrigger value="golden-path">golden path</TabsTrigger>
          <TabsTrigger value="advanced">advanced</TabsTrigger>
          <TabsTrigger value="import">import</TabsTrigger>
        </TabsList>

        <TabsContent value="attribution" className="space-y-4">
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

        <TabsContent value="flow" className="space-y-4">
          <JourneySankey data={flowData || []} isLoading={isLoadingFlow} />
        </TabsContent>

        <TabsContent value="graph" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">
              automatic structure learning discovers nodes and edges from journey events
            </p>
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
          <JourneyGraphViewer
            nodes={graphData?.nodes || []}
            edges={graphData?.edges || []}
            isLoading={isLoadingGraph}
            workspaceId={currentWorkspace?.id}
          />
        </TabsContent>

        <TabsContent value="valuation" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <StateValueHeatmap workspaceId={currentWorkspace?.id} />
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">about mdp state valuation</CardTitle>
                <CardDescription className="text-muted-foreground">
                  how we calculate page value
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-foreground">
                  We use <strong>Markov Decision Process (MDP)</strong> with Value Iteration to calculate the expected future value of each page state.
                </p>
                <div>
                  <h4 className="font-medium mb-1 text-foreground">The Algorithm</h4>
                  <p className="text-muted-foreground">
                    V(s) = R(s) + γ × Σ P(s'|s) × V(s')
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1 mt-2">
                    <li>• R(s) = immediate reward (conversion = $100)</li>
                    <li>• γ = discount factor (0.95, future value decay)</li>
                    <li>• P(s'|s) = transition probability to next state</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-1 text-foreground">What It Means</h4>
                  <p className="text-muted-foreground">
                    A page worth $45 means users on that page have a 45% probability-weighted path to conversion. A 404 page showing $0 means the probability of reaching conversion from there drops to near zero.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="golden-path" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <GoldenPathChart workspaceId={currentWorkspace?.id} />
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">about pareto optimization</CardTitle>
                <CardDescription className="text-muted-foreground">
                  the efficient frontier explained
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-foreground">
                  We use <strong>Pareto Optimization</strong> to find paths that balance two conflicting objectives: speed (minimize steps) and value (maximize revenue).
                </p>
                <div>
                  <h4 className="font-medium mb-1 text-foreground">What Is Pareto Optimal?</h4>
                  <p className="text-muted-foreground">
                    A path is Pareto optimal (⭐ Golden) if no other path is both faster AND more valuable. These paths represent the "efficient frontier" of your funnel.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1 text-foreground">The Insight</h4>
                  <p className="text-muted-foreground">
                    The fastest path might have low LTV. A longer path through high-value content (webinar, demo) can deliver 3x higher conversion value. Golden paths show you the optimal balance.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-primary/10">
                  <p className="text-xs font-medium text-foreground">💡 Pro Tip</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Send paid traffic to Golden Path entry points for maximum ROI, not just the shortest path to signup.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <div className="grid gap-6">
            {/* Identity Graph */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  identity graph
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  cross-device visitor connections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <IdentityGraphView />
              </CardContent>
            </Card>

            {/* Topic Attribution */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">topic attribution</CardTitle>
                <CardDescription className="text-muted-foreground">
                  revenue by content category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TopicAttributionView />
              </CardContent>
            </Card>

            {/* Lift Analysis */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  lift analysis
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  incremental causal impact by channel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LiftAnalysis />
              </CardContent>
            </Card>

            {/* Velocity Analytics */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">velocity analytics</CardTitle>
                <CardDescription className="text-muted-foreground">
                  time-to-convert by channel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VelocityAnalytics />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          <OfflineImporter />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Attribution;
