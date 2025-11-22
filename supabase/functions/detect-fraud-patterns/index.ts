import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FraudCheckRequest {
  userId: string;
  ipAddress?: string;
  referralCode?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { userId, ipAddress, referralCode }: FraudCheckRequest = await req.json();

    let fraudScore = 0;
    const detectionDetails: any = {};

    // Check 1: Duplicate email patterns
    const { data: user } = await supabase
      .from('early_access_requests')
      .select('email, created_at')
      .eq('id', userId)
      .single();

    if (user) {
      const emailDomain = user.email.split('@')[1];
      
      // Check for disposable email domains
      const disposableDomains = ['tempmail.com', 'guerrillamail.com', 'mailinator.com', '10minutemail.com'];
      if (disposableDomains.includes(emailDomain)) {
        fraudScore += 40;
        detectionDetails.disposable_email = true;
      }

      // Check for multiple signups from same email domain
      const { count } = await supabase
        .from('early_access_requests')
        .select('*', { count: 'exact', head: true })
        .eq('email', user.email);

      if (count && count > 1) {
        fraudScore += 30;
        detectionDetails.duplicate_email = true;
      }
    }

    // Check 2: IP address patterns
    if (ipAddress) {
      const { count: ipCount } = await supabase
        .from('waitlist_engagement_events')
        .select('*', { count: 'exact', head: true })
        .eq('ip_address', ipAddress);

      if (ipCount && ipCount > 10) {
        fraudScore += 25;
        detectionDetails.suspicious_ip = true;
      }
    }

    // Check 3: Referral patterns
    if (referralCode) {
      const { data: referrer } = await supabase
        .from('early_access_requests')
        .select('id, created_at')
        .eq('referral_code', referralCode)
        .single();

      if (referrer && user) {
        // Check if referred user signed up suspiciously close to referrer
        const timeDiff = new Date(user.created_at).getTime() - new Date(referrer.created_at).getTime();
        if (timeDiff < 60000) { // Less than 1 minute
          fraudScore += 35;
          detectionDetails.suspicious_referral_timing = true;
        }
      }

      // Check for circular referrals
      const { count: circularCount } = await supabase
        .from('early_access_requests')
        .select('*', { count: 'exact', head: true })
        .or(`referral_code.eq.${referralCode},referred_by.eq.${userId}`);

      if (circularCount && circularCount > 2) {
        fraudScore += 30;
        detectionDetails.circular_referral = true;
      }
    }

    // Check 4: Engagement patterns (bot detection)
    const { data: events } = await supabase
      .from('waitlist_engagement_events')
      .select('event_type, created_at')
      .eq('waitlist_user_id', userId)
      .order('created_at', { ascending: true })
      .limit(20);

    if (events && events.length > 5) {
      // Check for rapid sequential events (bot-like behavior)
      let rapidEvents = 0;
      for (let i = 1; i < events.length; i++) {
        const timeDiff = new Date(events[i].created_at).getTime() - 
                        new Date(events[i-1].created_at).getTime();
        if (timeDiff < 1000) { // Less than 1 second between events
          rapidEvents++;
        }
      }

      if (rapidEvents > 3) {
        fraudScore += 45;
        detectionDetails.bot_like_behavior = true;
      }
    }

    // Update user's fraud score
    const isFlagged = fraudScore >= 60;
    
    await supabase
      .from('early_access_requests')
      .update({ 
        fraud_risk_score: fraudScore,
        is_flagged: isFlagged
      })
      .eq('id', userId);

    // Log fraud detection
    if (fraudScore > 0) {
      await supabase
        .from('fraud_detection_logs')
        .insert({
          user_id: userId,
          detection_type: 'automated_scan',
          risk_score: fraudScore,
          details: detectionDetails,
        });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        fraud_score: fraudScore,
        is_flagged: isFlagged,
        details: detectionDetails
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});