import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DEBOUNCE_MINUTES = 30;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { linkId, clickMetadata } = await req.json();

    if (!linkId) {
      return new Response(
        JSON.stringify({ error: "linkId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch link details
    const { data: link, error: linkError } = await supabaseAdmin
      .from("links")
      .select("id, title, prospect_name, alert_on_click, alert_last_sent_at, created_by, domain, slug")
      .eq("id", linkId)
      .single();

    if (linkError || !link) {
      console.log("Link not found or error:", linkError);
      return new Response(
        JSON.stringify({ error: "Link not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if alerts are enabled
    if (!link.alert_on_click) {
      return new Response(
        JSON.stringify({ message: "Alerts not enabled for this link" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check debounce (30 minute cooldown)
    if (link.alert_last_sent_at) {
      const lastSent = new Date(link.alert_last_sent_at);
      const debounceThreshold = new Date(Date.now() - DEBOUNCE_MINUTES * 60 * 1000);
      
      if (lastSent > debounceThreshold) {
        console.log("Alert debounced - last sent:", lastSent);
        return new Response(
          JSON.stringify({ message: "Alert debounced" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Fetch user email
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("email, display_name")
      .eq("id", link.created_by)
      .single();

    if (profileError || !profile?.email) {
      console.log("User profile not found:", profileError);
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prepare email content
    const prospectName = link.prospect_name || link.title;
    const shortUrl = `https://${link.domain}/${link.slug}`;
    const deviceInfo = clickMetadata?.device_type || "Unknown device";
    const location = [clickMetadata?.city, clickMetadata?.country].filter(Boolean).join(", ") || "Unknown location";
    const timestamp = new Date().toLocaleString("en-US", { 
      hour: "numeric", 
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short"
    });

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #050505;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #050505; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="520" cellpadding="0" cellspacing="0" style="max-width: 520px;">
          <!-- Header -->
          <tr>
            <td style="padding-bottom: 32px;">
              <span style="font-size: 14px; font-weight: 600; color: #ffffff; letter-spacing: 0.5px;">utm.one</span>
            </td>
          </tr>
          
          <!-- Alert Badge -->
          <tr>
            <td style="padding-bottom: 24px;">
              <span style="display: inline-block; padding: 6px 16px; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); border-radius: 100px; font-size: 12px; font-weight: 600; color: #ffffff; text-transform: uppercase; letter-spacing: 1px;">
                🔥 Hot Lead
              </span>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="background: linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 32px;">
              <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 700; background: linear-gradient(180deg, #ffffff 0%, #a1a1aa 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                ${prospectName}
              </h1>
              <p style="margin: 0 0 24px 0; font-size: 16px; color: rgba(255,255,255,0.7);">
                just opened your link
              </p>
              
              <!-- Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <span style="font-size: 12px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.5px;">Link</span>
                    <p style="margin: 4px 0 0 0; font-size: 14px; color: #ffffff;">${shortUrl}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <span style="font-size: 12px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.5px;">Device</span>
                    <p style="margin: 4px 0 0 0; font-size: 14px; color: #ffffff;">${deviceInfo}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <span style="font-size: 12px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.5px;">Location</span>
                    <p style="margin: 4px 0 0 0; font-size: 14px; color: #ffffff;">${location}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <span style="font-size: 12px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.5px;">Time</span>
                    <p style="margin: 4px 0 0 0; font-size: 14px; color: #ffffff;">${timestamp}</p>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <a href="tel:" style="display: block; width: 100%; padding: 16px 24px; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); border-radius: 12px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; text-align: center; box-sizing: border-box;">
                📞 Call Them Now
              </a>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding-top: 32px; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: rgba(255,255,255,0.4);">
                They're reading it right now. Strike while it's hot.
              </p>
              <a href="https://utm.one/dashboard/sales" style="font-size: 12px; color: rgba(255,255,255,0.4); text-decoration: underline;">
                Manage alert settings
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Send email via Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "utm.one <alerts@send.utm.one>",
        to: [profile.email],
        subject: `🔥 Hot Lead: ${prospectName} just opened your link`,
        html: emailHtml,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Failed to send email:", errorText);
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update last sent timestamp
    await supabaseAdmin
      .from("links")
      .update({ alert_last_sent_at: new Date().toISOString() })
      .eq("id", linkId);

    // Log the alert
    await supabaseAdmin
      .from("sales_click_alerts")
      .insert({
        link_id: linkId,
        user_id: link.created_by,
        prospect_name: link.prospect_name,
        click_metadata: clickMetadata || {},
      });

    console.log("Hot lead alert sent successfully to:", profile.email);

    return new Response(
      JSON.stringify({ success: true, message: "Alert sent" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-hot-lead-alert:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
