import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create authenticated client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Verify requesting user is admin
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: adminRole, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (roleError || !adminRole) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { targetUserId, resetType } = await req.json();

    if (!targetUserId || !resetType) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!['totp', 'webauthn', 'all'].includes(resetType)) {
      return new Response(
        JSON.stringify({ error: 'Invalid reset type. Must be: totp, webauthn, or all' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use service role for admin operations
    const serviceSupabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Reset based on type
    const resetActions = [];

    if (resetType === 'webauthn' || resetType === 'all') {
      // Delete all WebAuthn authenticators
      const { error: webauthnError } = await serviceSupabase
        .from('user_authenticators')
        .delete()
        .eq('user_id', targetUserId);

      if (webauthnError) {
        console.error('WebAuthn reset error:', webauthnError);
        throw new Error('Failed to reset WebAuthn keys');
      }
      resetActions.push('WebAuthn keys removed');
    }

    if (resetType === 'totp' || resetType === 'all') {
      // Clear TOTP settings
      const { error: totpError } = await serviceSupabase
        .from('mfa_settings')
        .update({
          is_enabled: false,
          secret_encrypted: null,
          recovery_codes_hashed: [],
          admin_recovery_codes_hashed: [],
          backup_codes_downloaded: false,
          last_verified_at: null
        })
        .eq('user_id', targetUserId);

      if (totpError) {
        console.error('TOTP reset error:', totpError);
        throw new Error('Failed to reset TOTP');
      }
      resetActions.push('TOTP disabled');
    }

    // Log to audit trail
    const { error: auditError } = await serviceSupabase
      .from('admin_audit_logs')
      .insert({
        admin_user_id: user.id,
        action: 'mfa_reset',
        resource_type: 'user_mfa',
        resource_id: targetUserId,
        old_values: { reset_type: resetType },
        new_values: { actions: resetActions }
      });

    if (auditError) {
      console.error('Audit log error:', auditError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `MFA reset successful: ${resetActions.join(', ')}`,
        resetType,
        targetUserId
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('Admin MFA reset error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to reset MFA' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
