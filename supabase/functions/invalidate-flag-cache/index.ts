const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Invalidating feature flags cache...');
    
    // Open Deno KV connection
    const kv = await Deno.openKv();
    
    // Delete the feature_flags_cache key from Deno KV
    await kv.delete(['feature_flags_cache']);
    
    console.log('Feature flags cache invalidated successfully');
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Flag cache invalidated',
        propagation_time: '0-60 seconds',
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  } catch (error) {
    console.error('Error invalidating flag cache:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }
});
