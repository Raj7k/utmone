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
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    console.log("Starting drip email scheduling...");

    let totalScheduled = 0;

    // Get all active drip campaign schedules
    const { data: schedules, error: schedulesError } = await supabase
      .from("drip_campaign_schedules")
      .select("*, email_campaigns(*)")
      .eq("is_active", true);

    if (schedulesError) {
      throw schedulesError;
    }

    console.log(`Found ${schedules?.length || 0} active drip schedules`);

    for (const schedule of schedules || []) {
      if (schedule.trigger_type === "days_after_signup") {
        // Time-based drip emails
        const daysAgo = schedule.trigger_value || 0;
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - daysAgo);
        
        // Find users who signed up exactly X days ago and haven't received this email yet
        const { data: eligibleUsers, error: usersError } = await supabase
          .from("early_access_requests")
          .select("id, email, name")
          .gte("created_at", targetDate.toISOString().split("T")[0])
          .lt("created_at", new Date(targetDate.getTime() + 86400000).toISOString().split("T")[0])
          .not("id", "in", `(
            SELECT user_id FROM email_queue 
            WHERE campaign_id = '${schedule.campaign_id}'
          )`);

        if (usersError) {
          console.error(`Error fetching eligible users:`, usersError);
          continue;
        }

        console.log(`Found ${eligibleUsers?.length || 0} eligible users for campaign ${schedule.email_campaigns.campaign_type}`);

        // Schedule emails for eligible users
        for (const user of eligibleUsers || []) {
          const { error: queueError } = await supabase
            .from("email_queue")
            .insert({
              user_id: user.id,
              campaign_id: schedule.campaign_id,
              scheduled_at: new Date().toISOString(),
              status: "pending",
            });

          if (!queueError) {
            totalScheduled++;
            console.log(`Scheduled ${schedule.email_campaigns.campaign_type} for user ${user.email}`);
          }
        }
      } else if (schedule.trigger_type === "score_threshold") {
        // Score-based emails
        const threshold = schedule.trigger_value || 0;
        
        const { data: eligibleUsers, error: usersError } = await supabase
          .from("early_access_requests")
          .select("id, email, name, total_access_score")
          .gte("total_access_score", threshold)
          .not("id", "in", `(
            SELECT user_id FROM email_queue 
            WHERE campaign_id = '${schedule.campaign_id}'
          )`);

        if (usersError) {
          console.error(`Error fetching users by score:`, usersError);
          continue;
        }

        for (const user of eligibleUsers || []) {
          const { error: queueError } = await supabase
            .from("email_queue")
            .insert({
              user_id: user.id,
              campaign_id: schedule.campaign_id,
              scheduled_at: new Date().toISOString(),
              status: "pending",
            });

          if (!queueError) {
            totalScheduled++;
          }
        }
      } else if (schedule.trigger_type === "milestone") {
        // Milestone-based emails
        const milestoneType = schedule.trigger_milestone;
        
        // Find users who achieved this milestone but haven't received email
        const { data: eligibleUsers, error: usersError } = await supabase
          .from("waitlist_milestones")
          .select("user_id, early_access_requests(email, name)")
          .eq("milestone_type", milestoneType)
          .not("user_id", "in", `(
            SELECT user_id FROM email_queue 
            WHERE campaign_id = '${schedule.campaign_id}'
          )`);

        if (usersError) {
          console.error(`Error fetching milestone users:`, usersError);
          continue;
        }

        for (const milestone of eligibleUsers || []) {
          const { error: queueError } = await supabase
            .from("email_queue")
            .insert({
              user_id: milestone.user_id,
              campaign_id: schedule.campaign_id,
              scheduled_at: new Date().toISOString(),
              status: "pending",
            });

          if (!queueError) {
            totalScheduled++;
          }
        }
      }
    }

    console.log(`Scheduled ${totalScheduled} drip emails`);

    return new Response(
      JSON.stringify({
        success: true,
        totalScheduled,
        schedulesProcessed: schedules?.length || 0,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in schedule-drip-emails:", error);
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
