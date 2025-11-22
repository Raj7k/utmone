import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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

    console.log("Starting score update for all requests...");

    // Fetch all pending/approved requests
    const { data: requests, error: fetchError } = await supabase
      .from("early_access_requests")
      .select("id")
      .in("status", ["pending", "approved"]);

    if (fetchError) throw fetchError;

    console.log(`Found ${requests?.length || 0} requests to update`);

    // Call calculate-fit-score for each request
    const results = await Promise.allSettled(
      (requests || []).map(async (request) => {
        const response = await fetch(
          `${Deno.env.get("SUPABASE_URL")}/functions/v1/calculate-fit-score`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
            },
            body: JSON.stringify({ requestId: request.id }),
          }
        );
        
        if (!response.ok) {
          throw new Error(`Failed to calculate score for ${request.id}`);
        }
        
        return response.json();
      })
    );

    const successful = results.filter(r => r.status === "fulfilled").length;
    const failed = results.filter(r => r.status === "rejected").length;

    console.log(`Score update complete: ${successful} successful, ${failed} failed`);

    // Also update referral scores
    await fetch(
      `${Deno.env.get("SUPABASE_URL")}/functions/v1/calculate-referral-scores`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
        },
        body: JSON.stringify({}),
      }
    );

    return new Response(
      JSON.stringify({
        success: true,
        total: requests?.length || 0,
        successful,
        failed,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error updating scores:", error);
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
