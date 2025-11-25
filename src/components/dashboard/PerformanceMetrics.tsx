import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { AnimatedCounter } from "@/components/reports/AnimatedCounter";

interface PerformanceMetricsProps {
  workspaceId: string;
}

export const PerformanceMetrics = ({ workspaceId }: PerformanceMetricsProps) => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['performance-metrics', workspaceId],
    queryFn: async () => {
      // Fetch top performing links
      const { data: links } = await supabase
        .from('links')
        .select('title, total_clicks')
        .eq('workspace_id', workspaceId)
        .order('total_clicks', { ascending: false })
        .limit(3);

      // Fetch device breakdown from clicks
      const { data: clicks } = await supabase
        .from('link_clicks')
        .select('device_type, link_id')
        .in('link_id', (await supabase
          .from('links')
          .select('id')
          .eq('workspace_id', workspaceId)
          .then(res => res.data?.map(l => l.id) || [])));

      // Calculate device breakdown
      const deviceCounts = clicks?.reduce((acc, click) => {
        const device = click.device_type || 'unknown';
        acc[device] = (acc[device] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const deviceData = Object.entries(deviceCounts).map(([name, value]) => ({
        name,
        value,
      }));

      return {
        topLinks: links || [],
        deviceData,
        totalClicks: clicks?.length || 0,
      };
    },
  });

  if (isLoading) {
    return (
      <Card variant="grouped">
        <CardHeader>
          <CardTitle>performance metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-fill-tertiary rounded-lg" />
            <div className="h-32 bg-fill-tertiary rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const COLORS = [
    'hsl(var(--system-blue))',
    'hsl(var(--system-indigo))',
    'hsl(var(--system-teal))',
    'hsl(var(--system-orange))',
  ];

  return (
    <Card variant="grouped">
      <CardHeader>
        <CardTitle>performance metrics</CardTitle>
        <CardDescription>
          real-time insights into your links
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Top Performing Links */}
        <div>
          <h4 className="text-headline font-semibold text-label mb-3">
            top performing links
          </h4>
          {metrics?.topLinks && metrics.topLinks.length > 0 ? (
            <div className="space-y-2">
              {metrics.topLinks.map((link, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-secondary-grouped-background rounded-lg">
                  <div className="flex-1">
                    <p className="text-callout font-medium text-label truncate">
                      {link.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-headline font-bold text-system-blue">
                      <AnimatedCounter to={link.total_clicks || 0} />
                    </div>
                    <span className="text-caption-1 text-tertiary-label">clicks</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-caption-1 text-secondary-label">
              no data yet. create links to see performance
            </p>
          )}
        </div>

        {/* Device Breakdown */}
        {metrics?.deviceData && metrics.deviceData.length > 0 && (
          <div>
            <h4 className="text-headline font-semibold text-label mb-3">
              device breakdown
            </h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {metrics.deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--secondary-grouped-background))',
                      border: '1px solid hsl(var(--separator))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-4 justify-center mt-2">
              {metrics.deviceData.map((device, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <span className="text-caption-1 text-secondary-label capitalize">
                    {device.name}: {device.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
