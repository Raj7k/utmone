import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting scheduled link activation job...');

    // Find all scheduled links where activation_at is in the past
    const { data: scheduledLinks, error: fetchError } = await supabase
      .from('links')
      .select('id, title, workspace_id, activation_at')
      .eq('status', 'scheduled')
      .lte('activation_at', new Date().toISOString());

    if (fetchError) {
      console.error('Error fetching scheduled links:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${scheduledLinks?.length || 0} links ready for activation`);

    if (!scheduledLinks || scheduledLinks.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          activated: 0,
          message: 'No links ready for activation'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Activate all eligible links
    const linkIds = scheduledLinks.map(link => link.id);
    const { error: updateError } = await supabase
      .from('links')
      .update({ status: 'active' })
      .in('id', linkIds);

    if (updateError) {
      console.error('Error activating links:', updateError);
      throw updateError;
    }

    console.log(`Successfully activated ${linkIds.length} links`);

    // Log activation events
    for (const link of scheduledLinks) {
      await supabase.from('link_change_history').insert({
        link_id: link.id,
        changed_by: '00000000-0000-0000-0000-000000000000', // system user
        change_type: 'scheduled_activation',
        field_name: 'status',
        old_value: 'scheduled',
        new_value: 'active',
        metadata: {
          activation_at: link.activation_at,
          workspace_id: link.workspace_id,
        },
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        activated: linkIds.length,
        links: scheduledLinks.map(l => ({ id: l.id, title: l.title }))
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in activate-scheduled-links:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
