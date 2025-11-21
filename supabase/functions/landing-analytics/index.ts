import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalyticsEvent {
  session_id: string;
  event_type: 'page_view' | 'cta_click' | 'scroll_depth' | 'time_on_page';
  event_data?: Record<string, any>;
  hero_variant: number;
  user_agent?: string;
  ip_address?: string;
  referrer?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { session_id, event_type, event_data, hero_variant, user_agent, ip_address, referrer }: AnalyticsEvent = await req.json();

    // Validate required fields
    if (!session_id || !event_type || hero_variant === undefined) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if session exists, if not create it
    const { data: existingSession } = await supabaseClient
      .from('landing_page_sessions')
      .select('session_id')
      .eq('session_id', session_id)
      .maybeSingle();

    if (!existingSession) {
      // Create new session
      const { error: sessionError } = await supabaseClient
        .from('landing_page_sessions')
        .insert({
          session_id,
          hero_variant,
          user_agent: user_agent || req.headers.get('user-agent'),
          ip_address: ip_address || req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
          referrer: referrer || req.headers.get('referer'),
        });

      if (sessionError) {
        console.error('Error creating session:', sessionError);
        return new Response(
          JSON.stringify({ error: 'Failed to create session' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Insert event
    const { error: eventError } = await supabaseClient
      .from('landing_page_events')
      .insert({
        session_id,
        event_type,
        event_data,
        hero_variant,
      });

    if (eventError) {
      console.error('Error inserting event:', eventError);
      return new Response(
        JSON.stringify({ error: 'Failed to log event' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in landing-analytics function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
