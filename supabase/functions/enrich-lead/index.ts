import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EnrichmentRequest {
  firstName?: string;
  first_name?: string;
  lastName?: string;
  last_name?: string;
  company?: string;
  email?: string;
  workspaceId?: string;
  workspace_id?: string;
  scan_id?: string;
}

interface EnrichmentResponse {
  email?: string;
  phone?: string;
  linkedin?: string;
  title?: string;
  source: string;
  enriched: boolean;
}

interface ContactData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  linkedIn: string;
  source: string;
  enrichmentSource: string;
}

interface CrmCredentials {
  accessToken?: string;
  apiKey?: string;
  instanceUrl?: string;
}

// CRM Adapter Interface
interface CrmAdapter {
  pushContact(credentials: CrmCredentials, contact: ContactData): Promise<{ success: boolean; externalId?: string; error?: string }>;
}

// HubSpot Adapter
const hubspotAdapter: CrmAdapter = {
  async pushContact(credentials, contact) {
    try {
      const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${credentials.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: {
            firstname: contact.firstName,
            lastname: contact.lastName,
            email: contact.email,
            phone: contact.phone,
            company: contact.company,
            jobtitle: contact.title,
            hs_lead_status: 'NEW',
            utm_one_source: contact.source,
            linkedin_url: contact.linkedIn,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('[CRM-Adapter] HubSpot push failed:', error);
        return { success: false, error };
      }

      const data = await response.json();
      console.log('[CRM-Adapter] HubSpot contact created:', data.id);
      return { success: true, externalId: data.id };
    } catch (error) {
      console.error('[CRM-Adapter] HubSpot error:', error);
      return { success: false, error: String(error) };
    }
  },
};

// Salesforce Adapter
const salesforceAdapter: CrmAdapter = {
  async pushContact(credentials, contact) {
    try {
      if (!credentials.instanceUrl) {
        return { success: false, error: 'Salesforce instance URL not configured' };
      }

      const response = await fetch(
        `${credentials.instanceUrl}/services/data/v58.0/sobjects/Lead`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${credentials.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            FirstName: contact.firstName,
            LastName: contact.lastName || 'Unknown',
            Email: contact.email,
            Phone: contact.phone,
            Company: contact.company || 'Unknown',
            Title: contact.title,
            LeadSource: contact.source,
            Description: `Enriched via ${contact.enrichmentSource}. LinkedIn: ${contact.linkedIn}`,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error('[CRM-Adapter] Salesforce push failed:', error);
        return { success: false, error };
      }

      const data = await response.json();
      console.log('[CRM-Adapter] Salesforce lead created:', data.id);
      return { success: true, externalId: data.id };
    } catch (error) {
      console.error('[CRM-Adapter] Salesforce error:', error);
      return { success: false, error: String(error) };
    }
  },
};

// Zoho CRM Adapter
const zohoAdapter: CrmAdapter = {
  async pushContact(credentials, contact) {
    try {
      const response = await fetch('https://www.zohoapis.com/crm/v3/Leads', {
        method: 'POST',
        headers: {
          'Authorization': `Zoho-oauthtoken ${credentials.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [{
            First_Name: contact.firstName || '',
            Last_Name: contact.lastName || contact.email.split('@')[0],
            Email: contact.email,
            Phone: contact.phone || '',
            Company: contact.company || 'Unknown',
            Designation: contact.title || '',
            Lead_Source: contact.source || 'Event',
            LinkedIn: contact.linkedIn || '',
          }],
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('[CRM-Adapter] Zoho push failed:', error);
        return { success: false, error };
      }

      const data = await response.json();
      const leadId = data.data?.[0]?.details?.id;
      console.log('[CRM-Adapter] Zoho lead created:', leadId);
      return { success: true, externalId: leadId };
    } catch (error) {
      console.error('[CRM-Adapter] Zoho error:', error);
      return { success: false, error: String(error) };
    }
  },
};

// Pipedrive Adapter
const pipedriveAdapter: CrmAdapter = {
  async pushContact(credentials, contact) {
    try {
      const response = await fetch(
        `https://api.pipedrive.com/v1/persons?api_token=${credentials.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || contact.email,
            email: [{ value: contact.email, primary: true }],
            phone: contact.phone ? [{ value: contact.phone, primary: true }] : [],
            org_name: contact.company || '',
            job_title: contact.title || '',
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error('[CRM-Adapter] Pipedrive push failed:', error);
        return { success: false, error };
      }

      const data = await response.json();
      console.log('[CRM-Adapter] Pipedrive person created:', data.data?.id);
      return { success: true, externalId: String(data.data?.id) };
    } catch (error) {
      console.error('[CRM-Adapter] Pipedrive error:', error);
      return { success: false, error: String(error) };
    }
  },
};

// Adapter Registry
const crmAdapters: Record<string, CrmAdapter> = {
  hubspot: hubspotAdapter,
  salesforce: salesforceAdapter,
  zoho: zohoAdapter,
  pipedrive: pipedriveAdapter,
};

const getCrmAdapter = (providerId: string): CrmAdapter | null => {
  return crmAdapters[providerId] || null;
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json() as EnrichmentRequest;
    
    // Support both camelCase and snake_case
    const firstName = requestBody.firstName || requestBody.first_name;
    const lastName = requestBody.lastName || requestBody.last_name;
    const company = requestBody.company;
    const email = requestBody.email;
    const workspaceId = requestBody.workspaceId || requestBody.workspace_id;
    const scanId = requestBody.scan_id;

    if (!firstName && !email) {
      return new Response(
        JSON.stringify({ error: 'firstName or email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Enriching lead: ${firstName || email} ${lastName || ''} at ${company || 'unknown'}`);

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
    let crmPushEnabled = false;
    let crmPushTargets: string[] = [];
    
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
        crmPushEnabled = (settings.crm_push_enabled as boolean) || false;
        
        // Support both single target (string) and multiple targets (array)
        const crmTarget = settings.crm_push_target;
        if (Array.isArray(crmTarget)) {
          crmPushTargets = crmTarget as string[];
        } else if (typeof crmTarget === 'string' && crmTarget) {
          crmPushTargets = [crmTarget];
        }
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
              enriched: true,
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
              enriched: true,
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
                enriched: true,
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

    // Update the badge scan record if scan_id provided
    if (scanId) {
      if (enrichmentResult) {
        await supabase
          .from('event_badge_scans')
          .update({
            enriched: true,
            enrichment_source: enrichmentResult.source,
            enriched_at: new Date().toISOString(),
            phone: enrichmentResult.phone || null,
            linkedin_url: enrichmentResult.linkedin || null,
            enrichment_error: null,
          })
          .eq('id', scanId);
        console.log(`Updated badge scan ${scanId} with enrichment data`);
      } else {
        await supabase
          .from('event_badge_scans')
          .update({
            enriched: false,
            enrichment_error: 'No data found from enrichment providers',
          })
          .eq('id', scanId);
        console.log(`Marked badge scan ${scanId} as failed enrichment`);
      }
    }

    // Push to CRMs if enabled and enrichment was successful
    if (enrichmentResult && crmPushEnabled && crmPushTargets.length > 0 && workspaceId) {
      console.log(`Pushing enriched lead to CRMs: ${crmPushTargets.join(', ')}...`);
      
      const contactData: ContactData = {
        firstName: firstName || '',
        lastName: lastName || '',
        email: enrichmentResult.email || email || '',
        phone: enrichmentResult.phone || '',
        company: company || '',
        title: enrichmentResult.title || '',
        linkedIn: enrichmentResult.linkedin || '',
        source: 'utm.one Event Scanner',
        enrichmentSource: enrichmentResult.source,
      };

      // Push to each configured CRM
      for (const crmTarget of crmPushTargets) {
        try {
          const adapter = getCrmAdapter(crmTarget);
          if (!adapter) {
            console.log(`Unknown CRM adapter: ${crmTarget}`);
            continue;
          }

          // Get CRM integration credentials from integrations table
          const { data: integration } = await supabase
            .from('integrations')
            .select('*')
            .eq('workspace_id', workspaceId)
            .eq('provider', crmTarget)
            .eq('is_active', true)
            .single();

          if (!integration) {
            console.log(`No active ${crmTarget} integration found for workspace`);
            continue;
          }

          const credentials: CrmCredentials = {
            accessToken: integration.access_token_encrypted,
            apiKey: integration.api_key_encrypted,
            instanceUrl: integration.instance_url,
          };

          const result = await adapter.pushContact(credentials, contactData);
          
          if (result.success) {
            console.log(`Successfully pushed lead to ${crmTarget}, ID: ${result.externalId}`);
          } else {
            console.error(`CRM push to ${crmTarget} failed:`, result.error);
          }
        } catch (crmError) {
          console.error(`CRM push to ${crmTarget} failed:`, crmError);
          // Don't fail the whole request if CRM push fails
        }
      }
    }

    // Return result (may be null if no data found)
    if (enrichmentResult) {
      return new Response(
        JSON.stringify({ ...enrichmentResult, enriched: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ 
          enriched: false,
          error: 'No enrichment data found',
          searched: { firstName, lastName, company, email }
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Enrichment function error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Enrichment failed', enriched: false }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
