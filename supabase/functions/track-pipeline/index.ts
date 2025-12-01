import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.83.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface PipelinePayload {
  email: string;
  stage: 'lead' | 'sal' | 'sql' | 'opportunity' | 'closed_won' | 'closed_lost';
  value?: number;
  crm_deal_id?: string;
  timestamp?: string;
  workspace_id?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload: PipelinePayload = await req.json();
    
    const { email, stage, value, crm_deal_id, timestamp, workspace_id } = payload;

    // Validate required fields
    if (!email || !stage) {
      return new Response(
        JSON.stringify({ error: 'email and stage are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[track-pipeline] Processing ${stage} for ${email}`);

    // Lookup user_id from email via profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, workspace_id')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      console.error('[track-pipeline] Profile lookup error:', profileError);
    }

    // Also check visitor_identities for visitor_id
    const { data: identity, error: identityError } = await supabase
      .from('visitor_identities')
      .select('visitor_id, workspace_id')
      .eq('email', email)
      .maybeSingle();

    if (identityError) {
      console.error('[track-pipeline] Identity lookup error:', identityError);
    }

    // Determine workspace_id (priority: payload > profile > identity)
    const finalWorkspaceId = workspace_id || profile?.workspace_id || identity?.workspace_id;

    if (!finalWorkspaceId) {
      return new Response(
        JSON.stringify({ 
          error: 'Could not determine workspace for user',
          message: 'User not found in system. Ensure user has been identified via tracking pixel first.'
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert journey event with pipeline stage
    const journeyEvent = {
      workspace_id: finalWorkspaceId,
      user_id: profile?.id || null,
      visitor_id: identity?.visitor_id || null,
      event_type: stage,
      event_name: `pipeline_${stage}`,
      deal_value: value || null,
      crm_deal_id: crm_deal_id || null,
      revenue: (stage === 'closed_won' && value) ? value : null,
      metadata: {
        email,
        source: 'crm_webhook',
        crm_stage: stage,
      },
      created_at: timestamp || new Date().toISOString(),
    };

    const { data: insertedEvent, error: insertError } = await supabase
      .from('journey_events')
      .insert(journeyEvent)
      .select()
      .single();

    if (insertError) {
      console.error('[track-pipeline] Insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to insert pipeline event', details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[track-pipeline] ✅ Pipeline event created: ${stage} for ${email}`);

    // If stage is closed_won, trigger attribution recalculation
    if (stage === 'closed_won' && profile?.id) {
      console.log('[track-pipeline] 🎯 Triggering attribution recalculation for closed deal');
      
      // Note: Attribution recalculation happens automatically via the 
      // calculate_linear_attribution, calculate_time_decay_attribution, 
      // and calculate_position_attribution functions which now include 
      // revenue data from journey_events
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        event_id: insertedEvent.id,
        message: `Pipeline event ${stage} tracked successfully`,
        workspace_id: finalWorkspaceId,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('[track-pipeline] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
