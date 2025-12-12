import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, subDays } from "date-fns";

interface UseRealAnalyticsParams {
  workspaceId: string;
  dateRange?: number;
}

export const useRealAnalytics = ({ workspaceId, dateRange = 30 }: UseRealAnalyticsParams) => {
  return useQuery({
    queryKey: ["real-analytics-safe", workspaceId, dateRange],
    queryFn: async () => {
      const startDate = startOfDay(subDays(new Date(), dateRange));

      // SAFE MODE: Fetch only 500 rows max for breakdown analysis
      const { data: clicks, error } = await supabase
        .from("link_clicks")
        .select("device_type, browser, country, city, referrer, click_hour, clicked_at, is_unique")
        .eq("workspace_id", workspaceId)
        .gte("clicked_at", startDate.toISOString())
        .order("clicked_at", { ascending: false })
        .limit(500);

      if (error) throw error;

      // Get total count separately (fast query)
      const { count: totalClicks } = await supabase
        .from("link_clicks")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", workspaceId)
        .gte("clicked_at", startDate.toISOString());

      const { count: uniqueVisitors } = await supabase
        .from("link_clicks")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", workspaceId)
        .eq("is_unique", true)
        .gte("clicked_at", startDate.toISOString());

      if (!clicks || clicks.length === 0) {
        return {
          isEmpty: true,
          totalClicks: 0,
          uniqueVisitors: 0,
          clickRate: 0,
          heatmapData: [],
          topCountries: [],
          topCities: [],
          devices: [],
          browsers: [],
          topReferrers: [],
          insights: []
        };
      }

      // Build breakdowns from sample (500 rows)
      const deviceMap = new Map<string, number>();
      const browserMap = new Map<string, number>();
      const countryMap = new Map<string, number>();
      const cityMap = new Map<string, number>();
      const referrerMap = new Map<string, number>();
      const heatmapMap = new Map<string, number>();

      clicks.forEach(click => {
        // Device
        const device = click.device_type || 'Unknown';
        deviceMap.set(device, (deviceMap.get(device) || 0) + 1);

        // Browser
        const browser = click.browser || 'Unknown';
        browserMap.set(browser, (browserMap.get(browser) || 0) + 1);

        // Country
        if (click.country) {
          countryMap.set(click.country, (countryMap.get(click.country) || 0) + 1);
        }

        // City
        if (click.city) {
          const cityKey = `${click.city}, ${click.country || 'Unknown'}`;
          cityMap.set(cityKey, (cityMap.get(cityKey) || 0) + 1);
        }

        // Referrer
        if (click.referrer && click.referrer !== 'Direct') {
          try {
            const url = new URL(click.referrer);
            const domain = url.hostname.replace('www.', '');
            referrerMap.set(domain, (referrerMap.get(domain) || 0) + 1);
          } catch {
            referrerMap.set(click.referrer, (referrerMap.get(click.referrer) || 0) + 1);
          }
        }

        // Heatmap
        const date = new Date(click.clicked_at);
        const day = date.getDay();
        const hour = click.click_hour ?? date.getHours();
        const key = `${day}-${hour}`;
        heatmapMap.set(key, (heatmapMap.get(key) || 0) + 1);
      });

      const devices = Array.from(deviceMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

      const browsers = Array.from(browserMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      const topCountries = Array.from(countryMap.entries())
        .map(([name, clicks]) => ({ name, clicks }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 10);

      const topCities = Array.from(cityMap.entries())
        .map(([name, clicks]) => ({ name, clicks }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 10);

      const topReferrers = Array.from(referrerMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      const maxClicks = Math.max(...Array.from(heatmapMap.values()), 1);
      const heatmapData = Array.from(heatmapMap.entries()).map(([key, clicks]) => {
        const [day, hour] = key.split('-').map(Number);
        return { day, hour, clicks, intensity: clicks / maxClicks };
      });

      return {
        isEmpty: false,
        totalClicks: totalClicks || clicks.length,
        uniqueVisitors: uniqueVisitors || 0,
        clickRate: uniqueVisitors && uniqueVisitors > 0 ? ((totalClicks || 0) / uniqueVisitors).toFixed(1) : 0,
        heatmapData,
        topCountries,
        topCities,
        devices,
        browsers,
        topReferrers,
        insights: []
      };
    },
    enabled: !!workspaceId,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000
  });
};
