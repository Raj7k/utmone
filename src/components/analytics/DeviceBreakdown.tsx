import { useCachedDeviceAnalytics } from "@/hooks/useAnalyticsCache";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ChartWrapper } from "@/components/charts/ChartWrapper";
import { usePieChartAccessibility, useChartAccessibility } from "@/hooks/useChartAccessibility";
import { LazyBarChart, LazyPieChart, LazyChartContainer, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Pie, Cell } from "@/components/charts/LazyCharts";

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
  const { data: deviceData, isLoading } = useCachedDeviceAnalytics(workspaceId);

  // Process data for display
  const data = deviceData ? (() => {
    const deviceMap = new Map<string, number>();
    const browserMap = new Map<string, number>();
    const osMap = new Map<string, number>();

    deviceData.forEach((item) => {
      const device = item.device_type || 'Unknown';
      const browser = item.browser || 'Unknown';
      const os = item.os || 'Unknown';
      
      deviceMap.set(device, (deviceMap.get(device) || 0) + item.click_count);
      browserMap.set(browser, (browserMap.get(browser) || 0) + item.click_count);
      osMap.set(os, (osMap.get(os) || 0) + item.click_count);
    });

    return {
      devices: Array.from(deviceMap.entries()).map(([name, value]) => ({ name, value })),
      browsers: Array.from(browserMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5),
      os: Array.from(osMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5),
    };
  })() : { devices: [], browsers: [], os: [] };

  // Accessibility data
  const devicesAccessibility = usePieChartAccessibility(data.devices, "Device Type Distribution", "name", "value");
  const browsersAccessibility = useChartAccessibility(data.browsers, "Top Browsers", "name", ["value"]);
  const osAccessibility = useChartAccessibility(data.os, "Operating Systems", "name", ["value"]);

  if (isLoading) {
    return <div className="text-center py-8 text-secondary-label">loading device data…</div>;
  }

  if (!data || (data.devices.length === 0 && data.browsers.length === 0 && data.os.length === 0)) {
    return <div className="text-center py-8 text-secondary-label">No device data available</div>;
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
            <ChartWrapper height={300} accessibilityData={devicesAccessibility}>
              <LazyChartContainer height={300}>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LazyPieChart>
                      <Pie
                        data={data.devices}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {data.devices.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </LazyPieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </LazyChartContainer>
            </ChartWrapper>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Browsers</CardTitle>
            <CardDescription>Most used browsers</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartWrapper height={300} accessibilityData={browsersAccessibility}>
              <LazyChartContainer height={300}>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LazyBarChart data={data.browsers}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--secondary-label))" />
                      <YAxis stroke="hsl(var(--secondary-label))" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </LazyBarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </LazyChartContainer>
            </ChartWrapper>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Operating Systems</CardTitle>
            <CardDescription>Distribution by OS</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartWrapper height={300} accessibilityData={osAccessibility}>
              <LazyChartContainer height={300}>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LazyBarChart data={data.os}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--secondary-label))" />
                      <YAxis stroke="hsl(var(--secondary-label))" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                    </LazyBarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </LazyChartContainer>
            </ChartWrapper>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
