import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// NOTE: This function uses a database-backed queue instead of Deno.openKv
// Clicks are queued in click_queue table and processed in batches

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔄 Starting click queue batch processing...');
    const startTime = Date.now();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch pending clicks from database queue table
    const { data: queuedClicks, error: fetchError } = await supabase
      .from('click_queue')
      .select('*')
      .eq('processed', false)
      .order('created_at', { ascending: true })
      .limit(1000);

    if (fetchError) {
      console.error('❌ Error fetching click queue:', fetchError);
      throw fetchError;
    }

    if (!queuedClicks || queuedClicks.length === 0) {
      console.log('✅ No clicks in queue to process');
      return new Response(
        JSON.stringify({ 
          success: true, 
          processed: 0,
          duration_ms: Date.now() - startTime 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    console.log(`📊 Processing ${queuedClicks.length} clicks in batch...`);

    // Batch insert all clicks to link_clicks
    const clicksToInsert = queuedClicks.map(click => ({
      link_id: click.link_id,
      workspace_id: click.workspace_id,
      ip_address: click.ip_address,
      user_agent: click.user_agent,
      referrer: click.referrer,
      browser: click.browser,
      os: click.os,
      device_type: click.device_type,
      is_unique: click.is_unique,
      og_variant_id: click.og_variant_id,
      qr_code_id: click.qr_code_id,
      clicked_at: click.clicked_at,
      country: null,
      city: null,
    }));

    const { error: insertError } = await supabase
      .from('link_clicks')
      .insert(clicksToInsert);

    if (insertError) {
      console.error('❌ Error batch inserting clicks:', insertError);
      throw insertError;
    }

    // Update click counters for affected links
    const linkIds = [...new Set(queuedClicks.map(c => c.link_id))];
    console.log(`📈 Updating counters for ${linkIds.length} links...`);

    for (const linkId of linkIds) {
      const linkClicks = queuedClicks.filter(c => c.link_id === linkId);
      const totalClicks = linkClicks.length;
      const uniqueClicks = linkClicks.filter(c => c.is_unique).length;

      const { error: counterError } = await supabase.rpc('increment_link_clicks', {
        p_link_id: linkId,
        p_total_increment: totalClicks,
        p_unique_increment: uniqueClicks,
      });

      if (counterError) {
        console.error(`Failed to update counters for link ${linkId}:`, counterError);
      }
    }

    // Mark queue entries as processed
    const queueIds = queuedClicks.map(c => c.id);
    const { error: updateError } = await supabase
      .from('click_queue')
      .update({ processed: true, processed_at: new Date().toISOString() })
      .in('id', queueIds);

    if (updateError) {
      console.error('❌ Error marking queue entries as processed:', updateError);
    }

    const duration = Date.now() - startTime;
    console.log(`✅ Successfully processed ${queuedClicks.length} clicks in ${duration}ms`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: queuedClicks.length,
        affected_links: linkIds.length,
        duration_ms: duration,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('❌ Click queue processing failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
