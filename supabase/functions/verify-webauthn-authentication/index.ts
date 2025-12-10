import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { verifyAuthenticationResponse } from 'https://esm.sh/@simplewebauthn/server@13.0.0';
import type { AuthenticationResponseJSON } from 'https://esm.sh/@simplewebauthn/types@9.0.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Permissions-Policy': 'publickey-credentials-get=(self)',
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

    const { credential } = await req.json() as {
      credential: AuthenticationResponseJSON;
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
        JSON.stringify({ error: 'No challenge found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the authenticator from credential ID
    // credential.rawId is base64url encoded string in the response
    const { data: authenticator } = await supabase
      .from('user_authenticators')
      .select('*')
      .eq('credential_id', credential.id)
      .eq('user_id', user.id)
      .single();

    if (!authenticator) {
      return new Response(
        JSON.stringify({ error: 'Authenticator not found' }),
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

    // v13 API: credential object structure changed
    // SAFE MODE: Match 'discouraged' setting from authentication options
    const verification = await verifyAuthenticationResponse({
      response: credential,
      expectedChallenge: profile.mfa_challenge,
      expectedOrigin,
      expectedRPID: rpID,
      requireUserVerification: false, // SAFE MODE: Allow keys without PIN/biometric
      credential: {
        id: authenticator.credential_id, // base64url string
        publicKey: Uint8Array.from(atob(authenticator.public_key), c => c.charCodeAt(0)),
        counter: authenticator.counter,
      },
    });

    if (!verification.verified) {
      return new Response(
        JSON.stringify({ error: 'Verification failed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update counter and last used
    await supabase
      .from('user_authenticators')
      .update({
        counter: verification.authenticationInfo.newCounter,
        last_used_at: new Date().toISOString(),
      })
      .eq('id', authenticator.id);

    // Update MFA verification timestamp (valid for 12 hours)
    await supabase
      .from('profiles')
      .update({
        mfa_verified_at: new Date().toISOString(),
        mfa_challenge: null,
      })
      .eq('id', user.id);

    // Get client info for audit log
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ipAddress = forwardedFor?.split(',')[0]?.trim() || 'unknown';
    const userAgent = req.headers.get('user-agent') || '';

    // Log to admin_audit_logs (existing)
    await supabase
      .from('admin_audit_logs')
      .insert({
        admin_user_id: user.id,
        action: 'webauthn_verified',
        resource_type: 'user_authenticators',
        resource_id: user.id,
        new_values: { device_name: authenticator.device_name },
        ip_address: ipAddress,
        user_agent: userAgent,
      });

    // Log to mfa_audit_log (new detailed log)
    await supabase
      .from('mfa_audit_log')
      .insert({
        user_id: user.id,
        action: 'webauthn_authentication',
        success: true,
        ip_address: ipAddress,
        user_agent: userAgent,
        domain: rpID,
        metadata: { device_name: authenticator.device_name }
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Authentication successful',
        expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error verifying authentication:', error);
    
    // Try to log failure (may fail if we don't have user context)
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      const forwardedFor = req.headers.get('x-forwarded-for');
      const ipAddress = forwardedFor?.split(',')[0]?.trim() || 'unknown';
      
      await supabase.from('mfa_audit_log').insert({
        user_id: null,
        action: 'webauthn_authentication_failed',
        success: false,
        ip_address: ipAddress,
        user_agent: req.headers.get('user-agent') || '',
        metadata: { error: (error as Error).message }
      });
    } catch {}

    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
