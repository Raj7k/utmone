import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RateLimitTier {
  load_threshold_low: number
  load_threshold_high: number
  free_tier_limit: number
  pro_tier_limit: number
  business_tier_limit: number
  enterprise_tier_limit: number
  burst_multiplier: number
}

interface SystemLoad {
  cpu_load_percent: number
  memory_usage_percent: number
  active_connections: number
  requests_per_second: number
}

/**
 * Adaptive API Throttling using Penalty Methods
 * Based on Algorithms for Optimization, Chapter 10 (Constrained Optimization)
 * 
 * Dynamically adjusts rate limits based on system load:
 * - Low load: Allow burst traffic
 * - High load: Apply weighted throttling (prioritize paying customers)
 */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { user_id, api_key, endpoint } = await req.json()

    if (!user_id && !api_key) {
      return new Response(
        JSON.stringify({ error: 'user_id or api_key required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('🛡️ Adaptive throttle check for:', user_id || api_key)

    // Get current system load (last metric within 1 minute)
    const { data: loadData } = await supabase
      .from('system_load_metrics')
      .select('*')
      .gte('recorded_at', new Date(Date.now() - 60000).toISOString())
      .order('recorded_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    // Mock system load if no data (for development)
    const systemLoad: SystemLoad = loadData ? {
      cpu_load_percent: loadData.cpu_load_percent,
      memory_usage_percent: loadData.memory_usage_percent,
      active_connections: loadData.active_connections,
      requests_per_second: loadData.requests_per_second
    } : {
      cpu_load_percent: 35, // Mock: Normal load
      memory_usage_percent: 45,
      active_connections: 150,
      requests_per_second: 80
    }

    console.log('System load:', systemLoad)

    // Get rate limit configuration
    const { data: tierConfig } = await supabase
      .from('rate_limit_tiers')
      .select('*')
      .limit(1)
      .single()

    if (!tierConfig) {
      throw new Error('Rate limit configuration not found')
    }

    const config = tierConfig as RateLimitTier

    // Determine user's plan tier
    let userTier = 'free'
    if (user_id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_plan')
        .eq('id', user_id)
        .single()

      userTier = profile?.subscription_plan || 'free'
    }

    console.log('User tier:', userTier)

    // Calculate adaptive limit based on system load
    const avgLoad = (systemLoad.cpu_load_percent + systemLoad.memory_usage_percent) / 2

    let baseLimit: number
    switch (userTier) {
      case 'enterprise':
        baseLimit = config.enterprise_tier_limit
        break
      case 'business':
        baseLimit = config.business_tier_limit
        break
      case 'pro':
        baseLimit = config.pro_tier_limit
        break
      default:
        baseLimit = config.free_tier_limit
    }

    // Adaptive multiplier based on load (Penalty Method)
    let adaptiveLimit: number
    let retryAfter: number

    if (avgLoad < config.load_threshold_low) {
      // Low load: Allow burst traffic
      adaptiveLimit = baseLimit * config.burst_multiplier
      retryAfter = 1
      console.log('✅ Low load: Burst traffic allowed')
    } else if (avgLoad > config.load_threshold_high) {
      // High load: Apply penalty (reduce limits)
      const penaltyFactor = Math.max(0.1, 1 - (avgLoad - config.load_threshold_high) / 100)
      adaptiveLimit = Math.floor(baseLimit * penaltyFactor)
      
      // Exponential backoff for free users under high load
      retryAfter = userTier === 'free' ? 60 : userTier === 'pro' ? 30 : 10
      console.log('⚠️ High load: Penalty applied', { penaltyFactor, adaptiveLimit })
    } else {
      // Normal load: Standard limits
      adaptiveLimit = baseLimit
      retryAfter = 10
      console.log('📊 Normal load: Standard limits')
    }

    // Check current usage in rate_limit_log
    const { data: recentAttempts, error: logError } = await supabase
      .from('rate_limit_log')
      .select('attempt_count')
      .eq('endpoint', endpoint || 'api')
      .gte('window_start', new Date(Date.now() - 60000).toISOString())

    if (logError) {
      console.error('Error checking rate limit:', logError)
    }

    const currentAttempts = recentAttempts?.reduce((sum, r) => sum + r.attempt_count, 0) || 0

    const allowed = currentAttempts < adaptiveLimit

    console.log('Rate limit check:', {
      currentAttempts,
      adaptiveLimit,
      allowed,
      systemLoad: `${avgLoad.toFixed(1)}%`
    })

    // Record system load for monitoring
    if (!loadData || (Date.now() - new Date(loadData.recorded_at).getTime() > 30000)) {
      await supabase.from('system_load_metrics').insert({
        cpu_load_percent: systemLoad.cpu_load_percent,
        memory_usage_percent: systemLoad.memory_usage_percent,
        active_connections: systemLoad.active_connections,
        requests_per_second: systemLoad.requests_per_second
      })
    }

    return new Response(
      JSON.stringify({
        allowed,
        current_usage: currentAttempts,
        limit: adaptiveLimit,
        base_limit: baseLimit,
        tier: userTier,
        system_load: avgLoad,
        retry_after: allowed ? null : retryAfter,
        burst_active: avgLoad < config.load_threshold_low,
        penalty_active: avgLoad > config.load_threshold_high
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          ...(allowed ? {} : { 'Retry-After': retryAfter.toString() })
        },
        status: allowed ? 200 : 429
      }
    )
  } catch (error) {
    console.error('Error in adaptive throttle:', error)
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