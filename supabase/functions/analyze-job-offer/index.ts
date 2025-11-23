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
        Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    
    return new Response(JSON.stringify({ analysis: data.choices[0].message.content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});