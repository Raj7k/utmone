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

async function checkDomainHealth(domain: any, supabase: any) {
  const { id, domain: domainName, verification_code, is_verified } = domain;
  
  console.log(`Checking health for domain: ${domainName}`);

  try {
    const txtRecordName = `_utm-verification.${domainName}`;

    // Check TXT record via Google DNS-over-HTTPS
    const dnsResponse = await fetch(
      `https://dns.google/resolve?name=${txtRecordName}&type=TXT`,
      { headers: { 'Accept': 'application/dns-json' } }
    );

    if (!dnsResponse.ok) {
      console.error(`DNS lookup failed for ${domainName}`);
      await supabase
        .from('domains')
        .update({
          health_status: 'dns_error',
          last_health_check: new Date().toISOString(),
        })
        .eq('id', id);
      return;
    }

    const dnsData: DnsResponse = await dnsResponse.json();

    let verified = false;
    if (dnsData.Status === 0 && dnsData.Answer && dnsData.Answer.length > 0) {
      const txtRecords = dnsData.Answer.filter(record => record.type === 16);
      
      for (const record of txtRecords) {
        const recordValue = record.data.replace(/"/g, '');
        if (recordValue === verification_code) {
          verified = true;
          break;
        }
      }
    }

    // Update health status
    const updateData: any = {
      last_health_check: new Date().toISOString(),
    };

    if (verified) {
      updateData.health_status = 'healthy';
      if (!is_verified) {
        updateData.is_verified = true;
        updateData.dns_verified_at = new Date().toISOString();
        console.log(`Domain ${domainName} now verified!`);
      }
    } else {
      updateData.health_status = is_verified ? 'dns_changed' : 'verification_pending';
      if (is_verified && !verified) {
        // Domain was verified but DNS changed
        updateData.is_verified = false;
        console.warn(`Domain ${domainName} DNS changed - no longer verified!`);
      }
    }

    await supabase
      .from('domains')
      .update(updateData)
      .eq('id', id);

    console.log(`Health check complete for ${domainName}: ${updateData.health_status}`);

  } catch (error) {
    console.error(`Error checking health for ${domainName}:`, error);
    await supabase
      .from('domains')
      .update({
        health_status: 'check_failed',
        last_health_check: new Date().toISOString(),
      })
      .eq('id', id);
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting domain health check cron...');

    // Fetch all domains that need health checks
    // Check verified domains every 6 hours, unverified every hour
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { data: domains, error } = await supabase
      .from('domains')
      .select('*')
      .or(`and(is_verified.eq.true,last_health_check.lt.${sixHoursAgo}),and(is_verified.eq.false,last_health_check.lt.${oneHourAgo}),last_health_check.is.null`);

    if (error) {
      console.error('Error fetching domains:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch domains' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${domains?.length || 0} domains to check`);

    if (domains && domains.length > 0) {
      // Check all domains in parallel
      await Promise.all(
        domains.map(domain => checkDomainHealth(domain, supabase))
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        checked: domains?.length || 0,
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
