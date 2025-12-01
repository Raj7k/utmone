import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HealthCheckResult {
  linkId: string;
  isHealthy: boolean;
  statusCode: number | null;
  responseTimeMs: number | null;
  errorMessage: string | null;
  redirectChain: string[];
  finalUrl: string | null;
}

async function checkUrlHealth(url: string): Promise<Omit<HealthCheckResult, 'linkId'>> {
  const startTime = Date.now();
  const redirectChain: string[] = [];
  let currentUrl = url;
  let attempts = 0;
  const maxRedirects = 5;

  try {
    while (attempts < maxRedirects) {
      redirectChain.push(currentUrl);
      
      const response = await fetch(currentUrl, {
        method: 'HEAD',
        redirect: 'manual',
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      const responseTimeMs = Date.now() - startTime;

      // Success statuses
      if (response.status >= 200 && response.status < 300) {
        return {
          isHealthy: true,
          statusCode: response.status,
          responseTimeMs,
          errorMessage: null,
          redirectChain,
          finalUrl: currentUrl,
        };
      }

      // Redirect statuses
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('location');
        if (!location) {
          return {
            isHealthy: false,
            statusCode: response.status,
            responseTimeMs,
            errorMessage: 'Redirect without location header',
            redirectChain,
            finalUrl: null,
          };
        }
        
        // Handle relative URLs
        currentUrl = location.startsWith('http') 
          ? location 
          : new URL(location, currentUrl).toString();
        attempts++;
        continue;
      }

      // Error statuses
      return {
        isHealthy: false,
        statusCode: response.status,
        responseTimeMs,
        errorMessage: `HTTP ${response.status}`,
        redirectChain,
        finalUrl: null,
      };
    }

    return {
      isHealthy: false,
      statusCode: null,
      responseTimeMs: Date.now() - startTime,
      errorMessage: 'Too many redirects',
      redirectChain,
      finalUrl: null,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      isHealthy: false,
      statusCode: null,
      responseTimeMs: Date.now() - startTime,
      errorMessage,
      redirectChain,
      finalUrl: null,
    };
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('🔍 Starting link health check...');

    // Get top 100 most active links
    const { data: links, error: fetchError } = await supabase
      .from('links')
      .select('id, destination_url, title, workspace_id, health_check_failures, fallback_url')
      .eq('status', 'active')
      .order('cache_score', { ascending: false })
      .limit(100);

    if (fetchError) {
      console.error('Error fetching links:', fetchError);
      throw fetchError;
    }

    if (!links || links.length === 0) {
      console.log('No active links to check');
      return new Response(
        JSON.stringify({ message: 'No active links to check', checked: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Checking health of ${links.length} links...`);

    const results: HealthCheckResult[] = [];
    let healthyCount = 0;
    let unhealthyCount = 0;
    const alertUsers: Set<string> = new Set();

    // Check each link
    for (const link of links) {
      const healthCheck = await checkUrlHealth(link.destination_url);
      const result: HealthCheckResult = {
        linkId: link.id,
        ...healthCheck,
      };
      results.push(result);

      // Log the health check
      await supabase.from('link_health_logs').insert({
        link_id: link.id,
        status_code: result.statusCode,
        response_time_ms: result.responseTimeMs,
        is_healthy: result.isHealthy,
        error_message: result.errorMessage,
        redirect_chain: result.redirectChain,
        final_url: result.finalUrl,
      });

      // Update link health status
      const newFailures = result.isHealthy ? 0 : (link.health_check_failures || 0) + 1;
      const healthStatus = result.isHealthy ? 'healthy' : (newFailures >= 3 ? 'unhealthy' : 'unknown');

      await supabase
        .from('links')
        .update({
          health_status: healthStatus,
          last_health_check: new Date().toISOString(),
          health_check_failures: newFailures,
        })
        .eq('id', link.id);

      if (result.isHealthy) {
        healthyCount++;
      } else {
        unhealthyCount++;
        
        // If link just became unhealthy (3 consecutive failures), alert the workspace
        if (newFailures === 3) {
          alertUsers.add(link.workspace_id);
          console.log(`🚨 Link "${link.title}" is unhealthy after 3 failures`);
          
          // Send alert email (invoke another edge function)
          if (link.fallback_url) {
            console.log(`✅ Fallback URL configured: ${link.fallback_url}`);
          } else {
            console.log(`⚠️ No fallback URL configured for unhealthy link`);
          }
        }
      }
    }

    console.log(`✅ Health check complete: ${healthyCount} healthy, ${unhealthyCount} unhealthy`);

    // Send alert emails to workspace owners
    for (const workspaceId of alertUsers) {
      try {
        await supabase.functions.invoke('send-health-alert', {
          body: { workspaceId },
        });
      } catch (error) {
        console.error('Failed to send health alert:', error);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        checked: links.length,
        healthy: healthyCount,
        unhealthy: unhealthyCount,
        alertsSent: alertUsers.size,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Health check error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
