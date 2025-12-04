import { useCachedGeolocationAnalytics } from "@/hooks/useAnalyticsCache";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ChartWrapper } from "@/components/charts/ChartWrapper";
import { useChartAccessibility } from "@/hooks/useChartAccessibility";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Globe } from "lucide-react";

interface GeolocationMapProps {
  workspaceId: string;
}

export const GeolocationMap = ({ workspaceId }: GeolocationMapProps) => {
  const { data: geoData, isLoading } = useCachedGeolocationAnalytics(workspaceId);

  // Process data for display
  const data = geoData ? (() => {
    // Aggregate by country
    const countryMap = new Map<string, number>();
    const cityMap = new Map<string, number>();

    geoData.forEach((item) => {
      const country = item.country || 'Unknown';
      const city = item.city || 'Unknown';
      
      countryMap.set(country, (countryMap.get(country) || 0) + item.click_count);
      
      if (city !== 'Unknown') {
        const cityKey = `${city}, ${country}`;
        cityMap.set(cityKey, (cityMap.get(cityKey) || 0) + item.click_count);
      }
    });

    const countries = Array.from(countryMap.entries())
      .map(([name, clicks]) => ({ name, value: clicks }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    const cities = Array.from(cityMap.entries())
      .map(([name, clicks]) => ({ name, value: clicks }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    return { countries, cities };
  })() : { countries: [], cities: [] };

  // Accessibility data
  const countriesAccessibility = useChartAccessibility(data.countries, "Top Countries by Clicks", "name", ["value"]);
  const citiesAccessibility = useChartAccessibility(data.cities, "Top Cities by Clicks", "name", ["value"]);

  if (isLoading) {
    return <div className="text-center py-8 text-secondary-label">loading location data…</div>;
  }

  if (!data || (data.countries.length === 0 && data.cities.length === 0)) {
    return <div className="text-center py-8 text-secondary-label">No geolocation data available</div>;
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
            <Globe className="h-5 w-5" style={{ color: 'rgba(255,255,255,0.8)' }} />
            <CardTitle>Top Countries</CardTitle>
          </div>
          <CardDescription>Click distribution by country</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartWrapper height={400} accessibilityData={countriesAccessibility}>
            <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.countries} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--secondary-label))" />
                  <YAxis dataKey="name" type="category" width={100} stroke="hsl(var(--secondary-label))" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </ChartWrapper>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Cities</CardTitle>
          <CardDescription>Most active cities</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartWrapper height={400} accessibilityData={citiesAccessibility}>
            <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.cities} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--secondary-label))" />
                  <YAxis dataKey="name" type="category" width={120} stroke="hsl(var(--secondary-label))" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </ChartWrapper>
        </CardContent>
      </Card>
    </div>
  );
};
