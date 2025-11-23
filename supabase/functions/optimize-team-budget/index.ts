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
    const { budget, location, goals, workloadIntensity } = await req.json();
    
    const prompt = `You are a marketing team budget optimization expert. Generate 3 optimal team composition recommendations:

Budget: $${budget}
Location: ${location}
Primary Goals: ${goals.join(', ')}
Workload Intensity: ${workloadIntensity}/10

For each scenario, provide:
1. Team composition (roles + salaries)
2. Total cost breakdown
3. Strengths of this configuration
4. Trade-offs and limitations
5. Best fit use case

Format as JSON array with 3 scenarios labeled: "Balanced", "Senior-Heavy", "Volume-Focused"`;

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
    const recommendations = data.choices[0].message.content;
    
    return new Response(JSON.stringify({ recommendations }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error in optimize-team-budget:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
