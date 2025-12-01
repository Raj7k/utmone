import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  linkId: string;
  action: "approved" | "rejected" | "pending";
  reason?: string;
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { linkId, action, reason }: NotificationRequest = await req.json();

    console.log("Processing approval notification", { linkId, action });

    // Fetch link details
    const { data: link, error: linkError } = await supabaseClient
      .from("links")
      .select(`
        id,
        title,
        short_url,
        destination_url,
        created_by,
        workspace_id
      `)
      .eq("id", linkId)
      .single();

    if (linkError || !link) {
      throw new Error(`Link not found: ${linkError?.message}`);
    }

    // Fetch creator profile
    const { data: creatorProfile } = await supabaseClient
      .from("profiles")
      .select("full_name, email")
      .eq("id", link.created_by)
      .single();

    // Fetch workspace admins for "pending" notifications
    let adminEmails: string[] = [];
    if (action === "pending") {
      const { data: workspace } = await supabaseClient
        .from("workspaces")
        .select("owner_id")
        .eq("id", link.workspace_id)
        .single();

      if (workspace) {
        const { data: ownerProfile } = await supabaseClient
          .from("profiles")
          .select("email")
          .eq("id", workspace.owner_id)
          .single();

        if (ownerProfile?.email) {
          adminEmails.push(ownerProfile.email);
        }

        // Also fetch workspace admins
        const { data: members } = await supabaseClient
          .from("workspace_members")
          .select("user_id")
          .eq("workspace_id", link.workspace_id)
          .eq("role", "workspace_admin");

        if (members && members.length > 0) {
          const { data: adminProfiles } = await supabaseClient
            .from("profiles")
            .select("email")
            .in("user_id", members.map(m => m.user_id));

          if (adminProfiles) {
            adminEmails.push(...adminProfiles.map(p => p.email));
          }
        }
      }
    }

    const creatorEmail = creatorProfile?.email;
    const creatorName = creatorProfile?.full_name || "there";

    if (action === "approved" && creatorEmail) {
      // Send approval email to creator
      const emailResponse = await resend.emails.send({
        from: "utm.one <notifications@utm.one>",
        to: [creatorEmail],
        subject: `✅ Your link "${link.title}" is now live`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Link Approved!</h1>
            </div>
            
            <div style="background: white; padding: 40px 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                hey ${creatorName},
              </p>
              
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                great news! your link has been approved and is now live.
              </p>
              
              <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #718096; text-transform: lowercase;">link title</p>
                <p style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600; color: #2d3748;">${link.title}</p>
                
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #718096; text-transform: lowercase;">short url</p>
                <p style="margin: 0 0 15px 0;">
                  <a href="${link.short_url}" style="color: #667eea; text-decoration: none; font-weight: 500;">${link.short_url}</a>
                </p>
                
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #718096; text-transform: lowercase;">destination</p>
                <p style="margin: 0; color: #4a5568; font-size: 14px; word-break: break-all;">${link.destination_url}</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://utm.one/links/${link.id}" 
                   style="display: inline-block; background: #667eea; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  view analytics
                </a>
              </div>
              
              <p style="color: #718096; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                keep creating clean, trackable links,<br>
                the utm.one team
              </p>
            </div>
          </div>
        `,
      });

      console.log("Approval email sent", { emailResponse });
    } else if (action === "rejected" && creatorEmail && reason) {
      // Send rejection email to creator
      const emailResponse = await resend.emails.send({
        from: "utm.one <notifications@utm.one>",
        to: [creatorEmail],
        subject: `❌ Link "${link.title}" needs revision`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Link Needs Revision</h1>
            </div>
            
            <div style="background: white; padding: 40px 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                hey ${creatorName},
              </p>
              
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                your link submission was not approved. here's why:
              </p>
              
              <div style="background: #fff5f5; border-left: 4px solid #f56565; padding: 20px; border-radius: 4px; margin: 20px 0;">
                <p style="margin: 0; color: #742a2a; font-size: 15px; line-height: 1.6;">
                  ${reason}
                </p>
              </div>
              
              <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #718096; text-transform: lowercase;">link title</p>
                <p style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600; color: #2d3748;">${link.title}</p>
                
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #718096; text-transform: lowercase;">destination</p>
                <p style="margin: 0; color: #4a5568; font-size: 14px; word-break: break-all;">${link.destination_url}</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://utm.one/dashboard/links" 
                   style="display: inline-block; background: #667eea; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  create new link
                </a>
              </div>
              
              <p style="color: #718096; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                questions? reply to this email,<br>
                the utm.one team
              </p>
            </div>
          </div>
        `,
      });

      console.log("Rejection email sent", { emailResponse });
    } else if (action === "pending" && adminEmails.length > 0) {
      // Send notification to admins about new approval request
      const emailResponse = await resend.emails.send({
        from: "utm.one <notifications@utm.one>",
        to: adminEmails,
        subject: `🔔 New approval request: "${link.title}"`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">New Approval Request</h1>
            </div>
            
            <div style="background: white; padding: 40px 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                a new link is waiting for your approval.
              </p>
              
              <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #718096; text-transform: lowercase;">submitted by</p>
                <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #2d3748;">${creatorProfile?.full_name || creatorEmail}</p>
                
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #718096; text-transform: lowercase;">link title</p>
                <p style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600; color: #2d3748;">${link.title}</p>
                
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #718096; text-transform: lowercase;">destination</p>
                <p style="margin: 0; color: #4a5568; font-size: 14px; word-break: break-all;">${link.destination_url}</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://utm.one/dashboard/approvals" 
                   style="display: inline-block; background: #667eea; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  review request
                </a>
              </div>
              
              <p style="color: #718096; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                keep your links clean and compliant,<br>
                the utm.one team
              </p>
            </div>
          </div>
        `,
      });

      console.log("Admin notification sent", { emailResponse, adminEmails });
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-approval-notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
