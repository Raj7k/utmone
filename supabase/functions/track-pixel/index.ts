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

    if (!pixelId) {
      return new Response(
        JSON.stringify({ error: 'pixel_id required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get visitor_id from cookie
    const cookieHeader = req.headers.get('cookie') || '';
    const visitorId = cookieHeader
      .split(';')
      .find(c => c.trim().startsWith('utm_visitor_id='))
      ?.split('=')[1];

    if (!visitorId) {
      console.log('No visitor_id cookie found - conversion cannot be attributed');
      return new Response(
        JSON.stringify({ success: false, error: 'No visitor_id cookie found' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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
    }

    // Find the original click using visitor_id
    const { data: click, error: clickError } = await supabase
      .from('link_clicks')
      .select('link_id, id, metadata')
      .eq('visitor_id', visitorId)
      .order('clicked_at', { ascending: false })
      .limit(1)
      .single();

    if (clickError || !click) {
      console.log('No click found for visitor_id:', visitorId);
      return new Response(
        JSON.stringify({ success: false, error: 'No click found for visitor' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert conversion event
    const { error: conversionError } = await supabase
      .from('conversion_events')
      .insert({
        link_id: click.link_id,
        workspace_id: pixelConfig.workspace_id,
        visitor_id: visitorId,
        click_id: click.id,
        event_type: eventType,
        event_name: eventName,
        event_value: revenue > 0 ? revenue : null,
        currency: 'USD',
        metadata: {
          pixel_id: pixelId,
          referrer: referrer,
          user_agent: req.headers.get('user-agent'),
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
        event_name: eventName,
        source: (click.metadata as any)?.utm_source || null,
        medium: (click.metadata as any)?.utm_medium || null,
        campaign: (click.metadata as any)?.utm_campaign || null,
        landing_page: referrer,
        referrer: referrer,
        revenue: revenue > 0 ? revenue : null,
        device_type: null,
        metadata: {
          pixel_id: pixelId,
          link_id: click.link_id,
          click_id: click.id,
        },
      });

    if (journeyError) {
      console.error('Error inserting journey event (non-fatal):', journeyError);
    }

    console.log(`✅ Conversion logged: ${eventType}, link_id: ${click.link_id}, revenue: ${revenue}`);

    // Trigger identity matching for cross-device attribution (fire and forget)
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
      
      // Call update-experiment-stats with conversion flag
      supabase.functions.invoke('update-experiment-stats', {
        body: {
          experiment_id: clickMetadata.experiment_id,
          variant: clickMetadata.experiment_variant,
          is_conversion: true,
        },
      }).catch(err => console.error('Failed to update experiment stats:', err));
    }

    return new Response(
      JSON.stringify({ success: true, event: eventType, link_id: click.link_id }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
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