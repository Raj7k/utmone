import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, subDays, format } from "date-fns";

interface UseRealAnalyticsParams {
  workspaceId: string;
  dateRange?: number; // days to look back
}

export const useRealAnalytics = ({ workspaceId, dateRange = 30 }: UseRealAnalyticsParams) => {
  return useQuery({
    queryKey: ["real-analytics", workspaceId, dateRange],
    queryFn: async () => {
      const startDate = startOfDay(subDays(new Date(), dateRange));

      // OPTIMIZED: Query link_clicks directly via workspace_id column (no JOIN)
      const { data: clicks, error } = await supabase
        .from("link_clicks")
        .select(`
          id,
          clicked_at,
          is_unique,
          device_type,
          browser,
          os,
          country,
          city,
          referrer,
          click_hour
        `)
        .eq("workspace_id", workspaceId)
        .gte("clicked_at", startDate.toISOString())
        .limit(5000); // Safety limit to prevent massive payloads

      if (error) throw error;

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

      // Calculate metrics
      const totalClicks = clicks.length;
      const uniqueVisitors = clicks.filter(c => c.is_unique).length;
      
      // Heatmap data (day of week x hour)
      const heatmapMap = new Map<string, number>();
      clicks.forEach(click => {
        const date = new Date(click.clicked_at);
        const day = date.getDay(); // 0-6
        const hour = click.click_hour || date.getHours();
        const key = `${day}-${hour}`;
        heatmapMap.set(key, (heatmapMap.get(key) || 0) + 1);
      });

      const maxClicks = Math.max(...Array.from(heatmapMap.values()), 1);
      const heatmapData = Array.from(heatmapMap.entries()).map(([key, clicks]) => {
        const [day, hour] = key.split('-').map(Number);
        return {
          day,
          hour,
          clicks,
          intensity: clicks / maxClicks
        };
      });

      // Geographic data
      const countryMap = new Map<string, number>();
      const cityMap = new Map<string, number>();
      clicks.forEach(click => {
        if (click.country) {
          countryMap.set(click.country, (countryMap.get(click.country) || 0) + 1);
        }
        if (click.city) {
          const cityKey = `${click.city}, ${click.country || 'Unknown'}`;
          cityMap.set(cityKey, (cityMap.get(cityKey) || 0) + 1);
        }
      });

      const topCountries = Array.from(countryMap.entries())
        .map(([name, clicks]) => ({ name, clicks }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 10);

      const topCities = Array.from(cityMap.entries())
        .map(([name, clicks]) => ({ name, clicks }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 10);

      // Device breakdown
      const deviceMap = new Map<string, number>();
      const browserMap = new Map<string, number>();
      clicks.forEach(click => {
        const device = click.device_type || 'Unknown';
        const browser = click.browser || 'Unknown';
        deviceMap.set(device, (deviceMap.get(device) || 0) + 1);
        browserMap.set(browser, (browserMap.get(browser) || 0) + 1);
      });

      const devices = Array.from(deviceMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

      const browsers = Array.from(browserMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      // Referrer data
      const referrerMap = new Map<string, number>();
      clicks.forEach(click => {
        if (click.referrer && click.referrer !== 'Direct') {
          try {
            const url = new URL(click.referrer);
            const domain = url.hostname.replace('www.', '');
            referrerMap.set(domain, (referrerMap.get(domain) || 0) + 1);
          } catch {
            referrerMap.set(click.referrer, (referrerMap.get(click.referrer) || 0) + 1);
          }
        }
      });

      const topReferrers = Array.from(referrerMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      // Generate AI insights
      const insights = generateInsights({ clicks, devices, topCountries, heatmapData, topReferrers });

      return {
        isEmpty: false,
        totalClicks,
        uniqueVisitors,
        clickRate: uniqueVisitors > 0 ? (totalClicks / uniqueVisitors).toFixed(1) : 0,
        heatmapData,
        topCountries,
        topCities,
        devices,
        browsers,
        topReferrers,
        insights
      };
    },
    enabled: !!workspaceId,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000
  });
};

interface InsightParams {
  clicks: any[];
  devices: Array<{ name: string; value: number }>;
  topCountries: Array<{ name: string; clicks: number }>;
  heatmapData: Array<{ day: number; hour: number; clicks: number }>;
  topReferrers: Array<{ name: string; value: number }>;
}

function generateInsights({ clicks, devices, topCountries, heatmapData, topReferrers }: InsightParams): string[] {
  const insights: string[] = [];

  // Mobile optimization insight
  const totalDeviceClicks = devices.reduce((sum, d) => sum + d.value, 0);
  const mobileClicks = devices.find(d => d.name.toLowerCase() === 'mobile')?.value || 0;
  const mobilePercentage = totalDeviceClicks > 0 ? (mobileClicks / totalDeviceClicks) * 100 : 0;

  if (mobilePercentage > 70) {
    insights.push(`Your audience is ${mobilePercentage.toFixed(0)}% mobile. Optimize your landing pages for mobile devices.`);
  } else if (mobilePercentage < 30) {
    insights.push(`Your audience is ${(100 - mobilePercentage).toFixed(0)}% desktop. Consider desktop-optimized experiences.`);
  }

  // Geographic insight
  if (topCountries.length > 0) {
    const topCountry = topCountries[0];
    const topCountryPercentage = (topCountry.clicks / clicks.length) * 100;
    
    if (topCountry.name !== 'US' && topCountry.name !== 'United States') {
      insights.push(`You're trending in ${topCountry.name} (${topCountryPercentage.toFixed(0)}% of traffic). Consider localized content.`);
    } else if (topCountryPercentage > 60) {
      insights.push(`${topCountryPercentage.toFixed(0)}% of your traffic is from ${topCountry.name}. Your content resonates locally.`);
    }
  }

  // Best time insight
  if (heatmapData.length > 0) {
    const sortedByClicks = [...heatmapData].sort((a, b) => b.clicks - a.clicks);
    const bestTime = sortedByClicks[0];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[bestTime.day];
    const hour = bestTime.hour;
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    
    insights.push(`Best time to post: ${dayName} at ${displayHour}${period}. That's when your audience is most active.`);
  }

  // Referrer insight
  if (topReferrers.length > 0) {
    const topSource = topReferrers[0];
    const sourcePercentage = (topSource.value / clicks.length) * 100;
    insights.push(`${topSource.name} is your #1 traffic source (${sourcePercentage.toFixed(0)}%). Double down on that channel.`);
  }

  return insights;
}
