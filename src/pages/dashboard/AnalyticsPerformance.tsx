import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { StratifiedAnalyticsChart } from "@/components/analytics/StratifiedAnalyticsChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Zap, TrendingUp, Database } from "lucide-react";

export default function AnalyticsPerformance() {
  const { currentWorkspace } = useWorkspaceContext();

  if (!currentWorkspace) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-display font-bold tracking-tight">
            analytics performance
          </h1>
          <p className="text-muted-foreground">
            instant analytics powered by stratified sampling
          </p>
        </div>

        {/* Info Card */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Info className="h-5 w-5 text-primary" />
              how stratified sampling works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium text-foreground">Fast View (0.5s):</span> We sample 10% of your click data using PostgreSQL's TABLESAMPLE for instant visualization. You see estimated metrics with a ±15% confidence interval.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Database className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium text-foreground">Precision Backfill (background):</span> While you're viewing the fast estimate, we query the full dataset in the background. The chart seamlessly updates to exact numbers.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium text-foreground">Result:</span> Even with 10M+ clicks, your dashboard feels instant. No 10-second load times. Stratified sampling provides mathematically sound estimates that converge to truth.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Demo */}
        <div className="space-y-4">
          <h2 className="text-2xl font-display font-semibold">live performance demo</h2>
          <StratifiedAnalyticsChart
            workspaceId={currentWorkspace.id}
            days={30}
          />
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardDescription>sample rate</CardDescription>
              <CardTitle className="text-3xl font-display">10%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Only 10% of data needed for fast preview
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>confidence level</CardDescription>
              <CardTitle className="text-3xl font-display">95%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Statistical accuracy guarantee
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>load time</CardDescription>
              <CardTitle className="text-3xl font-display">&lt;0.5s</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Initial render even with millions of clicks
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Technical Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">technical implementation</CardTitle>
            <CardDescription>
              Based on stratified sampling from "Algorithms for Optimization" (Chapter 16)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">SQL Strategy</h4>
              <code className="text-xs bg-muted p-2 rounded block">
                SELECT * FROM link_clicks TABLESAMPLE SYSTEM (10)
              </code>
              <p className="text-sm text-muted-foreground mt-2">
                TABLESAMPLE grabs random disk blocks (not rows), providing unbiased sample in milliseconds
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Estimation Formula</h4>
              <code className="text-xs bg-muted p-2 rounded block">
                Estimated Total = Sample Count × (100 / Sample Rate)
              </code>
              <p className="text-sm text-muted-foreground mt-2">
                Multiply sampled results by 10 to estimate full dataset with ±confidence margin
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Progressive Enhancement</h4>
              <p className="text-sm text-muted-foreground">
                Fast view renders with dashed lines and confidence intervals. Precise data backfills seamlessly with solid lines and exact counts.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
