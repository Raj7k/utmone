import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Get geolocation from IP using ipapi.co (free tier: 1000 requests/day)
async function getGeolocation(ip: string) {
  try {
    // Skip geolocation for localhost/private IPs
    if (ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip === '::1') {
      return { country: null, city: null };
    }
    
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { 'User-Agent': 'utm.one URL Shortener' }
    });
    
    if (!response.ok) {
      console.warn(`Geolocation API error for IP ${ip}: ${response.status}`);
      return { country: null, city: null };
    }
    
    const data = await response.json();
    return {
      country: data.country_name || null,
      city: data.city || null
    };
  } catch (error) {
    console.error('Geolocation error:', error);
    return { country: null, city: null };
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting background geolocation processing...');
    
    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Fetch clicks that need geolocation enrichment
    // Query uses idx_link_clicks_geolocation_pending index for efficiency
    const { data: clicks, error: fetchError } = await supabase
      .from('link_clicks')
      .select('id, ip_address')
      .is('country', null)
      .not('ip_address', 'is', null)
      .order('clicked_at', { ascending: false })
      .limit(100); // Process 100 clicks per run (adjust based on API limits)
    
    if (fetchError) {
      console.error('Error fetching clicks:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch clicks', details: fetchError }), 
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    if (!clicks || clicks.length === 0) {
      console.log('No clicks need geolocation processing');
      return new Response(
        JSON.stringify({ message: 'No clicks to process', processed: 0 }), 
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    console.log(`Processing geolocation for ${clicks.length} clicks`);
    
    // Process each click
    let successCount = 0;
    let errorCount = 0;
    
    for (const click of clicks) {
      try {
        // Fetch geolocation data
        const { country, city } = await getGeolocation(click.ip_address);
        
        // Update click record with geolocation data
        const { error: updateError } = await supabase
          .from('link_clicks')
          .update({
            country: country,
            city: city
          })
          .eq('id', click.id);
        
        if (updateError) {
          console.error(`Error updating click ${click.id}:`, updateError);
          errorCount++;
        } else {
          successCount++;
        }
        
        // Small delay to avoid hitting API rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`Error processing click ${click.id}:`, error);
        errorCount++;
      }
    }
    
    console.log(`Geolocation processing complete: ${successCount} success, ${errorCount} errors`);
    
    return new Response(
      JSON.stringify({ 
        message: 'Geolocation processing complete',
        processed: successCount,
        errors: errorCount,
        total: clicks.length
      }), 
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Background geolocation processing error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
