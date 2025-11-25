import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MilestoneCheck {
  userId: string;
  email: string;
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

    const { userId, email }: MilestoneCheck = await req.json();

    console.log(`Checking milestones for user ${userId}`);

    // Fetch user data
    const { data: user, error: userError } = await supabase
      .from("early_access_requests")
      .select("*, user_badges(badge_id)")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      console.error("Error fetching user:", userError);
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const awardedBadges: string[] = [];

    // Check referral milestones
    const { count: referralCount } = await supabase
      .from("early_access_requests")
      .select("*", { count: "exact", head: true })
      .eq("referred_by", userId);

    if (referralCount && referralCount >= 1) {
      await checkAndAwardMilestone(supabase, userId, "first_referral", awardedBadges);
    }
    if (referralCount && referralCount >= 5) {
      await checkAndAwardMilestone(supabase, userId, "five_referrals", awardedBadges);
    }
    if (referralCount && referralCount >= 10) {
      await checkAndAwardMilestone(supabase, userId, "ten_referrals", awardedBadges);
    }

    // Check engagement score milestones
    if (user.engagement_score >= 40) {
      await checkAndAwardMilestone(supabase, userId, "super_engaged", awardedBadges);
    }

    // Check profile completion
    if (user.name && user.email && user.role && user.team_size && user.company_domain) {
      await checkAndAwardMilestone(supabase, userId, "profile_complete", awardedBadges);
    }

    // Check email engagement
    const { count: emailOpens } = await supabase
      .from("email_queue")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .not("opened_at", "is", null);

    if (emailOpens && emailOpens >= 5) {
      await checkAndAwardMilestone(supabase, userId, "engaged_reader", awardedBadges);
    }

    // Check full early access
    if (user.status === "approved" || user.access_level >= 3) {
      await checkAndAwardMilestone(supabase, userId, "early_circle", awardedBadges);
    }

    // Send notification emails for newly awarded badges
    if (awardedBadges.length > 0) {
      console.log(`Awarded ${awardedBadges.length} new badges to user ${userId}`);
      
      // Queue badge notification email
      const { data: campaign } = await supabase
        .from("email_campaigns")
        .select("id")
        .eq("campaign_type", "badge_earned")
        .eq("is_active", true)
        .single();

      if (campaign) {
        await supabase.from("email_queue").insert({
          user_id: userId,
          campaign_id: campaign.id,
          scheduled_at: new Date().toISOString(),
          status: "pending",
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        userId,
        newBadges: awardedBadges.length,
        badges: awardedBadges,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in check-milestones:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

async function checkAndAwardMilestone(
  supabase: any,
  userId: string,
  milestoneType: string,
  awardedBadges: string[]
) {
  // Check if milestone already exists
  const { data: existing } = await supabase
    .from("waitlist_milestones")
    .select("id")
    .eq("user_id", userId)
    .eq("milestone_type", milestoneType)
    .single();

  if (existing) {
    return; // Milestone already awarded
  }

  // Record milestone
  await supabase.from("waitlist_milestones").insert({
    user_id: userId,
    milestone_type: milestoneType,
  });

  // Get corresponding badge
  const { data: badge } = await supabase
    .from("waitlist_badges")
    .select("id, badge_key")
    .eq("badge_key", milestoneType)
    .single();

  if (badge) {
    // Award badge
    const { error: badgeError } = await supabase
      .from("user_badges")
      .insert({
        user_id: userId,
        badge_id: badge.id,
      })
      .select()
      .single();

    if (!badgeError) {
      awardedBadges.push(badge.badge_key);
      console.log(`Awarded badge ${badge.badge_key} to user ${userId}`);
    }
  }
}

serve(handler);
