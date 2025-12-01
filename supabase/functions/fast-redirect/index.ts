import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// In-memory cache for hot links (per-instance, resets on cold start)
const hotLinkCache = new Map<string, {
  destination_url: string;
  utm_params: Record<string, string>;
  cached_at: number;
}>();

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour TTL for in-memory cache

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get('slug');

    if (!slug) {
      return new Response(
        JSON.stringify({ error: 'Missing slug parameter' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    const startTime = Date.now();
    let cacheHit = false;
    let cacheTier = 'miss';

    // TIER 1: Check in-memory hot cache first (sub-millisecond)
    const cached = hotLinkCache.get(slug);
    if (cached && (Date.now() - cached.cached_at < CACHE_TTL_MS)) {
      console.log(`Cache HIT for ${slug} - Hot tier (in-memory)`);
      cacheHit = true;
      cacheTier = 'hot';
      
      const latency = Date.now() - startTime;
      
      return new Response(
        JSON.stringify({
          redirect_url: cached.destination_url,
          cache_hit: true,
          cache_tier: 'hot',
          latency_ms: latency,
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // TIER 2: Query database (with priority for hot-tagged links)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: link, error } = await supabase
      .from('links')
      .select('id, destination_url, utm_source, utm_medium, utm_campaign, utm_term, utm_content, cache_priority, fallback_url')
      .eq('slug', slug)
      .eq('status', 'active')
      .maybeSingle();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    if (!link) {
      return new Response(
        JSON.stringify({ error: 'Link not found' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    cacheTier = link.cache_priority || 'cold';

    // Build final destination URL with UTM parameters
    const destUrl = new URL(link.destination_url);
    if (link.utm_source) destUrl.searchParams.set('utm_source', link.utm_source);
    if (link.utm_medium) destUrl.searchParams.set('utm_medium', link.utm_medium);
    if (link.utm_campaign) destUrl.searchParams.set('utm_campaign', link.utm_campaign);
    if (link.utm_term) destUrl.searchParams.set('utm_term', link.utm_term);
    if (link.utm_content) destUrl.searchParams.set('utm_content', link.utm_content);

    const finalUrl = destUrl.toString();

    // TIER 3: Write to hot cache if this is a hot-priority link
    if (link.cache_priority === 'hot' || link.cache_priority === 'warm') {
      hotLinkCache.set(slug, {
        destination_url: finalUrl,
        utm_params: {
          utm_source: link.utm_source || '',
          utm_medium: link.utm_medium || '',
          utm_campaign: link.utm_campaign || '',
          utm_term: link.utm_term || '',
          utm_content: link.utm_content || '',
        },
        cached_at: Date.now(),
      });
      console.log(`Cached ${slug} in hot tier (in-memory)`);
    }

    // Update cache metadata access count in background
    supabase
      .from('link_cache_metadata')
      .upsert({
        link_id: link.id,
        cache_tier: link.cache_priority || 'cold',
        last_accessed_at: new Date().toISOString(),
        access_count: 1, // Increment would require a query first, keeping simple
      }, { onConflict: 'link_id' })
      .then(({ error }) => {
        if (error) console.error('Error updating cache metadata:', error);
      });

    const latency = Date.now() - startTime;
    console.log(`Redirect for ${slug} - ${cacheTier} tier - ${latency}ms`);

    return new Response(
      JSON.stringify({
        redirect_url: finalUrl,
        cache_hit: cacheHit,
        cache_tier: cacheTier,
        latency_ms: latency,
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store', // Don't cache at CDN level
        },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in fast-redirect:', error);
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
