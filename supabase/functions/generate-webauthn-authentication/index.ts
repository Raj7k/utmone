import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { generateAuthenticationOptions } from 'https://esm.sh/@simplewebauthn/server@9.0.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Get user's registered authenticators
    const { data: authenticators, error: authError } = await supabase
      .from('user_authenticators')
      .select('credential_id')
      .eq('user_id', user.id);

    if (authError || !authenticators || authenticators.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No security keys registered' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const rpID = new URL(supabaseUrl).hostname.replace('supabase.co', 'lovableproject.com');
    
    const options = await generateAuthenticationOptions({
      rpID,
      allowCredentials: authenticators.map(auth => ({
        id: Uint8Array.from(atob(auth.credential_id), c => c.charCodeAt(0)),
        type: 'public-key' as const,
      })),
      userVerification: 'preferred',
    });

    // Store challenge for verification
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ mfa_challenge: options.challenge })
      .eq('id', user.id);

    if (updateError) {
      console.error('Failed to store challenge:', updateError);
    }

    return new Response(
      JSON.stringify(options),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating authentication options:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
