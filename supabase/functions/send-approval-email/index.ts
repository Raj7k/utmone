import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ApprovalRequest {
  email: string;
  name: string;
  access_level: number;
  invite_token: string;
  role?: string;
  score?: number;
}

const getAccessLevelLabel = (level: number): string => {
  const labels: Record<number, string> = {
    0: "Waitlist",
    1: "Read-Only Preview",
    2: "Limited Beta",
    3: "Full Access",
    4: "Power User",
  };
  return labels[level] || "Unknown";
};

const getRoleMessage = (role: string | undefined): string => {
  const messages: Record<string, string> = {
    'marketing': 'as a marketer, you know clean tracking wins campaigns. we built this for you.',
    'sales': 'your team shares links everywhere. now every link tells a clear story.',
    'ops': 'governance that doesn\'t slow anyone down. that\'s the dream, right?',
    'developer': 'api-first. proper webhooks. full control. you\'ll feel right at home.',
  };
  return messages[role?.toLowerCase() || ''] || 'we built utm.one for teams like yours.';
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, access_level, invite_token, role, score }: ApprovalRequest = await req.json();

    const claimUrl = `${Deno.env.get("SUPABASE_URL")?.replace("https://", "https://app.")}/claim-access?token=${invite_token}`;
    
    const accessLabel = getAccessLevelLabel(access_level);
    const roleMessage = getRoleMessage(role);
    const scoreAcknowledgment = score && score > 0 
      ? `<p class="highlight">your engagement score of <strong>${score}</strong> earned you early access.</p>` 
      : '';

    const emailResponse = await resend.emails.send({
      from: "utm.one <onboarding@resend.dev>",
      to: [email],
      subject: "You've been selected for utm.one early access",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; line-height: 1.6; color: #1a1a1a; }
              .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
              .header { text-align: center; margin-bottom: 40px; }
              .title { font-size: 28px; font-weight: 600; margin-bottom: 12px; }
              .subtitle { font-size: 16px; color: #666; }
              .content { background: #f8f9fa; border-radius: 12px; padding: 32px; margin: 24px 0; }
              .access-badge { display: inline-block; background: #EE3B3B; color: white; padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 14px; margin: 16px 0; }
              .highlight { background: #fff7a8; padding: 12px; border-radius: 8px; margin: 16px 0; }
              .role-message { font-style: italic; color: #555; margin: 16px 0; }
              .cta-button { display: inline-block; background: #EE3B3B; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 24px 0; }
              .footer { text-align: center; color: #999; font-size: 14px; margin-top: 40px; }
              .features { margin: 24px 0; }
              .feature { margin: 12px 0; padding-left: 24px; position: relative; }
              .feature:before { content: "✓"; position: absolute; left: 0; color: #EE3B3B; font-weight: bold; }
              .urgency { background: #fff3cd; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 class="title">welcome to the early circle</h1>
                <p class="subtitle">you've been selected for utm.one</p>
              </div>
              
              <div class="content">
                <p>hey ${name},</p>
                <p>you're in. after reviewing hundreds of applications, we're excited to invite you to utm.one.</p>
                
                ${scoreAcknowledgment}
                
                <p class="role-message">${roleMessage}</p>
                
                <div class="access-badge">${accessLabel}</div>
                
                <div class="features">
                  ${access_level >= 2 ? '<div class="feature">create branded short links</div>' : ''}
                  ${access_level >= 2 ? '<div class="feature">generate custom qr codes</div>' : ''}
                  ${access_level >= 3 ? '<div class="feature">full utm builder & templates</div>' : ''}
                  ${access_level >= 3 ? '<div class="feature">complete analytics dashboard</div>' : ''}
                  ${access_level >= 4 ? '<div class="feature">api access & webhooks</div>' : ''}
                  ${access_level >= 4 ? '<div class="feature">experimental features</div>' : ''}
                </div>
                
                <div class="urgency">
                  <strong>⏰ claim your spot in 7 days</strong><br>
                  <span style="font-size: 14px;">if you don't claim it, we'll offer your spot to someone else.</span>
                </div>
                
                <a href="${claimUrl}" class="cta-button">claim your access</a>
              </div>
              
              <div class="footer">
                <p>have questions? just reply to this email.</p>
                <p style="margin-top: 16px;">clarity creates confidence.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Approval email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-approval-email function:", error);
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
