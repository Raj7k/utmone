import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.83.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// HubSpot lifecycle stage mapping
const LIFECYCLE_MAPPING: Record<string, string> = {
  'lead': 'lead',
  'marketingqualifiedlead': 'sal',
  'salesqualifiedlead': 'sql',
  'opportunity': 'opportunity',
  'customer': 'closed_won',
  'evangelist': 'closed_won',
  'other': 'lead',
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

    if (!workspaceId || workspaceId === 'webhook-hubspot') {
      return new Response(
        JSON.stringify({ error: 'workspace_id required in URL path' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[webhook-hubspot] Processing for workspace: ${workspaceId}`);

    // HubSpot sends JSON
    const payload = await req.json();
    console.log('[webhook-hubspot] Received payload:', JSON.stringify(payload, null, 2));

    // HubSpot can send either contact lifecycle changes or deal changes
    const email = payload.email;
    const lifecycleStage = payload.stage?.toLowerCase() || payload.lifecyclestage?.toLowerCase();
    const dealValue = payload.value || payload.amount;
    const dealId = payload.crm_deal_id || payload.deal_id || payload.dealId;

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: email' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Map HubSpot stage to utm.one stage
    let utmStage = 'lead';
    
    if (lifecycleStage) {
      utmStage = LIFECYCLE_MAPPING[lifecycleStage] || 'lead';
    }
    
    // If deal-specific stage is provided, it takes precedence
    if (payload.dealstage || payload.deal_stage) {
      const dealStage = (payload.dealstage || payload.deal_stage).toLowerCase();
      if (dealStage.includes('closed') && dealStage.includes('won')) {
        utmStage = 'closed_won';
      } else if (dealStage.includes('closed')) {
        utmStage = 'closed_lost';
      } else if (dealStage.includes('contract') || dealStage.includes('decision')) {
        utmStage = 'opportunity';
      }
    }

    // Normalize payload for track-pipeline
    const pipelinePayload = {
      email,
      stage: utmStage,
      value: dealValue ? parseFloat(dealValue) : undefined,
      crm_deal_id: dealId,
      workspace_id: workspaceId,
      timestamp: payload.timestamp || new Date().toISOString(),
    };

    console.log('[webhook-hubspot] Forwarding to track-pipeline:', pipelinePayload);

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
      console.error('[webhook-hubspot] track-pipeline error:', pipelineResult);
      return new Response(
        JSON.stringify({ error: 'Failed to track pipeline event', details: pipelineResult }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[webhook-hubspot] ✅ Success:', pipelineResult);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'HubSpot webhook processed successfully',
        event_id: pipelineResult.event_id,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('[webhook-hubspot] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
