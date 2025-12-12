import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DashboardPayload {
  links: any[];
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

    // Execute 5 lightweight queries IN PARALLEL using Promise.all
    const [linksResult, eventsResult, campaignsResult, clicksTodayResult, revenueResult] = await Promise.all([
      // 1. Links (top 50, minimal fields)
      supabase
        .from("links")
        .select("id, title, slug, short_url, destination_url, status, total_clicks, created_at")
        .eq("workspace_id", workspaceId)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(50),

      // 2. Events (top 10)
      supabase
        .from("field_events")
        .select("id, name, start_date, end_date, location_city, location_country, direct_scans, halo_visitors, lift_percentage, status")
        .eq("workspace_id", workspaceId)
        .order("start_date", { ascending: false })
        .limit(10),

      // 3. Campaigns (top 10 with link counts)
      supabase
        .from("campaigns")
        .select("id, name, status, color, created_at, links!links_campaign_id_fkey(id, total_clicks)")
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: false })
        .limit(10),

      // 4. Clicks today (count only)
      supabase
        .from("link_clicks")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", workspaceId)
        .gte("clicked_at", todayISO),

      // 5. Revenue (sum of conversion values)
      supabase
        .from("conversion_events")
        .select("event_value")
        .eq("workspace_id", workspaceId)
        .gte("attributed_at", startDateISO),
    ]);

    // Process results
    const links = linksResult.data || [];
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

    const payload: DashboardPayload = {
      links,
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
      fetchedAt: new Date().toISOString(),
    };

    console.log(`[get-dashboard-data] Success: ${links.length} links, ${events.length} events, ${campaigns.length} campaigns`);

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
