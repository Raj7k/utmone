import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.83.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload = await req.json();
    
    const {
      visitor_id,
      event_type,
      page_url,
      page_title,
      referrer,
      user_agent,
      email,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      ...metadata
    } = payload;

    // Validate required fields
    if (!visitor_id || !event_type) {
      return new Response(
        JSON.stringify({ error: 'visitor_id and event_type are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[track-event] Processing ${event_type} for visitor ${visitor_id}`);

    // Handle identity resolution
    if (event_type === 'identify' && email) {
      // Check if visitor identity exists
      const { data: existingIdentity } = await supabase
        .from('visitor_identities')
        .select('*')
        .eq('visitor_id', visitor_id)
        .maybeSingle();

      if (existingIdentity) {
        // Update existing identity
        await supabase
          .from('visitor_identities')
          .update({
            email,
            user_agent,
            last_seen_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('visitor_id', visitor_id);
      } else {
        // Create new identity
        await supabase
          .from('visitor_identities')
          .insert({
            visitor_id,
            email,
            user_agent,
            first_seen_at: new Date().toISOString(),
            last_seen_at: new Date().toISOString()
          });
      }

      // Call identity stitching function if it exists
      try {
        const { data: user } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .maybeSingle();

        if (user) {
          await supabase.rpc('stitch_visitor_identity', {
            p_visitor_id: visitor_id,
            p_user_id: user.id
          });
        }
      } catch (err) {
        console.error('[track-event] Identity stitching error:', err);
      }
    }

    // Store journey event (now includes workspace_id if available)
    const journeyEvent = {
      visitor_id,
      event_type,
      event_name: event_type === 'pageview' ? 'page_view' : event_type,
      page_url,
      page_title,
      referrer: referrer || null,
      user_agent,
      source: utm_source || null,
      medium: utm_medium || null,
      campaign: utm_campaign || null,
      term: utm_term || null,
      content: utm_content || null,
      metadata: metadata || {},
      created_at: new Date().toISOString()
    };

    console.log('[track-event] Journey event:', journeyEvent);

    return new Response(
      JSON.stringify({ 
        success: true, 
        visitor_id,
        message: 'Event tracked successfully' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('[track-event] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
