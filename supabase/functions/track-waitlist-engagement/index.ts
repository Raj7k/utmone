import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EngagementEvent {
  session_id: string;
  event_type: 'page_view' | 'form_start' | 'form_submit' | 'scroll_depth' | 'time_on_page' | 'click';
  event_data?: Record<string, any>;
  page_path?: string;
  referrer?: string;
  referral_code?: string;
  user_agent?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const {
      session_id,
      event_type,
      event_data,
      page_path,
      referrer,
      referral_code,
      user_agent,
    }: EngagementEvent = await req.json();

    // Validate required fields
    if (!session_id || !event_type) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find waitlist user by referral code if present
    let waitlistUserId: string | null = null;
    if (referral_code) {
      const { data: waitlistUser } = await supabaseClient
        .from('early_access_requests')
        .select('id')
        .eq('referral_code', referral_code)
        .single();
      
      waitlistUserId = waitlistUser?.id || null;
    }

    // Insert engagement event
    const { error: eventError } = await supabaseClient
      .from('waitlist_engagement_events')
      .insert({
        waitlist_user_id: waitlistUserId,
        session_id,
        event_type,
        event_data,
        page_path: page_path || '/',
        referrer: referrer || req.headers.get('referer'),
        user_agent: user_agent || req.headers.get('user-agent'),
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
      });

    if (eventError) {
      console.error('Error inserting engagement event:', eventError);
      return new Response(
        JSON.stringify({ error: 'Failed to track event' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update engagement score if user is identified
    if (waitlistUserId) {
      // Calculate engagement boost based on event type
      let scoreBoost = 0;
      switch (event_type) {
        case 'form_submit':
          scoreBoost = 20;
          break;
        case 'form_start':
          scoreBoost = 5;
          break;
        case 'scroll_depth':
          if (event_data?.depth === 100) scoreBoost = 3;
          break;
        case 'time_on_page':
          if (event_data?.seconds >= 120) scoreBoost = 5;
          break;
      }

      if (scoreBoost > 0) {
        // Fetch current score
        const { data: currentUser } = await supabaseClient
          .from('early_access_requests')
          .select('engagement_score')
          .eq('id', waitlistUserId)
          .single();
        
        const currentScore = currentUser?.engagement_score || 0;
        
        // Update with new score
        await supabaseClient
          .from('early_access_requests')
          .update({
            engagement_score: currentScore + scoreBoost,
          })
          .eq('id', waitlistUserId);
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in track-waitlist-engagement function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
