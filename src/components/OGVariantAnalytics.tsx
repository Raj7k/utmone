import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useOGVariantAnalytics, useABTestStatus, useCheckABTests } from "@/hooks/useOGVariants";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface OGVariantAnalyticsProps {
  linkId: string;
}

export const OGVariantAnalytics = ({ linkId }: OGVariantAnalyticsProps) => {
  const { data: analytics, isLoading } = useOGVariantAnalytics(linkId);
  const { data: testStatus } = useABTestStatus(linkId);
  const checkTests = useCheckABTests();

  // Calculate statistical significance (z-test for proportions)
  const calculateSignificance = () => {
    if (!analytics || analytics.length < 2) return null;
    
    const totalClicks = analytics.reduce((sum, v) => sum + v.clicks, 0);
    const winner = analytics[0];
    const runnerUp = analytics[1];
    
    if (totalClicks < 30) return null; // Need minimum sample size
    
    const p1 = winner.clicks / totalClicks;
    const p2 = runnerUp.clicks / totalClicks;
    const pooledP = (winner.clicks + runnerUp.clicks) / totalClicks;
    const se = Math.sqrt(pooledP * (1 - pooledP) * (2 / totalClicks));
    const zScore = (p1 - p2) / se;
    
    // Calculate p-value (approximation)
    const absZ = Math.abs(zScore);
    const t = 1 / (1 + 0.2316419 * absZ);
    const d = 0.3989423 * Math.exp(-absZ * absZ / 2);
    const pValue = 2 * d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    const confidence = 1 - pValue;
    
    return {
      confidence,
      isSignificant: confidence >= (testStatus?.ab_test_confidence_threshold || 0.95),
      zScore,
    };
  };

  const significance = calculateSignificance();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Variant Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-secondary-label">loading analytics…</div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics || analytics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Variant Performance</CardTitle>
          <CardDescription>
            Track which preview variant generates more clicks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-secondary-label">
            <p>No data yet.</p>
            <p className="text-sm mt-2">Clicks will appear here once users interact with your variants.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalClicks = analytics.reduce((sum, v) => sum + v.clicks, 0);
  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Variant Performance</CardTitle>
            <CardDescription>
              A/B test results showing clicks per variant
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {testStatus?.ab_test_status === 'running' && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Test Running
              </Badge>
            )}
            {testStatus?.ab_test_status === 'completed' && (
              <Badge variant="secondary" className="bg-accent/10 text-accent">
                <Trophy className="h-3 w-3 mr-1" />
                Winner Declared
              </Badge>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => checkTests.mutate()}
              disabled={checkTests.isPending}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${checkTests.isPending ? 'animate-spin' : ''}`} />
              Check Tests
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Test Status Alert */}
          {testStatus?.ab_test_status === 'completed' && testStatus.ab_test_winner_id && (
            <Alert className="border-accent bg-accent/5">
              <Trophy className="h-4 w-4 text-accent" />
              <AlertTitle>Winner Automatically Declared!</AlertTitle>
              <AlertDescription>
                The winning variant has been automatically set as the default Open Graph preview with {((significance?.confidence || 0) * 100).toFixed(2)}% confidence.
                The link now uses this variant for all social media shares.
              </AlertDescription>
            </Alert>
          )}

          {testStatus?.ab_test_status === 'running' && significance && (
            <Alert className={significance.isSignificant ? "border-accent bg-accent/5" : "border-primary bg-primary/5"}>
              <AlertTitle>
                {significance.isSignificant ? "Statistical Significance Reached!" : "Test In Progress"}
              </AlertTitle>
              <AlertDescription>
                Current confidence: {(significance.confidence * 100).toFixed(2)}% 
                (threshold: {((testStatus?.ab_test_confidence_threshold || 0.95) * 100).toFixed(0)}%)
                {significance.isSignificant && (
                  <span className="block mt-1">Winner will be declared automatically on next check.</span>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-secondary-label">Total Clicks</p>
              <p className="text-2xl font-bold">{totalClicks}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-secondary-label">Variants Tested</p>
              <p className="text-2xl font-bold">{analytics.length}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-secondary-label">Best Performer</p>
              <p className="text-lg font-semibold truncate">{analytics[0]?.variantName}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-secondary-label">Win Rate</p>
              <p className="text-2xl font-bold">
                {totalClicks > 0 ? Math.round((analytics[0]?.clicks / totalClicks) * 100) : 0}%
              </p>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="variantName" 
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
                />
                <Bar dataKey="clicks" radius={[8, 8, 0, 0]}>
                  {analytics.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed List */}
          <div className="space-y-2">
            {analytics.map((variant, index) => {
              const percentage = totalClicks > 0 ? (variant.clicks / totalClicks) * 100 : 0;
              return (
                <div key={variant.variantId} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{variant.variantName}</span>
                      {index === 0 && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                          Winner
                        </span>
                      )}
                    </div>
                    <div className="w-full bg-background rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <p className="text-2xl font-bold">{variant.clicks}</p>
                    <p className="text-xs text-secondary-label">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
