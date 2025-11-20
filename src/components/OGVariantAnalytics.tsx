import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useOGVariantAnalytics } from "@/hooks/useOGVariants";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface OGVariantAnalyticsProps {
  linkId: string;
}

export const OGVariantAnalytics = ({ linkId }: OGVariantAnalyticsProps) => {
  const { data: analytics, isLoading } = useOGVariantAnalytics(linkId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Variant Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">Loading analytics...</div>
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
          <div className="text-center py-8 text-muted-foreground">
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
        <CardTitle>Variant Performance</CardTitle>
        <CardDescription>
          A/B test results showing clicks per variant
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Total Clicks</p>
              <p className="text-2xl font-bold">{totalClicks}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Variants Tested</p>
              <p className="text-2xl font-bold">{analytics.length}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Best Performer</p>
              <p className="text-lg font-semibold truncate">{analytics[0]?.variantName}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Win Rate</p>
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
                    <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</p>
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
