import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.83.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-luma-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface LumaPayload {
  event: {
    api_id: string;
    name: string;
  };
  guest: {
    email: string;
    name?: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    company?: string;
  };
  registration_id?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extract flow_id from URL path
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const flowId = pathParts[pathParts.length - 1];

    if (!flowId || flowId === 'webhook-luma') {
      return new Response(
        JSON.stringify({ error: 'flow_id required in URL path' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[webhook-luma] Processing for flow: ${flowId}`);

    // Get the flow configuration
    const { data: flow, error: flowError } = await supabase
      .from('event_bridge_flows')
      .select('*')
      .eq('id', flowId)
      .eq('is_active', true)
      .single();

    if (flowError || !flow) {
      console.error('[webhook-luma] Flow not found or inactive:', flowError);
      return new Response(
        JSON.stringify({ error: 'Flow not found or inactive' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse payload
    const payload: LumaPayload = await req.json();
    console.log('[webhook-luma] Received payload:', JSON.stringify(payload, null, 2));

    const guest = payload.guest;
    if (!guest?.email) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: email' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse name if only full name provided
    let firstName = guest.first_name;
    let lastName = guest.last_name;
    if (!firstName && guest.name) {
      const nameParts = guest.name.split(' ');
      firstName = nameParts[0];
      lastName = nameParts.slice(1).join(' ');
    }

    // Create registration record
    const { data: registration, error: regError } = await supabase
      .from('event_bridge_registrations')
      .insert({
        flow_id: flowId,
        workspace_id: flow.workspace_id,
        external_id: payload.registration_id || payload.event?.api_id,
        email: guest.email.toLowerCase().trim(),
        first_name: firstName,
        last_name: lastName,
        company: guest.company,
        enriched_phone: guest.phone_number, // Luma might provide phone
        enrichment_status: flow.enrichment_enabled ? 'pending' : 'skipped',
        raw_payload: payload,
      })
      .select()
      .single();

    if (regError) {
      console.error('[webhook-luma] Failed to create registration:', regError);
      return new Response(
        JSON.stringify({ error: 'Failed to create registration', details: regError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[webhook-luma] Registration created:', registration.id);

    // Create/update visitor identity for attribution
    await supabase
      .from('visitor_identities')
      .upsert({
        workspace_id: flow.workspace_id,
        email: guest.email.toLowerCase().trim(),
        name: guest.name || `${firstName || ''} ${lastName || ''}`.trim(),
        visitor_id: registration.magic_link_token, // Use magic token as initial visitor_id
        identified_at: new Date().toISOString(),
      }, { onConflict: 'visitor_id' });

    // Trigger enrichment if enabled (async - don't wait)
    if (flow.enrichment_enabled && flow.enrichment_provider) {
      fetch(`${supabaseUrl}/functions/v1/enrich-registration`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registration_id: registration.id,
          flow_id: flowId,
        }),
      }).catch(err => console.error('[webhook-luma] Failed to trigger enrichment:', err));
    } else {
      // Skip enrichment, trigger routing directly
      fetch(`${supabaseUrl}/functions/v1/route-registration`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registration_id: registration.id,
          flow_id: flowId,
        }),
      }).catch(err => console.error('[webhook-luma] Failed to trigger routing:', err));
    }

    // Generate magic link URL
    const origin = Deno.env.get('PUBLIC_URL') || 'https://utm.one';
    const magicLink = `${origin}/e/${registration.magic_link_token}`;

    console.log('[webhook-luma] ✅ Success, magic link:', magicLink);

    return new Response(
      JSON.stringify({
        success: true,
        registration_id: registration.id,
        magic_link: magicLink,
        message: 'Registration processed successfully',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[webhook-luma] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
