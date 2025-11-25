import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getSecureCorsHeaders } from "../_shared/security-headers.ts";

const corsHeaders = getSecureCorsHeaders();

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get IP address from request
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
                      req.headers.get('x-real-ip') || 
                      'unknown';

    const endpoint = 'early_access_form';

    // Check rate limit (5 requests per hour)
    const { data, error } = await supabase.rpc('check_rate_limit', {
      p_ip_address: ipAddress,
      p_endpoint: endpoint,
      p_max_requests: 5,
      p_window_minutes: 60
    });

    if (error) {
      console.error('Rate limit check error:', error);
      
      // Log security event
      await supabase.rpc('log_security_event', {
        p_event_type: 'rate_limit_error',
        p_ip_address: ipAddress,
        p_user_agent: req.headers.get('user-agent'),
        p_metadata: { error: error.message, endpoint }
      });
      
      return new Response(
        JSON.stringify({ allowed: true }), // Fail open on error
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    const allowed = data as boolean;

    if (!allowed) {
      // Log rate limit violation
      await supabase.rpc('log_security_event', {
        p_event_type: 'rate_limit_exceeded',
        p_ip_address: ipAddress,
        p_user_agent: req.headers.get('user-agent'),
        p_metadata: { endpoint, limit: 5, window: '60 minutes' }
      });
    }

    return new Response(
      JSON.stringify({ allowed }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Rate limit check error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({ allowed: true, error: errorMessage }), // Fail open
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  }
});