import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EnrichmentRequest {
  firstName: string;
  lastName?: string;
  company: string;
  workspaceId?: string;
}

interface EnrichmentResponse {
  email?: string;
  phone?: string;
  linkedin?: string;
  title?: string;
  source: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { firstName, lastName, company, workspaceId } = await req.json() as EnrichmentRequest;

    if (!firstName || !company) {
      return new Response(
        JSON.stringify({ error: 'firstName and company are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Enriching lead: ${firstName} ${lastName || ''} at ${company}`);

    // Try to get enrichment API keys from workspace settings
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check for configured enrichment providers
    let apolloApiKey: string | null = null;
    let clayWebhookUrl: string | null = null;

    // Try environment variables first (global config)
    apolloApiKey = Deno.env.get('APOLLO_API_KEY') || null;
    clayWebhookUrl = Deno.env.get('CLAY_WEBHOOK_URL') || null;

    // If workspace provided, check workspace-specific settings
    if (workspaceId) {
      const { data: workspace } = await supabase
        .from('workspaces')
        .select('settings')
        .eq('id', workspaceId)
        .single();

      if (workspace?.settings) {
        const settings = workspace.settings as Record<string, unknown>;
        apolloApiKey = (settings.apollo_api_key as string) || apolloApiKey;
        clayWebhookUrl = (settings.clay_webhook_url as string) || clayWebhookUrl;
      }
    }

    // Check for ZoomInfo credentials
    let zoomInfoClientId: string | null = null;
    let zoomInfoClientSecret: string | null = null;
    
    zoomInfoClientId = Deno.env.get('ZOOMINFO_CLIENT_ID') || null;
    zoomInfoClientSecret = Deno.env.get('ZOOMINFO_CLIENT_SECRET') || null;
    
    if (workspaceId) {
      const { data: wsSettings } = await supabase
        .from('workspaces')
        .select('settings')
        .eq('id', workspaceId)
        .single();

      if (wsSettings?.settings) {
        const settings = wsSettings.settings as Record<string, unknown>;
        zoomInfoClientId = (settings.zoominfo_client_id as string) || zoomInfoClientId;
        zoomInfoClientSecret = (settings.zoominfo_client_secret as string) || zoomInfoClientSecret;
      }
    }

    let enrichmentResult: EnrichmentResponse | null = null;

    // Try Apollo.io first if configured
    if (apolloApiKey) {
      try {
        console.log('Attempting Apollo.io enrichment...');
        
        const apolloResponse = await fetch('https://api.apollo.io/v1/people/match', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'X-Api-Key': apolloApiKey,
          },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName || '',
            organization_name: company,
          }),
        });

        if (apolloResponse.ok) {
          const apolloData = await apolloResponse.json();
          
          if (apolloData.person) {
            enrichmentResult = {
              email: apolloData.person.email || undefined,
              phone: apolloData.person.phone_numbers?.[0]?.sanitized_number || undefined,
              linkedin: apolloData.person.linkedin_url || undefined,
              title: apolloData.person.title || undefined,
              source: 'apollo',
            };
            console.log('Apollo enrichment successful:', enrichmentResult);
          }
        } else {
          console.log('Apollo API error:', apolloResponse.status);
        }
      } catch (apolloError) {
        console.error('Apollo enrichment error:', apolloError);
      }
    }

    // Try Clay webhook if Apollo didn't work
    if (!enrichmentResult?.email && clayWebhookUrl) {
      try {
        console.log('Attempting Clay enrichment...');
        
        const clayResponse = await fetch(clayWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName,
            lastName: lastName || '',
            company,
          }),
        });

        if (clayResponse.ok) {
          const clayData = await clayResponse.json();
          
          if (clayData.email) {
            enrichmentResult = {
              email: clayData.email,
              phone: clayData.phone || undefined,
              linkedin: clayData.linkedin || undefined,
              title: clayData.title || undefined,
              source: 'clay',
            };
            console.log('Clay enrichment successful:', enrichmentResult);
          }
        }
      } catch (clayError) {
        console.error('Clay enrichment error:', clayError);
      }
    }

    // Try ZoomInfo if others didn't work
    if (!enrichmentResult?.email && zoomInfoClientId && zoomInfoClientSecret) {
      try {
        console.log('Attempting ZoomInfo enrichment...');
        
        // First, get access token
        const tokenResponse = await fetch('https://api.zoominfo.com/authenticate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clientId: zoomInfoClientId,
            privateKey: zoomInfoClientSecret,
          }),
        });

        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          const accessToken = tokenData.jwt;

          // Search for person
          const searchResponse = await fetch('https://api.zoominfo.com/search/person', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              personCriteria: {
                firstName: firstName,
                lastName: lastName || '',
                companyName: company,
              },
              outputFields: ['email', 'phone', 'linkedinUrl', 'jobTitle'],
            }),
          });

          if (searchResponse.ok) {
            const searchData = await searchResponse.json();
            const person = searchData.data?.[0];
            
            if (person) {
              enrichmentResult = {
                email: person.email || undefined,
                phone: person.phone || undefined,
                linkedin: person.linkedinUrl || undefined,
                title: person.jobTitle || undefined,
                source: 'zoominfo',
              };
              console.log('ZoomInfo enrichment successful:', enrichmentResult);
            }
          }
        } else {
          console.log('ZoomInfo auth failed:', tokenResponse.status);
        }
      } catch (zoomError) {
        console.error('ZoomInfo enrichment error:', zoomError);
      }
    }

    // If no enrichment providers configured, return helpful message
    if (!apolloApiKey && !clayWebhookUrl && !(zoomInfoClientId && zoomInfoClientSecret)) {
      console.log('No enrichment providers configured');
      return new Response(
        JSON.stringify({ 
          error: 'No enrichment provider configured',
          message: 'Configure Apollo or Clay API keys in Settings → Integrations'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return result (may be null if no data found)
    if (enrichmentResult) {
      return new Response(
        JSON.stringify(enrichmentResult),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ 
          error: 'No enrichment data found',
          searched: { firstName, lastName, company }
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Enrichment function error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Enrichment failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
