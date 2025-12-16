import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";
import { checkEmailQuality } from "../_shared/emailQuality.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Create Supabase client with service role (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const {
      name,
      email,
      team_size,
      role,
      reason_for_joining,
      reason_details,
      how_heard,
      company_domain,
      desired_domain,
      referred_by,
    } = await req.json();

    // Validate required fields
    if (!name || !email || !team_size || !role || !reason_for_joining || !how_heard) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const quality = checkEmailQuality(email);
    if (!quality.ok) {
      return new Response(
        JSON.stringify({
          error: "Invalid email",
          reason: quality.reason,
          suggestion: quality.suggestion,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const normalizedEmail = quality.normalizedEmail || email.trim().toLowerCase();

    // Check rate limit: max 3 signups per email per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count: recentCount } = await supabase
      .from("early_access_requests")
      .select("*", { count: "exact", head: true })
      .eq("email", normalizedEmail)
      .gte("created_at", oneHourAgo);

    if (recentCount && recentCount >= 3) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Insert the early access request using service role
    const { data: insertedData, error: insertError } = await supabase
      .from("early_access_requests")
      .insert({
        name,
        email: normalizedEmail,
        team_size,
        role,
        reason_for_joining,
        reason_details,
        how_heard,
        company_domain,
        desired_domain,
        referred_by,
        status: "pending",
      })
      .select("id, referral_code, status")
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({ error: insertError.message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Trigger confirmation email (Email 0 - instant confirmation)
    try {
      await supabase.functions.invoke("send-applicant-confirmation", {
        body: {
          name,
          email: normalizedEmail,
          team_size,
          referral_code: insertedData.referral_code,
          request_id: insertedData.id,
        },
      });
    } catch (emailError) {
      console.error("Email trigger error:", emailError);
      // Don't fail the request if email fails
    }

    return new Response(
      JSON.stringify(insertedData),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in submit-early-access:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
