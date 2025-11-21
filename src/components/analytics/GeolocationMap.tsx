import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Globe } from "lucide-react";

interface GeolocationMapProps {
  workspaceId: string;
}

export const GeolocationMap = ({ workspaceId }: GeolocationMapProps) => {
  const { data: geoData, isLoading } = useQuery({
    queryKey: ["geolocation", workspaceId],
    queryFn: async () => {
      const { data: links } = await supabase
        .from("links")
        .select("id")
        .eq("workspace_id", workspaceId);

      if (!links || links.length === 0) return null;

      const linkIds = links.map(l => l.id);

      const { data: clicks } = await supabase
        .from("link_clicks")
        .select("country, city")
        .in("link_id", linkIds);

      if (!clicks) return null;

      // Aggregate by country and city
      const countryCounts: Record<string, number> = {};
      const cityCounts: Record<string, number> = {};

      clicks.forEach(click => {
        const country = click.country || "Unknown";
        const city = click.city || "Unknown";

        countryCounts[country] = (countryCounts[country] || 0) + 1;
        if (click.city) {
          cityCounts[city] = (cityCounts[city] || 0) + 1;
        }
      });

      return {
        countries: Object.entries(countryCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([name, value]) => ({ name, value })),
        cities: Object.entries(cityCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([name, value]) => ({ name, value })),
      };
    },
  });

    return <div className="text-center py-8 text-muted-foreground">loading location data…</div>;

  if (!geoData) {
    return <div className="text-center py-8 text-muted-foreground">No geolocation data available</div>;
  }

  const chartConfig = {
    value: {
      label: "Clicks",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <CardTitle>Top Countries</CardTitle>
          </div>
          <CardDescription>Click distribution by country</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={geoData.countries} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="name" type="category" width={100} stroke="hsl(var(--muted-foreground))" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Cities</CardTitle>
          <CardDescription>Most active cities</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={geoData.cities} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="name" type="category" width={120} stroke="hsl(var(--muted-foreground))" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
