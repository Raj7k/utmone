import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { workspaceId, linkId, days = 30 } = await req.json();

    if (!workspaceId) {
      return new Response(
        JSON.stringify({ error: 'workspaceId required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Full precision query - no sampling
    let query = supabase
      .from('link_clicks')
      .select('clicked_at, visitor_id, device_type, browser, os, country, city, referrer')
      .eq('workspace_id', workspaceId)
      .gte('clicked_at', startDate.toISOString());

    if (linkId) {
      query = query.eq('link_id', linkId);
    }

    const { data: clicks, error } = await query;

    if (error) throw error;

    // Process time series
    const timeSeriesMap = new Map<string, { total: number; unique: Set<string> }>();
    
    clicks?.forEach((click) => {
      const day = new Date(click.clicked_at).toISOString().split('T')[0];
      if (!timeSeriesMap.has(day)) {
        timeSeriesMap.set(day, { total: 0, unique: new Set() });
      }
      const dayData = timeSeriesMap.get(day)!;
      dayData.total++;
      if (click.visitor_id) {
        dayData.unique.add(click.visitor_id);
      }
    });

    const timeSeries = Array.from(timeSeriesMap.entries())
      .map(([date, data]) => ({
        date,
        totalClicks: data.total,
        uniqueClicks: data.unique.size,
        isEstimated: false
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Process device breakdown
    const deviceMap = new Map<string, number>();
    clicks?.forEach((click) => {
      const device = click.device_type || 'unknown';
      deviceMap.set(device, (deviceMap.get(device) || 0) + 1);
    });

    const devices = Array.from(deviceMap.entries()).map(([device, clicks]) => ({
      device,
      clicks,
      isEstimated: false
    }));

    // Process geography
    const geoMap = new Map<string, number>();
    clicks?.forEach((click) => {
      if (click.country) {
        geoMap.set(click.country, (geoMap.get(click.country) || 0) + 1);
      }
    });

    const topCountries = Array.from(geoMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([country, clicks]) => ({ country, clicks }));

    return new Response(
      JSON.stringify({
        timeSeries,
        devices,
        topCountries,
        totalClicks: clicks?.length || 0,
        uniqueVisitors: new Set(clicks?.map(c => c.visitor_id).filter(Boolean)).size,
        isEstimated: false,
        sampleRate: 1.0,
        confidence: 1.0
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analytics-precise:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Failed to fetch precise analytics', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
