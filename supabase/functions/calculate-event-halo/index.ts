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

    console.log(`[Event Halo] Starting scientific calculation for event: ${event_id}`);

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
    const controlCity = event.control_city || null;

    console.log(`[Event Halo] Event: ${event.name}, Target: ${eventCity}, Control: ${controlCity || 'none'}`);

    // Step 2: Use the calculate_city_baseline_with_control SQL function for scientific analysis
    const { data: haloData, error: haloError } = await supabase.rpc('calculate_city_baseline_with_control', {
      p_workspace_id: workspace_id,
      p_target_city: eventCity,
      p_control_city: controlCity || '',
      p_event_start: startDate.toISOString(),
      p_event_end: endDate.toISOString(),
      p_baseline_days: 30
    });

    if (haloError) {
      console.error('[Event Halo] Error calculating baseline with control:', haloError);
    }

    const haloResult = haloData?.[0] || {
      baseline_daily_average: 0,
      baseline_total_visitors: 0,
      event_visitors: 0,
      halo_visitors: 0,
      halo_visitors_low: 0,
      halo_visitors_high: 0,
      lift_percentage: 0,
      event_duration_days: 1,
      has_sufficient_data: false,
      control_baseline_daily_average: 0,
      control_event_visitors: 0,
      control_lift_percentage: 0,
      divergence_score: 0,
      bots_filtered: 0,
      internal_ips_filtered: 0
    };

    console.log(`[Event Halo] Scientific analysis:`, haloResult);

    // Step 3: Get comparison timeseries (target vs control)
    const timeseriesStart = new Date(startDate);
    timeseriesStart.setDate(timeseriesStart.getDate() - 30);

    const { data: comparisonTimeseries, error: comparisonError } = await supabase.rpc('get_city_comparison_timeseries', {
      p_workspace_id: workspace_id,
      p_target_city: eventCity,
      p_control_city: controlCity || eventCity, // Use same city if no control
      p_start_date: timeseriesStart.toISOString(),
      p_end_date: endDate.toISOString()
    });

    if (comparisonError) {
      console.error('[Event Halo] Error fetching comparison timeseries:', comparisonError);
    }

    console.log(`[Event Halo] Comparison timeseries points: ${comparisonTimeseries?.length || 0}`);

    // Step 4: Get direct scans count
    const { count: directScansCount } = await supabase
      .from('event_badge_scans')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', event_id);

    const directScans = directScansCount || 0;

    // Step 5: Estimate pipeline
    const totalImpact = (haloResult.halo_visitors || 0) + directScans;
    const estimatedConversionRate = 0.15;
    const avgDealSize = 10000;
    const attributedPipeline = Math.round(totalImpact * estimatedConversionRate * avgDealSize);

    // Step 6: Build audit metadata
    const calculationMetadata = {
      baseline_days: 30,
      baseline_period: {
        start: timeseriesStart.toISOString(),
        end: startDate.toISOString()
      },
      event_period: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      },
      bots_filtered: haloResult.bots_filtered || 0,
      internal_ips_filtered: haloResult.internal_ips_filtered || 0,
      control_city: controlCity,
      control_lift_percentage: haloResult.control_lift_percentage || 0,
      divergence_score: haloResult.divergence_score || 0,
      calculated_at: new Date().toISOString(),
      methodology: "geo-temporal-lift-v2"
    };

    // Step 7: Update event with calculated values
    const now = new Date();
    const newStatus = now > endDate ? 'completed' : now >= startDate ? 'active' : 'upcoming';

    const { error: updateError } = await supabase
      .from('field_events')
      .update({
        halo_visitors: haloResult.halo_visitors || 0,
        halo_visitors_low: haloResult.halo_visitors_low || 0,
        halo_visitors_high: haloResult.halo_visitors_high || 0,
        baseline_visitors: Math.round((haloResult.baseline_daily_average || 0) * (haloResult.event_duration_days || 1)),
        lift_percentage: haloResult.lift_percentage || 0,
        direct_scans: directScans,
        attributed_pipeline: attributedPipeline,
        calculation_metadata: calculationMetadata,
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
      control_city: controlCity,
      // Target city metrics
      baseline_daily_average: haloResult.baseline_daily_average,
      baseline_total_visitors: haloResult.baseline_total_visitors,
      event_visitors: haloResult.event_visitors,
      halo_visitors: haloResult.halo_visitors,
      halo_visitors_low: haloResult.halo_visitors_low,
      halo_visitors_high: haloResult.halo_visitors_high,
      lift_percentage: haloResult.lift_percentage,
      event_duration_days: haloResult.event_duration_days,
      has_sufficient_data: haloResult.has_sufficient_data,
      // Control city metrics
      control_baseline_daily_average: haloResult.control_baseline_daily_average,
      control_event_visitors: haloResult.control_event_visitors,
      control_lift_percentage: haloResult.control_lift_percentage,
      divergence_score: haloResult.divergence_score,
      // Additional metrics
      direct_scans: directScans,
      total_impact: totalImpact,
      attributed_pipeline: attributedPipeline,
      // Comparison timeseries for scientific chart
      comparison_timeseries: comparisonTimeseries || [],
      // Audit metadata
      calculation_metadata: calculationMetadata,
      event_start: startDate.toISOString(),
      event_end: endDate.toISOString()
    };

    console.log(`[Event Halo] Scientific calculation complete:`, {
      halo_visitors: `${result.halo_visitors_low}-${result.halo_visitors_high}`,
      divergence_score: result.divergence_score,
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
