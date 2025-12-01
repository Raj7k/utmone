import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.83.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-link-id, x-workspace-id',
};

interface ConversionEvent {
  link_id: string;
  event_type: 'lead' | 'signup' | 'purchase' | 'custom';
  event_name?: string;
  event_value?: number;
  currency?: string;
  metadata?: Record<string, any>;
  user_identifier?: string;
  click_id?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse request body
    const event: ConversionEvent = await req.json();

    // Validate required fields
    if (!event.link_id || !event.event_type) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: link_id and event_type are required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verify link exists and get workspace_id
    const { data: link, error: linkError } = await supabase
      .from('links')
      .select('id, workspace_id')
      .eq('id', event.link_id)
      .single();

    if (linkError || !link) {
      return new Response(
        JSON.stringify({ 
          error: 'Link not found or invalid link_id' 
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Find most recent click for attribution (within 30 days)
    let clickId = event.click_id;
    if (!clickId && event.user_identifier) {
      // Try to attribute to recent click based on user_identifier or IP
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      
      const { data: recentClick } = await supabase
        .from('link_clicks')
        .select('id')
        .eq('link_id', event.link_id)
        .gte('clicked_at', thirtyDaysAgo)
        .order('clicked_at', { ascending: false })
        .limit(1)
        .single();

      if (recentClick) {
        clickId = recentClick.id;
      }
    }

    // Insert conversion event
    const { data: conversion, error: conversionError } = await supabase
      .from('conversion_events')
      .insert({
        link_id: event.link_id,
        workspace_id: link.workspace_id,
        click_id: clickId,
        event_type: event.event_type,
        event_name: event.event_name,
        event_value: event.event_value,
        currency: event.currency || 'USD',
        metadata: event.metadata || {},
        user_identifier: event.user_identifier,
      })
      .select()
      .single();

    if (conversionError) {
      console.error('Error inserting conversion:', conversionError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to track conversion',
          details: conversionError.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`✅ Conversion tracked: ${event.event_type} for link ${event.link_id}`);

    // Aggregate journey for Bayesian attribution (async)
    if (clickId) {
      try {
        const { data: clickData } = await supabase
          .from('link_clicks')
          .select('visitor_id')
          .eq('id', clickId)
          .single();

        if (clickData?.visitor_id && conversion) {
          await supabase.functions.invoke('aggregate-journey', {
            body: {
              visitor_id: clickData.visitor_id,
              conversion_event_id: conversion.id,
              revenue: event.event_value || 0,
              workspace_id: link.workspace_id,
            },
          });
          console.log('📊 Journey aggregation triggered for Bayesian attribution');
        }
      } catch (journeyError) {
        console.error('Journey aggregation failed:', journeyError);
        // Don't fail conversion tracking if journey aggregation fails
      }
    }

    // Update bandit weights if contextual routing is enabled
    if (clickId) {
      try {
        // Get the click context from link_clicks table
        const { data: click } = await supabase
          .from('link_clicks')
          .select('user_agent, ip_address')
          .eq('id', clickId)
          .single();

        if (click) {
          // Get link to check if contextual routing is enabled
          const { data: linkData } = await supabase
            .from('links')
            .select('contextual_routing, destinations')
            .eq('id', event.link_id)
            .single();

          if (linkData?.contextual_routing && linkData.destinations) {
            // Extract context from click
            const ua = click.user_agent?.toLowerCase() || '';
            const context = {
              is_mobile: /mobile|android|iphone|ipad|ipod|windows phone/i.test(ua) ? 1 : 0,
              is_ios: /iphone|ipad|ipod/i.test(ua) ? 1 : 0,
              is_us: 0, // We don't have country in link_clicks yet
            };
            
            const device = context.is_mobile ? 'mobile' : 'desktop';
            const os = context.is_ios ? 'ios' : 'other';
            const contextKey = `${device}_${os}_other`;

            // Determine which destination was used (stored in click metadata or utm_content)
            const { data: clickDetail } = await supabase
              .from('link_clicks')
              .select('metadata')
              .eq('id', clickId)
              .single();

            const destinationIndex = clickDetail?.metadata?.destination_index || 0;

            // Update bandit weights: A = A + x*x^T, b = b + r*x (reward=1)
            const { data: banditState } = await supabase
              .from('link_bandits')
              .select('*')
              .eq('link_id', event.link_id)
              .eq('destination_index', destinationIndex)
              .eq('context_key', contextKey)
              .single();

            if (banditState) {
              const x = [context.is_mobile, context.is_ios, context.is_us];
              const reward = 1; // Conversion happened
              
              // Update A matrix: A = A + x * x^T
              const currentA = banditState.a_matrix as number[][];
              const newA = currentA.map((row, i) =>
                row.map((val, j) => val + x[i] * x[j])
              );
              
              // Update b vector: b = b + r * x
              const currentB = banditState.b_vector as number[];
              const newB = currentB.map((val, i) => val + reward * x[i]);

              await supabase
                .from('link_bandits')
                .update({
                  a_matrix: newA,
                  b_vector: newB,
                  conversions: (banditState.conversions || 0) + 1,
                  last_updated_at: new Date().toISOString(),
                })
                .eq('link_id', event.link_id)
                .eq('destination_index', destinationIndex)
                .eq('context_key', contextKey);

              console.log(`🎯 Updated bandit weights for destination ${destinationIndex} in context ${contextKey}`);
            }
          }
        }
      } catch (banditError) {
        console.error('Failed to update bandit weights:', banditError);
        // Don't fail the conversion if bandit update fails
      }
    }

    // Trigger conversion.tracked webhook
    try {
      const { data: webhooks } = await supabase
        .from('webhook_subscriptions')
        .select('*')
        .eq('workspace_id', link.workspace_id)
        .eq('is_active', true);

      if (webhooks && webhooks.length > 0) {
        const matchingWebhooks = webhooks.filter(w => 
          w.event_type.split(',').includes('conversion.tracked')
        );

        for (const webhook of matchingWebhooks) {
          await supabase.functions.invoke('send-webhook', {
            body: {
              event: 'conversion.tracked',
              data: {
                conversion_id: conversion.id,
                link_id: conversion.link_id,
                event_type: conversion.event_type,
                event_name: conversion.event_name,
                event_value: conversion.event_value,
                currency: conversion.currency,
                tracked_at: conversion.created_at,
                user_identifier: conversion.user_identifier,
              },
              webhookUrl: webhook.webhook_url,
              secret: webhook.secret,
            },
          });
        }
      }
    } catch (webhookError) {
      console.error('Failed to trigger webhook:', webhookError);
      // Don't fail the conversion if webhook fails
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        data: conversion,
        message: 'Conversion tracked successfully'
      }),
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in track-conversion function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
