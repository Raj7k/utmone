import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getSecureCorsHeaders } from "../_shared/security-headers.ts";

const corsHeaders = getSecureCorsHeaders();

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { eventType, announcementId, sessionId, userId, metadata } = await req.json();

    if (!eventType || !announcementId || !sessionId) {
      throw new Error("Missing required fields");
    }

    let tableName: string;
    let data: any = {
      announcement_id: announcementId,
      session_id: sessionId,
      user_id: userId || null,
    };

    switch (eventType) {
      case "impression":
        tableName = "announcement_impressions";
        data = {
          ...data,
          user_segment: metadata?.userSegment,
          referrer: metadata?.referrer,
          user_agent: metadata?.userAgent,
        };
        break;
      case "click":
        tableName = "announcement_clicks";
        data = {
          ...data,
          cta_link: metadata?.ctaLink,
          referrer: metadata?.referrer,
          user_agent: metadata?.userAgent,
        };
        break;
      case "dismissal":
        tableName = "announcement_dismissals";
        break;
      default:
        throw new Error(`Invalid event type: ${eventType}`);
    }

    const { error } = await supabaseClient.from(tableName).insert(data);

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error tracking announcement event:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
