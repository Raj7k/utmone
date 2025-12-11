import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token, user_id, user_email } = await req.json();

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Token is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[claim-invite] Processing claim for token: ${token.substring(0, 10)}...`);

    // Use service role to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Find the invite by token
    const { data: invite, error: inviteError } = await supabaseAdmin
      .from('early_access_invites')
      .select('*')
      .eq('invite_token', token)
      .single();

    if (inviteError || !invite) {
      console.error('[claim-invite] Invite not found:', inviteError);
      return new Response(
        JSON.stringify({ error: 'Invalid or expired invite token' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if already claimed
    if (invite.claimed_at) {
      console.log('[claim-invite] Invite already claimed');
      return new Response(
        JSON.stringify({ success: true, message: 'Invite already claimed' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check expiry
    if (new Date(invite.expires_at) < new Date()) {
      console.error('[claim-invite] Invite expired');
      return new Response(
        JSON.stringify({ error: 'Invite has expired' }),
        { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update invite as claimed
    const { error: updateError } = await supabaseAdmin
      .from('early_access_invites')
      .update({ claimed_at: new Date().toISOString() })
      .eq('id', invite.id);

    if (updateError) {
      console.error('[claim-invite] Failed to update invite:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to claim invite' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[claim-invite] Successfully claimed invite for ${invite.email}`);

    // Also update or create early_access_requests entry
    const emailToUse = user_email || invite.email;
    
    const { data: existingRequest } = await supabaseAdmin
      .from('early_access_requests')
      .select('id')
      .eq('email', emailToUse)
      .single();

    if (existingRequest) {
      // Update existing request
      await supabaseAdmin
        .from('early_access_requests')
        .update({
          status: 'approved',
          approval_timestamp: new Date().toISOString(),
          access_level: invite.access_level || 2,
        })
        .eq('id', existingRequest.id);
      
      console.log(`[claim-invite] Updated existing early_access_request for ${emailToUse}`);
    } else {
      // Create new request
      await supabaseAdmin
        .from('early_access_requests')
        .insert({
          email: emailToUse,
          name: 'Claimed via invite',
          team_size: 'unknown',
          status: 'approved',
          access_level: invite.access_level || 2,
          approval_timestamp: new Date().toISOString(),
        });
      
      console.log(`[claim-invite] Created early_access_request for ${emailToUse}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Invite claimed successfully',
        plan_tier: invite.plan_tier,
        plan_duration_days: invite.plan_duration_days
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[claim-invite] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
