import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('VIRUSTOTAL_API_KEY');
    if (!apiKey) {
      console.warn('VirusTotal API key not configured, skipping scan');
      return new Response(
        JSON.stringify({ safe: true, threats: [], skipped: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Submit URL for scanning
    const submitResponse = await fetch('https://www.virustotal.com/api/v3/urls', {
      method: 'POST',
      headers: {
        'x-apikey': apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ url }),
    });

    if (!submitResponse.ok) {
      throw new Error('VirusTotal submission failed');
    }

    const submitResult = await submitResponse.json();
    const analysisId = submitResult.data.id;

    // Poll for results (max 10 attempts, 2 seconds apart)
    let analysisResult;
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const analysisResponse = await fetch(
        `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
        { headers: { 'x-apikey': apiKey } }
      );

      if (!analysisResponse.ok) {
        throw new Error('VirusTotal analysis fetch failed');
      }

      analysisResult = await analysisResponse.json();
      if (analysisResult.data.attributes.status === 'completed') {
        break;
      }
    }

    if (!analysisResult || analysisResult.data.attributes.status !== 'completed') {
      // Timeout - return safe by default
      return new Response(
        JSON.stringify({ safe: true, threats: [], timeout: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const stats = analysisResult.data.attributes.stats;
    const isSafe = stats.malicious === 0 && stats.suspicious === 0;
    
    const threats: string[] = [];
    const results = analysisResult.data.attributes.results || {};
    for (const [engine, result] of Object.entries(results)) {
      const r = result as any;
      if (r.category !== 'clean' && r.category !== 'undetected') {
        threats.push(engine);
      }
    }

    return new Response(
      JSON.stringify({
        safe: isSafe,
        threats,
        stats: {
          malicious: stats.malicious,
          suspicious: stats.suspicious,
          undetected: stats.undetected,
          harmless: stats.harmless,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('URL scan error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message, safe: true }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
