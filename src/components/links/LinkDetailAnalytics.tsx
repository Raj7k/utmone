import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { subDays } from "date-fns";

interface LinkDetailAnalyticsProps {
  linkId: string;
}

export const LinkDetailAnalytics = ({ linkId }: LinkDetailAnalyticsProps) => {
  const [dateRange, setDateRange] = useState("30");

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["link-analytics", linkId, dateRange],
    queryFn: async () => {
      const startDate = subDays(new Date(), parseInt(dateRange)).toISOString();

      // Fetch clicks
      const { data: clicks, error } = await supabase
        .from("link_clicks")
        .select("*")
        .eq("link_id", linkId)
        .gte("clicked_at", startDate);

      if (error) throw error;

      return clicks || [];
    },
  });

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading analytics...</div>;
  }

  if (!analyticsData || analyticsData.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">No click data available for this link yet.</p>
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
      {/* Date Range Selector */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Analytics Overview</h3>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalClicks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unique Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{uniqueClicks}</div>
          </CardContent>
        </Card>
      </div>

      {/* Device Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Device Types</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={deviceChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {deviceChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Browser Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Top Browsers</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={browserChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Referrers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Referrers</CardTitle>
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
          <CardTitle>Top Countries</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topCountries} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="clicks" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
