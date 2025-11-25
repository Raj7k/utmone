import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if Google Safe Browsing API key is configured
    const apiKey = Deno.env.get('GOOGLE_SAFE_BROWSING_API_KEY');
    if (!apiKey) {
      console.warn('Google Safe Browsing API key not configured, skipping check');
      return new Response(
        JSON.stringify({ 
          blacklisted: false, 
          status: 'unchecked',
          message: 'Blacklist check not configured'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call Google Safe Browsing API
    const safeBrowsingUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;
    
    const payload = {
      client: {
        clientId: 'utm-one',
        clientVersion: '1.0.0'
      },
      threatInfo: {
        threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
        platformTypes: ['ANY_PLATFORM'],
        threatEntryTypes: ['URL'],
        threatEntries: [{ url }]
      }
    };

    const response = await fetch(safeBrowsingUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Google Safe Browsing API error: ${response.statusText}`);
    }

    const result = await response.json();
    
    // Check if any threats were found
    const threatsFound = result.matches && result.matches.length > 0;
    const threatTypes = threatsFound ? result.matches.map((m: any) => m.threatType) : [];

    // Update link blacklist status in database
    const linkId = req.headers.get('x-link-id');
    if (linkId) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      
      if (supabaseUrl && supabaseKey) {
        try {
          const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.38.4');
          const supabase = createClient(supabaseUrl, supabaseKey);
          
          await supabase
            .from('links')
            .update({ 
              blacklist_status: threatsFound ? 'flagged' : 'clean',
              security_status: threatsFound ? 'threats_detected' : 'safe'
            })
            .eq('id', linkId);
        } catch (dbError) {
          console.error('Failed to update blacklist status:', dbError);
        }
      }
    }

    return new Response(
      JSON.stringify({
        blacklisted: threatsFound,
        status: threatsFound ? 'flagged' : 'clean',
        threatTypes,
        checkedAt: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Blacklist check error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message, status: 'error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
