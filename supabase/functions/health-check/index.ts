import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/security-headers.ts';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  checks: {
    database: { status: string; latency?: number };
    storage: { status: string; latency?: number };
    auth: { status: string; latency?: number };
  };
  uptime: number;
  version: string;
}

const startTime = Date.now();

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const checks: HealthStatus['checks'] = {
      database: { status: 'unknown' },
      storage: { status: 'unknown' },
      auth: { status: 'unknown' }
    };

    // Database health check
    const dbStart = Date.now();
    try {
      const { error: dbError } = await supabase
        .from('workspaces')
        .select('id')
        .limit(1);
      
      checks.database = {
        status: dbError ? 'unhealthy' : 'healthy',
        latency: Date.now() - dbStart
      };
    } catch (error) {
      checks.database = { status: 'unhealthy', latency: Date.now() - dbStart };
    }

    // Storage health check
    const storageStart = Date.now();
    try {
      const { error: storageError } = await supabase.storage.listBuckets();
      checks.storage = {
        status: storageError ? 'unhealthy' : 'healthy',
        latency: Date.now() - storageStart
      };
    } catch (error) {
      checks.storage = { status: 'unhealthy', latency: Date.now() - storageStart };
    }

    // Auth health check
    const authStart = Date.now();
    try {
      const { error: authError } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1
      });
      checks.auth = {
        status: authError ? 'unhealthy' : 'healthy',
        latency: Date.now() - authStart
      };
    } catch (error) {
      checks.auth = { status: 'unhealthy', latency: Date.now() - authStart };
    }

    // Determine overall status
    const unhealthyCount = Object.values(checks).filter(c => c.status === 'unhealthy').length;
    const overallStatus: HealthStatus['status'] = 
      unhealthyCount === 0 ? 'healthy' :
      unhealthyCount >= 2 ? 'unhealthy' : 'degraded';

    const healthStatus: HealthStatus = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      checks,
      uptime: Date.now() - startTime,
      version: '1.0.0'
    };

    const statusCode = overallStatus === 'healthy' ? 200 : 503;

    return new Response(
      JSON.stringify(healthStatus),
      {
        status: statusCode,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          ...corsHeaders
        }
      }
    );

  } catch (error) {
    console.error('[Health Check Error]', error);
    return new Response(
      JSON.stringify({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed'
      }),
      {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
});
