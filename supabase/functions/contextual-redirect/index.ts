import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContextVector {
  is_mobile: number;
  is_ios: number;
  is_us: number;
}

interface BanditState {
  destination_index: number;
  context_key: string;
  a_matrix: number[][];
  b_vector: number[];
  impressions: number;
  conversions: number;
}

// Extract context from request headers
function extractContext(userAgent: string, cfCountry?: string): ContextVector {
  const ua = userAgent.toLowerCase();
  
  return {
    is_mobile: /mobile|android|iphone|ipad|ipod|windows phone/i.test(ua) ? 1 : 0,
    is_ios: /iphone|ipad|ipod/i.test(ua) ? 1 : 0,
    is_us: cfCountry?.toUpperCase() === 'US' ? 1 : 0,
  };
}

function getContextKey(context: ContextVector): string {
  const device = context.is_mobile ? 'mobile' : 'desktop';
  const os = context.is_ios ? 'ios' : 'other';
  const country = context.is_us ? 'us' : 'other';
  return `${device}_${os}_${country}`;
}

function contextToArray(context: ContextVector): number[] {
  return [context.is_mobile, context.is_ios, context.is_us];
}

function invertMatrix3x3(A: number[][]): number[][] {
  const n = 3;
  const augmented: number[][] = A.map((row, i) => 
    [...row, ...[0, 0, 0].map((_, j) => i === j ? 1 : 0)]
  );

  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
        maxRow = k;
      }
    }
    [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];

    const divisor = augmented[i][i];
    if (Math.abs(divisor) < 1e-10) {
      return [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    }
    
    for (let j = 0; j < 2 * n; j++) {
      augmented[i][j] /= divisor;
    }

    for (let k = 0; k < n; k++) {
      if (k !== i) {
        const factor = augmented[k][i];
        for (let j = 0; j < 2 * n; j++) {
          augmented[k][j] -= factor * augmented[i][j];
        }
      }
    }
  }

  return augmented.map(row => row.slice(n));
}

function matrixVectorMultiply(A: number[][], x: number[]): number[] {
  return A.map(row => 
    row.reduce((sum, val, i) => sum + val * x[i], 0)
  );
}

function dotProduct(x: number[], y: number[]): number {
  return x.reduce((sum, val, i) => sum + val * y[i], 0);
}

function calculateLinUCBScore(
  state: BanditState,
  context: ContextVector,
  alpha: number
): number {
  const x = contextToArray(context);
  const A_inv = invertMatrix3x3(state.a_matrix);
  const theta = matrixVectorMultiply(A_inv, state.b_vector);
  const exploitation = dotProduct(theta, x);
  const A_inv_x = matrixVectorMultiply(A_inv, x);
  const exploration = alpha * Math.sqrt(Math.max(0, dotProduct(x, A_inv_x)));
  return exploitation + exploration;
}

function getAlpha(totalImpressions: number): number {
  if (totalImpressions < 50) return 2.0;
  if (totalImpressions < 200) return 1.5;
  if (totalImpressions < 500) return 1.0;
  return 0.5;
}

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch link data
    const { data: link, error } = await supabase
      .from('links')
      .select('id, destination_url, destinations, contextual_routing, routing_strategy, utm_source, utm_medium, utm_campaign, utm_term, utm_content')
      .eq('slug', slug)
      .eq('status', 'active')
      .maybeSingle();

    if (error || !link) {
      return new Response(
        JSON.stringify({ error: 'Link not found' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    // Extract user context
    const userAgent = req.headers.get('user-agent') || '';
    const cfCountry = req.headers.get('cf-ipcountry') || undefined;
    const context = extractContext(userAgent, cfCountry);
    const contextKey = getContextKey(context);

    let destinationUrl = link.destination_url;
    let selectedIndex = 0;

    // Check if contextual routing is enabled and destinations exist
    if (link.contextual_routing && link.destinations && Array.isArray(link.destinations)) {
      const destinations = link.destinations as Array<{ url: string }>;
      
      if (destinations.length >= 2) {
        // Fetch bandit states for all destinations
        const { data: banditStates } = await supabase
          .from('link_bandits')
          .select('*')
          .eq('link_id', link.id)
          .eq('context_key', contextKey);

        // Initialize missing states
        const existingIndices = new Set(banditStates?.map(s => s.destination_index) || []);
        const missingStates = [];
        
        for (let i = 0; i < destinations.length; i++) {
          if (!existingIndices.has(i)) {
            missingStates.push({
              link_id: link.id,
              destination_index: i,
              context_key: contextKey,
              a_matrix: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
              b_vector: [0, 0, 0],
              impressions: 0,
              conversions: 0,
            });
          }
        }

        if (missingStates.length > 0) {
          await supabase.from('link_bandits').insert(missingStates);
        }

        // Fetch complete states
        const { data: completeStates } = await supabase
          .from('link_bandits')
          .select('*')
          .eq('link_id', link.id)
          .eq('context_key', contextKey);

        if (completeStates && completeStates.length > 0) {
          // Calculate total impressions for alpha
          const totalImpressions = completeStates.reduce((sum, s) => sum + (s.impressions || 0), 0);
          const alpha = getAlpha(totalImpressions);

          // Select best destination using LinUCB
          let bestScore = -Infinity;
          let bestIndex = 0;

          for (const state of completeStates) {
            const score = calculateLinUCBScore(state as BanditState, context, alpha);
            if (score > bestScore) {
              bestScore = score;
              bestIndex = state.destination_index;
            }
          }

          selectedIndex = bestIndex;
          destinationUrl = destinations[bestIndex]?.url || link.destination_url;

          // Update impression count asynchronously
          supabase
            .from('link_bandits')
            .update({ 
              impressions: (completeStates.find(s => s.destination_index === bestIndex)?.impressions || 0) + 1,
              last_updated_at: new Date().toISOString(),
            })
            .eq('link_id', link.id)
            .eq('destination_index', bestIndex)
            .eq('context_key', contextKey)
            .then(({ error }) => {
              if (error) console.error('Error updating impressions:', error);
            });

          console.log(`🎯 Contextual routing: ${contextKey} → destination ${bestIndex} (score: ${bestScore.toFixed(3)})`);
        }
      }
    }

    // Build final URL with UTM parameters
    const destUrl = new URL(destinationUrl);
    if (link.utm_source) destUrl.searchParams.set('utm_source', link.utm_source);
    if (link.utm_medium) destUrl.searchParams.set('utm_medium', link.utm_medium);
    if (link.utm_campaign) destUrl.searchParams.set('utm_campaign', link.utm_campaign);
    if (link.utm_term) destUrl.searchParams.set('utm_term', link.utm_term);
    if (link.utm_content) destUrl.searchParams.set('utm_content', link.utm_content);

    const finalUrl = destUrl.toString();
    const latency = Date.now() - startTime;

    console.log(`✅ Redirect for ${slug} - ${latency}ms - context: ${contextKey}`);

    return new Response(
      JSON.stringify({
        redirect_url: finalUrl,
        context_key: contextKey,
        selected_destination: selectedIndex,
        latency_ms: latency,
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in contextual-redirect:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
