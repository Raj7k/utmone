import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EventHaloRequest {
  event_id: string;
  workspace_id: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { event_id, workspace_id }: EventHaloRequest = await req.json();

    console.log(`Calculating Event Halo for event: ${event_id}`);

    // Step 1: Get event details
    const { data: event, error: eventError } = await supabase
      .from('field_events')
      .select('*')
      .eq('id', event_id)
      .single();

    if (eventError || !event) {
      console.error('Event not found:', eventError);
      return new Response(
        JSON.stringify({ error: 'Event not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);
    const eventCity = event.location_city.toLowerCase();
    
    // Calculate event duration in days
    const eventDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));

    console.log(`Event: ${event.name}, City: ${eventCity}, Duration: ${eventDays} days`);

    // Step 2: Count traffic during event from event city
    const { count: eventTrafficCount, error: eventTrafficError } = await supabase
      .from('link_clicks')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspace_id)
      .ilike('city', `%${eventCity}%`)
      .gte('clicked_at', startDate.toISOString())
      .lte('clicked_at', endDate.toISOString());

    if (eventTrafficError) {
      console.error('Error fetching event traffic:', eventTrafficError);
    }

    const eventTraffic = eventTrafficCount || 0;
    console.log(`Event period traffic from ${eventCity}: ${eventTraffic}`);

    // Step 3: Calculate baseline (same city, 30 days prior to event)
    const baselineStart = new Date(startDate);
    baselineStart.setDate(baselineStart.getDate() - 30);
    const baselineEnd = new Date(startDate);
    baselineEnd.setDate(baselineEnd.getDate() - 1);

    const { count: baselineTrafficCount, error: baselineError } = await supabase
      .from('link_clicks')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspace_id)
      .ilike('city', `%${eventCity}%`)
      .gte('clicked_at', baselineStart.toISOString())
      .lte('clicked_at', baselineEnd.toISOString());

    if (baselineError) {
      console.error('Error fetching baseline traffic:', baselineError);
    }

    const baselineTraffic = baselineTrafficCount || 0;
    console.log(`Baseline (30 days prior) traffic from ${eventCity}: ${baselineTraffic}`);

    // Step 4: Calculate normalized baseline and lift
    // Normalize baseline to match event duration
    const normalizedBaseline = Math.round((baselineTraffic / 30) * eventDays);
    
    // Halo visitors = excess traffic above baseline (never negative)
    const haloVisitors = Math.max(0, eventTraffic - normalizedBaseline);
    
    // Calculate lift percentage
    const liftPercentage = normalizedBaseline > 0 
      ? Math.round(((eventTraffic - normalizedBaseline) / normalizedBaseline) * 100)
      : eventTraffic > 0 ? 100 : 0;

    console.log(`Normalized baseline: ${normalizedBaseline}, Halo visitors: ${haloVisitors}, Lift: ${liftPercentage}%`);

    // Step 5: Get direct scans count
    const { count: directScansCount } = await supabase
      .from('event_badge_scans')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', event_id);

    const directScans = directScansCount || 0;

    // Step 6: Estimate pipeline (using workspace average conversion rate or 15% default)
    const totalImpact = haloVisitors + directScans;
    const estimatedConversionRate = 0.15; // 15% default
    const avgDealSize = 10000; // $10k default
    const attributedPipeline = Math.round(totalImpact * estimatedConversionRate * avgDealSize);

    // Step 7: Update event with calculated values
    const { error: updateError } = await supabase
      .from('field_events')
      .update({
        halo_visitors: haloVisitors,
        baseline_visitors: normalizedBaseline,
        lift_percentage: liftPercentage,
        direct_scans: directScans,
        attributed_pipeline: attributedPipeline,
        status: new Date() > endDate ? 'completed' : new Date() >= startDate ? 'active' : 'upcoming',
        updated_at: new Date().toISOString()
      })
      .eq('id', event_id);

    if (updateError) {
      console.error('Error updating event:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update event' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = {
      event_id,
      event_name: event.name,
      location_city: event.location_city,
      event_days: eventDays,
      event_traffic: eventTraffic,
      baseline_traffic: baselineTraffic,
      normalized_baseline: normalizedBaseline,
      halo_visitors: haloVisitors,
      lift_percentage: liftPercentage,
      direct_scans: directScans,
      total_impact: totalImpact,
      attributed_pipeline: attributedPipeline
    };

    console.log('Event Halo calculation complete:', result);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in calculate-event-halo:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
