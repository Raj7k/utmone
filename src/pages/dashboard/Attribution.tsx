import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttributionModelSelector } from "@/components/analytics/AttributionModelSelector";
import { AttributionTable } from "@/components/analytics/AttributionTable";
import { JourneySankey } from "@/components/analytics/JourneySankey";
import { JourneyGraphViewer } from "@/components/analytics/JourneyGraphViewer";
import { StateValueHeatmap } from "@/components/analytics/StateValueHeatmap";
import { GoldenPathChart } from "@/components/analytics/GoldenPathChart";
import { useAttribution, useJourneyFlow, type AttributionModel } from "@/hooks/useAttribution";
import { useJourneyGraph, useDiscoverStructure } from "@/hooks/useJourneyGraph";
import { useWorkspace } from "@/hooks/useWorkspace";
import { subDays } from "date-fns";
import { Sparkles } from "lucide-react";

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

  // Calculate summary stats
  const totalConversions = attributionData?.reduce((sum, row) => sum + row.total_conversions, 0) || 0;
  const totalRevenue = attributionData?.reduce((sum, row) => sum + row.total_revenue, 0) || 0;
  const uniqueSources = new Set(attributionData?.map(row => row.source)).size;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">multi-touch attribution</h1>
        <p className="text-muted-foreground">
          understand which touchpoints drive conversions across the customer journey
        </p>
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

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              total conversions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              total revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              active sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueSources}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="attribution" className="space-y-4">
        <TabsList>
          <TabsTrigger value="attribution">attribution models</TabsTrigger>
          <TabsTrigger value="flow">journey flow</TabsTrigger>
          <TabsTrigger value="graph">journey graph</TabsTrigger>
          <TabsTrigger value="valuation">page valuation</TabsTrigger>
          <TabsTrigger value="golden-path">golden path</TabsTrigger>
        </TabsList>

        <TabsContent value="attribution" className="space-y-4">
          <AttributionTable data={attributionData || []} isLoading={isLoadingAttribution} />
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
            <Card>
              <CardHeader>
                <CardTitle>about mdp state valuation</CardTitle>
                <CardDescription>
                  how we calculate page value
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>
                  We use <strong>Markov Decision Process (MDP)</strong> with Value Iteration to calculate the expected future value of each page state.
                </p>
                <div>
                  <h4 className="font-medium mb-1">The Algorithm</h4>
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
                  <h4 className="font-medium mb-1">What It Means</h4>
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
            <Card>
              <CardHeader>
                <CardTitle>about pareto optimization</CardTitle>
                <CardDescription>
                  the efficient frontier explained
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>
                  We use <strong>Pareto Optimization</strong> to find paths that balance two conflicting objectives: speed (minimize steps) and value (maximize revenue).
                </p>
                <div>
                  <h4 className="font-medium mb-1">What Is Pareto Optimal?</h4>
                  <p className="text-muted-foreground">
                    A path is Pareto optimal (⭐ Golden) if no other path is both faster AND more valuable. These paths represent the "efficient frontier" of your funnel.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">The Insight</h4>
                  <p className="text-muted-foreground">
                    The fastest path might have low LTV. A longer path through high-value content (webinar, demo) can deliver 3x higher conversion value. Golden paths show you the optimal balance.
                  </p>
                </div>
                <div className="p-3 rounded-lg" style={{ background: 'rgba(59,130,246,0.1)' }}>
                  <p className="text-xs font-medium">💡 Pro Tip</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Send paid traffic to Golden Path entry points for maximum ROI, not just the shortest path to signup.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">about attribution models</CardTitle>
          <CardDescription>
            how we calculate credit for each touchpoint
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-1">linear attribution</h4>
            <p className="text-sm text-muted-foreground">
              gives equal credit to all touchpoints in the customer journey. best for understanding overall contribution.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-1">time decay</h4>
            <p className="text-sm text-muted-foreground">
              gives more credit to recent touchpoints using a 7-day half-life. best for understanding what drove the final decision.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-1">position-based (u-shaped)</h4>
            <p className="text-sm text-muted-foreground">
              gives 40% credit to first touchpoint, 40% to last touchpoint, and splits remaining 20% among middle touchpoints. best for balancing awareness and conversion.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Attribution;
