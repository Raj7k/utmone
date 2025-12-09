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

    // If no enrichment providers configured, return helpful message
    if (!apolloApiKey && !clayWebhookUrl) {
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
