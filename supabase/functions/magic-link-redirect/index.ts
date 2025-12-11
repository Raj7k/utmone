import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.83.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extract token from URL path
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const token = pathParts[pathParts.length - 1];

    if (!token || token === 'magic-link-redirect') {
      return new Response('Invalid magic link', { status: 400 });
    }

    console.log(`[magic-link-redirect] Processing token: ${token.substring(0, 8)}...`);

    // Find registration by magic link token
    const { data: registration, error: regError } = await supabase
      .from('event_bridge_registrations')
      .select('*, event_bridge_flows(*)')
      .eq('magic_link_token', token)
      .single();

    if (regError || !registration) {
      console.error('[magic-link-redirect] Registration not found:', regError);
      return new Response('Magic link not found or expired', { status: 404 });
    }

    const flow = registration.event_bridge_flows;

    // Generate visitor ID for cookie
    const visitorId = `utm_${crypto.randomUUID().replace(/-/g, '').substring(0, 16)}`;

    // Update registration with click timestamp and visitor ID
    await supabase
      .from('event_bridge_registrations')
      .update({
        magic_link_clicked_at: new Date().toISOString(),
        visitor_id: visitorId,
      })
      .eq('id', registration.id);

    // Create/update visitor identity for attribution
    await supabase
      .from('visitor_identities')
      .upsert({
        workspace_id: registration.workspace_id,
        email: registration.email,
        name: `${registration.first_name || ''} ${registration.last_name || ''}`.trim() || null,
        visitor_id: visitorId,
        identified_at: new Date().toISOString(),
      }, { onConflict: 'visitor_id' });

    // Record journey event for attribution
    await supabase
      .from('journey_events')
      .insert({
        workspace_id: registration.workspace_id,
        visitor_id: visitorId,
        event_type: 'identify',
        event_name: 'event_registration_clicked',
        source: 'luma',
        medium: 'event',
        campaign: flow?.name || 'event_bridge',
        metadata: {
          flow_id: flow?.id,
          registration_id: registration.id,
          email: registration.email,
        },
      });

    console.log('[magic-link-redirect] ✅ Identity stitched, visitor:', visitorId);

    // Get redirect URL from flow config or default to Luma
    const sourceConfig = flow?.source_config || {};
    let redirectUrl = sourceConfig.event_url || sourceConfig.redirect_url;
    
    // Default fallback
    if (!redirectUrl) {
      redirectUrl = 'https://lu.ma';
    }

    // Set attribution cookie and redirect
    const cookieMaxAge = 365 * 24 * 60 * 60; // 1 year
    const cookies = [
      `utm_visitor_id=${visitorId}; Path=/; Max-Age=${cookieMaxAge}; SameSite=Lax`,
      `utm_source=luma; Path=/; Max-Age=${cookieMaxAge}; SameSite=Lax`,
      `utm_medium=event; Path=/; Max-Age=${cookieMaxAge}; SameSite=Lax`,
      `utm_campaign=${encodeURIComponent(flow?.name || 'event')}; Path=/; Max-Age=${cookieMaxAge}; SameSite=Lax`,
    ];

    return new Response(null, {
      status: 302,
      headers: {
        'Location': redirectUrl,
        'Set-Cookie': cookies.join(', '),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('[magic-link-redirect] Error:', error);
    return new Response('Internal server error', { status: 500 });
  }
});
