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
      // Hours after signup trigger
      if (schedule.trigger_type === "hours_after_signup") {
        const hoursAgo = new Date(Date.now() - (schedule.trigger_hours || 24) * 60 * 60 * 1000);
        
        const { data: eligibleUsers } = await supabase
          .from("early_access_requests")
          .select("id, email, drip_emails_sent")
          .gte("created_at", hoursAgo.toISOString())
          .lte("created_at", new Date(hoursAgo.getTime() + 30 * 60 * 1000).toISOString());

        for (const user of eligibleUsers || []) {
          const emailsSent = user.drip_emails_sent || {};
          if (!emailsSent[schedule.email_campaigns.template_name]) {
            await supabase.from("email_queue").insert({
              user_id: user.id,
              campaign_id: schedule.campaign_id,
              scheduled_at: new Date().toISOString(),
              status: "pending",
            });
            totalScheduled++;
          }
        }
      }
      // Days after signup trigger
      else if (schedule.trigger_type === "days_after_signup") {
        const daysAgo = schedule.trigger_value || 0;
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - daysAgo);
        
        const { data: eligibleUsers, error: usersError } = await supabase
          .from("early_access_requests")
          .select("id, email, name, drip_emails_sent")
          .gte("created_at", targetDate.toISOString().split("T")[0])
          .lt("created_at", new Date(targetDate.getTime() + 86400000).toISOString().split("T")[0]);

        if (usersError) {
          console.error(`Error fetching eligible users:`, usersError);
          continue;
        }

        console.log(`Found ${eligibleUsers?.length || 0} eligible users for campaign ${schedule.email_campaigns.campaign_type}`);

        for (const user of eligibleUsers || []) {
          const emailsSent = user.drip_emails_sent || {};
          if (!emailsSent[schedule.email_campaigns.template_name]) {
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
        }
      } 
      // Conditional pending (Day 14 nudge)
      else if (schedule.trigger_type === "conditional_pending") {
        const daysAgo = new Date(Date.now() - (schedule.trigger_value || 14) * 24 * 60 * 60 * 1000);
        
        const { data: eligibleUsers } = await supabase
          .from("early_access_requests")
          .select("id, email, drip_emails_sent, status")
          .eq("status", "pending")
          .gte("created_at", daysAgo.toISOString())
          .lte("created_at", new Date(daysAgo.getTime() + 60 * 60 * 1000).toISOString());

        for (const user of eligibleUsers || []) {
          const emailsSent = user.drip_emails_sent || {};
          if (!emailsSent[schedule.email_campaigns.template_name]) {
            await supabase.from("email_queue").insert({
              user_id: user.id,
              campaign_id: schedule.campaign_id,
              scheduled_at: new Date().toISOString(),
              status: "pending",
            });
            totalScheduled++;
          }
        }
      }
      // Hours after approval with no activity
      else if (schedule.trigger_type === "hours_after_approval_no_activity") {
        const hoursAgo = new Date(Date.now() - (schedule.condition_hours || 48) * 60 * 60 * 1000);
        
        const { data: eligibleUsers } = await supabase
          .from("early_access_requests")
          .select("id, email, drip_emails_sent, last_activity_timestamp")
          .eq("status", "approved")
          .lte("approval_timestamp", hoursAgo.toISOString())
          .is("last_activity_timestamp", null);

        for (const user of eligibleUsers || []) {
          const emailsSent = user.drip_emails_sent || {};
          if (!emailsSent[schedule.email_campaigns.template_name]) {
            await supabase.from("email_queue").insert({
              user_id: user.id,
              campaign_id: schedule.campaign_id,
              scheduled_at: new Date().toISOString(),
              status: "pending",
            });
            totalScheduled++;
          }
        }
      }
      // Score threshold trigger
      else if (schedule.trigger_type === "score_threshold") {
        const threshold = schedule.trigger_value || 0;
        
        const { data: eligibleUsers, error: usersError } = await supabase
          .from("early_access_requests")
          .select("id, email, name, total_access_score, drip_emails_sent")
          .gte("total_access_score", threshold);

        if (usersError) {
          console.error(`Error fetching users by score:`, usersError);
          continue;
        }

        for (const user of eligibleUsers || []) {
          const emailsSent = user.drip_emails_sent || {};
          if (!emailsSent[schedule.email_campaigns.template_name]) {
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
        }
      } 
      // Milestone trigger
      else if (schedule.trigger_type === "milestone") {
        const milestoneType = schedule.trigger_milestone;
        
        const { data: eligibleUsers, error: usersError } = await supabase
          .from("waitlist_milestones")
          .select("user_id, early_access_requests(email, name, drip_emails_sent)")
          .eq("milestone_type", milestoneType);

        if (usersError) {
          console.error(`Error fetching milestone users:`, usersError);
          continue;
        }

        for (const milestone of eligibleUsers || []) {
          const user = milestone.early_access_requests;
          const emailsSent = (user as any)?.drip_emails_sent || {};
          if (!emailsSent[schedule.email_campaigns.template_name]) {
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
