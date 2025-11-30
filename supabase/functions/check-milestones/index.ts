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

    // Connector (Bronze) - 1 referral
    if (referralCount && referralCount >= 1) {
      await checkAndAwardBadge(supabase, userId, "connector", awardedBadges);
    }
    // Networker (Silver) - 5 referrals
    if (referralCount && referralCount >= 5) {
      await checkAndAwardBadge(supabase, userId, "networker", awardedBadges);
    }
    // Influencer (Gold) - 10+ referrals
    if (referralCount && referralCount >= 10) {
      await checkAndAwardBadge(supabase, userId, "influencer", awardedBadges);
    }

    // Early Bird (Gold) - First 100 users
    const { count: totalUsers } = await supabase
      .from("early_access_requests")
      .select("*", { count: "exact", head: true });
    
    if (totalUsers && totalUsers <= 100) {
      await checkAndAwardBadge(supabase, userId, "early_bird", awardedBadges);
    }

    // Detailed (Bronze) - Complete profile
    if (user.name && user.email && user.role && user.team_size && user.company_domain) {
      await checkAndAwardBadge(supabase, userId, "detailed", awardedBadges);
    }

    // Early Circle (Gold) - Access granted
    if (user.status === "approved" || user.status === "skipped_line") {
      await checkAndAwardBadge(supabase, userId, "early_circle", awardedBadges);
    }

    // Super Fan (Silver) - 40+ engagement score
    if (user.engagement_score >= 40) {
      await checkAndAwardBadge(supabase, userId, "super_fan", awardedBadges);
    }

    // Engaged (Silver) - Check login count from profiles table
    const { data: profileData } = await supabase
      .from("profiles")
      .select("login_count")
      .eq("email", email)
      .single();
    
    if (profileData && profileData.login_count >= 5) {
      await checkAndAwardBadge(supabase, userId, "engaged", awardedBadges);
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

async function checkAndAwardBadge(
  supabase: any,
  userId: string,
  badgeKey: string,
  awardedBadges: string[]
) {
  // Get badge definition
  const { data: badge } = await supabase
    .from("waitlist_badges")
    .select("id, badge_key, name")
    .eq("badge_key", badgeKey)
    .single();

  if (!badge) {
    console.log(`Badge ${badgeKey} not found`);
    return;
  }

  // Check if user already has this badge
  const { data: existing } = await supabase
    .from("user_badges")
    .select("id")
    .eq("user_id", userId)
    .eq("badge_id", badge.id)
    .single();

  if (existing) {
    return; // Badge already awarded
  }

  // Award badge
  const { error: badgeError } = await supabase
    .from("user_badges")
    .insert({
      user_id: userId,
      badge_id: badge.id,
    });

  if (!badgeError) {
    awardedBadges.push(badge.badge_key);
    console.log(`✨ Awarded ${badge.name} badge to user ${userId}`);
  } else {
    console.error(`Failed to award badge ${badgeKey}:`, badgeError);
  }
}

serve(handler);
