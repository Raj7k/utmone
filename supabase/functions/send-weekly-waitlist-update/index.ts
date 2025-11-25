import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const handler = async (req: Request): Promise<Response> => {
  try {
    console.log("Starting weekly waitlist update emails...");

    // Fetch all waitlisted users
    const { data: waitlistUsers, error } = await supabase
      .from("early_access_requests")
      .select("id, name, email, referral_code, total_access_score")
      .eq("status", "pending")
      .order("total_access_score", { ascending: false });

    if (error) throw error;

    console.log(`Found ${waitlistUsers?.length || 0} waitlisted users`);

    let sentCount = 0;
    let errorCount = 0;

    for (let i = 0; i < (waitlistUsers?.length || 0); i++) {
      const user = waitlistUsers![i];
      const position = i + 1;

      try {
        const emailResponse = await resend.emails.send({
          from: "utm.one <updates@utm.one>",
          to: [user.email],
          subject: "Your weekly utm.one waitlist update",
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; line-height: 1.6; color: #1A1A1A; }
                .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
                .header { text-align: center; margin-bottom: 40px; }
                .logo { font-size: 24px; font-weight: 700; color: #FF5B04; margin-bottom: 10px; }
                .title { font-size: 24px; font-weight: 700; margin: 20px 0; color: #1A1A1A; }
                .content { background: #F9FAFB; padding: 30px; border-radius: 16px; margin: 20px 0; }
                .position { font-size: 48px; font-weight: 700; color: #FF5B04; text-align: center; margin: 20px 0; }
                .score { font-size: 18px; text-align: center; color: #6B7280; margin: 10px 0; }
                .footer { text-align: center; margin-top: 40px; color: #6B7280; font-size: 14px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="logo">utm.one</div>
                  <h1 class="title">Your Weekly Waitlist Update</h1>
                </div>
                
                <p>Hi ${user.name},</p>
                
                <div class="content">
                  <h3 style="text-align: center; margin: 0 0 10px 0;">Your Current Position</h3>
                  <div class="position">#${position}</div>
                  <div class="score">Score: ${user.total_access_score} / 200</div>
                  
                  <h3 style="margin-top: 30px;">How to move up faster:</h3>
                  <ul>
                    <li><strong>Invite friends:</strong> +10 points per sign-up, +25 when they activate</li>
                    <li><strong>Share content:</strong> Engage with our emails and content</li>
                    <li><strong>Company match:</strong> +20 points if your referrals have matching domains</li>
                  </ul>
                  
                  <p style="margin-top: 20px;"><strong>Your Referral Link:</strong></p>
                  <p style="background: white; padding: 12px; border-radius: 8px; word-break: break-all; font-size: 14px;">
                    https://utm.one/early-access?ref=${user.referral_code}
                  </p>
                </div>
                
                <p style="text-align: center; margin-top: 30px;">We're gradually onboarding users. Keep engaging and you'll get access soon.</p>
                
                <div class="footer">
                  <p>clarity creates confidence.<br>© 2025 utm.one</p>
                  <p style="font-size: 12px; margin-top: 10px;">
                    <a href="https://utm.one/early-access/unsubscribe?email=${encodeURIComponent(user.email)}" style="color: #6B7280;">Unsubscribe from weekly updates</a>
                  </p>
                </div>
              </div>
            </body>
            </html>
          `,
        });

        console.log(`Email sent to ${user.email}:`, emailResponse);
        sentCount++;
      } catch (emailError: any) {
        console.error(`Error sending email to ${user.email}:`, emailError);
        errorCount++;
      }

      // Rate limiting - wait 100ms between emails
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`Weekly update complete: ${sentCount} sent, ${errorCount} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        sent: sentCount,
        errors: errorCount,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in weekly waitlist update:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
