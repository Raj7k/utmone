import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.83.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface MatchingPayload {
  visitor_id: string;
  workspace_id: string;
  ip_address: string;
  user_agent: string;
  geo_country?: string;
  geo_city?: string;
  timestamp?: string;
}

interface VisitorSession {
  visitor_id: string;
  ip_address: string;
  user_agent: string;
  geo_country: string;
  geo_city: string;
  created_at: string;
}

// Extract OS family from user agent
function getOSFamily(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('mac')) return 'apple';
  if (ua.includes('android')) return 'android';
  if (ua.includes('windows')) return 'windows';
  if (ua.includes('linux')) return 'linux';
  return 'unknown';
}

// Calculate confidence score based on signals
function calculateConfidence(current: MatchingPayload, candidate: VisitorSession): { confidence: number; signals: Record<string, boolean> } {
  const signals: Record<string, boolean> = {};
  let score = 0;

  // Same IP address is the base requirement
  signals.ip_match = current.ip_address === candidate.ip_address;
  if (!signals.ip_match) return { confidence: 0, signals };

  // Same geographic location
  signals.geo_match = current.geo_country === candidate.geo_country && current.geo_city === candidate.geo_city;
  if (signals.geo_match) score += 0.3;

  // Compatible OS family (iOS/Mac = Apple ecosystem)
  const currentOS = getOSFamily(current.user_agent);
  const candidateOS = getOSFamily(candidate.user_agent);
  signals.os_compatible = currentOS === candidateOS || 
    (currentOS === 'apple' && candidateOS === 'apple');
  if (signals.os_compatible) score += 0.3;

  // Time proximity (within 1 hour = higher confidence)
  const currentTime = new Date(current.timestamp || new Date()).getTime();
  const candidateTime = new Date(candidate.created_at).getTime();
  const timeDiffHours = Math.abs(currentTime - candidateTime) / (1000 * 60 * 60);
  signals.time_proximity = timeDiffHours <= 1;
  if (signals.time_proximity) score += 0.2;
  else if (timeDiffHours <= 24) score += 0.1;

  // Different user agent (confirms different device)
  signals.different_device = current.user_agent !== candidate.user_agent;
  if (signals.different_device) score += 0.1;

  // If same geo but different geo, likely VPN - reduce confidence
  if (signals.ip_match && !signals.geo_match) {
    score = Math.max(0, score - 0.5);
    signals.vpn_suspected = true;
  }

  // Cap at 0.95 for probabilistic matches
  return { 
    confidence: Math.min(0.95, Math.max(0, score + 0.1)), // Base 0.1 for IP match
    signals 
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload: MatchingPayload = await req.json();
    const { visitor_id, workspace_id, ip_address, user_agent, geo_country, geo_city, timestamp } = payload;

    if (!visitor_id || !workspace_id || !ip_address) {
      return new Response(
        JSON.stringify({ error: 'visitor_id, workspace_id, and ip_address are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[identity-matching] Processing visitor ${visitor_id} from IP ${ip_address}`);

    // Find recent sessions from same IP but different visitor_id
    const lookbackHours = 24;
    const lookbackTime = new Date(Date.now() - lookbackHours * 60 * 60 * 1000).toISOString();

    const { data: candidates, error: queryError } = await supabase
      .from('link_clicks')
      .select('visitor_id, ip_address, user_agent, country, city, created_at')
      .eq('workspace_id', workspace_id)
      .neq('visitor_id', visitor_id)
      .gte('created_at', lookbackTime)
      .order('created_at', { ascending: false })
      .limit(100);

    if (queryError) {
      console.error('[identity-matching] Query error:', queryError);
      throw queryError;
    }

    // Filter to same IP and deduplicate by visitor_id
    const uniqueCandidates = new Map<string, VisitorSession>();
    for (const click of candidates || []) {
      if (click.ip_address === ip_address && !uniqueCandidates.has(click.visitor_id)) {
        uniqueCandidates.set(click.visitor_id, {
          visitor_id: click.visitor_id,
          ip_address: click.ip_address,
          user_agent: click.user_agent,
          geo_country: click.country,
          geo_city: click.city,
          created_at: click.created_at,
        });
      }
    }

    console.log(`[identity-matching] Found ${uniqueCandidates.size} potential matches`);

    const edgesCreated: Array<{ target: string; confidence: number }> = [];

    // Process each candidate
    for (const [candidateVisitorId, candidate] of uniqueCandidates) {
      const { confidence, signals } = calculateConfidence(
        { ...payload, geo_country, geo_city },
        candidate
      );

      // Only create edge if confidence >= 0.5
      if (confidence >= 0.5) {
        // Check if edge already exists
        const { data: existing } = await supabase
          .from('identity_edges')
          .select('id, confidence')
          .eq('workspace_id', workspace_id)
          .or(`and(source_visitor_id.eq.${visitor_id},target_visitor_id.eq.${candidateVisitorId}),and(source_visitor_id.eq.${candidateVisitorId},target_visitor_id.eq.${visitor_id})`)
          .maybeSingle();

        if (existing) {
          // Update if new confidence is higher
          if (confidence > existing.confidence) {
            await supabase
              .from('identity_edges')
              .update({ 
                confidence, 
                signals,
                updated_at: new Date().toISOString()
              })
              .eq('id', existing.id);
            console.log(`[identity-matching] Updated edge ${existing.id} with confidence ${confidence}`);
          }
        } else {
          // Create new edge
          const { error: insertError } = await supabase
            .from('identity_edges')
            .insert({
              source_visitor_id: visitor_id,
              target_visitor_id: candidateVisitorId,
              workspace_id,
              match_type: 'probabilistic',
              confidence,
              signals,
            });

          if (insertError) {
            console.error('[identity-matching] Insert error:', insertError);
          } else {
            edgesCreated.push({ target: candidateVisitorId, confidence });
            console.log(`[identity-matching] Created edge to ${candidateVisitorId} with confidence ${confidence}`);
          }
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        visitor_id,
        edges_created: edgesCreated.length,
        edges: edgesCreated,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[identity-matching] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
