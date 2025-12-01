import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { getSecureCorsHeaders } from '../_shared/security-headers.ts';

const corsHeaders = getSecureCorsHeaders();

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body
    const body = await req.json();
    const { visitor_id, pixel_id, email, name } = body;

    if (!visitor_id || !pixel_id || !email) {
      return new Response(
        JSON.stringify({ error: 'visitor_id, pixel_id, and email are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Identifying visitor: ${visitor_id}, email: ${email}`);

    // Verify pixel_id exists and get workspace
    const { data: pixelConfig, error: pixelError } = await supabase
      .from('pixel_configs')
      .select('workspace_id, is_active')
      .eq('pixel_id', pixel_id)
      .eq('is_active', true)
      .single();

    if (pixelError || !pixelConfig) {
      console.error('Invalid pixel_id:', pixel_id);
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid pixel_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Upsert visitor identity
    const { error: upsertError } = await supabase
      .from('visitor_identities')
      .upsert({
        visitor_id,
        workspace_id: pixelConfig.workspace_id,
        email,
        name,
        identified_at: new Date().toISOString(),
      }, {
        onConflict: 'visitor_id',
        ignoreDuplicates: false,
      });

    if (upsertError) {
      console.error('Error upserting visitor identity:', upsertError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to identify visitor' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`✅ Visitor identified: ${email}`);

    return new Response(
      JSON.stringify({ success: true, visitor_id, email }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        } 
      }
    );

  } catch (error) {
    console.error('Visitor identification error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
