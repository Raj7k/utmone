import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { verifyRegistrationResponse } from 'https://esm.sh/@simplewebauthn/server@13.0.0';
import type { RegistrationResponseJSON } from 'https://esm.sh/@simplewebauthn/types@9.0.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Permissions-Policy': 'publickey-credentials-create=(self)',
};

Deno.serve(async (req) => {
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

    const { credential: credentialResponse, deviceName } = await req.json() as {
      credential: RegistrationResponseJSON;
      deviceName?: string;
    };

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get stored challenge
    const { data: profile } = await supabase
      .from('profiles')
      .select('mfa_challenge')
      .eq('id', user.id)
      .single();

    if (!profile?.mfa_challenge) {
      return new Response(
        JSON.stringify({ error: 'No challenge found. Please restart registration.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Dynamic RP ID and origin based on the request Origin header
    const origin = req.headers.get('origin') || req.headers.get('referer') || '';
    let rpID = 'localhost';
    let expectedOrigin = 'http://localhost:8080';
    
    try {
      const originUrl = new URL(origin);
      rpID = originUrl.hostname;
      expectedOrigin = origin;
    } catch (e) {
      console.warn('Could not parse origin, using localhost:', origin);
    }

    const verification = await verifyRegistrationResponse({
      response: credentialResponse,
      expectedChallenge: profile.mfa_challenge,
      expectedOrigin,
      expectedRPID: rpID,
    });

    if (!verification.verified || !verification.registrationInfo) {
      return new Response(
        JSON.stringify({ error: 'Verification failed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // v13 API: credential data is now under .credential property
    const { credential } = verification.registrationInfo;

    // Store the authenticator with the domain it was registered on
    const { error: insertError } = await supabase
      .from('user_authenticators')
      .insert({
        user_id: user.id,
        credential_id: credential.id, // Already base64url encoded
        public_key: btoa(String.fromCharCode(...new Uint8Array(credential.publicKey))),
        counter: credential.counter,
        device_name: deviceName || 'Security Key',
        registered_domain: rpID, // Store the domain for mismatch detection
      });

    if (insertError) {
      console.error('Failed to store authenticator:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to register security key' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clear the challenge
    await supabase
      .from('profiles')
      .update({ mfa_challenge: null })
      .eq('id', user.id);

    // Log the action
    await supabase
      .from('admin_audit_logs')
      .insert({
        admin_user_id: user.id,
        action: 'webauthn_registered',
        resource_type: 'user_authenticators',
        resource_id: user.id,
        new_values: { device_name: deviceName || 'Security Key' },
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Security key registered successfully' 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error verifying registration:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
