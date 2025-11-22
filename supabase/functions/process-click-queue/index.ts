import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QueuedClick {
  link_id: string;
  ip_address: string;
  user_agent: string;
  referrer: string | null;
  browser: string | null;
  os: string | null;
  device_type: string | null;
  is_unique: boolean;
  og_variant_id: string | null;
  qr_code_id: string | null;
  clicked_at: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔄 Starting click queue batch processing...');
    const startTime = Date.now();

    // Initialize Deno KV
    const kv = await Deno.openKv();

    // Initialize Supabase with service role (bypass RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Collect all pending clicks from queue
    const clicks: QueuedClick[] = [];
    const keysToDelete: Deno.KvKey[] = [];

    const entries = kv.list<QueuedClick>({ prefix: ['click_queue'] });
    
    let batchCount = 0;
    for await (const entry of entries) {
      clicks.push(entry.value);
      keysToDelete.push(entry.key);
      batchCount++;
      
      // Safety limit: process max 1000 clicks per run
      if (batchCount >= 1000) {
        console.log('⚠️ Reached batch limit of 1000 clicks');
        break;
      }
    }

    if (clicks.length === 0) {
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

    console.log(`📊 Processing ${clicks.length} clicks in batch...`);

    // Batch insert all clicks
    const clicksToInsert = clicks.map(click => ({
      link_id: click.link_id,
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
      country: null, // Processed by separate geolocation job
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
    const linkIds = [...new Set(clicks.map(c => c.link_id))];
    console.log(`📈 Updating counters for ${linkIds.length} links...`);

    for (const linkId of linkIds) {
      const linkClicks = clicks.filter(c => c.link_id === linkId);
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

    // Delete processed clicks from queue
    console.log(`🧹 Cleaning up ${keysToDelete.length} queue entries...`);
    const deletePromises = keysToDelete.map(key => kv.delete(key));
    await Promise.all(deletePromises);

    // Invalidate cache for affected links
    for (const linkId of linkIds) {
      const { data: link } = await supabase
        .from('links')
        .select('domain, path, slug')
        .eq('id', linkId)
        .single();
      
      if (link) {
        const cacheKey = ['link', link.domain, link.path || '', link.slug];
        await kv.delete(cacheKey);
      }
    }

    const duration = Date.now() - startTime;
    console.log(`✅ Successfully processed ${clicks.length} clicks in ${duration}ms`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: clicks.length,
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
