import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { authenticator } from "npm:otplib@12.0.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    // Generate TOTP secret
    const secret = authenticator.generateSecret();

    // Get user email for QR code label
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single();

    const email = profile?.email || user.email || 'user@utm.one';

    // Generate otpauth URL for QR code
    const otpauthUrl = authenticator.keyuri(
      email,
      'utm.one',
      secret
    );

    // Encrypt the secret before storing (using Supabase encryption)
    const serviceSupabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: encryptedData, error: encryptError } = await serviceSupabase
      .rpc('encrypt_sensitive_data', {
        plaintext: secret,
        encryption_key: Deno.env.get('ENCRYPTION_KEY') || 'default-key-change-me'
      });

    if (encryptError) throw encryptError;

    // Store encrypted secret temporarily (not enabled yet)
    const { error: insertError } = await supabaseClient
      .from('mfa_settings')
      .upsert({
        user_id: user.id,
        secret_encrypted: encryptedData,
        is_enabled: false,
        backup_codes_downloaded: false
      });

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({
        secret,
        otpauthUrl,
        qrCodeData: otpauthUrl
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('TOTP setup error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
