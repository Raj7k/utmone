import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.83.0';
import { DOMParser } from 'https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, soapaction',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Salesforce stage mapping to utm.one stages
const STAGE_MAPPING: Record<string, string> = {
  'Prospecting': 'lead',
  'Qualification': 'sal',
  'Needs Analysis': 'sql',
  'Value Proposition': 'sql',
  'Id. Decision Makers': 'sql',
  'Perception Analysis': 'sql',
  'Proposal/Price Quote': 'opportunity',
  'Negotiation/Review': 'opportunity',
  'Closed Won': 'closed_won',
  'Closed Lost': 'closed_lost',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extract workspace_id from URL path
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const workspaceId = pathParts[pathParts.length - 1];

    if (!workspaceId || workspaceId === 'webhook-salesforce') {
      return new Response(
        JSON.stringify({ error: 'workspace_id required in URL path' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[webhook-salesforce] Processing for workspace: ${workspaceId}`);

    // Salesforce sends XML (SOAP envelope)
    const xmlBody = await req.text();
    console.log('[webhook-salesforce] Received XML:', xmlBody.substring(0, 500));

    // Parse XML
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlBody, 'text/xml');
    
    if (!doc) {
      return new Response(
        JSON.stringify({ error: 'Failed to parse XML' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract fields from Salesforce outbound message
    // Salesforce structure: soapenv:Envelope > soapenv:Body > notifications > Notification > sObject
    const sObject = doc.querySelector('sObject');
    
    if (!sObject) {
      console.error('[webhook-salesforce] No sObject found in XML');
      return new Response(
        JSON.stringify({ error: 'Invalid Salesforce message structure' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract fields
    const email = sObject.querySelector('sf\\:Email, Email')?.textContent || 
                  sObject.querySelector('sf\\:Contact__r sf\\:Email, Contact__r Email')?.textContent;
    const stageName = sObject.querySelector('sf\\:StageName, StageName')?.textContent;
    const amount = sObject.querySelector('sf\\:Amount, Amount')?.textContent;
    const opportunityId = sObject.querySelector('sf\\:Id, Id')?.textContent;

    console.log('[webhook-salesforce] Extracted:', { email, stageName, amount, opportunityId });

    if (!email || !stageName) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email or StageName' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Map Salesforce stage to utm.one stage
    const utmStage = STAGE_MAPPING[stageName] || 'opportunity';
    const dealValue = amount ? parseFloat(amount) : undefined;

    // Call track-pipeline endpoint with normalized data
    const pipelinePayload = {
      email,
      stage: utmStage,
      value: dealValue,
      crm_deal_id: opportunityId,
      workspace_id: workspaceId,
      timestamp: new Date().toISOString(),
    };

    console.log('[webhook-salesforce] Forwarding to track-pipeline:', pipelinePayload);

    // Forward to track-pipeline
    const pipelineResponse = await fetch(`${supabaseUrl}/functions/v1/track-pipeline`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pipelinePayload),
    });

    const pipelineResult = await pipelineResponse.json();

    if (!pipelineResponse.ok) {
      console.error('[webhook-salesforce] track-pipeline error:', pipelineResult);
      return new Response(
        JSON.stringify({ error: 'Failed to track pipeline event', details: pipelineResult }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[webhook-salesforce] ✅ Success:', pipelineResult);

    // Salesforce expects SOAP acknowledgment
    const soapAck = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Body>
    <notificationsResponse xmlns="http://soap.sforce.com/2005/09/outbound">
      <Ack>true</Ack>
    </notificationsResponse>
  </soapenv:Body>
</soapenv:Envelope>`;

    return new Response(soapAck, {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'text/xml' },
    });
  } catch (error) {
    console.error('[webhook-salesforce] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
