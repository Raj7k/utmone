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

    // Get user's MFA settings with service role (to decrypt secret)
    const serviceSupabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: mfaSettings, error: mfaError } = await serviceSupabase
      .from('mfa_settings')
      .select('secret_encrypted')
      .eq('user_id', user.id)
      .single();

    if (mfaError || !mfaSettings) {
      return new Response(
        JSON.stringify({ error: 'MFA not set up' }),
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
      return new Response(
        JSON.stringify({ error: 'Invalid code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate recovery codes
    const recoveryCodes = generateRecoveryCodes(10);
    const hashedCodes = await Promise.all(
      recoveryCodes.map(code => hash(code))
    );

    // Enable 2FA and store hashed recovery codes
    const { error: updateError } = await serviceSupabase
      .from('mfa_settings')
      .update({
        is_enabled: true,
        recovery_codes_hashed: hashedCodes,
        last_verified_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({
        success: true,
        recoveryCodes // Return plaintext codes only once
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('TOTP verification error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
