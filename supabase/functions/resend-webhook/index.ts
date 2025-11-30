import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ResendWebhookEvent {
  type: string;
  created_at: string;
  data: {
    email_id: string;
    to: string;
    from: string;
    subject: string;
    [key: string]: any;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const event: ResendWebhookEvent = await req.json();
    console.log("📧 Resend webhook received:", event.type);

    // Only process email opened events
    if (event.type !== "email.opened") {
      console.log("⏭️  Ignoring event type:", event.type);
      return new Response(JSON.stringify({ message: "Event ignored" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userEmail = event.data.to;
    console.log("👤 Processing email open for:", userEmail);

    // Find the user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, email_open_count")
      .eq("email", userEmail)
      .single();

    if (profileError || !profile) {
      console.error("❌ Profile not found for email:", userEmail);
      return new Response(
        JSON.stringify({ error: "Profile not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Increment email open count
    const newCount = (profile.email_open_count || 0) + 1;
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ email_open_count: newCount })
      .eq("id", profile.id);

    if (updateError) {
      console.error("❌ Failed to update email_open_count:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update count" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`✅ Email open count updated: ${newCount} for ${userEmail}`);

    // Check if user should get the "Engaged" badge (5+ opens)
    if (newCount >= 5) {
      // Find the engaged badge
      const { data: badge } = await supabase
        .from("waitlist_badges")
        .select("id, badge_key, name")
        .eq("badge_key", "engaged")
        .single();

      if (badge) {
        // Find user's waitlist entry
        const { data: waitlistUser } = await supabase
          .from("early_access_requests")
          .select("id")
          .eq("email", userEmail)
          .single();

        if (waitlistUser) {
          // Check if badge already awarded
          const { data: existingBadge } = await supabase
            .from("user_badges")
            .select("id")
            .eq("user_id", waitlistUser.id)
            .eq("badge_id", badge.id)
            .single();

          if (!existingBadge) {
            // Award the badge
            const { error: badgeError } = await supabase
              .from("user_badges")
              .insert({
                user_id: waitlistUser.id,
                badge_id: badge.id,
              });

            if (!badgeError) {
              console.log(`🏆 Awarded "${badge.name}" badge to ${userEmail}`);
            } else {
              console.error("❌ Failed to award badge:", badgeError);
            }
          }
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        email: userEmail,
        openCount: newCount,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("❌ Error in resend-webhook:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
