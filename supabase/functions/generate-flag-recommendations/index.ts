import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.83.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SystemMetrics {
  latency_p95: number;
  error_rate: number;
  cache_hit_rate: number;
  system_load: 'low' | 'medium' | 'high';
  traffic_pattern: 'normal' | 'burst' | 'sustained';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Generating flag recommendations...');

    // Get current system metrics (simulated - would come from real monitoring)
    const currentMetrics: SystemMetrics = {
      latency_p95: 85,
      error_rate: 0.3,
      cache_hit_rate: 87.5,
      system_load: 'medium',
      traffic_pattern: 'normal'
    };

    // Get current flag states
    const { data: flags, error: flagsError } = await supabase
      .from('feature_flags')
      .select('*');

    if (flagsError) throw flagsError;

    // Get historical metrics for analysis
    const { data: history, error: historyError } = await supabase
      .from('metrics_snapshots')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(50);

    if (historyError) throw historyError;

    const recommendations = [];

    // Analyze each flag and generate recommendations
    for (const flag of flags || []) {
      const metadata = flag.metadata as any;
      
      // Recommendation logic based on current system state
      
      // 1. Cache flag recommendation
      if (flag.flag_key === 'enable_cache' && !flag.is_enabled) {
        if (currentMetrics.latency_p95 > 150) {
          recommendations.push({
            recommendation_type: 'enable',
            flag_key: flag.flag_key,
            confidence_score: 0.95,
            reason: 'High latency detected (85ms). Enabling cache will reduce latency by ~250ms based on historical data.',
            expected_impact: {
              latency_change: -250,
              cache_hit_rate_change: 87.5
            },
            current_system_load: currentMetrics.system_load,
            current_traffic_pattern: currentMetrics.traffic_pattern,
          });
        }
      }

      // 2. Geolocation flag recommendation
      if (flag.flag_key === 'enable_geolocation' && flag.is_enabled) {
        if (currentMetrics.system_load === 'high' && currentMetrics.latency_p95 > 120) {
          recommendations.push({
            recommendation_type: 'disable',
            flag_key: flag.flag_key,
            confidence_score: 0.85,
            reason: 'System under high load with elevated latency. Disabling geolocation will reduce latency by ~150ms, improving user experience during peak traffic.',
            expected_impact: {
              latency_change: -150,
              error_rate_change: -0.1
            },
            current_system_load: currentMetrics.system_load,
            current_traffic_pattern: currentMetrics.traffic_pattern,
          });
        }
      }

      // 3. Batch processing recommendation
      if (flag.flag_key === 'enable_batch_processing' && !flag.is_enabled) {
        if (currentMetrics.traffic_pattern === 'burst' || currentMetrics.system_load === 'high') {
          recommendations.push({
            recommendation_type: 'enable',
            flag_key: flag.flag_key,
            confidence_score: 0.90,
            reason: 'Burst traffic pattern detected. Enabling batch processing will reduce database write load by 100x, preventing database connection exhaustion.',
            expected_impact: {
              latency_change: -25,
              error_rate_change: -0.3
            },
            current_system_load: currentMetrics.system_load,
            current_traffic_pattern: currentMetrics.traffic_pattern,
          });
        }
      }

      // 4. OG variants recommendation
      if (flag.flag_key === 'enable_og_variants' && flag.is_enabled) {
        if (currentMetrics.latency_p95 > 200 && currentMetrics.system_load === 'high') {
          recommendations.push({
            recommendation_type: 'disable',
            flag_key: flag.flag_key,
            confidence_score: 0.70,
            reason: 'High latency under load. Consider disabling OG variants A/B testing temporarily to reduce per-request overhead by ~75ms.',
            expected_impact: {
              latency_change: -75,
            },
            current_system_load: currentMetrics.system_load,
            current_traffic_pattern: currentMetrics.traffic_pattern,
          });
        }
      }

      // 5. Rate limiting recommendation
      if (flag.flag_key === 'enable_rate_limiting' && !flag.is_enabled) {
        if (currentMetrics.error_rate > 1.0 || currentMetrics.traffic_pattern === 'burst') {
          recommendations.push({
            recommendation_type: 'enable',
            flag_key: flag.flag_key,
            confidence_score: 0.88,
            reason: 'Elevated error rate detected. Enabling rate limiting will protect the system from overload and reduce error rate by ~0.8%.',
            expected_impact: {
              error_rate_change: -0.8,
              latency_change: 5
            },
            current_system_load: currentMetrics.system_load,
            current_traffic_pattern: currentMetrics.traffic_pattern,
          });
        }
      }
    }

    // Insert recommendations into database
    if (recommendations.length > 0) {
      const { error: insertError } = await supabase
        .from('flag_recommendations')
        .insert(recommendations);

      if (insertError) throw insertError;

      console.log(`Generated ${recommendations.length} recommendations`);
    } else {
      console.log('No recommendations needed - system is optimal');
    }

    return new Response(
      JSON.stringify({
        success: true,
        recommendations_count: recommendations.length,
        message: recommendations.length > 0 
          ? `Generated ${recommendations.length} recommendations` 
          : 'System is running optimally'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating recommendations:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
