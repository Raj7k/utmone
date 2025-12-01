import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LinkForCache {
  id: string;
  workspace_id: string;
  slug: string;
  destination_url: string;
  cache_score: number;
  estimated_size_bytes: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting Knapsack cache optimization...');

    // Step 1: Update cache scores for all active links
    console.log('Updating cache scores...');
    const { error: updateError } = await supabase.rpc('update_link_cache_scores');
    
    if (updateError) {
      console.error('Error updating cache scores:', updateError);
      throw updateError;
    }

    // Step 2: Get all active links sorted by cache score (from hot_links_view)
    const { data: links, error: linksError } = await supabase
      .from('hot_links_view')
      .select('*')
      .limit(1000); // Process top 1000 links

    if (linksError) {
      console.error('Error fetching hot links:', linksError);
      throw linksError;
    }

    if (!links || links.length === 0) {
      console.log('No active links found');
      return new Response(
        JSON.stringify({ success: true, message: 'No links to optimize' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Analyzing ${links.length} links for cache optimization`);

    // Step 3: Implement Greedy Knapsack Approximation
    // Capacity: 100MB of "hot" cache (configurable)
    const HOT_CACHE_CAPACITY_BYTES = 100 * 1024 * 1024; // 100MB
    const WARM_CACHE_CAPACITY_BYTES = 500 * 1024 * 1024; // 500MB
    
    let hotCacheUsed = 0;
    let warmCacheUsed = 0;
    const hotLinks: string[] = [];
    const warmLinks: string[] = [];
    const coldLinks: string[] = [];

    // Greedy algorithm: Sort by score (already sorted from view), fill cache by capacity
    for (const link of links) {
      const linkData = link as unknown as LinkForCache;
      const size = linkData.estimated_size_bytes || 1000;

      // Try to fit in hot cache first
      if (hotCacheUsed + size <= HOT_CACHE_CAPACITY_BYTES) {
        hotLinks.push(linkData.id);
        hotCacheUsed += size;
      } 
      // Otherwise try warm cache
      else if (warmCacheUsed + size <= WARM_CACHE_CAPACITY_BYTES) {
        warmLinks.push(linkData.id);
        warmCacheUsed += size;
      }
      // Otherwise it's cold (database only)
      else {
        coldLinks.push(linkData.id);
      }
    }

    console.log(`Cache allocation: ${hotLinks.length} hot, ${warmLinks.length} warm, ${coldLinks.length} cold`);
    console.log(`Memory used: Hot ${(hotCacheUsed / 1024 / 1024).toFixed(2)}MB, Warm ${(warmCacheUsed / 1024 / 1024).toFixed(2)}MB`);

    // Step 4: Update cache priority in database
    const updates = [];

    if (hotLinks.length > 0) {
      updates.push(
        supabase
          .from('links')
          .update({ cache_priority: 'hot', last_cached_at: new Date().toISOString() })
          .in('id', hotLinks)
      );
    }

    if (warmLinks.length > 0) {
      updates.push(
        supabase
          .from('links')
          .update({ cache_priority: 'warm', last_cached_at: new Date().toISOString() })
          .in('id', warmLinks)
      );
    }

    if (coldLinks.length > 0) {
      updates.push(
        supabase
          .from('links')
          .update({ cache_priority: 'cold', last_cached_at: null })
          .in('id', coldLinks)
      );
    }

    // Execute all updates in parallel
    const results = await Promise.all(updates);
    
    // Check for errors
    const updateErrors = results.filter(r => r.error);
    if (updateErrors.length > 0) {
      console.error('Errors updating cache priorities:', updateErrors);
    }

    // Step 5: Update cache metadata table
    const cacheMetadata = [
      ...hotLinks.map(id => ({
        link_id: id,
        cache_tier: 'hot',
        last_accessed_at: new Date().toISOString(),
      })),
      ...warmLinks.map(id => ({
        link_id: id,
        cache_tier: 'warm',
        last_accessed_at: new Date().toISOString(),
      })),
    ];

    if (cacheMetadata.length > 0) {
      const { error: metadataError } = await supabase
        .from('link_cache_metadata')
        .upsert(cacheMetadata, { onConflict: 'link_id' });

      if (metadataError) {
        console.error('Error updating cache metadata:', metadataError);
      }
    }

    console.log('Cache optimization complete');

    return new Response(
      JSON.stringify({
        success: true,
        stats: {
          total_links: links.length,
          hot_cache: {
            count: hotLinks.length,
            size_mb: (hotCacheUsed / 1024 / 1024).toFixed(2),
            capacity_used_percent: ((hotCacheUsed / HOT_CACHE_CAPACITY_BYTES) * 100).toFixed(1),
          },
          warm_cache: {
            count: warmLinks.length,
            size_mb: (warmCacheUsed / 1024 / 1024).toFixed(2),
            capacity_used_percent: ((warmCacheUsed / WARM_CACHE_CAPACITY_BYTES) * 100).toFixed(1),
          },
          cold_cache: {
            count: coldLinks.length,
          },
        },
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in optimize-cache:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
