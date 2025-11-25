import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { workspaceId, email, role } = await req.json();

    if (!workspaceId || !email || !role) {
      throw new Error("Missing required fields");
    }

    // Verify the requesting user has permission
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    // Check if user is workspace owner or admin
    const { data: workspace } = await supabase
      .from("workspaces")
      .select("owner_id, name")
      .eq("id", workspaceId)
      .single();

    const { data: membership } = await supabase
      .from("workspace_members")
      .select("role")
      .eq("workspace_id", workspaceId)
      .eq("user_id", user.id)
      .single();

    const isOwner = workspace?.owner_id === user.id;
    const isAdmin = membership?.role === "workspace_admin";

    if (!isOwner && !isAdmin) {
      throw new Error("Insufficient permissions");
    }

    // Get inviter's name for denormalization
    const { data: inviterProfile } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", user.id)
      .single();
    
    const inviterName = inviterProfile?.full_name || inviterProfile?.email || user.email || "A team member";

    // Create invitation
    const { data: invitation, error: inviteError } = await supabase
      .from("workspace_invitations")
      .insert({
        workspace_id: workspaceId,
        email,
        role,
        invited_by: user.id,
        invited_by_name: inviterName,
      })
      .select()
      .single();

    if (inviteError) throw inviteError;

    // Send invitation email using fetch to Resend API
    console.log("📧 Starting email send process...");
    try {
      const inviteUrl = `${req.headers.get("origin") || "https://utm.one"}/accept-invite?token=${invitation.token}`;
      const inviterName = user.email?.split("@")[0] || "A team member";
      const resendApiKey = Deno.env.get("RESEND_API_KEY");
      
      console.log(`Invite URL: ${inviteUrl}`);
      console.log(`RESEND_API_KEY configured: ${!!resendApiKey}`);
      
      if (resendApiKey) {
        console.log(`Sending email to ${email}...`);
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "utm.one <invites@utm.one>",
            to: [email],
            subject: `You're invited to join ${workspace?.name || "a workspace"} on utm.one`,
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                </head>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: #f5f5f7; padding: 40px 20px; border-radius: 12px; text-align: center;">
                    <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 8px 0;">You're invited!</h1>
                    <p style="font-size: 16px; color: #666; margin: 0;">${inviterName} invited you to collaborate</p>
                  </div>
                  
                  <div style="padding: 32px 0;">
                    <p style="font-size: 16px; margin: 0 0 16px 0;">Hi there,</p>
                    <p style="font-size: 16px; margin: 0 0 16px 0;">${inviterName} has invited you to join <strong>${workspace?.name || "their workspace"}</strong> on utm.one.</p>
                    <p style="font-size: 16px; margin: 0 0 24px 0;">Your role: <strong>${role}</strong></p>
                    
                    <div style="text-align: center; margin: 32px 0;">
                      <a href="${inviteUrl}" style="display: inline-block; background: #007aff; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">Accept Invitation →</a>
                    </div>
                    
                    <p style="font-size: 14px; color: #666; margin: 24px 0 0 0;">This invitation expires in 7 days.</p>
                    <p style="font-size: 14px; color: #666; margin: 8px 0 0 0;">If the button doesn't work, copy and paste this link:</p>
                    <p style="font-size: 12px; color: #999; word-break: break-all; margin: 8px 0 0 0;">${inviteUrl}</p>
                  </div>
                  
                  <div style="border-top: 1px solid #e5e5e7; padding-top: 20px; text-align: center;">
                    <p style="font-size: 14px; color: #999; margin: 0;">utm.one – clarity creates confidence</p>
                  </div>
                </body>
              </html>
            `,
          }),
        });

        console.log(`Email API response status: ${emailResponse.status}`);

        if (emailResponse.ok) {
          console.log(`✅ Email sent successfully to ${email}`);
        } else {
          const errorData = await emailResponse.json();
          console.error("⚠️ Email sending failed:", errorData);
        }
      } else {
        console.warn("⚠️ RESEND_API_KEY not configured, skipping email");
      }
    } catch (emailError) {
      console.error("⚠️ Email sending error:", emailError);
      // Don't throw - invitation is created, email is bonus
    }

    console.log(`Invitation created for ${email} to workspace ${workspaceId}`);
    console.log(`Invitation token: ${invitation.token}`);

    return new Response(
      JSON.stringify({ success: true, invitation }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});
