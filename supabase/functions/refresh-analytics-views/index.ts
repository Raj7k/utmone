import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting analytics materialized views refresh...');
    
    const startTime = Date.now();
    
    // Call the refresh function
    const { error } = await supabase.rpc('refresh_analytics_views');
    
    if (error) {
      console.error('Error refreshing views:', error);
      throw error;
    }
    
    const duration = Date.now() - startTime;
    console.log(`Successfully refreshed all materialized views in ${duration}ms`);

    // Store metrics in Deno KV for monitoring
    const kv = await Deno.openKv();
    await kv.set(['analytics_refresh', 'last_run'], {
      timestamp: new Date().toISOString(),
      duration_ms: duration,
      status: 'success'
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        duration_ms: duration,
        refreshed_at: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in refresh-analytics-views:', errorMessage);
    
    // Store error in Deno KV for monitoring
    const kv = await Deno.openKv();
    await kv.set(['analytics_refresh', 'last_run'], {
      timestamp: new Date().toISOString(),
      status: 'error',
      error: errorMessage
    });

    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
