import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { StratifiedAnalyticsChart } from "@/components/analytics/StratifiedAnalyticsChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, CheckCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function AnalyticsPerformance() {
  const { currentWorkspace } = useWorkspaceContext();

  if (!currentWorkspace) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-12 pb-12">
        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
            fast insights
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            see your data instantly, even with millions of clicks
          </p>
        </div>

        {/* How It Works Card */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-xl font-display">
              how it works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium text-foreground">instant preview:</span>{" "}
                <span className="text-muted-foreground">we show you a quick preview first so you're never waiting.</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium text-foreground">precision update:</span>{" "}
                <span className="text-muted-foreground">exact numbers fill in automatically in the background.</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium text-foreground">always accurate:</span>{" "}
                <span className="text-muted-foreground">what you see is always reliable—no guessing.</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Demo */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-3xl font-display font-semibold">see it in action</h2>
            <Button variant="marketing" size="lg" asChild>
              <Link to="/dashboard/analytics">
                view full analytics
              </Link>
            </Button>
          </div>
          <StratifiedAnalyticsChart
            workspaceId={currentWorkspace.id}
            days={30}
          />
        </div>

        {/* Performance Metrics */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-border/40">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs uppercase tracking-wide">load time</CardDescription>
              <CardTitle className="text-4xl font-display">&lt;0.5s</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                initial render, even with millions of clicks
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs uppercase tracking-wide">data shown</CardDescription>
              <CardTitle className="text-4xl font-display">100%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                reliable insights without long waits
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs uppercase tracking-wide">accuracy</CardDescription>
              <CardTitle className="text-4xl font-display">exact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                precision backfill ensures accuracy
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Why This Matters */}
        <Card className="bg-muted/30 border-border/40">
          <CardHeader>
            <CardTitle className="text-2xl font-display">why this matters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-base text-muted-foreground leading-relaxed">
              traditional analytics dashboards slow down as your data grows. with fast insights, you get instant visibility into your campaigns no matter how much traffic you have.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              this means you can make decisions faster, spot trends sooner, and never wait for dashboards to load during critical campaign moments.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
