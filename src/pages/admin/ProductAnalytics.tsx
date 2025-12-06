import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, QrCode, Users, MousePointerClick, Eye } from "lucide-react";
import { LazyBarChart, LazyLineChart, LazyChartContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from "@/components/charts/LazyCharts";

export default function ProductAnalytics() {
  // Fetch links created per day (last 30 days)
  const { data: linkTrends } = useQuery({
    queryKey: ['admin-link-trends'],
    queryFn: async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('links')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (error) throw error;

      // Group by day
      const grouped = data?.reduce((acc: any, link) => {
        const day = link.created_at.split('T')[0];
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(grouped || {}).map(([date, count]) => ({
        date,
        count
      })).sort((a, b) => a.date.localeCompare(b.date));
    },
  });

  // Fetch QR codes created per day
  const { data: qrTrends } = useQuery({
    queryKey: ['admin-qr-trends'],
    queryFn: async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('qr_codes')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (error) throw error;

      const grouped = data?.reduce((acc: any, qr) => {
        const day = qr.created_at.split('T')[0];
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(grouped || {}).map(([date, count]) => ({
        date,
        count
      })).sort((a, b) => a.date.localeCompare(b.date));
    },
  });

  // Fetch top workspaces by link count
  const { data: topWorkspaces } = useQuery({
    queryKey: ['admin-top-workspaces'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workspaces')
        .select(`
          id,
          name,
          links:links(count)
        `)
        .limit(10);

      if (error) throw error;

      return data
        ?.map(w => ({ name: w.name, links: w.links[0]?.count || 0 }))
        .sort((a, b) => b.links - a.links);
    },
  });

  // Fetch click stats
  const { data: clickStats } = useQuery({
    queryKey: ['admin-click-stats'],
    queryFn: async () => {
      const { count } = await supabase
        .from('link_clicks')
        .select('*', { count: 'exact', head: true });

      const { count: uniqueCount } = await supabase
        .from('link_clicks')
        .select('*', { count: 'exact', head: true })
        .eq('is_unique', true);

      return {
        total: count || 0,
        unique: uniqueCount || 0,
      };
    },
  });

  return (
    <div className="p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold">product analytics</h1>
          <p className="text-muted-foreground mt-1">
            usage trends and feature adoption
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <MousePointerClick className="w-4 h-4" />
                total clicks tracked
              </CardDescription>
              <CardTitle className="text-3xl">{clickStats?.total.toLocaleString() || 0}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                unique visitors
              </CardDescription>
              <CardTitle className="text-3xl">{clickStats?.unique.toLocaleString() || 0}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="w-5 h-5" />
                links created (last 30 days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LazyChartContainer height={300}>
                <ResponsiveContainer width="100%" height={300}>
                  <LazyLineChart data={linkTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LazyLineChart>
                </ResponsiveContainer>
              </LazyChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                qr codes generated (last 30 days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LazyChartContainer height={300}>
                <ResponsiveContainer width="100%" height={300}>
                  <LazyLineChart data={qrTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LazyLineChart>
                </ResponsiveContainer>
              </LazyChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Workspaces */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              most active workspaces
            </CardTitle>
            <CardDescription>workspaces by link count</CardDescription>
          </CardHeader>
          <CardContent>
            <LazyChartContainer height={400}>
              <ResponsiveContainer width="100%" height={400}>
                <LazyBarChart data={topWorkspaces} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip />
                  <Bar dataKey="links" fill="hsl(var(--primary))" />
                </LazyBarChart>
              </ResponsiveContainer>
            </LazyChartContainer>
          </CardContent>
        </Card>
      </div>
  );
}
