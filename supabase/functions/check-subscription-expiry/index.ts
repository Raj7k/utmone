import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.83.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DATA_RETENTION_DAYS = 60;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const now = new Date().toISOString();
    const deletionDate = new Date(Date.now() + DATA_RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString();

    console.log(`[check-subscription-expiry] Starting expiry check at ${now}`);

    // 1. Find workspaces with expired subscriptions that are still active
    const { data: expiredWorkspaces, error: fetchError } = await supabase
      .from("workspaces")
      .select("id, name, owner_id, plan_tier, plan_expires_at")
      .lt("plan_expires_at", now)
      .eq("subscription_status", "active")
      .neq("plan_tier", "free");

    if (fetchError) {
      console.error("[check-subscription-expiry] Error fetching expired workspaces:", fetchError);
      throw fetchError;
    }

    console.log(`[check-subscription-expiry] Found ${expiredWorkspaces?.length || 0} expired workspaces`);

    const results = {
      processed: 0,
      downgraded: 0,
      notificationsSent: 0,
      errors: [] as string[],
    };

    for (const workspace of expiredWorkspaces || []) {
      try {
        console.log(`[check-subscription-expiry] Processing workspace: ${workspace.name} (${workspace.id})`);

        // Update workspace to free tier with grace period
        const { error: updateError } = await supabase
          .from("workspaces")
          .update({
            previous_plan_tier: workspace.plan_tier,
            plan_tier: "free",
            subscription_status: "grace_period",
            downgraded_at: now,
            data_deletion_scheduled_at: deletionDate,
          })
          .eq("id", workspace.id);

        if (updateError) {
          console.error(`[check-subscription-expiry] Error updating workspace ${workspace.id}:`, updateError);
          results.errors.push(`Failed to update workspace ${workspace.id}: ${updateError.message}`);
          continue;
        }

        results.downgraded++;

        // Get owner email for notification
        const { data: ownerProfile } = await supabase
          .from("profiles")
          .select("email, full_name")
          .eq("id", workspace.owner_id)
          .single();

        if (ownerProfile?.email) {
          // Send expiry notification email
          try {
            await supabase.functions.invoke("send-subscription-expiry-email", {
              body: {
                email: ownerProfile.email,
                name: ownerProfile.full_name || "there",
                workspaceName: workspace.name,
                previousPlan: workspace.plan_tier,
                dataRetentionDays: DATA_RETENTION_DAYS,
                deletionDate: deletionDate,
              },
            });
            results.notificationsSent++;
            console.log(`[check-subscription-expiry] Sent notification to ${ownerProfile.email}`);
          } catch (emailError) {
            console.error(`[check-subscription-expiry] Failed to send email to ${ownerProfile.email}:`, emailError);
          }
        }

        results.processed++;
      } catch (workspaceError) {
        console.error(`[check-subscription-expiry] Error processing workspace ${workspace.id}:`, workspaceError);
        results.errors.push(`Error processing workspace ${workspace.id}`);
      }
    }

    // 2. Check for workspaces past data retention period
    const finalDeletionDate = new Date(Date.now()).toISOString();
    const { data: deletionDueWorkspaces, error: deletionFetchError } = await supabase
      .from("workspaces")
      .select("id, name")
      .lt("data_deletion_scheduled_at", finalDeletionDate)
      .eq("subscription_status", "grace_period");

    if (!deletionFetchError && deletionDueWorkspaces?.length) {
      console.log(`[check-subscription-expiry] Found ${deletionDueWorkspaces.length} workspaces due for data cleanup`);
      
      // Mark them for scheduled deletion (actual deletion would be a separate process)
      for (const ws of deletionDueWorkspaces) {
        await supabase
          .from("workspaces")
          .update({ subscription_status: "scheduled_deletion" })
          .eq("id", ws.id);
      }
    }

    console.log(`[check-subscription-expiry] Completed. Results:`, results);

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[check-subscription-expiry] Fatal error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});