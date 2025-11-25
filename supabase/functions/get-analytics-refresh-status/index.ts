const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching analytics refresh status from Deno KV...');

    // Get last refresh metrics from Deno KV (stored by refresh-analytics-views function)
    const kv = await Deno.openKv();
    const lastRun = await kv.get(['analytics_refresh', 'last_run']);

    if (!lastRun.value) {
      return new Response(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          duration_ms: 0,
          status: 'no_data',
          message: 'No refresh data available yet',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const metrics = lastRun.value as {
      timestamp: string;
      duration_ms?: number;
      status: string;
      error?: string;
    };

    return new Response(
      JSON.stringify(metrics),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error fetching analytics refresh status:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch status', 
        details: errorMessage,
        status: 'error',
        timestamp: new Date().toISOString(),
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
