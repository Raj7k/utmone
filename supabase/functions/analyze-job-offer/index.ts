import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Upfront validation so callers get a clean 503 with a specific code
    // instead of a cryptic downstream error when LOVABLE_API_KEY isn't set.
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "AI is not configured on this environment. Set LOVABLE_API_KEY in Supabase function secrets.",
          code: "AI_UNAVAILABLE",
        }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { offerDetails, marketData } = await req.json();

    const prompt = `Analyze this job offer:

Role: ${offerDetails.role}
Base: $${offerDetails.baseSalary}
Equity: $${offerDetails.equity || 0}
Bonus: ${offerDetails.bonus || 0}%
Location: ${offerDetails.location}
Company Size: ${offerDetails.companySize}

Market median: $${marketData.median}
Market 75th: $${marketData.p75}

Provide brief analysis with:
1. Pros (2-3 points)
2. Cons/Red flags (2-3 points)
3. Final recommendation (Take/Negotiate/Walk)`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.error("[analyze-job-offer] AI gateway returned", response.status, errText);
      return new Response(
        JSON.stringify({ error: "AI request failed", code: "AI_GATEWAY_ERROR" }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const analysis = data?.choices?.[0]?.message?.content;
    if (!analysis) {
      return new Response(
        JSON.stringify({ error: "AI returned no content", code: "AI_EMPTY_RESPONSE" }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});