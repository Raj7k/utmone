import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/**
 * Updates experiment click and conversion statistics
 * Called from redirect edge function when traffic is split between variants
 */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { experiment_id, variant, is_conversion } = await req.json()

    if (!experiment_id || !variant) {
      return new Response(
        JSON.stringify({ error: 'experiment_id and variant required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log(`📊 Updating experiment ${experiment_id}, variant ${variant}`)

    // Get current experiment data
    const { data: experiment, error: fetchError } = await supabase
      .from('experiments')
      .select('*')
      .eq('id', experiment_id)
      .single()

    if (fetchError || !experiment) {
      throw new Error('Experiment not found')
    }

    // Update clicks and conversions
    const updates: any = {}

    if (variant === 'A') {
      updates.variant_a_clicks = experiment.variant_a_clicks + 1
      if (is_conversion) {
        updates.variant_a_conversions = experiment.variant_a_conversions + 1
      }
    } else if (variant === 'B') {
      updates.variant_b_clicks = experiment.variant_b_clicks + 1
      if (is_conversion) {
        updates.variant_b_conversions = experiment.variant_b_conversions + 1
      }
    }

    // Calculate Bayesian probability using Monte Carlo
    const clicksA = variant === 'A' ? updates.variant_a_clicks : experiment.variant_a_clicks
    const clicksB = variant === 'B' ? updates.variant_b_clicks : experiment.variant_b_clicks
    const conversionsA = variant === 'A' && is_conversion 
      ? updates.variant_a_conversions 
      : experiment.variant_a_conversions
    const conversionsB = variant === 'B' && is_conversion 
      ? updates.variant_b_conversions 
      : experiment.variant_b_conversions

    // Simple Monte Carlo simulation (1000 samples)
    const probability = calculateProbabilityBWins(clicksA, conversionsA, clicksB, conversionsB)
    updates.probability_b_wins = probability

    console.log('Bayesian calculation:', {
      clicksA,
      conversionsA,
      clicksB,
      conversionsB,
      probabilityBWins: probability
    })

    // Update experiment
    const { error: updateError } = await supabase
      .from('experiments')
      .update(updates)
      .eq('id', experiment_id)

    if (updateError) {
      throw updateError
    }

    return new Response(
      JSON.stringify({
        success: true,
        experiment_id,
        variant,
        is_conversion,
        probability_b_wins: probability
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error updating experiment stats:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

/**
 * Calculate probability that Variant B beats Variant A
 * Using Beta-Binomial Bayesian inference with Monte Carlo
 */
function calculateProbabilityBWins(
  clicksA: number,
  conversionsA: number,
  clicksB: number,
  conversionsB: number,
  simulations: number = 1000
): number {
  // Beta distribution parameters (with prior Beta(1,1))
  const alphaA = 1 + conversionsA
  const betaA = 1 + (clicksA - conversionsA)
  const alphaB = 1 + conversionsB
  const betaB = 1 + (clicksB - conversionsB)

  let bWinsCount = 0

  // Monte Carlo simulation
  for (let i = 0; i < simulations; i++) {
    const sampleA = betaSample(alphaA, betaA)
    const sampleB = betaSample(alphaB, betaB)

    if (sampleB > sampleA) {
      bWinsCount++
    }
  }

  return bWinsCount / simulations
}

/**
 * Sample from Beta distribution
 */
function betaSample(alpha: number, beta: number): number {
  const x = gammaRandom(alpha)
  const y = gammaRandom(beta)
  return x / (x + y)
}

/**
 * Sample from Gamma distribution
 */
function gammaRandom(alpha: number): number {
  if (alpha < 1) {
    return gammaRandom(alpha + 1) * Math.pow(Math.random(), 1 / alpha)
  }

  const d = alpha - 1 / 3
  const c = 1 / Math.sqrt(9 * d)

  while (true) {
    let x, v
    do {
      x = randomNormal()
      v = 1 + c * x
    } while (v <= 0)

    v = v * v * v
    const u = Math.random()
    const x2 = x * x

    if (u < 1 - 0.0331 * x2 * x2) {
      return d * v
    }

    if (Math.log(u) < 0.5 * x2 + d * (1 - v + Math.log(v))) {
      return d * v
    }
  }
}

/**
 * Box-Muller transform for normal distribution
 */
function randomNormal(): number {
  const u1 = Math.random()
  const u2 = Math.random()
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
}