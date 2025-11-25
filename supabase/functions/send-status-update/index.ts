import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface StatusUpdateRequest {
  email: string;
  name: string;
  status: "approved" | "waitlisted" | "position_update";
  accessLevel?: number;
  inviteToken?: string;
  position?: number;
  referralCode?: string;
}

const getEmailTemplate = (request: StatusUpdateRequest): { subject: string; html: string } => {
  switch (request.status) {
    case "approved":
      return {
        subject: "You're in! Claim your early access to utm.one",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; line-height: 1.6; color: #1A1A1A; }
              .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
              .header { text-align: center; margin-bottom: 40px; }
              .logo { font-size: 24px; font-weight: 700; color: #FF5B04; margin-bottom: 10px; }
              .title { font-size: 28px; font-weight: 700; margin: 20px 0; color: #1A1A1A; }
              .content { background: #F9FAFB; padding: 30px; border-radius: 16px; margin: 20px 0; }
              .button { display: inline-block; padding: 16px 32px; background: #FF5B04; color: white; text-decoration: none; border-radius: 12px; font-weight: 600; margin: 20px 0; }
              .footer { text-align: center; margin-top: 40px; color: #6B7280; font-size: 14px; }
              .highlight { color: #FF5B04; font-weight: 600; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">utm.one</div>
                <h1 class="title">You're In 🎉</h1>
              </div>
              
              <p>Hi ${request.name},</p>
              
              <p>Congratulations! You've been selected for early access to utm.one.</p>
              
              <div class="content">
                <h2 style="margin-top: 0;">Next Steps:</h2>
                <ol>
                  <li>Click the button below to claim your access</li>
                  <li>Create your account</li>
                  <li>Set up your first workspace</li>
                </ol>
              </div>
              
              <center>
                <a href="https://utm.one/auth?invite=${request.inviteToken}" class="button">
                  Claim Your Access →
                </a>
              </center>
              
              <p><strong>Access Level:</strong> ${request.accessLevel === 3 ? "Full Access" : request.accessLevel === 2 ? "Limited Beta" : "Preview"}</p>
              
              <p>Your invite link is valid for 30 days. Don't wait too long!</p>
              
              <div class="footer">
                <p>Questions? Reply to this email</p>
                <p style="font-size: 12px; margin-top: 20px;">
                  clarity creates confidence.<br>
                  © 2025 utm.one
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

    case "waitlisted":
      return {
        subject: "You're on the list — your position in the utm.one waitlist",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; line-height: 1.6; color: #1A1A1A; }
              .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
              .header { text-align: center; margin-bottom: 40px; }
              .logo { font-size: 24px; font-weight: 700; color: #FF5B04; margin-bottom: 10px; }
              .title { font-size: 28px; font-weight: 700; margin: 20px 0; color: #1A1A1A; }
              .content { background: #F9FAFB; padding: 30px; border-radius: 16px; margin: 20px 0; }
              .position { font-size: 48px; font-weight: 700; color: #FF5B04; text-align: center; margin: 20px 0; }
              .footer { text-align: center; margin-top: 40px; color: #6B7280; font-size: 14px; }
              .highlight { color: #FF5B04; font-weight: 600; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">utm.one</div>
                <h1 class="title">You're On The List</h1>
              </div>
              
              <p>Hi ${request.name},</p>
              
              <p>Thanks for requesting early access to utm.one. You're officially on the waitlist.</p>
              
              <div class="content">
                <h3 style="text-align: center; margin: 0 0 10px 0;">Your Position</h3>
                <div class="position">#${request.position}</div>
                
                <h3 style="margin-top: 30px;">Move up faster:</h3>
                <ul>
                  <li>Share your unique referral link (each referral bumps you up)</li>
                  <li>Engage with our emails (we track opens and clicks)</li>
                  <li>Complete your profile</li>
                </ul>
                
                <p style="margin-top: 20px;"><strong>Your Referral Link:</strong></p>
                <p style="background: white; padding: 12px; border-radius: 8px; word-break: break-all; font-size: 14px;">
                  https://utm.one/early-access?ref=${request.referralCode}
                </p>
              </div>
              
              <p>We'll send you updates as you move up the queue.</p>
              
              <div class="footer">
                <p>Questions? Reply to this email</p>
                <p style="font-size: 12px; margin-top: 20px;">
                  clarity creates confidence.<br>
                  © 2025 utm.one
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

    case "position_update":
      return {
        subject: `You've moved up ${request.position ? 5 : 1} spots in the utm.one waitlist`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; line-height: 1.6; color: #1A1A1A; }
              .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
              .header { text-align: center; margin-bottom: 40px; }
              .logo { font-size: 24px; font-weight: 700; color: #FF5B04; margin-bottom: 10px; }
              .title { font-size: 28px; font-weight: 700; margin: 20px 0; color: #1A1A1A; }
              .content { background: #F9FAFB; padding: 30px; border-radius: 16px; margin: 20px 0; }
              .position { font-size: 48px; font-weight: 700; color: #FF5B04; text-align: center; margin: 20px 0; }
              .footer { text-align: center; margin-top: 40px; color: #6B7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">utm.one</div>
                <h1 class="title">You're Moving Up! 📈</h1>
              </div>
              
              <p>Hi ${request.name},</p>
              
              <p>Good news! You've moved up in the utm.one waitlist.</p>
              
              <div class="content">
                <h3 style="text-align: center; margin: 0 0 10px 0;">Your New Position</h3>
                <div class="position">#${request.position}</div>
                
                <p style="text-align: center; margin-top: 20px;">Keep sharing your referral link to move up even faster.</p>
              </div>
              
              <div class="footer">
                <p>clarity creates confidence.<br>© 2025 utm.one</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

    default:
      throw new Error("Invalid status type");
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const request: StatusUpdateRequest = await req.json();

    console.log("Sending status update email:", request);

    const template = getEmailTemplate(request);

    const emailResponse = await resend.emails.send({
      from: "utm.one <updates@utm.one>",
      to: [request.email],
      subject: template.subject,
      html: template.html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending status update email:", error);
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
