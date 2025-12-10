import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LazyBarChart, LazyPieChart, Bar, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LazyChartContainer } from "@/components/charts/LazyCharts";
import { subDays } from "date-fns";
import { ClicksOverTime } from "@/components/analytics/ClicksOverTime";
import { ConversionFunnel } from "@/components/analytics/ConversionFunnel";
import { useConversionMetrics } from "@/hooks/useConversionMetrics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrafficAnomalyDetector } from "@/components/links/TrafficAnomalyDetector";
import { StatisticalReadiness } from "@/components/links/StatisticalReadiness";
import { ClickTrendPredictor } from "@/components/links/ClickTrendPredictor";
import { LinkPeriodComparison } from "@/components/links/LinkPeriodComparison";
import { LinkTimingInsights } from "@/components/links/LinkTimingInsights";
import { ConversionProbability } from "@/components/links/ConversionProbability";
import { LinkAIInsights } from "@/components/links/LinkAIInsights";

interface LinkDetailAnalyticsProps {
  linkId: string;
}

export const LinkDetailAnalytics = ({ linkId }: LinkDetailAnalyticsProps) => {
  const [dateRange, setDateRange] = useState("30");
  const [selectedQRCode, setSelectedQRCode] = useState<string>("all");
  const conversionMetrics = useConversionMetrics(linkId);

  // Fetch link data to get workspace_id
  const { data: linkData } = useQuery({
    queryKey: ["link-data", linkId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("links")
        .select("workspace_id")
        .eq("id", linkId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Fetch QR codes for filtering
  const { data: qrCodes } = useQuery({
    queryKey: ["qr-codes-filter", linkId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("qr_codes")
        .select("id, name, variant_name")
        .eq("link_id", linkId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["link-analytics", linkId, dateRange, selectedQRCode],
    queryFn: async () => {
      const startDate = subDays(new Date(), parseInt(dateRange)).toISOString();

      let query = supabase
        .from("link_clicks")
        .select("*")
        .eq("link_id", linkId)
        .gte("clicked_at", startDate);

      // Filter by QR code if selected
      if (selectedQRCode !== "all") {
        query = query.eq("qr_code_id", selectedQRCode);
      }

      const { data: clicks, error } = await query;

      if (error) throw error;

      return clicks || [];
    },
  });

  if (isLoading) {
    return <div className="p-8 text-center text-secondary-label">loading analytics…</div>;
  }

  if (!analyticsData || analyticsData.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-secondary-label">No click data available for this link yet.</p>
      </div>
    );
  }

  // Process data
  const totalClicks = analyticsData.length;
  const uniqueClicks = new Set(analyticsData.map((c) => c.ip_address)).size;

  // Device breakdown
  const deviceData = analyticsData.reduce((acc: any, click) => {
    const device = click.device_type || "Unknown";
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {});

  const deviceChartData = Object.entries(deviceData).map(([name, value]) => ({ name, value }));

  // Browser breakdown
  const browserData = analyticsData.reduce((acc: any, click) => {
    const browser = click.browser || "Unknown";
    acc[browser] = (acc[browser] || 0) + 1;
    return acc;
  }, {});

  const browserChartData = Object.entries(browserData).map(([name, value]) => ({ name, value }));

  // Top referrers
  const referrerData = analyticsData.reduce((acc: any, click) => {
    const ref = click.referrer || "Direct";
    acc[ref] = (acc[ref] || 0) + 1;
    return acc;
  }, {});

  const topReferrers = Object.entries(referrerData)
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 5)
    .map(([name, clicks]) => ({ name, clicks }));

  // Top countries
  const countryData = analyticsData.reduce((acc: any, click) => {
    const country = click.country || "Unknown";
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {});

  const topCountries = Object.entries(countryData)
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 10)
    .map(([name, clicks]) => ({ name, clicks }));

  const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))", "hsl(var(--muted))"];

  return (
    <div className="space-y-6">
      {linkData && <ClicksOverTime workspaceId={linkData.workspace_id} linkId={linkId} />}
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">overview</TabsTrigger>
          <TabsTrigger value="timing">timing</TabsTrigger>
          <TabsTrigger value="audience">audience</TabsTrigger>
          <TabsTrigger value="conversions">conversions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* AI Insights for this link */}
          {linkData && (
            <LinkAIInsights linkId={linkId} workspaceId={linkData.workspace_id} />
          )}

          {/* Clean Track Intelligence */}
          <div className="space-y-2 mb-6">
            <h3 className="text-lg font-display font-semibold">clean track intelligence</h3>
            <p className="text-sm text-muted-foreground">AI-powered insights to keep your data quality high</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrafficAnomalyDetector linkId={linkId} />
            <StatisticalReadiness linkId={linkId} />
          </div>

          <ClickTrendPredictor linkId={linkId} />

          {/* Period Comparison */}
          {linkData && <LinkPeriodComparison workspaceId={linkData.workspace_id} linkId={linkId} />}

          {/* Stats Overview */}
          <div className="space-y-2 mt-8">
            <h3 className="text-lg font-display font-semibold">quick stats</h3>
            <p className="text-sm text-muted-foreground">overview of your link performance</p>
          </div>

      {/* Date Range Selector */}
      <div className="flex justify-between items-center flex-wrap gap-4 mt-4">
        <div className="flex gap-2">
          {qrCodes && qrCodes.length > 0 && (
            <Select value={selectedQRCode} onValueChange={setSelectedQRCode}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All QR codes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All QR codes</SelectItem>
                {qrCodes.map((qr) => (
                  <SelectItem key={qr.id} value={qr.id}>
                    {qr.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">total clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalClicks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">unique visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{uniqueClicks}</div>
          </CardContent>
        </Card>
      </div>
        </TabsContent>

        {/* Timing Tab */}
        <TabsContent value="timing" className="space-y-6">
          {linkData && <LinkTimingInsights workspaceId={linkData.workspace_id} linkId={linkId} />}
        </TabsContent>

        {/* Audience Tab */}
        <TabsContent value="audience" className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-display font-semibold">audience insights</h3>
            <p className="text-sm text-muted-foreground">understand who's clicking your links</p>
          </div>

      {/* Device Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>devices & browsers</CardTitle>
        </CardHeader>
        <CardContent>
          <LazyChartContainer height={300}>
            <ResponsiveContainer width="100%" height={300}>
              <LazyPieChart>
                <Pie data={deviceChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {deviceChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </LazyPieChart>
            </ResponsiveContainer>
          </LazyChartContainer>
        </CardContent>
      </Card>

      {/* Browser Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>top browsers</CardTitle>
        </CardHeader>
        <CardContent>
          <LazyChartContainer height={300}>
            <ResponsiveContainer width="100%" height={300}>
              <LazyBarChart data={browserChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </LazyBarChart>
            </ResponsiveContainer>
          </LazyChartContainer>
        </CardContent>
      </Card>

      {/* Top Referrers */}
      <Card>
        <CardHeader>
          <CardTitle>top referrers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topReferrers.map((ref: any) => (
              <div key={ref.name} className="flex justify-between items-center">
                <span className="text-sm truncate max-w-[300px]">{ref.name}</span>
                <span className="font-semibold">{ref.clicks}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Countries */}
      <Card>
        <CardHeader>
          <CardTitle>top countries</CardTitle>
        </CardHeader>
        <CardContent>
          <LazyChartContainer height={300}>
            <ResponsiveContainer width="100%" height={300}>
              <LazyBarChart data={topCountries} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="clicks" fill="hsl(var(--primary))" />
              </LazyBarChart>
            </ResponsiveContainer>
          </LazyChartContainer>
        </CardContent>
      </Card>
        </TabsContent>

        {/* Conversions Tab */}
        <TabsContent value="conversions" className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-display font-semibold">conversion tracking</h3>
            <p className="text-sm text-muted-foreground">track your funnel and estimate conversion probability</p>
          </div>

          {conversionMetrics.data && (
            <ConversionFunnel
              clicks={conversionMetrics.data.totalClicks}
              leads={conversionMetrics.data.leads}
              signups={conversionMetrics.data.signups}
              purchases={conversionMetrics.data.purchases}
              revenue={conversionMetrics.data.totalRevenue}
            />
          )}

          <ConversionProbability linkId={linkId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
