import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.83.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface EnrichmentRequest {
  registration_id: string;
  flow_id: string;
}

interface ApolloPersonMatch {
  id: string;
  first_name: string;
  last_name: string;
  title: string;
  linkedin_url: string;
  phone_numbers?: Array<{ raw_number: string; sanitized_number: string }>;
  organization?: {
    name: string;
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const apolloApiKey = Deno.env.get('APOLLO_API_KEY');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { registration_id, flow_id }: EnrichmentRequest = await req.json();

    if (!registration_id || !flow_id) {
      return new Response(
        JSON.stringify({ error: 'Missing registration_id or flow_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[enrich-registration] Processing registration: ${registration_id}`);

    // Get registration and flow
    const { data: registration, error: regError } = await supabase
      .from('event_bridge_registrations')
      .select('*, event_bridge_flows(*)')
      .eq('id', registration_id)
      .single();

    if (regError || !registration) {
      console.error('[enrich-registration] Registration not found:', regError);
      return new Response(
        JSON.stringify({ error: 'Registration not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const flow = registration.event_bridge_flows;
    let enrichedPhone = registration.enriched_phone;
    let enrichedTitle = registration.enriched_title;
    let enrichedLinkedin = registration.enriched_linkedin;
    let enrichmentStatus = 'enriched';

    // Call Apollo API if configured
    if (flow.enrichment_provider === 'apollo' && apolloApiKey) {
      try {
        console.log('[enrich-registration] Calling Apollo API for:', registration.email);
        
        const apolloResponse = await fetch('https://api.apollo.io/v1/people/match', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'X-Api-Key': apolloApiKey,
          },
          body: JSON.stringify({
            email: registration.email,
            reveal_personal_emails: true,
            reveal_phone_number: true,
          }),
        });

        if (apolloResponse.ok) {
          const apolloData = await apolloResponse.json();
          const person: ApolloPersonMatch = apolloData.person;

          if (person) {
            enrichedTitle = person.title || enrichedTitle;
            enrichedLinkedin = person.linkedin_url || enrichedLinkedin;
            
            if (person.phone_numbers && person.phone_numbers.length > 0) {
              enrichedPhone = person.phone_numbers[0].sanitized_number || 
                              person.phone_numbers[0].raw_number || 
                              enrichedPhone;
            }

            console.log('[enrich-registration] Apollo enrichment successful:', {
              title: enrichedTitle,
              phone: enrichedPhone ? '***' : null,
              linkedin: enrichedLinkedin,
            });
          } else {
            console.log('[enrich-registration] No person found in Apollo');
          }
        } else {
          const errorText = await apolloResponse.text();
          console.error('[enrich-registration] Apollo API error:', apolloResponse.status, errorText);
          enrichmentStatus = 'failed';
        }
      } catch (apolloError) {
        console.error('[enrich-registration] Apollo API call failed:', apolloError);
        enrichmentStatus = 'failed';
      }
    } else if (!apolloApiKey && flow.enrichment_provider === 'apollo') {
      console.warn('[enrich-registration] Apollo API key not configured');
      enrichmentStatus = 'failed';
    }

    // Update registration with enriched data
    const { error: updateError } = await supabase
      .from('event_bridge_registrations')
      .update({
        enriched_phone: enrichedPhone,
        enriched_title: enrichedTitle,
        enriched_linkedin: enrichedLinkedin,
        enrichment_status: enrichmentStatus,
      })
      .eq('id', registration_id);

    if (updateError) {
      console.error('[enrich-registration] Failed to update registration:', updateError);
    }

    // Trigger routing
    fetch(`${supabaseUrl}/functions/v1/route-registration`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        registration_id,
        flow_id,
      }),
    }).catch(err => console.error('[enrich-registration] Failed to trigger routing:', err));

    console.log('[enrich-registration] ✅ Enrichment complete');

    return new Response(
      JSON.stringify({
        success: true,
        enrichment_status: enrichmentStatus,
        has_phone: !!enrichedPhone,
        has_title: !!enrichedTitle,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[enrich-registration] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
