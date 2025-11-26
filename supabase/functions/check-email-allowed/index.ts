import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Create Supabase client with service role (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ 
          allowed: false, 
          reason: "error",
          message: "Email is required" 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`[check-email-allowed] Checking access for email: ${email}`);

    // Check 1: Is user an admin?
    const { data: profileData } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single();

    if (profileData) {
      const { data: adminRole } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", profileData.id)
        .eq("role", "admin")
        .single();

      if (adminRole) {
        console.log(`[check-email-allowed] User is admin: ${email}`);
        return new Response(
          JSON.stringify({ 
            allowed: true, 
            reason: "admin",
            message: "Admin access granted" 
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Check 2: Has approved early access request?
    const { data: earlyAccessData } = await supabase
      .from("early_access_requests")
      .select("status")
      .eq("email", email)
      .eq("status", "approved")
      .single();

    if (earlyAccessData) {
      console.log(`[check-email-allowed] User has approved early access: ${email}`);
      return new Response(
        JSON.stringify({ 
          allowed: true, 
          reason: "early_access",
          message: "Early access approved" 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check 3: Has valid unclaimed invite?
    const now = new Date().toISOString();
    const { data: inviteData } = await supabase
      .from("early_access_invites")
      .select("id, claimed_at, expires_at")
      .eq("email", email)
      .is("claimed_at", null)
      .gt("expires_at", now)
      .single();

    if (inviteData) {
      console.log(`[check-email-allowed] User has valid direct invite: ${email}`);
      return new Response(
        JSON.stringify({ 
          allowed: true, 
          reason: "direct_invite",
          message: "Direct invitation found" 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check 4: Has valid workspace invitation?
    const { data: workspaceInviteData } = await supabase
      .from("workspace_invitations")
      .select("id, email, expires_at, accepted_at")
      .eq("email", email)
      .is("accepted_at", null)
      .gt("expires_at", now)
      .single();

    if (workspaceInviteData) {
      console.log(`[check-email-allowed] User has valid workspace invite: ${email}`);
      return new Response(
        JSON.stringify({ 
          allowed: true, 
          reason: "workspace_invite",
          message: "Workspace invitation found" 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // No access found
    console.log(`[check-email-allowed] No access found for: ${email}`);
    return new Response(
      JSON.stringify({ 
        allowed: false, 
        reason: "no_access",
        message: "This email is not authorized for early access" 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("[check-email-allowed] Error:", error);
    return new Response(
      JSON.stringify({ 
        allowed: false, 
        reason: "error",
        message: "Unable to verify access" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
