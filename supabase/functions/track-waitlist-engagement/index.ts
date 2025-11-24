import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EngagementEvent {
  sessionId: string;
  eventType: string;
  eventData?: any;
  pagePath?: string;
  referrer?: string;
  referralCode?: string;
  userAgent?: string;
}

/**
 * Calculate Engagement Score based on user activity
 * 
 * Engagement Score Formula (0-50 points):
 * - Email opens: +2 each (max 10 points)
 * - Email clicks: +3 each (max 12 points)
 * - Site visits: +1 each (max 10 points)
 * - Feature page visits: +2 each (max 8 points)
 * - Onboarding profile complete: +10 points
 */
async function calculateEngagementScore(supabase: any, userId: string): Promise<number> {
  let score = 0;

  // Get all engagement events for this user
  const { data: events, error } = await supabase
    .from('waitlist_engagement_events')
    .select('event_type, event_data, created_at')
    .eq('waitlist_user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching events for ${userId}:`, error);
    return 0;
  }

  // Count event types
  const emailOpens = events?.filter((e: any) => e.event_type === 'email_open').length || 0;
  const emailClicks = events?.filter((e: any) => e.event_type === 'email_click').length || 0;
  const siteVisits = events?.filter((e: any) => e.event_type === 'page_view').length || 0;
  const featurePageVisits = events?.filter((e: any) => 
    e.event_type === 'page_view' && 
    (e.event_data?.page_path?.includes('/solutions/') || 
     e.event_data?.page_path?.includes('/features/'))
  ).length || 0;
  const profileComplete = events?.some((e: any) => e.event_type === 'onboarding_complete') || false;

  // Calculate score based on formula
  score += Math.min(emailOpens * 2, 10); // Max 10 points
  score += Math.min(emailClicks * 3, 12); // Max 12 points
  score += Math.min(siteVisits * 1, 10); // Max 10 points
  score += Math.min(featurePageVisits * 2, 8); // Max 8 points
  score += profileComplete ? 10 : 0;

  // Bot detection penalty
  const recentEvents = events?.filter((e: any) => {
    const eventTime = new Date(e.created_at).getTime();
    const now = Date.now();
    return (now - eventTime) < 60000; // Last 60 seconds
  }) || [];

  if (recentEvents.length > 20) {
    console.log(`Bot pattern detected for ${userId}: ${recentEvents.length} events in 60s`);
    score = Math.max(0, score - 50); // Penalty
  }

  return Math.min(score, 50); // Cap at 50 points
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const {
      sessionId,
      eventType,
      eventData,
      pagePath,
      referrer,
      referralCode,
      userAgent,
    }: EngagementEvent = await req.json();

    // Validate required sessionId
    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: 'sessionId is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get IP address
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('x-real-ip') || 
                     'unknown';

    // Find or link to waitlist user by session or referral code
    let waitlistUserId: string | null = null;

    if (referralCode) {
      const { data: referrer } = await supabase
        .from('early_access_requests')
        .select('id')
        .eq('referral_code', referralCode)
        .single();

      if (referrer) {
        waitlistUserId = referrer.id;
      }
    }

    // Insert engagement event
    const { error: insertError } = await supabase
      .from('waitlist_engagement_events')
      .insert({
        session_id: sessionId,
        event_type: eventType,
        event_data: eventData,
        page_path: pagePath,
        referrer,
        ip_address: ipAddress,
        user_agent: userAgent,
        waitlist_user_id: waitlistUserId,
      });

    if (insertError) throw insertError;

    // If we have a user, recalculate their engagement score
    if (waitlistUserId) {
      const engagementScore = await calculateEngagementScore(supabase, waitlistUserId);

      // Get current scores
      const { data: current } = await supabase
        .from('early_access_requests')
        .select('referral_score, fit_score')
        .eq('id', waitlistUserId)
        .single();

      const referralScore = current?.referral_score || 0;
      const fitScore = current?.fit_score || 0;
      const totalAccessScore = engagementScore + referralScore + fitScore;

      // Update engagement score
      const { error: updateError } = await supabase
        .from('early_access_requests')
        .update({
          engagement_score: engagementScore,
          total_access_score: totalAccessScore,
          updated_at: new Date().toISOString(),
        })
        .eq('id', waitlistUserId);

      if (updateError) {
        console.error('Error updating engagement score:', updateError);
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error tracking engagement:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);
