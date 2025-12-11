import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Calculate founding user number (out of first 100)
async function getFoundingNumber(supabase: any): Promise<number> {
  const { count } = await supabase
    .from("workspace_invitations")
    .select("*", { count: "exact", head: true });
  
  return Math.min((count || 0) + 1, 100);
}

// Premium Apple-style email template with Early Believer badge
function createPremiumInviteEmail(params: {
  inviterName: string;
  workspaceName: string;
  role: string;
  inviteUrl: string;
  foundingNumber: number;
  expiryDate: string;
}): string {
  const { inviterName, workspaceName, role, inviteUrl, foundingNumber, expiryDate } = params;
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>You're Invited to utm.one</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; line-height: 1.7; color: #f5f5f7; max-width: 600px; margin: 0 auto; padding: 0; background-color: #000000;">
        
        <!-- Dark container -->
        <div style="background: linear-gradient(180deg, #0a0a0a 0%, #141414 100%); padding: 48px 32px; border-radius: 0;">
          
          <!-- Premium Early Believer Badge -->
          <div style="background: linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%); border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; padding: 40px 32px; text-align: center; margin-bottom: 40px; box-shadow: inset 0 1px 0 rgba(255,255,255,0.05), 0 20px 40px rgba(0,0,0,0.4);">
            
            <div style="font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-bottom: 8px;">you are</div>
            
            <div style="font-size: 32px; font-weight: 700; background: linear-gradient(135deg, #f5f5f7 0%, #a1a1a6 40%, #f5f5f7 60%, #d4d4d8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 16px 0; letter-spacing: -0.5px;">Early Believer</div>
            
            <div style="font-size: 14px; color: rgba(255,255,255,0.5); margin-bottom: 20px;">#${foundingNumber} of 100 founding users</div>
            
            <div style="width: 60px; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); margin: 0 auto 20px;"></div>
            
            <div style="font-size: 9px; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.25);">utm.one · 2024</div>
          </div>
          
          <!-- Personal Story Section -->
          <div style="padding: 0 8px;">
            <p style="font-size: 17px; margin: 0 0 20px 0; color: #f5f5f7;">hey,</p>
            
            <p style="font-size: 16px; margin: 0 0 20px 0; color: rgba(255,255,255,0.8);">we built utm.one because we were tired of the chaos.</p>
            
            <p style="font-size: 16px; margin: 0 0 20px 0; color: rgba(255,255,255,0.7);">broken tracking links. messy UTMs. dashboards that lie. campaigns that looked successful until finance asked <em>"show me the revenue."</em></p>
            
            <p style="font-size: 16px; margin: 0 0 20px 0; color: rgba(255,255,255,0.8);">we thought: what if every link told the truth? what if tracking was clean by default, not fixed after the fact?</p>
            
            <p style="font-size: 16px; margin: 0 0 32px 0; color: #f5f5f7;">that's utm.one. and <strong>${inviterName}</strong> thinks you'd be perfect for what we're building.</p>
          </div>
          
          <!-- Workspace Details Card -->
          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 24px; margin: 32px 0;">
            <div style="display: flex; align-items: center; margin-bottom: 16px;">
              <div style="width: 40px; height: 40px; background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05)); border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-right: 16px;">
                <span style="font-size: 18px;">🏢</span>
              </div>
              <div>
                <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: rgba(255,255,255,0.4); margin-bottom: 4px;">joining workspace</div>
                <div style="font-size: 18px; font-weight: 600; color: #f5f5f7;">${workspaceName}</div>
              </div>
            </div>
            
            <div style="display: flex; align-items: center;">
              <div style="width: 40px; height: 40px; background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05)); border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-right: 16px;">
                <span style="font-size: 18px;">✨</span>
              </div>
              <div>
                <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: rgba(255,255,255,0.4); margin-bottom: 4px;">your role</div>
                <div style="font-size: 18px; font-weight: 600; color: #f5f5f7;">${role}</div>
              </div>
            </div>
          </div>
          
          <!-- What You Get Section -->
          <div style="margin: 32px 0; padding: 0 8px;">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.4); margin-bottom: 16px;">what you're getting</div>
            
            <div style="display: flex; align-items: flex-start; margin-bottom: 12px;">
              <span style="color: rgba(255,255,255,0.3); margin-right: 12px;">→</span>
              <span style="font-size: 15px; color: rgba(255,255,255,0.8);">clean, trackable links that never break</span>
            </div>
            <div style="display: flex; align-items: flex-start; margin-bottom: 12px;">
              <span style="color: rgba(255,255,255,0.3); margin-right: 12px;">→</span>
              <span style="font-size: 15px; color: rgba(255,255,255,0.8);">branded QR codes that match your identity</span>
            </div>
            <div style="display: flex; align-items: flex-start; margin-bottom: 12px;">
              <span style="color: rgba(255,255,255,0.3); margin-right: 12px;">→</span>
              <span style="font-size: 15px; color: rgba(255,255,255,0.8);">attribution that actually proves ROI</span>
            </div>
            <div style="display: flex; align-items: flex-start;">
              <span style="color: rgba(255,255,255,0.3); margin-right: 12px;">→</span>
              <span style="font-size: 15px; color: rgba(255,255,255,0.8);">founding user status (forever)</span>
            </div>
          </div>
          
          <!-- CTA Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="${inviteUrl}" style="display: inline-block; background: linear-gradient(135deg, #f5f5f7 0%, #e8e8ed 100%); color: #0a0a0a; text-decoration: none; padding: 18px 48px; border-radius: 14px; font-weight: 600; font-size: 16px; letter-spacing: -0.2px; box-shadow: 0 8px 24px rgba(255,255,255,0.15), inset 0 1px 0 rgba(255,255,255,0.4);">claim your spot →</a>
          </div>
          
          <!-- Elegant Urgency -->
          <div style="text-align: center; margin: 32px 0; padding: 20px; border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06);">
            <p style="font-size: 14px; color: rgba(255,255,255,0.5); margin: 0;">this invitation is yours for the next 7 days.</p>
            <p style="font-size: 14px; color: rgba(255,255,255,0.4); margin: 8px 0 0 0;">after ${expiryDate}, we'll offer your spot to someone else.</p>
          </div>
          
          <!-- Fallback Link -->
          <div style="margin: 24px 0; padding: 0 8px;">
            <p style="font-size: 13px; color: rgba(255,255,255,0.4); margin: 0 0 8px 0;">if the button doesn't work:</p>
            <p style="font-size: 11px; color: rgba(255,255,255,0.3); word-break: break-all; background: rgba(255,255,255,0.03); padding: 12px; border-radius: 8px; margin: 0; border: 1px solid rgba(255,255,255,0.05);">${inviteUrl}</p>
          </div>
          
          <!-- Personal Sign-off -->
          <div style="margin-top: 48px; padding: 0 8px;">
            <p style="font-size: 15px; color: rgba(255,255,255,0.7); margin: 0 0 4px 0;">looking forward to having you,</p>
            <p style="font-size: 16px; color: #f5f5f7; font-weight: 600; margin: 0;">raj</p>
            <p style="font-size: 13px; color: rgba(255,255,255,0.4); margin: 4px 0 0 0;">founder, utm.one</p>
            
            <p style="font-size: 14px; color: rgba(255,255,255,0.5); margin: 24px 0 0 0; font-style: italic;">p.s. reply anytime — i read every email.</p>
          </div>
          
          <!-- Footer -->
          <div style="margin-top: 48px; text-align: center; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.05);">
            <p style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.25); margin: 0;">clarity creates confidence</p>
          </div>
          
        </div>
      </body>
    </html>
  `;
}

// Reminder email template (simpler version)
function createReminderEmail(params: {
  workspaceName: string;
  role: string;
  inviteUrl: string;
  expiryDate: string;
}): string {
  const { workspaceName, role, inviteUrl, expiryDate } = params;
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.7; color: #f5f5f7; max-width: 600px; margin: 0 auto; padding: 0; background-color: #000000;">
        
        <div style="background: linear-gradient(180deg, #0a0a0a 0%, #141414 100%); padding: 48px 32px;">
          
          <div style="text-align: center; margin-bottom: 32px;">
            <p style="font-size: 14px; color: rgba(255,255,255,0.5); margin: 0 0 8px 0;">friendly reminder 👋</p>
            <h1 style="font-size: 24px; font-weight: 600; margin: 0; color: #f5f5f7;">your spot is still waiting</h1>
          </div>
          
          <div style="padding: 0 8px;">
            <p style="font-size: 16px; margin: 0 0 20px 0; color: rgba(255,255,255,0.8);">hey there,</p>
            
            <p style="font-size: 16px; margin: 0 0 20px 0; color: rgba(255,255,255,0.7);">just checking in — you've been invited to join <strong style="color: #f5f5f7;">${workspaceName}</strong> on utm.one as <strong style="color: #f5f5f7;">${role}</strong>.</p>
            
            <p style="font-size: 16px; margin: 0 0 20px 0; color: rgba(255,255,255,0.7);">we'd love to have you on board.</p>
          </div>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="${inviteUrl}" style="display: inline-block; background: linear-gradient(135deg, #f5f5f7 0%, #e8e8ed 100%); color: #0a0a0a; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 600; font-size: 16px;">accept invitation →</a>
          </div>
          
          <div style="text-align: center; margin: 24px 0;">
            <p style="font-size: 14px; color: rgba(255,255,255,0.4); margin: 0;">expires ${expiryDate}</p>
          </div>
          
          <div style="margin-top: 40px; padding: 0 8px;">
            <p style="font-size: 14px; color: rgba(255,255,255,0.5); margin: 0 0 4px 0;">cheers,</p>
            <p style="font-size: 15px; color: #f5f5f7; font-weight: 600; margin: 0;">raj from utm.one</p>
          </div>
          
        </div>
      </body>
    </html>
  `;
}

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
      const expiryDate = new Date(existingInvite.expires_at).toLocaleDateString('en-US', { 
        weekday: 'long', month: 'long', day: 'numeric' 
      });
      
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
              subject: `✨ your spot is still waiting — ${existingInvite.workspace_name || "utm.one"}`,
              html: createReminderEmail({
                workspaceName: existingInvite.workspace_name || "a workspace",
                role,
                inviteUrl,
                expiryDate,
              }),
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
    
    const inviterName = inviterProfile?.full_name || inviterProfile?.email?.split("@")[0] || "A team member";

    // Get founding number
    const foundingNumber = await getFoundingNumber(supabase);

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
    console.log("📧 Starting premium email send process...");
    try {
      const inviteUrl = `${req.headers.get("origin") || "https://utm.one"}/accept-invite?token=${invitation.token}`;
      const resendApiKey = Deno.env.get("RESEND_API_KEY");
      const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
        weekday: 'long', month: 'long', day: 'numeric' 
      });
      
      console.log(`Invite URL: ${inviteUrl}`);
      console.log(`RESEND_API_KEY configured: ${!!resendApiKey}`);
      console.log(`Founding user number: #${foundingNumber}`);
      
      if (resendApiKey) {
        console.log(`Sending premium email to ${normalizedEmail}...`);
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Raj from utm.one <invites@utm.one>",
            to: [normalizedEmail],
            subject: `✨ you're one of the first 100 — welcome to utm.one`,
            html: createPremiumInviteEmail({
              inviterName,
              workspaceName: workspace?.name || "utm.one",
              role,
              inviteUrl,
              foundingNumber,
              expiryDate,
            }),
          }),
        });

        console.log(`Email API response status: ${emailResponse.status}`);

        if (emailResponse.ok) {
          console.log(`✅ Premium email sent successfully to ${normalizedEmail}`);
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
