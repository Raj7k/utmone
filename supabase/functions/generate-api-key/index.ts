import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.83.0';
import { createHash, randomBytes } from 'node:crypto';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
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
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { key_name, workspace_id, scopes, expires_at } = await req.json();

    // Generate API key
    const key = `utm_${randomBytes(32).toString('hex')}`;
    const hash = createHash('sha256').update(key).digest('hex');
    const prefix = key.substring(0, 12);

    // Insert into database
    const { data, error } = await supabaseClient
      .from('api_keys')
      .insert({
        key_name,
        key_hash: hash,
        key_prefix: prefix,
        workspace_id,
        created_by: user.id,
        scopes: scopes || ['links:read', 'links:write'],
        expires_at,
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ ...data, full_key: key }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
