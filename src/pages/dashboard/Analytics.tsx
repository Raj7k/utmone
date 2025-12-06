import { useEffect } from "react";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useActivationTracking } from "@/hooks/useActivationTracking";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { TrendingUp, Activity, Sparkles, Link as LinkIcon } from "lucide-react";
import { useRealAnalytics } from "@/hooks/useRealAnalytics";
import { LazyPieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, LazyChartContainer } from "@/components/charts/LazyCharts";
import { Link } from "react-router-dom";
import { TrafficForecastChart } from "@/components/analytics/TrafficForecastChart";
import { ParetoFrontier } from "@/components/analytics/ParetoFrontier";
import { useTrafficForecast } from "@/hooks/useTrafficForecast";
import { useCampaignPerformance } from "@/hooks/useCampaignPerformance";
import { PageHeader } from "@/components/layout/PageHeader";

const COLORS = {
  mobile: "hsl(var(--primary))",
  desktop: "hsl(var(--accent))",
  tablet: "hsl(var(--secondary))",
  unknown: "hsl(var(--muted))"
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Analytics() {
  const { currentWorkspace } = useWorkspace();
  const { trackFirstAnalyticsView } = useActivationTracking();
  const { data: analytics, isLoading, error } = useRealAnalytics({ 
    workspaceId: currentWorkspace?.id || '',
    dateRange: 30 
  });
  
  // Feature 2: Traffic Forecasting
  const { data: forecastData } = useTrafficForecast(currentWorkspace?.id || '', 7);
  
  // Feature 3: Pareto Optimization
  const { data: campaignPerformance } = useCampaignPerformance(currentWorkspace?.id || '');

  useEffect(() => {
    trackFirstAnalyticsView();
  }, [trackFirstAnalyticsView]);

  if (!currentWorkspace || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'rgba(59,130,246,1)' }} />
          <p className="text-sm text-secondary-label">loading analytics…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-sm text-destructive">failed to load analytics</p>
      </div>
    );
  }

  // Empty state
  if (analytics?.isEmpty) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-label mb-2">analytics</h1>
          <p className="text-sm text-secondary-label">
            real-time insights into your link performance
          </p>
        </div>

        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-label mb-2">no data yet</h3>
              <p className="text-sm text-secondary-label max-w-md mx-auto">
                your click data will appear here once your links start getting traffic. share your first link to see real-time insights.
              </p>
            </div>
            <Button asChild className="mt-2">
              <Link to="/dashboard">
                <LinkIcon className="h-4 w-4 mr-2" />
                create your first link
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="analytics"
        description="real-time insights, traffic forecasting, and campaign optimization"
        breadcrumbs={[{ label: "analytics" }]}
      />
      <div className="hidden">
        <h1 className="text-4xl font-bold text-label mb-2">analytics</h1>
        <p className="text-sm text-secondary-label">
          real-time insights into your link performance
        </p>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 rounded-2xl shadow-sm border-border">
          <div className="text-sm text-secondary-label mb-2">total clicks</div>
          <div className="text-4xl font-bold text-label tracking-tight">
            {analytics.totalClicks.toLocaleString()}
          </div>
        </Card>
        <Card className="p-6 rounded-2xl shadow-sm border-border">
          <div className="text-sm text-secondary-label mb-2">unique visitors</div>
          <div className="text-4xl font-bold text-label tracking-tight">
            {analytics.uniqueVisitors.toLocaleString()}
          </div>
        </Card>
        <Card className="p-6 rounded-2xl shadow-sm border-border">
          <div className="text-sm text-secondary-label mb-2">click rate</div>
          <div className="text-4xl font-bold text-label tracking-tight">
            {analytics.clickRate}
          </div>
        </Card>
      </div>

      {/* AI Insights */}
      {analytics.insights && analytics.insights.length > 0 && (
        <Card className="rounded-2xl shadow-sm" style={{ background: 'linear-gradient(to bottom right, rgba(59,130,246,0.05), rgba(139,92,246,0.05))', borderColor: 'rgba(59,130,246,0.2)' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" style={{ color: 'rgba(59,130,246,1)' }} />
              ai insights
            </CardTitle>
            <CardDescription>powered by your real data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: 'rgba(59,130,246,1)' }} />
                  <p className="text-sm text-label">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Google-Style Tabs */}
      <Tabs defaultValue="when" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 rounded-2xl">
          <TabsTrigger value="when">when</TabsTrigger>
          <TabsTrigger value="where">where</TabsTrigger>
          <TabsTrigger value="who">who</TabsTrigger>
          <TabsTrigger value="trajectory">trajectory</TabsTrigger>
          <TabsTrigger value="optimize">optimize</TabsTrigger>
        </TabsList>

        <TabsContent value="when">
          <Card className="rounded-2xl shadow-sm border-border">
            <CardHeader>
              <CardTitle>activity heatmap</CardTitle>
              <CardDescription>when your audience is most active</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.heatmapData.length > 0 ? (
                <div className="overflow-x-auto">
                  <div className="inline-block min-w-full">
                    {/* Hour labels */}
                    <div className="flex mb-2">
                      <div className="w-16" />
                      {Array.from({ length: 24 }, (_, i) => (
                        <div key={i} className="w-8 text-center text-xs text-secondary-label">
                          {i % 3 === 0 ? `${i}` : ""}
                        </div>
                      ))}
                    </div>

                    {/* Heatmap rows */}
                    {DAYS.map((day, dayIndex) => (
                      <div key={dayIndex} className="flex items-center mb-1">
                        <div className="w-16 text-xs font-medium text-secondary-label">
                          {day}
                        </div>
                        <div className="flex gap-1">
                          {Array.from({ length: 24 }, (_, hourIndex) => {
                            const cell = analytics.heatmapData.find(
                              c => c.day === dayIndex && c.hour === hourIndex
                            );
                            const clicks = cell?.clicks || 0;
                            const intensity = cell?.intensity || 0;

                            const getColor = (intensity: number) => {
                              if (intensity === 0) return "bg-muted";
                              if (intensity < 0.25) return "opacity-20";
                              if (intensity < 0.5) return "opacity-40";
                              if (intensity < 0.75) return "opacity-60";
                              return "opacity-100";
                            };
                            const baseStyle = { background: intensity > 0 ? 'rgba(59,130,246,1)' : undefined };

                            return (
                              <div
                                key={hourIndex}
                                className={`w-8 h-8 rounded ${getColor(intensity)} 
                                  transition-all hover:ring-2 hover:ring-offset-1 
                                  cursor-pointer relative group`}
                                style={{ ...baseStyle, '--tw-ring-color': 'rgba(59,130,246,1)' } as React.CSSProperties}
                                title={`${day}, ${hourIndex}:00 - ${clicks} clicks`}
                              >
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                                  hidden group-hover:block bg-popover text-popover-foreground 
                                  text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                                  {day}, {hourIndex}:00
                                  <br />
                                  <span className="font-semibold">{clicks} clicks</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-4 text-xs text-secondary-label pt-4 border-t mt-4">
                    <span>less</span>
                    <div className="flex gap-1">
                      <div className="w-4 h-4 rounded bg-muted" />
                      <div className="w-4 h-4 rounded" style={{ background: 'rgba(59,130,246,0.2)' }} />
                      <div className="w-4 h-4 rounded" style={{ background: 'rgba(59,130,246,0.4)' }} />
                      <div className="w-4 h-4 rounded" style={{ background: 'rgba(59,130,246,0.6)' }} />
                      <div className="w-4 h-4 rounded" style={{ background: 'rgba(59,130,246,1)' }} />
                    </div>
                    <span>more</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-secondary-label text-center py-8">no timing data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="where">
          <div className="grid gap-6">
            <Card className="rounded-2xl shadow-sm border-border">
              <CardHeader>
                <CardTitle>top countries</CardTitle>
                <CardDescription>where your audience is located</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.topCountries.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.topCountries.map((country, index) => (
                      <div key={country.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-secondary-label w-6">
                            #{index + 1}
                          </span>
                          <span className="text-sm text-label">{country.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-label">
                          {country.clicks.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-secondary-label text-center py-8">no geographic data available</p>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm border-border">
              <CardHeader>
                <CardTitle>top cities</CardTitle>
                <CardDescription>most active cities</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.topCities.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.topCities.slice(0, 5).map((city, index) => (
                      <div key={city.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-secondary-label w-6">
                            #{index + 1}
                          </span>
                          <span className="text-sm text-label">{city.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-label">
                          {city.clicks.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-secondary-label text-center py-8">no city data available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="who">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="rounded-2xl shadow-sm border-border">
              <CardHeader>
                <CardTitle>devices</CardTitle>
                <CardDescription>mobile vs desktop breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.devices.length > 0 ? (
                  <LazyChartContainer height={300}>
                    <ResponsiveContainer width="100%" height={300}>
                      <LazyPieChart>
                        <Pie
                          data={analytics.devices}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {analytics.devices.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS] || COLORS.unknown} 
                            />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </LazyPieChart>
                    </ResponsiveContainer>
                  </LazyChartContainer>
                ) : (
                  <p className="text-sm text-secondary-label text-center py-8">no device data available</p>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm border-border">
              <CardHeader>
                <CardTitle>top referrers</CardTitle>
                <CardDescription>where your traffic comes from</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.topReferrers.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.topReferrers.map((referrer, index) => (
                      <div key={referrer.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-secondary-label w-6">
                            #{index + 1}
                          </span>
                          <span className="text-sm text-label truncate max-w-[200px]">
                            {referrer.name}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-label">
                          {referrer.value.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-secondary-label text-center py-8">no referrer data available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trajectory">
          <TrafficForecastChart
            historical={forecastData?.historical || []}
            forecast={forecastData?.forecast || []}
            needsMoreData={forecastData?.needsMoreData || true}
          />
        </TabsContent>

        <TabsContent value="optimize">
          {campaignPerformance && campaignPerformance.length > 0 ? (
            <ParetoFrontier links={campaignPerformance} />
          ) : (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-label mb-2">no campaign data yet</h3>
                <p className="text-sm text-secondary-label max-w-md mx-auto">
                  campaign optimization insights will appear here once you have links with conversions.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
