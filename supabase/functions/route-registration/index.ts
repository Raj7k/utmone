import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.83.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface RoutingRequest {
  registration_id: string;
  flow_id: string;
}

interface RoutingRule {
  id: string;
  destination: string;
  condition: 'always' | 'has_phone' | 'has_title' | 'title_contains';
  condition_value?: string;
  credentials_key?: string;
}

interface RegistrationData {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  enriched_phone: string | null;
  enriched_title: string | null;
  enriched_linkedin: string | null;
  workspace_id: string;
}

// CRM Adapters
async function pushToKylas(registration: RegistrationData, apiKey: string): Promise<{ success: boolean; external_id?: string; error?: string }> {
  try {
    const response = await fetch('https://api.kylas.io/v1/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        firstName: registration.first_name || 'Unknown',
        lastName: registration.last_name || '',
        emails: [{ value: registration.email, type: 'WORK' }],
        phoneNumbers: registration.enriched_phone ? [{ value: registration.enriched_phone, type: 'WORK' }] : [],
        company: registration.company ? { name: registration.company } : undefined,
        customFieldValues: {
          title: registration.enriched_title,
          linkedin: registration.enriched_linkedin,
          source: 'utm.one Event Bridge',
        },
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, external_id: data.id?.toString() };
    } else {
      const errorText = await response.text();
      return { success: false, error: `Kylas API error: ${response.status} - ${errorText}` };
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function pushToZoho(registration: RegistrationData, accessToken: string): Promise<{ success: boolean; external_id?: string; error?: string }> {
  try {
    const response = await fetch('https://www.zohoapis.com/crm/v2/Leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
      },
      body: JSON.stringify({
        data: [{
          First_Name: registration.first_name || 'Unknown',
          Last_Name: registration.last_name || registration.email.split('@')[0],
          Email: registration.email,
          Phone: registration.enriched_phone,
          Company: registration.company || 'Unknown',
          Designation: registration.enriched_title,
          Lead_Source: 'utm.one Event Bridge',
          Description: `LinkedIn: ${registration.enriched_linkedin || 'N/A'}`,
        }],
        trigger: ['workflow'],
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const leadId = data.data?.[0]?.details?.id;
      return { success: true, external_id: leadId };
    } else {
      const errorText = await response.text();
      return { success: false, error: `Zoho API error: ${response.status} - ${errorText}` };
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function pushToHubspot(registration: RegistrationData, apiKey: string): Promise<{ success: boolean; external_id?: string; error?: string }> {
  try {
    const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        properties: {
          email: registration.email,
          firstname: registration.first_name || '',
          lastname: registration.last_name || '',
          phone: registration.enriched_phone || '',
          company: registration.company || '',
          jobtitle: registration.enriched_title || '',
          hs_lead_status: 'NEW',
        },
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, external_id: data.id };
    } else {
      const errorText = await response.text();
      return { success: false, error: `HubSpot API error: ${response.status} - ${errorText}` };
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

function evaluateCondition(rule: RoutingRule, registration: RegistrationData): boolean {
  switch (rule.condition) {
    case 'always':
      return true;
    case 'has_phone':
      return !!registration.enriched_phone;
    case 'has_title':
      return !!registration.enriched_title;
    case 'title_contains':
      if (!rule.condition_value || !registration.enriched_title) return false;
      return registration.enriched_title.toLowerCase().includes(rule.condition_value.toLowerCase());
    default:
      return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { registration_id, flow_id }: RoutingRequest = await req.json();

    if (!registration_id || !flow_id) {
      return new Response(
        JSON.stringify({ error: 'Missing registration_id or flow_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[route-registration] Processing registration: ${registration_id}`);

    // Get registration
    const { data: registration, error: regError } = await supabase
      .from('event_bridge_registrations')
      .select('*')
      .eq('id', registration_id)
      .single();

    if (regError || !registration) {
      console.error('[route-registration] Registration not found:', regError);
      return new Response(
        JSON.stringify({ error: 'Registration not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get flow with routing rules
    const { data: flow, error: flowError } = await supabase
      .from('event_bridge_flows')
      .select('*')
      .eq('id', flow_id)
      .single();

    if (flowError || !flow) {
      console.error('[route-registration] Flow not found:', flowError);
      return new Response(
        JSON.stringify({ error: 'Flow not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const routingRules: RoutingRule[] = flow.routing_rules || [];
    const routingStatus: Record<string, string> = {};
    const results: Array<{ destination: string; success: boolean; external_id?: string; error?: string }> = [];

    // Get workspace integrations for credentials
    const { data: integrations } = await supabase
      .from('integrations')
      .select('*')
      .eq('workspace_id', flow.workspace_id)
      .eq('is_active', true);

    const credentialsMap: Record<string, string> = {};
    if (integrations) {
      for (const integration of integrations) {
        if (integration.access_token_encrypted) {
          credentialsMap[integration.provider] = integration.access_token_encrypted;
        }
      }
    }

    // Also check for API keys in secrets
    const kylasApiKey = Deno.env.get('KYLAS_API_KEY');
    const zohoAccessToken = Deno.env.get('ZOHO_ACCESS_TOKEN');
    const hubspotApiKey = Deno.env.get('HUBSPOT_API_KEY');

    if (kylasApiKey) credentialsMap['kylas'] = kylasApiKey;
    if (zohoAccessToken) credentialsMap['zoho'] = zohoAccessToken;
    if (hubspotApiKey) credentialsMap['hubspot'] = hubspotApiKey;

    // Process each routing rule
    for (const rule of routingRules) {
      if (!evaluateCondition(rule, registration)) {
        console.log(`[route-registration] Rule ${rule.id} condition not met, skipping`);
        continue;
      }

      console.log(`[route-registration] Processing rule: ${rule.destination}`);

      const credentials = credentialsMap[rule.destination];
      if (!credentials) {
        console.warn(`[route-registration] No credentials for ${rule.destination}`);
        await supabase.from('event_bridge_routing_logs').insert({
          registration_id,
          destination: rule.destination,
          status: 'failed',
          error_message: 'No credentials configured',
        });
        routingStatus[rule.destination] = 'failed';
        continue;
      }

      let result: { success: boolean; external_id?: string; error?: string };

      switch (rule.destination) {
        case 'kylas':
          result = await pushToKylas(registration, credentials);
          break;
        case 'zoho':
          result = await pushToZoho(registration, credentials);
          break;
        case 'hubspot':
          result = await pushToHubspot(registration, credentials);
          break;
        default:
          result = { success: false, error: `Unknown destination: ${rule.destination}` };
      }

      // Log the routing attempt
      await supabase.from('event_bridge_routing_logs').insert({
        registration_id,
        destination: rule.destination,
        status: result.success ? 'success' : 'failed',
        external_id: result.external_id,
        error_message: result.error,
      });

      routingStatus[rule.destination] = result.success ? 'success' : 'failed';
      results.push({ destination: rule.destination, ...result });

      console.log(`[route-registration] ${rule.destination}: ${result.success ? 'success' : 'failed'}`);
    }

    // Update registration with routing status
    await supabase
      .from('event_bridge_registrations')
      .update({ routing_status: routingStatus })
      .eq('id', registration_id);

    console.log('[route-registration] ✅ Routing complete');

    return new Response(
      JSON.stringify({
        success: true,
        results,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[route-registration] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
