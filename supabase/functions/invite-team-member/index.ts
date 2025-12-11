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

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user is already a workspace member
    const { data: existingMember } = await supabase
      .from("workspace_members")
      .select(`
        id,
        profiles!inner(email)
      `)
      .eq("workspace_id", workspaceId)
      .eq("profiles.email", normalizedEmail)
      .maybeSingle();

    if (existingMember) {
      throw new Error("This user is already a member of this workspace");
    }

    // Check for existing pending invitation
    const { data: existingInvite } = await supabase
      .from("workspace_invitations")
      .select("*")
      .eq("workspace_id", workspaceId)
      .eq("email", normalizedEmail)
      .is("accepted_at", null)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (existingInvite) {
      // Resend email for existing invitation
      console.log(`📧 Resending invitation to ${normalizedEmail}...`);
      
      const inviteUrl = `${req.headers.get("origin") || "https://utm.one"}/accept-invite?token=${existingInvite.token}`;
      const resendApiKey = Deno.env.get("RESEND_API_KEY");
      
      if (resendApiKey) {
        try {
          const emailResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${resendApiKey}`,
            },
            body: JSON.stringify({
              from: "Raj from utm.one <invites@utm.one>",
              to: [normalizedEmail],
              subject: `Reminder: You're invited to join ${existingInvite.workspace_name || "a workspace"} on utm.one`,
              html: `
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                  </head>
                  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #f5f5f7 0%, #e8e8ed 100%); padding: 40px 20px; border-radius: 16px; text-align: center;">
                      <h1 style="font-size: 28px; font-weight: 700; margin: 0 0 8px 0; color: #1a1a1a;">friendly reminder 👋</h1>
                      <p style="font-size: 16px; color: #666; margin: 0;">your spot is still waiting for you</p>
                    </div>
                    
                    <div style="padding: 32px 0;">
                      <p style="font-size: 16px; margin: 0 0 16px 0;">hey there,</p>
                      <p style="font-size: 16px; margin: 0 0 16px 0;">just wanted to check in — you've been invited to join <strong>${existingInvite.workspace_name || "a workspace"}</strong> on utm.one, and we'd love to have you on board!</p>
                      <p style="font-size: 16px; margin: 0 0 8px 0;">you'll be joining as: <strong style="color: #007aff;">${role}</strong></p>
                      <p style="font-size: 16px; margin: 0 0 24px 0;">with access to powerful link tracking, branded QR codes, and campaign analytics.</p>
                      
                      <div style="text-align: center; margin: 32px 0;">
                        <a href="${inviteUrl}" style="display: inline-block; background: linear-gradient(135deg, #007aff 0%, #0056b3 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(0, 122, 255, 0.3);">accept invitation →</a>
                      </div>
                      
                      <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 12px 16px; margin: 24px 0;">
                        <p style="font-size: 14px; color: #856404; margin: 0; font-weight: 600;">⏰ this invitation expires on ${new Date(existingInvite.expires_at).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                      
                      <p style="font-size: 14px; color: #666; margin: 16px 0 0 0;">if the button doesn't work, copy and paste this link:</p>
                      <p style="font-size: 12px; color: #999; word-break: break-all; margin: 8px 0 0 0; background: #f5f5f7; padding: 8px 12px; border-radius: 6px;">${inviteUrl}</p>
                    </div>
                    
                    <div style="border-top: 1px solid #e5e5e7; padding-top: 20px; text-align: center;">
                      <p style="font-size: 14px; color: #666; margin: 0;">cheers,</p>
                      <p style="font-size: 14px; color: #1a1a1a; font-weight: 600; margin: 4px 0 0 0;">raj from utm.one</p>
                      <p style="font-size: 12px; color: #999; margin: 16px 0 0 0;">clarity creates confidence ✨</p>
                    </div>
                  </body>
                </html>
              `,
            }),
          });

          if (emailResponse.ok) {
            console.log(`✅ Reminder email sent successfully to ${normalizedEmail}`);
          } else {
            const errorData = await emailResponse.json();
            console.error("⚠️ Email sending failed:", errorData);
          }
        } catch (emailError) {
          console.error("⚠️ Email sending error:", emailError);
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          invitation: existingInvite,
          isResend: true 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
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

    // Create invitation with normalized email
    const { data: invitation, error: inviteError } = await supabase
      .from("workspace_invitations")
      .insert({
        workspace_id: workspaceId,
        email: normalizedEmail,
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
            from: "Raj from utm.one <invites@utm.one>",
            to: [normalizedEmail],
            subject: `🎉 ${inviterName} invited you to join ${workspace?.name || "their team"} on utm.one`,
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                </head>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: linear-gradient(135deg, #f5f5f7 0%, #e8e8ed 100%); padding: 40px 20px; border-radius: 16px; text-align: center;">
                    <h1 style="font-size: 28px; font-weight: 700; margin: 0 0 8px 0; color: #1a1a1a;">you're invited! 🎉</h1>
                    <p style="font-size: 16px; color: #666; margin: 0;">${inviterName} thinks you'd be perfect for the team</p>
                  </div>
                  
                  <div style="padding: 32px 0;">
                    <p style="font-size: 16px; margin: 0 0 16px 0;">hey there,</p>
                    <p style="font-size: 16px; margin: 0 0 16px 0;">great news! <strong>${inviterName}</strong> has invited you to join <strong>${workspace?.name || "their workspace"}</strong> on utm.one.</p>
                    <p style="font-size: 16px; margin: 0 0 8px 0;">you'll be joining as: <strong style="color: #007aff;">${role}</strong></p>
                    <p style="font-size: 16px; margin: 0 0 24px 0;">with access to powerful link tracking, branded QR codes, and campaign analytics.</p>
                    
                    <div style="text-align: center; margin: 32px 0;">
                      <a href="${inviteUrl}" style="display: inline-block; background: linear-gradient(135deg, #007aff 0%, #0056b3 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(0, 122, 255, 0.3);">accept invitation →</a>
                    </div>
                    
                    <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 12px 16px; margin: 24px 0;">
                      <p style="font-size: 14px; color: #856404; margin: 0; font-weight: 600;">⏰ act fast! this invitation expires on ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    
                    <p style="font-size: 14px; color: #666; margin: 16px 0 0 0;">if the button doesn't work, copy and paste this link:</p>
                    <p style="font-size: 12px; color: #999; word-break: break-all; margin: 8px 0 0 0; background: #f5f5f7; padding: 8px 12px; border-radius: 6px;">${inviteUrl}</p>
                  </div>
                  
                  <div style="border-top: 1px solid #e5e5e7; padding-top: 20px; text-align: center;">
                    <p style="font-size: 14px; color: #666; margin: 0;">cheers,</p>
                    <p style="font-size: 14px; color: #1a1a1a; font-weight: 600; margin: 4px 0 0 0;">raj from utm.one</p>
                    <p style="font-size: 12px; color: #999; margin: 16px 0 0 0;">clarity creates confidence ✨</p>
                  </div>
                </body>
              </html>
            `,
          }),
        });

        console.log(`Email API response status: ${emailResponse.status}`);

        if (emailResponse.ok) {
          console.log(`✅ Email sent successfully to ${normalizedEmail}`);
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

    console.log(`Invitation created for ${normalizedEmail} to workspace ${workspaceId}`);
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
