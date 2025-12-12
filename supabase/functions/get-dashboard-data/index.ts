import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { startOfDay, subDays } from "https://esm.sh/date-fns@3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DashboardPayload {
  links: any[];
  salesLinks: any[];
  events: any[];
  campaigns: any[];
  stats: {
    clicksToday: number;
    totalRevenue: number;
    totalLinks: number;
  };
  onboarding: {
    hasLinks: boolean;
    linkCount: number;
  };
  analytics: {
    isEmpty: boolean;
    totalClicks: number;
    uniqueVisitors: number;
    heatmapData: any[];
    topCountries: any[];
    topCities: any[];
    devices: any[];
    browsers: any[];
    topReferrers: any[];
    insights: string[];
  };
  executiveMetrics: {
    totalClicks: number;
    uniqueVisitors: number;
    conversionRate: number;
    revenue: number;
    clicksChange: number;
    visitorsChange: number;
    conversionChange: number;
    revenueChange: number;
    clicksTrend: number[];
    visitorsTrend: number[];
    topChannel: string | null;
    topChannelClicks: number;
    peakDay: string | null;
    peakDayClicks: number;
    avgClicksPerDay: number;
  };
  fetchedAt: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { workspaceId, range = "30d" } = await req.json();

    if (!workspaceId) {
      return new Response(
        JSON.stringify({ error: "workspaceId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role for efficient queries
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Calculate date range
    const days = parseInt(range.replace("d", "")) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateISO = startDate.toISOString();

    // Today for clicks count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    console.log(`[get-dashboard-data] Fetching data for workspace ${workspaceId}, range: ${range}`);

    // Get user from auth header for sales links filter
    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;
    
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    // Previous period for comparison
    const prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - days);
    const prevEndDate = startDate;

    // Execute ALL queries IN PARALLEL using Promise.all
    const [
      linksResult, 
      salesLinksResult, 
      eventsResult, 
      campaignsResult, 
      clicksTodayResult, 
      revenueResult,
      clicksResult,
      prevClicksResult,
      conversionsResult
    ] = await Promise.all([
      // 1. Links (top 50, minimal fields)
      supabase
        .from("links")
        .select("id, title, slug, short_url, destination_url, status, total_clicks, created_at")
        .eq("workspace_id", workspaceId)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(50),

      // 2. Sales Links (user's sales links)
      userId ? supabase
        .from("links")
        .select("*")
        .eq("workspace_id", workspaceId)
        .eq("link_type", "sales")
        .eq("created_by", userId)
        .order("created_at", { ascending: false })
        .limit(50) : Promise.resolve({ data: [], error: null }),

      // 3. Events (top 10)
      supabase
        .from("field_events")
        .select("id, name, start_date, end_date, location_city, location_country, direct_scans, halo_visitors, lift_percentage, status")
        .eq("workspace_id", workspaceId)
        .order("start_date", { ascending: false })
        .limit(10),

      // 4. Campaigns (top 10 with link counts)
      supabase
        .from("campaigns")
        .select("id, name, status, color, created_at, links!links_campaign_id_fkey(id, total_clicks)")
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: false })
        .limit(10),

      // 5. Clicks today (count only)
      supabase
        .from("link_clicks")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", workspaceId)
        .gte("clicked_at", todayISO),

      // 6. Revenue (sum of conversion values)
      supabase
        .from("conversion_events")
        .select("event_value")
        .eq("workspace_id", workspaceId)
        .gte("attributed_at", startDateISO),

      // 7. Analytics clicks (current period)
      supabase
        .from("link_clicks")
        .select("id, clicked_at, is_unique, device_type, browser, os, country, city, referrer, click_hour")
        .eq("workspace_id", workspaceId)
        .gte("clicked_at", startDateISO)
        .limit(5000),

      // 8. Analytics clicks (previous period for comparison)
      supabase
        .from("link_clicks")
        .select("id, clicked_at, is_unique")
        .eq("workspace_id", workspaceId)
        .gte("clicked_at", prevStartDate.toISOString())
        .lt("clicked_at", prevEndDate.toISOString())
        .limit(5000),

      // 9. Conversions for rate calculation
      supabase
        .from("conversion_events")
        .select("id, event_value")
        .eq("workspace_id", workspaceId)
        .gte("attributed_at", startDateISO),
    ]);

    // Process results
    const links = linksResult.data || [];
    const salesLinks = salesLinksResult.data || [];
    const events = eventsResult.data || [];
    
    // Process campaigns with stats
    const campaigns = (campaignsResult.data || []).map((campaign: any) => {
      const campaignLinks = campaign.links || [];
      return {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        color: campaign.color,
        created_at: campaign.created_at,
        stats: {
          linkCount: campaignLinks.length,
          totalClicks: campaignLinks.reduce((sum: number, l: any) => sum + (l.total_clicks || 0), 0),
        },
      };
    });

    const clicksToday = clicksTodayResult.count || 0;
    const totalRevenue = (revenueResult.data || []).reduce(
      (sum: number, c: any) => sum + (c.event_value || 0),
      0
    );

    // Process analytics data
    const clicks = clicksResult.data || [];
    const prevClicks = prevClicksResult.data || [];
    const conversions = conversionsResult.data || [];

    // Calculate analytics metrics
    const totalClicks = clicks.length;
    const uniqueVisitors = clicks.filter((c: any) => c.is_unique).length;
    const prevTotalClicks = prevClicks.length;
    const prevUniqueVisitors = prevClicks.filter((c: any) => c.is_unique).length;

    // Heatmap data
    const heatmapMap = new Map<string, number>();
    clicks.forEach((click: any) => {
      const date = new Date(click.clicked_at);
      const day = date.getDay();
      const hour = click.click_hour || date.getHours();
      const key = `${day}-${hour}`;
      heatmapMap.set(key, (heatmapMap.get(key) || 0) + 1);
    });

    const maxClicks = Math.max(...Array.from(heatmapMap.values()), 1);
    const heatmapData = Array.from(heatmapMap.entries()).map(([key, clickCount]) => {
      const [day, hour] = key.split('-').map(Number);
      return { day, hour, clicks: clickCount, intensity: clickCount / maxClicks };
    });

    // Geographic data
    const countryMap = new Map<string, number>();
    const cityMap = new Map<string, number>();
    clicks.forEach((click: any) => {
      if (click.country) countryMap.set(click.country, (countryMap.get(click.country) || 0) + 1);
      if (click.city) {
        const cityKey = `${click.city}, ${click.country || 'Unknown'}`;
        cityMap.set(cityKey, (cityMap.get(cityKey) || 0) + 1);
      }
    });

    const topCountries = Array.from(countryMap.entries())
      .map(([name, clickCount]) => ({ name, clicks: clickCount }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);

    const topCities = Array.from(cityMap.entries())
      .map(([name, clickCount]) => ({ name, clicks: clickCount }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);

    // Device breakdown
    const deviceMap = new Map<string, number>();
    const browserMap = new Map<string, number>();
    clicks.forEach((click: any) => {
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
    clicks.forEach((click: any) => {
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

    // Generate insights
    const insights: string[] = [];
    const totalDeviceClicks = devices.reduce((sum, d) => sum + d.value, 0);
    const mobileClicks = devices.find(d => d.name.toLowerCase() === 'mobile')?.value || 0;
    const mobilePercentage = totalDeviceClicks > 0 ? (mobileClicks / totalDeviceClicks) * 100 : 0;

    if (mobilePercentage > 70) {
      insights.push(`Your audience is ${mobilePercentage.toFixed(0)}% mobile. Optimize your landing pages for mobile devices.`);
    }
    if (topCountries.length > 0) {
      const topCountry = topCountries[0];
      insights.push(`${topCountry.name} is your #1 country with ${topCountry.clicks} clicks.`);
    }
    if (topReferrers.length > 0) {
      insights.push(`${topReferrers[0].name} is your top traffic source.`);
    }

    // Executive metrics calculations
    const clicksChange = prevTotalClicks > 0 ? ((totalClicks - prevTotalClicks) / prevTotalClicks) * 100 : 0;
    const visitorsChange = prevUniqueVisitors > 0 ? ((uniqueVisitors - prevUniqueVisitors) / prevUniqueVisitors) * 100 : 0;
    const conversionRate = uniqueVisitors > 0 ? (conversions.length / uniqueVisitors) * 100 : 0;
    const revenue = conversions.reduce((sum: number, c: any) => sum + (c.event_value || 0), 0);

    // Trend data (last 7 days)
    const clicksTrend: number[] = [];
    const visitorsTrend: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date();
      dayStart.setDate(dayStart.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const dayClicks = clicks.filter((c: any) => {
        const clickDate = new Date(c.clicked_at);
        return clickDate >= dayStart && clickDate < dayEnd;
      });
      clicksTrend.push(dayClicks.length);
      visitorsTrend.push(dayClicks.filter((c: any) => c.is_unique).length);
    }

    // Top channel and peak day
    const topChannel = topReferrers.length > 0 ? topReferrers[0].name : null;
    const topChannelClicks = topReferrers.length > 0 ? topReferrers[0].value : 0;

    const dailyClicksMap = new Map<string, number>();
    clicks.forEach((click: any) => {
      const date = new Date(click.clicked_at).toISOString().split('T')[0];
      dailyClicksMap.set(date, (dailyClicksMap.get(date) || 0) + 1);
    });
    const peakEntry = Array.from(dailyClicksMap.entries()).sort((a, b) => b[1] - a[1])[0];
    const peakDay = peakEntry ? peakEntry[0] : null;
    const peakDayClicks = peakEntry ? peakEntry[1] : 0;
    const avgClicksPerDay = days > 0 ? totalClicks / days : 0;

    const payload: DashboardPayload = {
      links,
      salesLinks,
      events,
      campaigns,
      stats: {
        clicksToday,
        totalRevenue,
        totalLinks: links.length,
      },
      onboarding: {
        hasLinks: links.length > 0,
        linkCount: links.length,
      },
      analytics: {
        isEmpty: clicks.length === 0,
        totalClicks,
        uniqueVisitors,
        heatmapData,
        topCountries,
        topCities,
        devices,
        browsers,
        topReferrers,
        insights,
      },
      executiveMetrics: {
        totalClicks,
        uniqueVisitors,
        conversionRate,
        revenue,
        clicksChange,
        visitorsChange,
        conversionChange: 0, // Would need prev period conversion data
        revenueChange: 0, // Would need prev period revenue data
        clicksTrend,
        visitorsTrend,
        topChannel,
        topChannelClicks,
        peakDay,
        peakDayClicks,
        avgClicksPerDay,
      },
      fetchedAt: new Date().toISOString(),
    };

    console.log(`[get-dashboard-data] Success: ${links.length} links, ${totalClicks} clicks, ${events.length} events`);

    return new Response(JSON.stringify(payload), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("[get-dashboard-data] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
