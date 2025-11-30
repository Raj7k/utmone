import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";

interface BatchApproveRequest {
  count: number;
  access_level?: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { count, access_level = 2 }: BatchApproveRequest = await req.json();

    console.log(`[batch-approve] Approving top ${count} users`);

    // Get top N pending users sorted by referral_count DESC, then created_at ASC
    const { data: pendingUsers, error: fetchError } = await supabase
      .from("early_access_requests")
      .select("*")
      .eq("status", "pending")
      .order("referral_count", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(count);

    if (fetchError) throw fetchError;

    if (!pendingUsers || pendingUsers.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true,
          approved_count: 0,
          message: "No pending users to approve" 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`[batch-approve] Found ${pendingUsers.length} users to approve`);

    // Approve all users and create invites
    const approvePromises = pendingUsers.map(async (user) => {
      try {
        // Create invite
        const { data: invite, error: inviteError } = await supabase
          .from("early_access_invites")
          .insert({
            email: user.email,
            access_level: access_level,
            invite_token: '',
          })
          .select()
          .single();

        if (inviteError) throw inviteError;

        // Update user status
        const { error: updateError } = await supabase
          .from("early_access_requests")
          .update({ 
            status: "approved", 
            access_level: access_level,
            approval_timestamp: new Date().toISOString()
          })
          .eq("id", user.id);

        if (updateError) throw updateError;

        // Send approval email
        await supabase.functions.invoke("send-approval-email", {
          body: {
            email: user.email,
            name: user.name,
            access_level: access_level,
            invite_token: invite.invite_token,
          },
        });

        console.log(`[batch-approve] Approved user: ${user.email}`);
        return { success: true, email: user.email };
      } catch (error) {
        console.error(`[batch-approve] Error approving ${user.email}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, email: user.email, error: errorMessage };
      }
    });

    const results = await Promise.all(approvePromises);
    const successCount = results.filter(r => r.success).length;
    const failedCount = results.filter(r => !r.success).length;

    // Update waitlist positions after batch approval
    await supabase.rpc('update_waitlist_positions');

    return new Response(
      JSON.stringify({
        success: true,
        approved_count: successCount,
        failed_count: failedCount,
        details: results,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error: any) {
    console.error("[batch-approve] Error:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
