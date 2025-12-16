import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { checkEmailQuality } from '../_shared/emailQuality.ts';

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

    const quality = checkEmailQuality(email);
    if (!quality.ok) {
      return new Response(
        JSON.stringify({
          error: 'Invalid email',
          reason: quality.reason,
          suggestion: quality.suggestion,
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const normalizedEmail = quality.normalizedEmail || email.trim().toLowerCase();

    // Check if user has a valid direct invite - if so, auto-approve
    const { data: validInvite } = await supabase
      .from('early_access_invites')
      .select('access_level, plan_tier')
      .eq('email', normalizedEmail)
      .is('claimed_at', null)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (validInvite) {
      console.log('[Referral Signup] User has valid invite, auto-approving:', email);
      
      // Create approved entry directly
      const { data: approvedRequest, error: approveError } = await supabase
        .from('early_access_requests')
        .upsert({
          email: normalizedEmail,
          name,
          team_size,
          reason_for_joining,
          status: 'approved',
          access_level: validInvite.access_level,
          approval_timestamp: new Date().toISOString(),
        }, { onConflict: 'email' })
        .select('position, referral_code')
        .single();

      if (approveError) {
        console.error('[Referral Signup] Auto-approve error:', approveError);
        throw approveError;
      }

      return new Response(
        JSON.stringify({
          success: true,
          position: 1, // Top of list since approved
          referral_code: approvedRequest?.referral_code,
          auto_approved: true,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if email already exists in waitlist
    const { data: existing } = await supabase
      .from('early_access_requests')
      .select('id')
      .eq('email', normalizedEmail)
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
        email: normalizedEmail,
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

    // Increment referral count immediately on signup
    // The verification trigger provides a secondary check for fraud prevention
    if (referrerId) {
      console.log(`[Referral Signup] Incrementing referral count for ${referrerId}`);
      
      try {
        await supabase.rpc('increment_referral_count', { referrer_id: referrerId });
        console.log(`[Referral Signup] Successfully incremented referral count for ${referrerId}`);
      } catch (countError) {
        console.error('[Referral Signup] Failed to increment referral count:', countError);
        // Don't fail the signup if referral count fails
      }
    }

    // Send confirmation email to new signup
    await supabase.functions.invoke('send-applicant-confirmation', {
      body: {
        email: normalizedEmail,
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
