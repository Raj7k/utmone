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

// AI bot user agents
const AI_BOT_PATTERNS = [
  /GPTBot/i,
  /ChatGPT-User/i,
  /Claude-Web/i,
  /ClaudeBot/i,
  /Anthropic/i,
  /PerplexityBot/i,
  /Googlebot/i,
  /Bingbot/i,
  /Google-Extended/i,
];

function isAIBot(userAgent: string): boolean {
  return AI_BOT_PATTERNS.some(pattern => pattern.test(userAgent));
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get('slug');
    // SECURITY/PERF: accept explicit domain param from callers so we can use the
    // composite (domain, slug, status) index. Falls back to X-Original-Domain
    // header for callers that set it (Cloudflare worker pattern), then to a
    // warning for slug-only queries (slower + may return wrong link when two
    // domains share a slug).
    const domain = (url.searchParams.get('domain')
        || req.headers.get('X-Original-Domain')
        || '').replace(/^www\./, '').trim();
    const userAgent = req.headers.get('user-agent') || '';

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

    // PERF: build the query with an explicit domain filter when available so
    // Postgres can use the composite (domain, slug, status) unique index.
    // Without the filter we risk a seq scan or returning a wrong-domain link.
    // PERF note: extended columns (cache_priority, health_status, sentinel_*,
    // campaign_id) don't exist on every target DB (migrations 20251201/20260414
    // may not have run). The SELECT below lists only the core columns that are
    // guaranteed to exist. The extended sentinel/cache features operate on
    // `link.cache_priority` etc. — those branches already guard on undefined,
    // so omitting them from the SELECT degrades gracefully.
    let linkQuery = supabase
      .from('links')
      .select('id, workspace_id, destination_url, utm_source, utm_medium, utm_campaign, utm_term, utm_content, fallback_url')
      .eq('slug', slug)
      .eq('status', 'active');

    if (domain) {
      linkQuery = linkQuery.eq('domain', domain);
    } else {
      console.warn(`[fast-redirect] No domain provided for slug=${slug}. Falling back to slug-only lookup. Callers should pass ?domain= or X-Original-Domain header.`);
    }

    const { data: link, error } = await linkQuery.maybeSingle();

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
    let destinationUrl = link.destination_url;
    let sentinelDecision: { action: string; fallback_url?: string; json_payload?: Record<string, unknown>; save_type?: string } | null = null;

    // SENTINEL MODE: Run preflight checks if enabled
    if (link.sentinel_enabled && link.sentinel_config) {
      const sentinelConfig = link.sentinel_config as Record<string, unknown>;
      
      // AI Bot Detection - check first as it returns JSON instead of redirect
      const aiBotConfig = sentinelConfig.ai_bot_mode as { enabled?: boolean; json_payload?: Record<string, unknown> } | undefined;
      if (aiBotConfig?.enabled && isAIBot(userAgent)) {
        console.log(`🤖 Sentinel: AI bot detected for ${slug}`);
        
        // Log the save
        await supabase.from('sentinel_saves').insert({
          link_id: link.id,
          workspace_id: link.workspace_id,
          save_type: 'ai_bot',
          original_destination: link.destination_url,
          redirected_to: 'json_response',
          estimated_value: 0,
          visitor_info: { user_agent: userAgent },
          metadata: { json_payload: aiBotConfig.json_payload },
        });

        return new Response(
          JSON.stringify(aiBotConfig.json_payload || { url: link.destination_url }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );
      }

      // Inventory Check (Shopify)
      const inventoryConfig = sentinelConfig.inventory_check as { 
        enabled?: boolean; 
        shopify_sku?: string; 
        threshold?: number; 
        fallback_url?: string 
      } | undefined;
      
      if (inventoryConfig?.enabled && inventoryConfig.shopify_sku && inventoryConfig.fallback_url) {
        try {
          const inventoryResponse = await supabase.functions.invoke('shopify-inventory', {
            body: { sku: inventoryConfig.shopify_sku },
          });
          
          if (inventoryResponse.data?.inventory !== undefined) {
            const threshold = inventoryConfig.threshold || 0;
            if (inventoryResponse.data.inventory <= threshold) {
              console.log(`📦 Sentinel: Out of stock for ${slug}, redirecting to fallback`);
              sentinelDecision = {
                action: 'redirect',
                fallback_url: inventoryConfig.fallback_url,
                save_type: 'inventory',
              };
            }
          }
        } catch (err) {
          console.error('Inventory check failed:', err);
          // Fail open - continue with original URL
        }
      }

      // Health Preflight Check
      const healthConfig = sentinelConfig.health_preflight as { 
        enabled?: boolean; 
        timeout_ms?: number; 
        fallback_url?: string 
      } | undefined;
      
      if (!sentinelDecision && healthConfig?.enabled && healthConfig.fallback_url) {
        try {
          const timeout = healthConfig.timeout_ms || 3000;
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), timeout);
          
          const healthCheck = await fetch(link.destination_url, {
            method: 'HEAD',
            signal: controller.signal,
          });
          clearTimeout(timeoutId);
          
          if (!healthCheck.ok) {
            console.log(`🏥 Sentinel: Health check failed for ${slug} (${healthCheck.status})`);
            sentinelDecision = {
              action: 'redirect',
              fallback_url: healthConfig.fallback_url,
              save_type: 'health',
            };
          }
        } catch (err) {
          console.log(`🏥 Sentinel: Health check timeout/error for ${slug}`);
          sentinelDecision = {
            action: 'redirect',
            fallback_url: healthConfig.fallback_url,
            save_type: 'health',
          };
        }
      }

      // Apply Sentinel decision if any
      if (sentinelDecision?.fallback_url) {
        destinationUrl = sentinelDecision.fallback_url;
        
        // Log the save
        await supabase.from('sentinel_saves').insert({
          link_id: link.id,
          workspace_id: link.workspace_id,
          save_type: sentinelDecision.save_type,
          original_destination: link.destination_url,
          redirected_to: sentinelDecision.fallback_url,
          estimated_value: 5, // Default estimated value per save
          visitor_info: { user_agent: userAgent },
          metadata: {},
        });
      }
    }

    // Check link health and use fallback if unhealthy (legacy behavior)
    if (!sentinelDecision && link.health_status === 'unhealthy' && link.fallback_url) {
      console.log(`⚠️ Link ${slug} is unhealthy, routing to fallback: ${link.fallback_url}`);
      destinationUrl = link.fallback_url;
    }

    // Build final destination URL with UTM parameters
    const destUrl = new URL(destinationUrl);
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
    console.log(`Redirect for ${slug} - ${cacheTier} tier - ${latency}ms${sentinelDecision ? ` (sentinel: ${sentinelDecision.save_type})` : ''}`);

    return new Response(
      JSON.stringify({
        redirect_url: finalUrl,
        cache_hit: cacheHit,
        cache_tier: cacheTier,
        latency_ms: latency,
        sentinel_applied: !!sentinelDecision,
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          // Enable CDN edge caching: browser 60s, edge 5min, stale-while-revalidate 1hr
          'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=3600',
          'Vary': 'slug',
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