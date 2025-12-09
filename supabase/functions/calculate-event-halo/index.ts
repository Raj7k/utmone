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

    console.log(`[Event Halo] Starting calculation for event: ${event_id}`);

    // Step 1: Get event details
    const { data: event, error: eventError } = await supabase
      .from('field_events')
      .select('*')
      .eq('id', event_id)
      .single();

    if (eventError || !event) {
      console.error('[Event Halo] Event not found:', eventError);
      return new Response(
        JSON.stringify({ error: 'Event not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);
    const eventCity = event.location_city;

    console.log(`[Event Halo] Event: ${event.name}, City: ${eventCity}, Start: ${startDate.toISOString()}, End: ${endDate.toISOString()}`);

    // Step 2: Use the calculate_city_baseline SQL function for zero-dependency analysis
    // This uses journey_events (pixel data) - no external API access needed
    const { data: haloData, error: haloError } = await supabase.rpc('calculate_city_baseline', {
      p_workspace_id: workspace_id,
      p_target_city: eventCity,
      p_event_start: startDate.toISOString(),
      p_event_end: endDate.toISOString(),
      p_baseline_days: 30
    });

    if (haloError) {
      console.error('[Event Halo] Error calculating baseline:', haloError);
      // Fallback to zero values if function fails
    }

    const haloResult = haloData?.[0] || {
      baseline_daily_average: 0,
      baseline_total_visitors: 0,
      event_visitors: 0,
      halo_visitors: 0,
      lift_percentage: 0,
      event_duration_days: 1,
      has_sufficient_data: false
    };

    console.log(`[Event Halo] Baseline analysis:`, haloResult);

    // Step 3: Get time series data for the spike chart (baseline + event period)
    const timeseriesStart = new Date(startDate);
    timeseriesStart.setDate(timeseriesStart.getDate() - 30);

    const { data: timeseries, error: timeseriesError } = await supabase.rpc('get_city_visitor_timeseries', {
      p_workspace_id: workspace_id,
      p_target_city: eventCity,
      p_start_date: timeseriesStart.toISOString(),
      p_end_date: endDate.toISOString()
    });

    if (timeseriesError) {
      console.error('[Event Halo] Error fetching timeseries:', timeseriesError);
    }

    console.log(`[Event Halo] Timeseries data points: ${timeseries?.length || 0}`);

    // Step 4: Get direct scans count (badge scans at booth)
    const { count: directScansCount } = await supabase
      .from('event_badge_scans')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', event_id);

    const directScans = directScansCount || 0;

    // Step 5: Estimate pipeline using halo + direct scans
    const totalImpact = (haloResult.halo_visitors || 0) + directScans;
    const estimatedConversionRate = 0.15; // 15% default
    const avgDealSize = 10000; // $10k default
    const attributedPipeline = Math.round(totalImpact * estimatedConversionRate * avgDealSize);

    // Step 6: Update event with calculated values
    const now = new Date();
    const newStatus = now > endDate ? 'completed' : now >= startDate ? 'active' : 'upcoming';

    const { error: updateError } = await supabase
      .from('field_events')
      .update({
        halo_visitors: haloResult.halo_visitors || 0,
        baseline_visitors: Math.round(haloResult.baseline_daily_average * haloResult.event_duration_days) || 0,
        lift_percentage: haloResult.lift_percentage || 0,
        direct_scans: directScans,
        attributed_pipeline: attributedPipeline,
        status: newStatus,
        updated_at: now.toISOString()
      })
      .eq('id', event_id);

    if (updateError) {
      console.error('[Event Halo] Error updating event:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update event' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = {
      event_id,
      event_name: event.name,
      location_city: event.location_city,
      // Baseline analysis (from journey_events pixel data)
      baseline_daily_average: haloResult.baseline_daily_average,
      baseline_total_visitors: haloResult.baseline_total_visitors,
      event_visitors: haloResult.event_visitors,
      halo_visitors: haloResult.halo_visitors,
      lift_percentage: haloResult.lift_percentage,
      event_duration_days: haloResult.event_duration_days,
      has_sufficient_data: haloResult.has_sufficient_data,
      // Additional metrics
      direct_scans: directScans,
      total_impact: totalImpact,
      attributed_pipeline: attributedPipeline,
      // Timeseries for spike chart
      timeseries: timeseries || [],
      event_start: startDate.toISOString(),
      event_end: endDate.toISOString()
    };

    console.log(`[Event Halo] Calculation complete:`, {
      halo_visitors: result.halo_visitors,
      lift_percentage: result.lift_percentage,
      has_sufficient_data: result.has_sufficient_data
    });

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Event Halo] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
