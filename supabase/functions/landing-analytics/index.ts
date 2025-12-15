import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalyticsEvent {
  session_id: string;
  event_type: 'page_view' | 'cta_click' | 'scroll_depth' | 'time_on_page';
  event_data?: Record<string, any>;
  hero_variant: number;
  user_agent?: string;
  ip_address?: string;
  referrer?: string;
}

// Retry helper for transient network errors
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 2,
  delay: number = 500
): Promise<T> {
  let lastError: Error | null = null;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      const errorMessage = String(error);
      // Only retry on network/DNS errors, not on validation errors
      if (errorMessage.includes('Could not find host') || 
          errorMessage.includes('DNS') ||
          errorMessage.includes('ECONNREFUSED') ||
          errorMessage.includes('fetch failed')) {
        if (i < maxRetries) {
          console.log(`Retry ${i + 1}/${maxRetries} after transient error`);
          await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
          continue;
        }
      }
      throw error;
    }
  }
  throw lastError;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    const { session_id, event_type, event_data, hero_variant, user_agent, ip_address, referrer }: AnalyticsEvent = await req.json();

    // Validate required fields
    if (!session_id || !event_type || hero_variant === undefined) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Upsert session with retry for transient errors
    const sessionResult = await withRetry(async () => {
      return await supabaseClient
        .from('landing_page_sessions')
        .upsert({
          session_id,
          hero_variant,
          user_agent: user_agent || req.headers.get('user-agent'),
          ip_address: ip_address || req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
          referrer: referrer || req.headers.get('referer'),
        }, {
          onConflict: 'session_id',
          ignoreDuplicates: true
        });
    });

    if (sessionResult.error) {
      console.error('Error upserting session:', sessionResult.error);
      return new Response(
        JSON.stringify({ error: 'Failed to create session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert event with retry
    const eventResult = await withRetry(async () => {
      return await supabaseClient
        .from('landing_page_events')
        .insert({
          session_id,
          event_type,
          event_data,
          hero_variant,
        });
    });

    if (eventResult.error) {
      console.error('Error inserting event:', eventResult.error);
      return new Response(
        JSON.stringify({ error: 'Failed to log event' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in landing-analytics function:', error);
    // Return 503 for transient errors to signal client can retry
    const errorMessage = String(error);
    const isTransient = errorMessage.includes('Could not find host') || 
                        errorMessage.includes('DNS') ||
                        errorMessage.includes('fetch failed');
    return new Response(
      JSON.stringify({ error: isTransient ? 'Service temporarily unavailable' : 'Internal server error' }),
      { status: isTransient ? 503 : 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
