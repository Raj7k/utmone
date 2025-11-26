import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getSecureCorsHeaders } from "../_shared/security-headers.ts";

const corsHeaders = getSecureCorsHeaders();

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get aggregate stats (no PII)
    const { count: totalCount, error: totalError } = await supabase
      .from("early_access_requests")
      .select("*", { count: "exact", head: true });

    if (totalError) throw totalError;

    const { count: approvedCount, error: approvedError } = await supabase
      .from("early_access_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved");

    if (approvedError) throw approvedError;

    const { count: referralCount, error: referralError } = await supabase
      .from("early_access_requests")
      .select("*", { count: "exact", head: true })
      .gt("referral_score", 0);

    if (referralError) throw referralError;

    // Get top referrers with ONLY anonymized data (no emails, no PII)
    const { data: topReferrers, error: referrersError } = await supabase
      .from("early_access_requests")
      .select("name, referral_score, country, badge")
      .gt("referral_score", 0)
      .order("referral_score", { ascending: false })
      .limit(20);

    if (referrersError) throw referrersError;

    // Anonymize names (only first name + last initial)
    const anonymizedReferrers = topReferrers?.map((referrer) => ({
      name: anonymizeName(referrer.name),
      score: referrer.referral_score,
      country: referrer.country,
      badge: referrer.badge,
    })) || [];

    return new Response(
      JSON.stringify({
        totalCount: totalCount || 0,
        approvedCount: approvedCount || 0,
        referralCount: referralCount || 0,
        topReferrers: anonymizedReferrers,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching waitlist stats:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch waitlist stats" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function anonymizeName(fullName: string): string {
  const parts = fullName.trim().split(" ");
  if (parts.length === 0) return "Anonymous";
  if (parts.length === 1) return parts[0];
  
  const firstName = parts[0];
  const lastInitial = parts[parts.length - 1].charAt(0);
  return `${firstName} ${lastInitial}.`;
}
