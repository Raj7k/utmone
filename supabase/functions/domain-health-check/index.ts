import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DnsResponse {
  Status: number;
  Answer?: Array<{
    name: string;
    type: number;
    data: string;
  }>;
}

interface HealthCheckResult {
  check_type: string;
  status: 'pass' | 'fail' | 'warning';
  response_time_ms?: number;
  details: Record<string, any>;
}

async function logHealthCheck(supabase: any, domainId: string, result: HealthCheckResult) {
  await supabase.from('domain_health_logs').insert({
    domain_id: domainId,
    check_type: result.check_type,
    status: result.status,
    response_time_ms: result.response_time_ms,
    details: result.details,
  });
}

async function checkDNSTxt(domain: string, verificationCode: string): Promise<HealthCheckResult> {
  const startTime = Date.now();
  try {
    const txtRecordName = `_utm-verification.${domain}`;
    const dnsResponse = await fetch(
      `https://dns.google/resolve?name=${txtRecordName}&type=TXT`,
      { headers: { 'Accept': 'application/dns-json' } }
    );

    const responseTime = Date.now() - startTime;

    if (!dnsResponse.ok) {
      return {
        check_type: 'dns_txt',
        status: 'fail',
        response_time_ms: responseTime,
        details: { error: 'DNS lookup failed' },
      };
    }

    const dnsData: DnsResponse = await dnsResponse.json();

    if (dnsData.Status === 0 && dnsData.Answer && dnsData.Answer.length > 0) {
      const txtRecords = dnsData.Answer.filter(record => record.type === 16);
      
      for (const record of txtRecords) {
        const recordValue = record.data.replace(/"/g, '');
        if (recordValue === verificationCode) {
          return {
            check_type: 'dns_txt',
            status: 'pass',
            response_time_ms: responseTime,
            details: { verified: true, record: recordValue },
          };
        }
      }
    }

    return {
      check_type: 'dns_txt',
      status: 'fail',
      response_time_ms: responseTime,
      details: { verified: false, message: 'TXT record not found or incorrect' },
    };
  } catch (error) {
    return {
      check_type: 'dns_txt',
      status: 'fail',
      response_time_ms: Date.now() - startTime,
      details: { error: error instanceof Error ? error.message : 'Unknown error' },
    };
  }
}

async function checkDNSRouting(domain: string): Promise<HealthCheckResult> {
  const startTime = Date.now();
  try {
    const dnsResponse = await fetch(
      `https://dns.google/resolve?name=${domain}&type=A`,
      { headers: { 'Accept': 'application/dns-json' } }
    );

    const responseTime = Date.now() - startTime;
    const dnsData: DnsResponse = await dnsResponse.json();

    if (dnsData.Status === 0 && dnsData.Answer && dnsData.Answer.length > 0) {
      return {
        check_type: 'dns_routing',
        status: 'pass',
        response_time_ms: responseTime,
        details: { records: dnsData.Answer.map(a => a.data) },
      };
    }

    return {
      check_type: 'dns_routing',
      status: 'fail',
      response_time_ms: responseTime,
      details: { message: 'No A/CNAME records found' },
    };
  } catch (error) {
    return {
      check_type: 'dns_routing',
      status: 'fail',
      response_time_ms: Date.now() - startTime,
      details: { error: error instanceof Error ? error.message : 'Unknown error' },
    };
  }
}

async function checkHTTP(domain: string): Promise<HealthCheckResult> {
  const startTime = Date.now();
  try {
    const response = await fetch(`https://${domain}`, {
      method: 'HEAD',
      redirect: 'manual',
    });

    const responseTime = Date.now() - startTime;

    if (response.ok || response.status === 301 || response.status === 302) {
      return {
        check_type: 'http',
        status: 'pass',
        response_time_ms: responseTime,
        details: { status_code: response.status },
      };
    }

    return {
      check_type: 'http',
      status: 'fail',
      response_time_ms: responseTime,
      details: { status_code: response.status },
    };
  } catch (error) {
    return {
      check_type: 'http',
      status: 'fail',
      response_time_ms: Date.now() - startTime,
      details: { error: error instanceof Error ? error.message : 'Unknown error' },
    };
  }
}

async function checkSSL(domain: string): Promise<HealthCheckResult> {
  const startTime = Date.now();
  try {
    const response = await fetch(`https://${domain}`, {
      method: 'HEAD',
    });

    const responseTime = Date.now() - startTime;

    return {
      check_type: 'ssl',
      status: 'pass',
      response_time_ms: responseTime,
      details: { secure: true },
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return {
      check_type: 'ssl',
      status: 'fail',
      response_time_ms: Date.now() - startTime,
      details: { error: errorMsg, secure: false },
    };
  }
}

async function checkDomainHealth(domain: any, supabase: any) {
  const { id, domain: domainName, verification_code, is_verified } = domain;
  
  console.log(`Running comprehensive health check for: ${domainName}`);

  const results: HealthCheckResult[] = [];

  // DNS TXT verification check
  const txtResult = await checkDNSTxt(domainName, verification_code);
  results.push(txtResult);
  await logHealthCheck(supabase, id, txtResult);

  // DNS routing check
  const routingResult = await checkDNSRouting(domainName);
  results.push(routingResult);
  await logHealthCheck(supabase, id, routingResult);

  // HTTP reachability check
  const httpResult = await checkHTTP(domainName);
  results.push(httpResult);
  await logHealthCheck(supabase, id, httpResult);

  // SSL certificate check
  const sslResult = await checkSSL(domainName);
  results.push(sslResult);
  await logHealthCheck(supabase, id, sslResult);

  // Determine overall health status
  const hasFailed = results.some(r => r.status === 'fail');
  const hasWarning = results.some(r => r.status === 'warning');
  
  let healthStatus = 'healthy';
  if (hasFailed) {
    healthStatus = txtResult.status === 'fail' ? 'verification_pending' : 'dns_error';
  } else if (hasWarning) {
    healthStatus = 'warning';
  }

  // Update domain health status
  const updateData: any = {
    last_health_check: new Date().toISOString(),
    health_status: healthStatus,
  };

  // Update verification status if TXT check passed
  if (txtResult.status === 'pass' && !is_verified) {
    updateData.is_verified = true;
    updateData.dns_verified_at = new Date().toISOString();
    console.log(`Domain ${domainName} now verified!`);
  } else if (txtResult.status === 'fail' && is_verified) {
    updateData.is_verified = false;
    console.warn(`Domain ${domainName} DNS changed - no longer verified!`);
  }

  await supabase
    .from('domains')
    .update(updateData)
    .eq('id', id);

  console.log(`Health check complete for ${domainName}: ${healthStatus}`);
  return { domain: domainName, status: healthStatus, results };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if specific domain_id is provided (manual trigger)
    const url = new URL(req.url);
    const domainId = url.searchParams.get('domain_id');

    let domains;
    if (domainId) {
      console.log(`Running health check for specific domain: ${domainId}`);
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .eq('id', domainId)
        .single();
      
      if (error) throw error;
      domains = [data];
    } else {
      console.log('Starting domain health check cron...');
      
      // Fetch domains that need health checks
      const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .or(`and(is_verified.eq.true,last_health_check.lt.${sixHoursAgo}),and(is_verified.eq.false,last_health_check.lt.${oneHourAgo}),last_health_check.is.null`);

      if (error) throw error;
      domains = data;
    }

    console.log(`Found ${domains?.length || 0} domains to check`);

    const checkResults = [];
    if (domains && domains.length > 0) {
      for (const domain of domains) {
        const result = await checkDomainHealth(domain, supabase);
        checkResults.push(result);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        checked: domains?.length || 0,
        results: checkResults,
        timestamp: new Date().toISOString()
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in domain health check:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
