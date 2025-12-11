import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.83.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface LumaGuest {
  api_id: string;
  email: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  company?: string;
  created_at: string;
}

interface LumaApiResponse {
  entries: Array<{
    api_id: string;
    guest: LumaGuest;
  }>;
  has_more: boolean;
  next_cursor?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lumaApiKey = Deno.env.get('LUMA_API_KEY');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { flow_id } = await req.json();

    if (!flow_id) {
      return new Response(
        JSON.stringify({ error: 'flow_id required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[sync-luma-guests] Starting sync for flow: ${flow_id}`);

    // Get flow configuration
    const { data: flow, error: flowError } = await supabase
      .from('event_bridge_flows')
      .select('*')
      .eq('id', flow_id)
      .eq('is_active', true)
      .single();

    if (flowError || !flow) {
      console.error('[sync-luma-guests] Flow not found:', flowError);
      return new Response(
        JSON.stringify({ error: 'Flow not found or inactive' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get Luma API key from flow config or environment
    const apiKey = flow.source_config?.luma_api_key || lumaApiKey;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Luma API key not configured' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract event ID from URL
    const eventUrl = flow.source_config?.event_url;
    if (!eventUrl) {
      return new Response(
        JSON.stringify({ error: 'Event URL not configured' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse event slug from URL (e.g., https://lu.ma/ai-summit-2025)
    const eventSlug = eventUrl.split('/').pop();
    
    console.log(`[sync-luma-guests] Fetching guests for event: ${eventSlug}`);

    // Fetch guests from Luma API
    const lumaResponse = await fetch(`https://api.lu.ma/public/v1/event/get-guests?event_api_id=${eventSlug}`, {
      headers: {
        'x-luma-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!lumaResponse.ok) {
      const errorText = await lumaResponse.text();
      console.error('[sync-luma-guests] Luma API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch from Luma API', details: errorText }),
        { status: lumaResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const lumaData: LumaApiResponse = await lumaResponse.json();
    const guests = lumaData.entries || [];

    console.log(`[sync-luma-guests] Found ${guests.length} guests from Luma`);

    // Get existing registrations to dedupe
    const { data: existingRegs } = await supabase
      .from('event_bridge_registrations')
      .select('email, external_id')
      .eq('flow_id', flow_id);

    const existingEmails = new Set(existingRegs?.map(r => r.email.toLowerCase()) || []);
    const existingIds = new Set(existingRegs?.map(r => r.external_id) || []);

    let newRegistrations = 0;
    const errors: string[] = [];

    // Process new guests
    for (const entry of guests) {
      const guest = entry.guest;
      const email = guest.email?.toLowerCase().trim();

      if (!email) continue;
      if (existingEmails.has(email) || existingIds.has(entry.api_id)) continue;

      // Parse name
      let firstName = guest.first_name;
      let lastName = guest.last_name;
      if (!firstName && guest.name) {
        const nameParts = guest.name.split(' ');
        firstName = nameParts[0];
        lastName = nameParts.slice(1).join(' ');
      }

      // Create registration
      const { data: registration, error: regError } = await supabase
        .from('event_bridge_registrations')
        .insert({
          flow_id: flow_id,
          workspace_id: flow.workspace_id,
          external_id: entry.api_id,
          email: email,
          first_name: firstName,
          last_name: lastName,
          company: guest.company,
          enriched_phone: guest.phone_number,
          enrichment_status: flow.enrichment_enabled ? 'pending' : 'skipped',
          raw_payload: entry,
        })
        .select()
        .single();

      if (regError) {
        console.error('[sync-luma-guests] Failed to create registration:', regError);
        errors.push(`Failed for ${email}: ${regError.message}`);
        continue;
      }

      newRegistrations++;

      // Trigger enrichment if enabled
      if (flow.enrichment_enabled && flow.enrichment_provider) {
        fetch(`${supabaseUrl}/functions/v1/enrich-registration`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            registration_id: registration.id,
            flow_id: flow_id,
          }),
        }).catch(err => console.error('[sync-luma-guests] Enrichment trigger failed:', err));
      } else {
        // Trigger routing directly
        fetch(`${supabaseUrl}/functions/v1/route-registration`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            registration_id: registration.id,
            flow_id: flow_id,
          }),
        }).catch(err => console.error('[sync-luma-guests] Routing trigger failed:', err));
      }
    }

    // Update flow's last sync timestamp
    await supabase
      .from('event_bridge_flows')
      .update({
        source_config: {
          ...flow.source_config,
          last_sync_at: new Date().toISOString(),
        }
      })
      .eq('id', flow_id);

    console.log(`[sync-luma-guests] ✅ Sync complete: ${newRegistrations} new registrations`);

    return new Response(
      JSON.stringify({
        success: true,
        total_guests: guests.length,
        new_registrations: newRegistrations,
        skipped: guests.length - newRegistrations,
        errors: errors.length > 0 ? errors : undefined,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[sync-luma-guests] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
