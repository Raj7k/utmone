import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface DeviceBreakdownProps {
  workspaceId: string;
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
  "hsl(var(--muted))",
  "hsl(var(--success))",
];

export const DeviceBreakdown = ({ workspaceId }: DeviceBreakdownProps) => {
  const { data: deviceData, isLoading } = useQuery({
    queryKey: ["device-breakdown", workspaceId],
    queryFn: async () => {
      const { data: links } = await supabase
        .from("links")
        .select("id")
        .eq("workspace_id", workspaceId);

      if (!links || links.length === 0) return null;

      const linkIds = links.map(l => l.id);

      const { data: clicks } = await supabase
        .from("link_clicks")
        .select("device_type, browser, os")
        .in("link_id", linkIds);

      if (!clicks) return null;

      // Aggregate by device type
      const deviceCounts: Record<string, number> = {};
      const browserCounts: Record<string, number> = {};
      const osCounts: Record<string, number> = {};

      clicks.forEach(click => {
        const device = click.device_type || "Unknown";
        const browser = click.browser || "Unknown";
        const os = click.os || "Unknown";

        deviceCounts[device] = (deviceCounts[device] || 0) + 1;
        browserCounts[browser] = (browserCounts[browser] || 0) + 1;
        osCounts[os] = (osCounts[os] || 0) + 1;
      });

      return {
        devices: Object.entries(deviceCounts).map(([name, value]) => ({ name, value })),
        browsers: Object.entries(browserCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, value]) => ({ name, value })),
        os: Object.entries(osCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, value]) => ({ name, value })),
      };
    },
  });

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading device data...</div>;
  }

  if (!deviceData) {
    return <div className="text-center py-8 text-muted-foreground">No device data available</div>;
  }

  const chartConfig = {
    value: {
      label: "Clicks",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Device Types</CardTitle>
            <CardDescription>Click distribution by device</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData.devices}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {deviceData.devices.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Browsers</CardTitle>
            <CardDescription>Most used browsers</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deviceData.browsers}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Operating Systems</CardTitle>
            <CardDescription>Distribution by OS</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deviceData.os}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
