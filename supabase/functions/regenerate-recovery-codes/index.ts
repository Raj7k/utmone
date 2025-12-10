import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { authenticator } from "npm:otplib@12.0.1";
import { hash } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function generateRecoveryCodes(count = 10): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const code = Array.from({ length: 8 }, () => 
      Math.random().toString(36).charAt(2).toUpperCase()
    ).join('');
    codes.push(code);
  }
  return codes;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code } = await req.json();
    const origin = req.headers.get('origin') || '';
    const userAgent = req.headers.get('user-agent') || '';
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ipAddress = forwardedFor?.split(',')[0]?.trim() || 'unknown';

    let domain = 'unknown';
    try {
      const originUrl = new URL(origin);
      domain = originUrl.hostname;
    } catch {}

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user's MFA settings with service role
    const serviceSupabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: mfaSettings, error: mfaError } = await serviceSupabase
      .from('mfa_settings')
      .select('secret_encrypted, is_enabled')
      .eq('user_id', user.id)
      .single();

    if (mfaError || !mfaSettings || !mfaSettings.is_enabled) {
      // Log failed attempt
      await serviceSupabase.from('mfa_audit_log').insert({
        user_id: user.id,
        action: 'recovery_codes_regenerated',
        success: false,
        ip_address: ipAddress,
        user_agent: userAgent,
        domain,
        metadata: { reason: 'MFA not enabled' }
      });

      return new Response(
        JSON.stringify({ error: '2FA is not enabled' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Decrypt the secret
    const { data: decryptedSecret, error: decryptError } = await serviceSupabase
      .rpc('decrypt_sensitive_data', {
        ciphertext: mfaSettings.secret_encrypted,
        encryption_key: Deno.env.get('ENCRYPTION_KEY') || 'default-key-change-me'
      });

    if (decryptError) throw decryptError;

    // Verify the TOTP code
    const isValid = authenticator.verify({
      token: code,
      secret: decryptedSecret
    });

    if (!isValid) {
      // Log failed verification
      await serviceSupabase.from('mfa_audit_log').insert({
        user_id: user.id,
        action: 'recovery_codes_regenerated',
        success: false,
        ip_address: ipAddress,
        user_agent: userAgent,
        domain,
        metadata: { reason: 'Invalid TOTP code' }
      });

      return new Response(
        JSON.stringify({ error: 'Invalid verification code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate new recovery codes
    const recoveryCodes = generateRecoveryCodes(10);
    const hashedCodes = await Promise.all(
      recoveryCodes.map(c => hash(c))
    );

    // Update recovery codes
    const { error: updateError } = await serviceSupabase
      .from('mfa_settings')
      .update({
        recovery_codes_hashed: hashedCodes,
        backup_codes_downloaded: false
      })
      .eq('user_id', user.id);

    if (updateError) throw updateError;

    // Log success
    await serviceSupabase.from('mfa_audit_log').insert({
      user_id: user.id,
      action: 'recovery_codes_regenerated',
      success: true,
      ip_address: ipAddress,
      user_agent: userAgent,
      domain,
      metadata: { codes_generated: recoveryCodes.length }
    });

    console.log(`Recovery codes regenerated for user ${user.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        recoveryCodes
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('Recovery code regeneration error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});