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
