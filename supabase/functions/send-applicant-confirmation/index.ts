import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

// Initialize lazily inside the handler so a missing RESEND_API_KEY returns
// a clean 503 instead of a misleading success (or a hard error deep inside
// Resend's internals). Previously this module-level init swallowed a missing
// key silently — emails were never delivered but the function "succeeded".
let _resend: Resend | null = null;
function getResend(): Resend | null {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) return null;
  if (!_resend) _resend = new Resend(key);
  return _resend;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ConfirmationRequest {
  name: string;
  email: string;
  team_size: string;
  referral_code: string;
  request_id: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const resend = getResend();
  if (!resend) {
    console.error("[send-applicant-confirmation] RESEND_API_KEY not configured");
    return new Response(
      JSON.stringify({
        error: "Email delivery is not configured on this environment. Set RESEND_API_KEY in Supabase function secrets.",
        code: "EMAIL_UNAVAILABLE",
      }),
      { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const { name, email, team_size, referral_code, request_id }: ConfirmationRequest = await req.json();
    
    console.log("Sending confirmation email to:", email);

    // Trigger fit score calculation
    try {
      await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/calculate-fit-score`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
        },
        body: JSON.stringify({ requestId: request_id }),
      });
    } catch (error) {
      console.error("Error calculating fit score:", error);
    }

    const referralUrl = `https://utm.one/invite/${referral_code}`;

    const emailResponse = await resend.emails.send({
      from: "utm.one <onboarding@send.utm.one>",
      replyTo: "hello@send.utm.one",
      to: [email],
      subject: "you're in the queue — utm.one early access",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
                line-height: 1.6;
                color: #1A1A1A;
                max-width: 600px;
                margin: 0 auto;
                padding: 40px 20px;
              }
              h1 {
                font-size: 32px;
                font-weight: 600;
                margin-bottom: 24px;
                color: #1A1A1A;
              }
              p {
                font-size: 16px;
                margin-bottom: 16px;
                color: #4E3C2F;
              }
              .highlight {
                background: #FFF7A8;
                padding: 2px 6px;
                border-radius: 3px;
              }
              .section {
                margin: 32px 0;
              }
              .referral-box {
                background: #F8F9FA;
                border: 1px solid #E5E5E5;
                border-radius: 12px;
                padding: 24px;
                margin: 24px 0;
                text-align: center;
              }
              .referral-link {
                display: inline-block;
                background: #1A1A1A;
                color: white;
                padding: 12px 24px;
                border-radius: 24px;
                text-decoration: none;
                margin-top: 12px;
                font-weight: 500;
              }
              .footer {
                margin-top: 48px;
                padding-top: 24px;
                border-top: 1px solid #E5E5E5;
                font-size: 14px;
                color: #898989;
              }
            </style>
          </head>
          <body>
            <h1>welcome to the early circle.</h1>
            
            <p>hi ${name},</p>
            
            <p>we've received your early access request for utm.one. you're now in the queue.</p>
            
            <div class="section">
              <p><strong>what happens next:</strong></p>
              <p>
                1. <span class="highlight">we review every request personally</span> — typically within 3-5 business days<br>
                2. priority goes to teams actively running campaigns and needing clean utm governance<br>
                3. we'll reach out directly when a spot opens
              </p>
            </div>

            <div class="referral-box">
              <p><strong>jump the queue</strong></p>
              <p style="margin-top: 8px; margin-bottom: 16px;">invite others and move up in line. every successful referral boosts your priority.</p>
              <a href="${referralUrl}" class="referral-link">share your invite link</a>
            </div>
            
            <div class="section">
              <p><strong>in the meantime:</strong></p>
              <p>
                • check your inbox for updates (we'll email you)<br>
                • explore <a href="https://utm.one" style="color: #5DABDB;">utm.one</a> to see what's possible<br>
                • share your invite link to boost your priority
              </p>
            </div>
            
            <p>we're building utm.one with the same care we bring to the product itself — clean, intentional, and designed for teams who value clarity.</p>
            
            <p>talk soon,<br>the utm.one team</p>
            
            <div class="footer">
              <p>utm.one — clean links change everything</p>
              <p>this email was sent because you requested early access at <a href="https://utm.one/early-access" style="color: #5DABDB;">utm.one/early-access</a></p>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending confirmation email:", error);
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
