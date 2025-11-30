import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SignupRequest {
  email: string;
  name: string;
  team_size: string;
  reason_for_joining?: string;
  referral_code?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { email, name, team_size, reason_for_joining, referral_code }: SignupRequest = await req.json();

    console.log('[Referral Signup] Processing signup:', { email, referral_code });

    // Check if email already exists
    const { data: existing } = await supabase
      .from('early_access_requests')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return new Response(
        JSON.stringify({ error: 'Email already registered' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find referrer if referral code provided
    let referrerId: string | null = null;
    let referrerName: string | null = null;
    
    if (referral_code) {
      const { data: referrer } = await supabase
        .from('early_access_requests')
        .select('id, name')
        .eq('referral_code', referral_code)
        .single();

      if (referrer) {
        referrerId = referrer.id;
        referrerName = referrer.name;
        console.log('[Referral Signup] Found referrer:', { referrerId, referrerName });
      }
    }

    // Create new waitlist entry
    const { data: newRequest, error: insertError } = await supabase
      .from('early_access_requests')
      .insert({
        email,
        name,
        team_size,
        reason_for_joining,
        referred_by: referrerId,
        status: 'pending',
      })
      .select()
      .single();

    if (insertError) {
      console.error('[Referral Signup] Insert error:', insertError);
      throw insertError;
    }

    // Increment referrer's count if valid referral
    if (referrerId) {
      const { error: countError } = await supabase.rpc('increment_referral_count', {
        referrer_id: referrerId,
      });

      if (countError) {
        console.error('[Referral Signup] Failed to increment referral count:', countError);
      } else {
        console.log('[Referral Signup] Incremented referral count for:', referrerId);
        
        // Check if referrer just unlocked access
        const { data: updatedReferrer } = await supabase
          .from('early_access_requests')
          .select('referral_count, status, email, name')
          .eq('id', referrerId)
          .single();

        if (updatedReferrer?.status === 'approved' && updatedReferrer.referral_count === 3) {
          // Send "You're In!" email to referrer
          await supabase.functions.invoke('send-referral-unlock-email', {
            body: {
              email: updatedReferrer.email,
              name: updatedReferrer.name,
              referral_count: updatedReferrer.referral_count,
            },
          });
        }
      }
    }

    // Send confirmation email to new signup
    await supabase.functions.invoke('send-applicant-confirmation', {
      body: {
        email,
        name,
        referrer_name: referrerName,
      },
    });

    // Update all positions
    await supabase.rpc('update_waitlist_positions');

    // Get final position
    const { data: updatedRequest } = await supabase
      .from('early_access_requests')
      .select('position, referral_code')
      .eq('id', newRequest.id)
      .single();

    return new Response(
      JSON.stringify({
        success: true,
        position: updatedRequest?.position,
        referral_code: updatedRequest?.referral_code,
        referred_by: referrerName,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[Referral Signup] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
