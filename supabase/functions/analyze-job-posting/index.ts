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
    const { jobDescription } = await req.json();
    
    const prompt = `Analyze this job posting and extract key data. Identify red flags and calculate a "Reality Check Score" (0-100, where 100 is most reasonable):

Job Posting:
${jobDescription}

Return JSON with:
{
  "extractedData": {
    "title": "extracted role title",
    "experienceRequired": "X years",
    "requiredSkills": ["skill1", "skill2"],
    "salaryRange": "extracted or 'Not Listed'",
    "responsibilities": ["resp1", "resp2"]
  },
  "redFlags": [
    {"flag": "description", "severity": "high/medium/low"}
  ],
  "realityCheckScore": 0-100,
  "reasoning": "2-3 sentence explanation of score",
  "recommendation": "Apply / Be Cautious / Avoid"
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
    const analysisText = data.choices[0].message.content;
    
    // Parse JSON from response
    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch {
      // If AI didn't return valid JSON, wrap the text
      analysis = {
        extractedData: {},
        redFlags: [],
        realityCheckScore: 50,
        reasoning: analysisText,
        recommendation: "Review Manually"
      };
    }
    
    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error in analyze-job-posting:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
