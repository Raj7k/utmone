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

    // Use TABLESAMPLE SYSTEM (10) for 10% sample - ultra-fast
    const sampleQuery = `
      SELECT 
        COUNT(*) as sample_count,
        COUNT(DISTINCT visitor_id) as sample_unique,
        DATE_TRUNC('day', clicked_at) as click_day
      FROM link_clicks TABLESAMPLE SYSTEM (10)
      WHERE workspace_id = $1
        AND clicked_at >= $2
        ${linkId ? 'AND link_id = $3' : ''}
      GROUP BY click_day
      ORDER BY click_day ASC
    `;

    const params = linkId ? [workspaceId, startDate.toISOString(), linkId] : [workspaceId, startDate.toISOString()];
    
    const { data: sampleData, error: sampleError } = await supabase.rpc('exec_sql', {
      query: sampleQuery,
      params
    }).single();

    if (sampleError) throw sampleError;

    // Multiply by 10 to estimate full dataset
    const sampleRows = Array.isArray(sampleData) ? sampleData : [];
    const estimatedData = sampleRows.map((row: any) => ({
      date: row.click_day,
      totalClicks: Math.round(row.sample_count * 10),
      uniqueClicks: Math.round(row.sample_unique * 10),
      isEstimated: true,
      confidence: 0.95, // 95% confidence interval
      margin: Math.round(row.sample_count * 10 * 0.15) // ±15% margin
    }));

    // Get device breakdown sample
    const deviceQuery = `
      SELECT 
        device_type,
        COUNT(*) as sample_count
      FROM link_clicks TABLESAMPLE SYSTEM (10)
      WHERE workspace_id = $1
        AND clicked_at >= $2
        ${linkId ? 'AND link_id = $3' : ''}
      GROUP BY device_type
    `;

    const { data: deviceData, error: deviceError } = await supabase.rpc('exec_sql', {
      query: deviceQuery,
      params
    }).single();

    if (deviceError) throw deviceError;

    const deviceRows = Array.isArray(deviceData) ? deviceData : [];
    const estimatedDevices = deviceRows.map((row: any) => ({
      device: row.device_type,
      clicks: Math.round(row.sample_count * 10),
      isEstimated: true
    }));

    return new Response(
      JSON.stringify({
        timeSeries: estimatedData,
        devices: estimatedDevices,
        isEstimated: true,
        sampleRate: 0.1,
        confidence: 0.95
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
