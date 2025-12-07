import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { getSecureCorsHeaders } from '../_shared/security-headers.ts';

const corsHeaders = getSecureCorsHeaders();

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request
    const url = new URL(req.url);
    const pixelId = url.searchParams.get('pixel_id');
    const eventType = url.searchParams.get('event') || 'pageview';
    const revenue = parseFloat(url.searchParams.get('revenue') || '0');
    const eventName = url.searchParams.get('event_name') || null;
    const pageUrl = url.searchParams.get('url') || null;
    const pageTitle = url.searchParams.get('title') || null;

    if (!pixelId) {
      return new Response(
        JSON.stringify({ error: 'pixel_id required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get visitor_id from cookie or query param (for debugging)
    const cookieHeader = req.headers.get('cookie') || '';
    let visitorId = cookieHeader
      .split(';')
      .find(c => c.trim().startsWith('utm_visitor_id='))
      ?.split('=')[1];

    // Also check utm_vid query parameter (set during redirect)
    if (!visitorId) {
      visitorId = url.searchParams.get('utm_vid') || undefined;
    }

    // Generate a visitor_id if none exists (for direct pageview tracking)
    if (!visitorId) {
      const randomPart = Array.from(crypto.getRandomValues(new Uint8Array(12)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      visitorId = `v_${randomPart}`;
      console.log(`Generated new visitor_id for tracking: ${visitorId}`);
    }

    console.log(`Tracking pixel event: ${eventType}, visitor_id: ${visitorId}, pixel_id: ${pixelId}`);

    // Verify pixel_id exists and get workspace
    const { data: pixelConfig, error: pixelError } = await supabase
      .from('pixel_configs')
      .select('workspace_id, domain_whitelist, is_active')
      .eq('pixel_id', pixelId)
      .eq('is_active', true)
      .single();

    if (pixelError || !pixelConfig) {
      console.error('Invalid pixel_id:', pixelId);
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid pixel_id' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check domain whitelist if configured
    const referrer = req.headers.get('referer') || req.headers.get('referrer');
    if (pixelConfig.domain_whitelist && pixelConfig.domain_whitelist.length > 0 && referrer) {
      try {
        const referrerDomain = new URL(referrer).hostname;
        const isWhitelisted = pixelConfig.domain_whitelist.some((domain: string) => 
          referrerDomain === domain || referrerDomain.endsWith(`.${domain}`)
        );

        if (!isWhitelisted) {
          console.log(`Domain not whitelisted: ${referrerDomain}`);
          return new Response(
            JSON.stringify({ success: false, error: 'Domain not whitelisted' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } catch (e) {
        console.log('Could not parse referrer domain, skipping whitelist check');
      }
    }

    // Find the original click using visitor_id (optional - for conversion attribution)
    let click = null;
    const { data: clickData } = await supabase
      .from('link_clicks')
      .select('link_id, id, metadata')
      .eq('visitor_id', visitorId)
      .order('clicked_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    click = clickData;

    // For pageview events, we DON'T require a prior click match
    // This allows the real-time debugger to work even for direct visits
    const linkId = click?.link_id || null;
    const clickId = click?.id || null;

    console.log(`Click lookup: ${click ? `found link_id=${linkId}` : 'no prior click found (OK for pageview)'}`);

    // Insert conversion event (always, even without click match for debugger to work)
    const { error: conversionError } = await supabase
      .from('conversion_events')
      .insert({
        link_id: linkId,
        workspace_id: pixelConfig.workspace_id,
        visitor_id: visitorId,
        click_id: clickId,
        event_type: eventType,
        event_name: eventName || (eventType === 'pageview' ? pageTitle : null),
        event_value: revenue > 0 ? revenue : null,
        currency: 'USD',
        metadata: {
          pixel_id: pixelId,
          referrer: referrer,
          page_url: pageUrl,
          page_title: pageTitle,
          user_agent: req.headers.get('user-agent'),
          has_prior_click: !!click,
        },
      });

    if (conversionError) {
      console.error('Error inserting conversion:', conversionError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to log conversion' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Also insert into journey_events for real-time debugger and journey visualization
    const { error: journeyError } = await supabase
      .from('journey_events')
      .insert({
        workspace_id: pixelConfig.workspace_id,
        visitor_id: visitorId,
        event_type: eventType,
        event_name: eventName || (eventType === 'pageview' ? 'page_view' : null),
        source: click ? (click.metadata as any)?.utm_source || null : null,
        medium: click ? (click.metadata as any)?.utm_medium || null : null,
        campaign: click ? (click.metadata as any)?.utm_campaign || null : null,
        landing_page: pageUrl || referrer,
        referrer: referrer,
        revenue: revenue > 0 ? revenue : null,
        device_type: null,
        metadata: {
          pixel_id: pixelId,
          link_id: linkId,
          click_id: clickId,
          page_url: pageUrl,
          page_title: pageTitle,
          has_prior_click: !!click,
        },
      });

    if (journeyError) {
      console.error('Error inserting journey event (non-fatal):', journeyError);
    }

    console.log(`✅ Event logged: ${eventType}, link_id: ${linkId || 'none'}, workspace: ${pixelConfig.workspace_id}`);

    // Trigger identity matching for cross-device attribution (fire and forget) - only if we have a click
    if (click) {
      const userAgent = req.headers.get('user-agent') || '';
      const cfCountry = req.headers.get('cf-ipcountry') || 'unknown';
      const cfCity = req.headers.get('cf-ipcity') || 'unknown';
      const clientIp = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
      
      supabase.functions.invoke('identity-matching', {
        body: {
          visitor_id: visitorId,
          workspace_id: pixelConfig.workspace_id,
          ip_address: clientIp,
          user_agent: userAgent,
          geo_location: `${cfCity}, ${cfCountry}`,
          timestamp: new Date().toISOString(),
        },
      }).catch(err => console.error('Identity matching failed:', err));

      // Check if this click was part of an experiment and update experiment stats
      const clickMetadata = click.metadata as any;
      if (clickMetadata?.experiment_id && clickMetadata?.experiment_variant) {
        console.log(`Updating experiment stats for conversion: ${clickMetadata.experiment_id}, variant ${clickMetadata.experiment_variant}`);
        
        supabase.functions.invoke('update-experiment-stats', {
          body: {
            experiment_id: clickMetadata.experiment_id,
            variant: clickMetadata.experiment_variant,
            is_conversion: true,
          },
        }).catch(err => console.error('Failed to update experiment stats:', err));
      }
    }

    // Set visitor_id cookie in response for future tracking
    const cookieValue = `utm_visitor_id=${visitorId}; Path=/; Max-Age=2592000; SameSite=None; Secure`;

    return new Response(
      JSON.stringify({ 
        success: true, 
        event: eventType, 
        link_id: linkId,
        visitor_id: visitorId,
        workspace_id: pixelConfig.workspace_id,
        has_prior_click: !!click,
      }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Set-Cookie': cookieValue,
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        } 
      }
    );

  } catch (error) {
    console.error('Pixel tracking error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});