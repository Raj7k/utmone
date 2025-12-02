import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { generateRegistrationOptions } from 'https://esm.sh/@simplewebauthn/server@9.0.3';

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

    // Verify user is admin
    const { data: adminRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!adminRole) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user's email
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single();

    // Get existing authenticators for this user
    const { data: existingAuthenticators } = await supabase
      .from('user_authenticators')
      .select('credential_id, counter')
      .eq('user_id', user.id);

    // Dynamic RP ID based on the Origin header
    const origin = req.headers.get('origin') || req.headers.get('referer') || '';
    let rpID = 'localhost';
    try {
      const originUrl = new URL(origin);
      rpID = originUrl.hostname;
    } catch (e) {
      console.warn('Could not parse origin, using localhost:', origin);
    }

    const rpName = 'utm.one';
    
    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: user.id,
      userName: profile?.email || user.email || user.id,
      attestationType: 'none',
      excludeCredentials: existingAuthenticators?.map(auth => ({
        id: Uint8Array.from(atob(auth.credential_id), c => c.charCodeAt(0)),
        type: 'public-key' as const,
      })) || [],
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
        authenticatorAttachment: 'cross-platform',
      },
      timeout: 60000,
    });

    // Store challenge in session for verification
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        mfa_challenge: options.challenge,
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Failed to store challenge:', updateError);
    }

    return new Response(
      JSON.stringify(options),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating registration options:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
