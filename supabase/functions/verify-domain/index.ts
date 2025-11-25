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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { domainId } = await req.json();

    if (!domainId) {
      return new Response(
        JSON.stringify({ error: 'Domain ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Verifying domain:', domainId);

    // Fetch domain from database
    const { data: domain, error: domainError } = await supabase
      .from('domains')
      .select('*')
      .eq('id', domainId)
      .single();

    if (domainError || !domain) {
      console.error('Domain not found:', domainError);
      return new Response(
        JSON.stringify({ error: 'Domain not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { domain: domainName, verification_code } = domain;
    const txtRecordName = `_utm-verification.${domainName}`;

    console.log('Checking TXT record:', txtRecordName, 'for code:', verification_code);

    // Use Google DNS-over-HTTPS API to check TXT record
    const dnsResponse = await fetch(
      `https://dns.google/resolve?name=${txtRecordName}&type=TXT`,
      { headers: { 'Accept': 'application/dns-json' } }
    );

    if (!dnsResponse.ok) {
      console.error('DNS lookup failed:', dnsResponse.status);
      return new Response(
        JSON.stringify({ 
          verified: false, 
          error: 'DNS lookup failed. Please try again later.' 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const dnsData: DnsResponse = await dnsResponse.json();

    console.log('DNS response:', JSON.stringify(dnsData, null, 2));

    // Check if TXT record exists and matches verification code
    let verified = false;
    let errorMessage = 'TXT record not found. DNS changes can take up to 72 hours to propagate.';

    if (dnsData.Status === 0 && dnsData.Answer && dnsData.Answer.length > 0) {
      // TXT records are type 16
      const txtRecords = dnsData.Answer.filter(record => record.type === 16);
      
      for (const record of txtRecords) {
        // DNS TXT records come with quotes, so we need to remove them
        const recordValue = record.data.replace(/"/g, '');
        console.log('Checking TXT record value:', recordValue);
        
        if (recordValue === verification_code) {
          verified = true;
          errorMessage = '';
          break;
        }
      }

      if (!verified && txtRecords.length > 0) {
        errorMessage = 'TXT record found but verification code does not match. Please check your DNS settings.';
      }
    }

    // Update domain verification status
    const updateData: any = {
      last_health_check: new Date().toISOString(),
      health_status: verified ? 'healthy' : 'verification_pending',
    };

    if (verified && !domain.is_verified) {
      updateData.is_verified = true;
      updateData.dns_verified_at = new Date().toISOString();
      console.log('Domain verified successfully!');
    }

    const { error: updateError } = await supabase
      .from('domains')
      .update(updateData)
      .eq('id', domainId);

    if (updateError) {
      console.error('Failed to update domain:', updateError);
    }

    return new Response(
      JSON.stringify({ 
        verified,
        message: verified ? 'Domain verified successfully!' : errorMessage,
        lastCheck: updateData.last_health_check
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error verifying domain:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
