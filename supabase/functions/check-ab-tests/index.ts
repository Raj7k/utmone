import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.83.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VariantStats {
  variant_id: string;
  variant_name: string;
  clicks: number;
  conversions: number;
}

// Calculate z-score for two proportions
function calculateZScore(p1: number, n1: number, p2: number, n2: number): number {
  const pooledP = (p1 * n1 + p2 * n2) / (n1 + n2);
  const se = Math.sqrt(pooledP * (1 - pooledP) * (1 / n1 + 1 / n2));
  return (p1 - p2) / se;
}

// Calculate p-value from z-score (two-tailed test)
function calculatePValue(zScore: number): number {
  const absZ = Math.abs(zScore);
  // Approximation using error function
  const t = 1 / (1 + 0.2316419 * absZ);
  const d = 0.3989423 * Math.exp(-absZ * absZ / 2);
  const probability = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return 2 * probability; // two-tailed
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Checking for active A/B tests...');

    // Find all links with running A/B tests
    const { data: activeTests, error: testsError } = await supabase
      .from('links')
      .select('id, ab_test_confidence_threshold, ab_test_min_clicks, ab_test_started_at')
      .eq('ab_test_status', 'running');

    if (testsError) {
      console.error('Error fetching active tests:', testsError);
      throw testsError;
    }

    console.log(`Found ${activeTests?.length || 0} active tests`);

    const results = [];

    for (const test of activeTests || []) {
      console.log(`Checking test for link ${test.id}`);

      // Get variant performance data
      const { data: variantData, error: variantError } = await supabase
        .from('link_clicks')
        .select(`
          og_variant_id,
          og_image_variants!inner (
            id,
            variant_name,
            is_active
          )
        `)
        .eq('link_id', test.id)
        .not('og_variant_id', 'is', null)
        .gte('clicked_at', test.ab_test_started_at);

      if (variantError) {
        console.error(`Error fetching variant data for link ${test.id}:`, variantError);
        continue;
      }

      // Aggregate clicks by variant (only active variants)
      const variantStats: Record<string, VariantStats> = {};
      
      for (const click of variantData || []) {
        const variant = (click.og_image_variants as any);
        if (!variant.is_active) continue;
        
        const variantId = click.og_variant_id!;
        if (!variantStats[variantId]) {
          variantStats[variantId] = {
            variant_id: variantId,
            variant_name: variant.variant_name,
            clicks: 0,
            conversions: 0,
          };
        }
        variantStats[variantId].clicks++;
      }

      const variants = Object.values(variantStats);
      
      if (variants.length < 2) {
        console.log(`Test ${test.id}: Not enough variants (${variants.length})`);
        continue;
      }

      const totalClicks = variants.reduce((sum, v) => sum + v.clicks, 0);
      
      if (totalClicks < test.ab_test_min_clicks) {
        console.log(`Test ${test.id}: Not enough clicks (${totalClicks}/${test.ab_test_min_clicks})`);
        continue;
      }

      // Find the best performing variant
      const sortedVariants = [...variants].sort((a, b) => b.clicks - a.clicks);
      const winner = sortedVariants[0];
      const runnerUp = sortedVariants[1];

      // Calculate conversion rates
      const winnerRate = winner.clicks / totalClicks;
      const runnerUpRate = runnerUp.clicks / totalClicks;

      // Calculate statistical significance
      const zScore = calculateZScore(
        winnerRate,
        winner.clicks,
        runnerUpRate,
        runnerUp.clicks
      );
      const pValue = calculatePValue(zScore);
      const confidence = 1 - pValue;

      console.log(`Test ${test.id}: Winner=${winner.variant_name} (${winner.clicks}), RunnerUp=${runnerUp.variant_name} (${runnerUp.clicks}), Confidence=${confidence.toFixed(4)}, Threshold=${test.ab_test_confidence_threshold}`);

      if (confidence >= test.ab_test_confidence_threshold) {
        console.log(`🏆 Test ${test.id}: Winner declared! ${winner.variant_name} with ${(confidence * 100).toFixed(2)}% confidence`);

        // Get the full winner variant data
        const { data: winnerVariant, error: winnerError } = await supabase
          .from('og_image_variants')
          .select('*')
          .eq('id', winner.variant_id)
          .single();

        if (winnerError) {
          console.error(`Error fetching winner variant:`, winnerError);
          continue;
        }

        // Update link with winner data and mark test as completed
        const { error: updateError } = await supabase
          .from('links')
          .update({
            ab_test_status: 'completed',
            ab_test_winner_id: winner.variant_id,
            ab_test_completed_at: new Date().toISOString(),
            og_title: winnerVariant.og_title,
            og_description: winnerVariant.og_description,
            og_image: winnerVariant.og_image,
          })
          .eq('id', test.id);

        if (updateError) {
          console.error(`Error updating link with winner:`, updateError);
          continue;
        }

        results.push({
          link_id: test.id,
          winner_variant_id: winner.variant_id,
          winner_variant_name: winner.variant_name,
          confidence: confidence,
          total_clicks: totalClicks,
          winner_clicks: winner.clicks,
          runner_up_clicks: runnerUp.clicks,
        });
      }
    }

    console.log(`Completed checking ${activeTests?.length || 0} tests, ${results.length} winners declared`);

    return new Response(
      JSON.stringify({
        success: true,
        checked: activeTests?.length || 0,
        winners_declared: results.length,
        results,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in check-ab-tests:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
