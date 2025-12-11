import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SENDER_EMAIL = "onboarding@send.utm.one";
const SENDER_NAME = "utm.one";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, workspaceName, previousPlan, dataRetentionDays, deletionDate } = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    console.log(`[send-subscription-expiry-email] Sending to ${email} for workspace ${workspaceName}`);

    const formattedDeletionDate = new Date(deletionDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your subscription has expired</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <tr>
      <td>
        <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 24px; color: #ffffff;">
          Your ${previousPlan} subscription has expired
        </h1>
        
        <p style="font-size: 16px; line-height: 1.6; color: #a1a1aa; margin-bottom: 16px;">
          Hi ${name},
        </p>
        
        <p style="font-size: 16px; line-height: 1.6; color: #a1a1aa; margin-bottom: 16px;">
          Your <strong style="color: #ffffff;">${previousPlan}</strong> plan for <strong style="color: #ffffff;">${workspaceName}</strong> has expired. Your workspace has been moved to the free tier.
        </p>
        
        <div style="background-color: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="font-size: 14px; font-weight: 600; color: #ffffff; margin: 0 0 12px 0;">
            What happens now?
          </h3>
          <ul style="margin: 0; padding-left: 20px; color: #a1a1aa; font-size: 14px; line-height: 1.8;">
            <li>Your data is safe for <strong style="color: #ffffff;">${dataRetentionDays} days</strong></li>
            <li>Some features may be restricted</li>
            <li>You can upgrade anytime to restore full access</li>
          </ul>
        </div>
        
        <div style="background-color: #7f1d1d20; border: 1px solid #7f1d1d50; border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="margin: 0; font-size: 14px; color: #fca5a5;">
            <strong>Important:</strong> If you don't upgrade by ${formattedDeletionDate}, your data may be permanently deleted.
          </p>
        </div>
        
        <a href="https://utm.one/dashboard/settings?tab=billing" 
           style="display: inline-block; background-color: #ffffff; color: #0a0a0a; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; font-size: 14px; margin-top: 16px;">
          Upgrade Now
        </a>
        
        <p style="font-size: 14px; color: #71717a; margin-top: 32px;">
          Need help? Reply to this email or contact support@utm.one
        </p>
        
        <hr style="border: none; border-top: 1px solid #27272a; margin: 32px 0;">
        
        <p style="font-size: 12px; color: #52525b; margin: 0;">
          utm.one — clean links. clear data. confident decisions.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
        to: [email],
        subject: `Your ${previousPlan} subscription has expired`,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[send-subscription-expiry-email] Resend error:", errorText);
      throw new Error(`Failed to send email: ${errorText}`);
    }

    const result = await response.json();
    console.log("[send-subscription-expiry-email] Email sent successfully:", result);

    return new Response(JSON.stringify({ success: true, id: result.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[send-subscription-expiry-email] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});