import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BatchInviteRequest {
  user_ids: string[];
  access_level: number;
}

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { user_ids, access_level }: BatchInviteRequest = await req.json();

    console.log(`Processing batch invite for ${user_ids.length} users at access level ${access_level}`);

    const results = {
      success: [] as string[],
      failed: [] as { id: string; error: string }[],
    };

    // Fetch all user details first
    const { data: users, error: fetchError } = await supabase
      .from("early_access_requests")
      .select("*")
      .in("id", user_ids);

    if (fetchError) throw fetchError;

    // Process each user
    for (const user of users || []) {
      try {
        // Generate unique invite token
        const inviteToken = btoa(`${user.email}-${Date.now()}-${Math.random().toString(36).substring(2)}`);
        
        // Create invite with unique token
        const { data: invite, error: inviteError } = await supabase
          .from("early_access_invites")
          .insert({
            email: user.email,
            access_level: access_level,
            invite_token: inviteToken,
          })
          .select()
          .single();

        if (inviteError) throw inviteError;

        // Update request status
        const { error: updateError } = await supabase
          .from("early_access_requests")
          .update({ 
            status: "approved", 
            access_level: access_level 
          })
          .eq("id", user.id);

        if (updateError) throw updateError;

        // Queue approval email
        await supabase.functions.invoke("send-approval-email", {
          body: {
            email: user.email,
            name: user.name,
            access_level: access_level,
            invite_token: invite.invite_token,
            role: user.role,
            score: user.total_access_score,
          },
        });

        results.success.push(user.email);
        console.log(`✓ Processed invite for ${user.email}`);
      } catch (error: any) {
        results.failed.push({ 
          id: user.id, 
          error: error.message 
        });
        console.error(`✗ Failed to process ${user.email}:`, error.message);
      }
    }

    console.log(`Batch complete: ${results.success.length} sent, ${results.failed.length} failed`);

    return new Response(
      JSON.stringify({
        message: "Batch invites processed",
        total: user_ids.length,
        success_count: results.success.length,
        failed_count: results.failed.length,
        results,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in batch-send-invites function:", error);
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
