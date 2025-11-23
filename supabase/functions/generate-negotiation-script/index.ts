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
    const { userData, marketData } = await req.json();
    
    const prompt = `You are a professional salary negotiation coach. Generate 4 concise, professional negotiation scripts for:

Role: ${userData.role}
Experience: ${userData.yearsExperience} years
Current: $${userData.currentSalary}
${userData.offerSalary ? `Offer: $${userData.offerSalary}` : ''}
Market Median: $${marketData.p50}
Market 75th: $${marketData.p75}
Your Percentile: ${marketData.percentile}th

Generate exactly 4 scripts in JSON format:
{
  "opening": "2-3 sentence opening statement",
  "counteroffer": "specific counter with data-driven justification",
  "pushback": "2-3 sentence response to pushback",
  "closing": "1-2 sentence professional closing"
}`;

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
    const scriptText = data.choices[0].message.content;
    
    return new Response(JSON.stringify(JSON.parse(scriptText)), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});