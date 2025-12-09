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

interface TestResult {
  step: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  message: string;
  details?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { domain } = await req.json();

    if (!domain) {
      return new Response(
        JSON.stringify({ error: 'Domain is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Testing domain:', domain);

    const results: TestResult[] = [];
    const isSubdomain = domain.split('.').length > 2;

    // Step 1: DNS Resolution Test
    console.log('Step 1: Testing DNS resolution...');
    try {
      const dnsResponse = await fetch(
        `https://dns.google/resolve?name=${domain}&type=A`,
        { headers: { 'Accept': 'application/dns-json' } }
      );
      const dnsData: DnsResponse = await dnsResponse.json();

      if (dnsData.Status === 0 && dnsData.Answer && dnsData.Answer.length > 0) {
        results.push({
          step: 'DNS Resolution',
          status: 'pass',
          message: 'Domain resolves successfully',
          details: `A records found: ${dnsData.Answer.map(a => a.data).join(', ')}`
        });
      } else if (dnsData.Status === 3) {
        results.push({
          step: 'DNS Resolution',
          status: 'fail',
          message: 'Domain does not resolve (NXDOMAIN)',
          details: 'No DNS records found. Check your DNS configuration.'
        });
      } else {
        results.push({
          step: 'DNS Resolution',
          status: 'warning',
          message: 'No A records found',
          details: 'This might be okay if using CNAME for a subdomain.'
        });
      }
    } catch (error) {
      results.push({
        step: 'DNS Resolution',
        status: 'fail',
        message: 'Failed to check DNS',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Step 2: CNAME Record Test (for subdomains)
    if (isSubdomain) {
      console.log('Step 2: Testing CNAME record...');
      try {
        const cnameResponse = await fetch(
          `https://dns.google/resolve?name=${domain}&type=CNAME`,
          { headers: { 'Accept': 'application/dns-json' } }
        );
        const cnameData: DnsResponse = await cnameResponse.json();

        if (cnameData.Status === 0 && cnameData.Answer && cnameData.Answer.length > 0) {
          const cnameTarget = cnameData.Answer[0].data.replace(/\.$/, '');
          const isPointingToUtm = ['go.utm.one', 'utm.click', 'utm.one'].some(t => 
            cnameTarget.toLowerCase().includes(t.toLowerCase())
          );

          if (isPointingToUtm) {
            results.push({
              step: 'CNAME Configuration',
              status: 'pass',
              message: 'CNAME correctly points to utm.one',
              details: `CNAME → ${cnameTarget}`
            });
          } else {
            results.push({
              step: 'CNAME Configuration',
              status: 'warning',
              message: 'CNAME found but not pointing to utm.one',
              details: `Current target: ${cnameTarget}. Should point to go.utm.one`
            });
          }
        } else {
          results.push({
            step: 'CNAME Configuration',
            status: 'fail',
            message: 'No CNAME record found',
            details: 'Add a CNAME record pointing to go.utm.one'
          });
        }
      } catch (error) {
        results.push({
          step: 'CNAME Configuration',
          status: 'fail',
          message: 'Failed to check CNAME',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Step 3: A Record Test (for root domains or as fallback)
    if (!isSubdomain) {
      console.log('Step 3: Testing A record for root domain...');
      try {
        const aResponse = await fetch(
          `https://dns.google/resolve?name=${domain}&type=A`,
          { headers: { 'Accept': 'application/dns-json' } }
        );
        const aData: DnsResponse = await aResponse.json();

        if (aData.Status === 0 && aData.Answer && aData.Answer.length > 0) {
          const aRecord = aData.Answer.find(a => a.type === 1);
          if (aRecord) {
            // Check if it's pointing to a known CDN or our IP
            results.push({
              step: 'A Record',
              status: 'pass',
              message: 'A record configured',
              details: `Points to: ${aRecord.data}`
            });
          }
        } else {
          results.push({
            step: 'A Record',
            status: 'warning',
            message: 'No A record found for root domain',
            details: 'Consider using a subdomain (e.g., go.yourdomain.com) instead'
          });
        }
      } catch (error) {
        results.push({
          step: 'A Record',
          status: 'fail',
          message: 'Failed to check A record',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Step 4: HTTP Connectivity Test
    console.log('Step 4: Testing HTTP connectivity...');
    try {
      const httpResponse = await fetch(`https://${domain}/`, {
        method: 'HEAD',
        redirect: 'manual',
      });

      if (httpResponse.status >= 200 && httpResponse.status < 400) {
        results.push({
          step: 'HTTPS Connectivity',
          status: 'pass',
          message: 'Domain is accessible via HTTPS',
          details: `HTTP Status: ${httpResponse.status}`
        });
      } else if (httpResponse.status >= 300 && httpResponse.status < 400) {
        results.push({
          step: 'HTTPS Connectivity',
          status: 'pass',
          message: 'Domain responds with redirect (expected behavior)',
          details: `Redirects to: ${httpResponse.headers.get('location') || 'unknown'}`
        });
      } else {
        results.push({
          step: 'HTTPS Connectivity',
          status: 'warning',
          message: 'Domain returned unexpected status',
          details: `HTTP Status: ${httpResponse.status}`
        });
      }
    } catch (error) {
      // Try HTTP as fallback
      try {
        const httpResponse = await fetch(`http://${domain}/`, {
          method: 'HEAD',
          redirect: 'manual',
        });
        results.push({
          step: 'HTTPS Connectivity',
          status: 'warning',
          message: 'HTTP works but HTTPS may not be configured',
          details: 'SSL certificate may not be provisioned yet'
        });
      } catch {
        results.push({
          step: 'HTTPS Connectivity',
          status: 'pending',
          message: 'Domain not yet accessible',
          details: 'DNS may still be propagating. This can take up to 72 hours.'
        });
      }
    }

    // Step 5: TXT Verification Record Check
    console.log('Step 5: Checking TXT verification record...');
    try {
      const txtResponse = await fetch(
        `https://dns.google/resolve?name=_utm-verification.${domain}&type=TXT`,
        { headers: { 'Accept': 'application/dns-json' } }
      );
      const txtData: DnsResponse = await txtResponse.json();

      if (txtData.Status === 0 && txtData.Answer && txtData.Answer.length > 0) {
        const txtRecords = txtData.Answer.filter(a => a.type === 16);
        if (txtRecords.length > 0) {
          results.push({
            step: 'TXT Verification',
            status: 'pass',
            message: 'Verification TXT record found',
            details: `Value: ${txtRecords[0].data.replace(/"/g, '')}`
          });
        }
      } else {
        results.push({
          step: 'TXT Verification',
          status: 'warning',
          message: 'No verification TXT record found',
          details: 'Add _utm-verification TXT record to verify domain ownership'
        });
      }
    } catch (error) {
      results.push({
        step: 'TXT Verification',
        status: 'warning',
        message: 'Could not check TXT record',
        details: 'This is optional but recommended for domain verification'
      });
    }

    // Calculate overall status
    const hasFailure = results.some(r => r.status === 'fail');
    const allPassed = results.every(r => r.status === 'pass');
    const overallStatus = hasFailure ? 'fail' : allPassed ? 'pass' : 'warning';

    // Generate test link
    const testSlug = `test-${Date.now().toString(36)}`;
    const testLink = `https://${domain}/${testSlug}`;

    return new Response(
      JSON.stringify({
        domain,
        isSubdomain,
        overallStatus,
        results,
        testLink,
        recommendation: isSubdomain 
          ? 'Subdomains are the easiest to configure. Just add a CNAME record.'
          : 'Root domains require A records or Cloudflare. Consider using a subdomain like go.' + domain
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error testing domain:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
