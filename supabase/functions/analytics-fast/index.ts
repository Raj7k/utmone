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

    // Query link_clicks directly using Supabase client
    let clicksQuery = supabase
      .from('link_clicks')
      .select('id, visitor_id, clicked_at, device_type')
      .eq('workspace_id', workspaceId)
      .gte('clicked_at', startDate.toISOString());

    if (linkId) {
      clicksQuery = clicksQuery.eq('link_id', linkId);
    }

    const { data: clicksData, error: clicksError } = await clicksQuery;

    if (clicksError) throw clicksError;

    // Process data for time series
    const dailyMap = new Map<string, { total: number; unique: Set<string> }>();
    const deviceMap = new Map<string, number>();

    (clicksData || []).forEach((click) => {
      const day = new Date(click.clicked_at).toISOString().split('T')[0];
      
      if (!dailyMap.has(day)) {
        dailyMap.set(day, { total: 0, unique: new Set() });
      }
      
      const dayData = dailyMap.get(day)!;
      dayData.total++;
      if (click.visitor_id) {
        dayData.unique.add(click.visitor_id);
      }

      // Track device types
      const device = click.device_type || 'unknown';
      deviceMap.set(device, (deviceMap.get(device) || 0) + 1);
    });

    // Convert to time series format
    const estimatedData = Array.from(dailyMap.entries())
      .map(([date, data]) => ({
        date,
        totalClicks: data.total,
        uniqueClicks: data.unique.size,
        isEstimated: false,
        confidence: 1.0,
        margin: 0
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Convert device map to array
    const estimatedDevices = Array.from(deviceMap.entries()).map(([device, clicks]) => ({
      device,
      clicks,
      isEstimated: false
    }));

    return new Response(
      JSON.stringify({
        timeSeries: estimatedData,
        devices: estimatedDevices,
        isEstimated: false,
        sampleRate: 1.0,
        confidence: 1.0
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analytics-fast:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Failed to fetch fast analytics', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
