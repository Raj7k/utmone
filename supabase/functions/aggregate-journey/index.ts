import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Touchpoint {
  link_id: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  clicked_at: string;
  link_title: string | null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { visitor_id, conversion_event_id, revenue, workspace_id } = await req.json();

    if (!visitor_id || !conversion_event_id || !workspace_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[Aggregate Journey] Processing visitor:', visitor_id);

    // Look back 30 days for all clicks by this visitor
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: clicks, error: clicksError } = await supabase
      .from('link_clicks')
      .select(`
        id,
        link_id,
        created_at,
        links!inner(
          id,
          title,
          utm_source,
          utm_medium,
          utm_campaign,
          workspace_id
        )
      `)
      .eq('visitor_id', visitor_id)
      .eq('links.workspace_id', workspace_id)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    if (clicksError) {
      console.error('[Aggregate Journey] Error fetching clicks:', clicksError);
      throw clicksError;
    }

    if (!clicks || clicks.length === 0) {
      console.log('[Aggregate Journey] No clicks found for visitor');
      return new Response(
        JSON.stringify({ message: 'No journey data found', touchpoints: 0 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build touchpoints array
    const touchpoints: Touchpoint[] = clicks.map((click: any) => ({
      link_id: click.link_id,
      utm_source: click.links.utm_source,
      utm_medium: click.links.utm_medium,
      utm_campaign: click.links.utm_campaign,
      clicked_at: click.created_at,
      link_title: click.links.title,
    }));

    const journeyStart = clicks[0].created_at;
    const journeyEnd = clicks[clicks.length - 1].created_at;

    // Insert or update journey
    const { data: existingJourney } = await supabase
      .from('attribution_journeys')
      .select('id')
      .eq('visitor_id', visitor_id)
      .eq('conversion_event_id', conversion_event_id)
      .single();

    if (existingJourney) {
      // Update existing journey
      const { error: updateError } = await supabase
        .from('attribution_journeys')
        .update({
          touchpoints,
          converted: true,
          revenue: revenue || 0,
          journey_end_at: journeyEnd,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingJourney.id);

      if (updateError) throw updateError;
    } else {
      // Insert new journey
      const { error: insertError } = await supabase
        .from('attribution_journeys')
        .insert({
          visitor_id,
          workspace_id,
          touchpoints,
          converted: true,
          revenue: revenue || 0,
          journey_start_at: journeyStart,
          journey_end_at: journeyEnd,
          conversion_event_id,
        });

      if (insertError) throw insertError;
    }

    console.log('[Aggregate Journey] Journey created/updated:', touchpoints.length, 'touchpoints');

    return new Response(
      JSON.stringify({
        success: true,
        touchpoints: touchpoints.length,
        journey_start: journeyStart,
        journey_end: journeyEnd,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[Aggregate Journey] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});