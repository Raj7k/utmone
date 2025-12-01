import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChannelInfluence {
  channel: string;
  channel_name: string;
  total_journeys: number;
  converted_journeys: number;
  conversion_rate: number;
  baseline_conversion_rate: number;
  lift: number;
  influence_score: number;
  total_revenue: number;
  avg_revenue: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = req.headers.get('authorization')?.replace('Bearer ', '') || 
                        Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { workspace_id, days = 30 } = await req.json();

    if (!workspace_id) {
      return new Response(
        JSON.stringify({ error: 'workspace_id required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[Calculate Influence] Processing workspace:', workspace_id);

    // Fetch all journeys for the workspace
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);

    const { data: journeys, error: journeysError } = await supabase
      .from('attribution_journeys')
      .select('*')
      .eq('workspace_id', workspace_id)
      .gte('created_at', daysAgo.toISOString());

    if (journeysError) throw journeysError;
    if (!journeys || journeys.length === 0) {
      return new Response(
        JSON.stringify({ channels: [], baseline_conversion_rate: 0 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate baseline conversion rate (global)
    const totalJourneys = journeys.length;
    const convertedJourneys = journeys.filter((j: any) => j.converted).length;
    const baselineConversionRate = totalJourneys > 0 ? convertedJourneys / totalJourneys : 0;

    console.log('[Calculate Influence] Baseline conversion rate:', baselineConversionRate);

    // Extract all unique channels from touchpoints
    const channelStats = new Map<string, {
      journeys: Set<string>,
      conversions: number,
      revenue: number,
    }>();

    journeys.forEach((journey: any) => {
      const journeyId = journey.id;
      const touchpoints = journey.touchpoints || [];
      const converted = journey.converted;
      const revenue = parseFloat(journey.revenue) || 0;

      // Track unique channels in this journey
      const channelsInJourney = new Set<string>();

      touchpoints.forEach((tp: any) => {
        // Use utm_source as the primary channel identifier
        const channel = tp.utm_source || 'direct';
        channelsInJourney.add(channel);
      });

      // Update stats for each channel in this journey
      channelsInJourney.forEach((channel) => {
        if (!channelStats.has(channel)) {
          channelStats.set(channel, {
            journeys: new Set(),
            conversions: 0,
            revenue: 0,
          });
        }

        const stats = channelStats.get(channel)!;
        stats.journeys.add(journeyId);
        if (converted) {
          stats.conversions += 1;
          stats.revenue += revenue;
        }
      });
    });

    // Calculate influence scores for each channel
    const influences: ChannelInfluence[] = [];

    channelStats.forEach((stats, channel) => {
      const totalJourneysWithChannel = stats.journeys.size;
      const convertedJourneysWithChannel = stats.conversions;
      const conversionRate = totalJourneysWithChannel > 0 
        ? convertedJourneysWithChannel / totalJourneysWithChannel 
        : 0;

      // Calculate lift: P(Conv | Channel) - P(Conv)
      const lift = conversionRate - baselineConversionRate;

      // Influence score: weighted by journey count
      const influenceScore = lift * totalJourneysWithChannel;

      const avgRevenue = convertedJourneysWithChannel > 0 
        ? stats.revenue / convertedJourneysWithChannel 
        : 0;

      influences.push({
        channel,
        channel_name: channel.charAt(0).toUpperCase() + channel.slice(1),
        total_journeys: totalJourneysWithChannel,
        converted_journeys: convertedJourneysWithChannel,
        conversion_rate: conversionRate,
        baseline_conversion_rate: baselineConversionRate,
        lift,
        influence_score: influenceScore,
        total_revenue: stats.revenue,
        avg_revenue: avgRevenue,
      });
    });

    // Sort by influence score (descending)
    influences.sort((a, b) => b.influence_score - a.influence_score);

    console.log('[Calculate Influence] Calculated', influences.length, 'channel influences');

    return new Response(
      JSON.stringify({
        channels: influences,
        baseline_conversion_rate: baselineConversionRate,
        total_journeys: totalJourneys,
        converted_journeys: convertedJourneys,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[Calculate Influence] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});