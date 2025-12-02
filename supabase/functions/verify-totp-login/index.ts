import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { authenticator } from "npm:otplib@12.0.1";
import { compare } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, isRecoveryCode = false } = await req.json();

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

    const serviceSupabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: mfaSettings, error: mfaError } = await serviceSupabase
      .from('mfa_settings')
      .select('secret_encrypted, recovery_codes_hashed, is_enabled')
      .eq('user_id', user.id)
      .single();

    if (mfaError || !mfaSettings || !mfaSettings.is_enabled) {
      return new Response(
        JSON.stringify({ error: 'MFA not enabled' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let isValid = false;
    let usedRecoveryCode = false;

    if (isRecoveryCode) {
      // Verify recovery code
      const recoveryCodes = mfaSettings.recovery_codes_hashed || [];
      
      for (let i = 0; i < recoveryCodes.length; i++) {
        const matches = await compare(code, recoveryCodes[i]);
        if (matches) {
          isValid = true;
          usedRecoveryCode = true;
          
          // Remove the used recovery code
          recoveryCodes.splice(i, 1);
          await serviceSupabase
            .from('mfa_settings')
            .update({ recovery_codes_hashed: recoveryCodes })
            .eq('user_id', user.id);
          
          // TODO: Send email alert about recovery code usage
          console.log(`Recovery code used for user ${user.id}`);
          
          break;
        }
      }
    } else {
      // Verify TOTP code
      const { data: decryptedSecret } = await serviceSupabase
        .rpc('decrypt_sensitive_data', {
          ciphertext: mfaSettings.secret_encrypted,
          encryption_key: Deno.env.get('ENCRYPTION_KEY') || 'default-key-change-me'
        });

      isValid = authenticator.verify({
        token: code,
        secret: decryptedSecret
      });
    }

    if (!isValid) {
      return new Response(
        JSON.stringify({ error: 'Invalid code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update last verified timestamp
    await serviceSupabase
      .from('mfa_settings')
      .update({ last_verified_at: new Date().toISOString() })
      .eq('user_id', user.id);

    return new Response(
      JSON.stringify({
        success: true,
        usedRecoveryCode
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('TOTP login verification error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
