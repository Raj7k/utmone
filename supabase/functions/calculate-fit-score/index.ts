import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FitScoreRequest {
  requestId: string;
}

// ICP (Ideal Customer Profile) scoring logic
const calculateFitScore = (request: any): number => {
  let score = 0;
  
  // Team size scoring (0-30 points)
  const teamSizePoints: Record<string, number> = {
    "1-10": 10,
    "11-50": 20,
    "51-200": 30,
    "201-1000": 25,
    "1000+": 20,
  };
  score += teamSizePoints[request.team_size] || 0;
  
  // Role relevance (0-25 points)
  const rolePoints: Record<string, number> = {
    "marketing": 25,
    "marketing_ops": 25,
    "sales": 20,
    "developer": 20,
    "other": 10,
  };
  score += rolePoints[request.role] || 10;
  
  // Domain quality (0-20 points)
  if (request.company_domain) {
    const domain = request.company_domain.toLowerCase();
    
    // Penalize free email domains
    const freeEmailDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com"];
    if (freeEmailDomains.some(d => domain.includes(d))) {
      score += 5;
    } else {
      // Real company domain
      score += 20;
      
      // Bonus for recognizable tech/enterprise domains
      if (domain.length < 15 && !domain.includes("test") && !domain.includes("demo")) {
        score += 5;
      }
    }
  }
  
  // Reason quality (0-15 points)
  if (request.reason_details) {
    const detailsLength = request.reason_details.length;
    if (detailsLength > 100) score += 15;
    else if (detailsLength > 50) score += 10;
    else if (detailsLength > 20) score += 5;
  }
  
  // Desired domain indicates clear use case (0-10 points)
  if (request.desired_domain && request.desired_domain.length > 3) {
    score += 10;
  }
  
  return Math.min(score, 100);
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { requestId }: FitScoreRequest = await req.json();

    if (!requestId) {
      throw new Error("Request ID is required");
    }

    // Fetch the request
    const { data: request, error: fetchError } = await supabase
      .from("early_access_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (fetchError) throw fetchError;

    // Calculate fit score
    const fitScore = calculateFitScore(request);
    
    // Calculate total access score
    const engagementScore = request.engagement_score || 0;
    const referralScore = request.referral_score || 0;
    const totalAccessScore = engagementScore + referralScore + fitScore;

    // Update the request with calculated scores
    const { error: updateError } = await supabase
      .from("early_access_requests")
      .update({
        fit_score: fitScore,
        total_access_score: totalAccessScore,
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    if (updateError) throw updateError;

    console.log(`Calculated fit score for ${request.email}: ${fitScore} (total: ${totalAccessScore})`);

    return new Response(
      JSON.stringify({
        success: true,
        fit_score: fitScore,
        total_access_score: totalAccessScore,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error calculating fit score:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
