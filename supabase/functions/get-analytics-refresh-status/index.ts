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
    console.log('Fetching analytics refresh status from database...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get last refresh metrics from database
    const { data: lastRun, error } = await supabase
      .from('analytics_refresh_status')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !lastRun) {
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

    return new Response(
      JSON.stringify({
        timestamp: lastRun.timestamp,
        duration_ms: lastRun.duration_ms,
        status: lastRun.status,
        error: lastRun.error,
      }),
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
