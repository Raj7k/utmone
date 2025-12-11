import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ApprovalRequest {
  email: string;
  name?: string;
  access_level?: number;
  invite_token: string;
  role?: string;
  score?: number;
  plan_tier?: string;
  plan_duration_days?: number;
}

const getPlanLabel = (tier: string): string => {
  const labels: Record<string, string> = {
    'free': 'Free',
    'starter': 'Starter',
    'growth': 'Growth',
    'business': 'Business',
    'enterprise': 'Enterprise',
  };
  return labels[tier?.toLowerCase()] || 'Growth';
};

const getPlanFeatures = (tier: string): string[] => {
  const features: Record<string, string[]> = {
    'free': ['50 links/month', 'Basic UTM builder', 'Standard QR codes'],
    'starter': ['500 links/month', '1 custom domain', 'Branded QR codes', 'Device analytics'],
    'growth': ['Unlimited links', '3 custom domains', 'Full attribution', 'A/B testing', 'Campaigns'],
    'business': ['Everything in Growth', 'Identity Graph', 'Approval workflows', 'SSO', 'Audit logs'],
    'enterprise': ['Everything in Business', 'Custom SLA', 'Dedicated support', 'White-label options'],
  };
  return features[tier?.toLowerCase()] || features['growth'];
};

const getFoundingNumber = async (): Promise<number> => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { count } = await supabase
      .from("early_access_invites")
      .select("*", { count: "exact", head: true });

    return Math.min((count || 0) + 1, 100);
  } catch {
    return Math.floor(Math.random() * 30) + 20; // Fallback to random 20-50
  }
};

const formatExpiryDate = (durationDays?: number): string => {
  const days = durationDays || 30;
  const expiryDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  return expiryDate.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

const createPremiumApprovalEmail = (
  name: string,
  claimUrl: string,
  foundingNumber: number,
  planTier: string,
  planDurationDays: number
): string => {
  const planLabel = getPlanLabel(planTier);
  const planFeatures = getPlanFeatures(planTier);
  const expiryDate = formatExpiryDate(planDurationDays);

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to utm.one</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px;">
            
            <!-- Early Believer Badge -->
            <tr>
              <td align="center" style="padding: 40px 32px;">
                <table cellpadding="0" cellspacing="0" style="
                  background: linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
                  border: 1px solid rgba(255,255,255,0.08);
                  border-radius: 24px;
                  width: 100%;
                  max-width: 320px;
                ">
                  <tr>
                    <td style="padding: 36px 32px; text-align: center;">
                      <div style="
                        font-size: 10px;
                        letter-spacing: 4px;
                        text-transform: uppercase;
                        color: rgba(255,255,255,0.4);
                        margin-bottom: 12px;
                      ">you are</div>
                      
                      <div style="
                        font-size: 32px;
                        font-weight: 700;
                        letter-spacing: -0.5px;
                        background: linear-gradient(135deg, #f5f5f7 0%, #a1a1a6 40%, #f5f5f7 80%, #d1d1d6 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        margin-bottom: 8px;
                      ">Early Believer</div>
                      
                      <div style="
                        font-size: 14px;
                        color: rgba(255,255,255,0.5);
                        margin-bottom: 16px;
                      ">#${foundingNumber} of 100 founding users</div>
                      
                      <div style="
                        font-size: 9px;
                        letter-spacing: 3px;
                        text-transform: uppercase;
                        color: rgba(255,255,255,0.25);
                      ">utm.one · 2025</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Personal Story -->
            <tr>
              <td style="padding: 0 32px 32px;">
                <p style="color: rgba(255,255,255,0.9); font-size: 16px; line-height: 1.7; margin: 0 0 20px;">
                  hey ${name},
                </p>
                
                <p style="color: rgba(255,255,255,0.7); font-size: 15px; line-height: 1.7; margin: 0 0 20px;">
                  we built utm.one because we were tired of the chaos.
                </p>
                
                <p style="color: rgba(255,255,255,0.7); font-size: 15px; line-height: 1.7; margin: 0 0 20px;">
                  broken tracking links. messy UTMs. dashboards that lie. campaigns that looked successful until finance asked <em style="color: rgba(255,255,255,0.9);">"show me the revenue."</em>
                </p>
                
                <p style="color: rgba(255,255,255,0.7); font-size: 15px; line-height: 1.7; margin: 0 0 20px;">
                  we thought: what if every link told the truth? what if tracking was clean by default, not fixed after the fact?
                </p>
                
                <p style="color: rgba(255,255,255,0.9); font-size: 15px; line-height: 1.7; margin: 0;">
                  that's utm.one. and we think you'd be perfect for what we're building.
                </p>
              </td>
            </tr>

            <!-- Access Details Card -->
            <tr>
              <td style="padding: 0 32px 32px;">
                <table cellpadding="0" cellspacing="0" style="
                  background: rgba(255,255,255,0.03);
                  border: 1px solid rgba(255,255,255,0.08);
                  border-radius: 16px;
                  width: 100%;
                ">
                  <tr>
                    <td style="padding: 24px;">
                      <div style="
                        font-size: 10px;
                        letter-spacing: 3px;
                        text-transform: uppercase;
                        color: rgba(255,255,255,0.4);
                        margin-bottom: 16px;
                      ">your access</div>
                      
                      <table cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
                            <span style="color: rgba(255,255,255,0.5); font-size: 13px;">plan</span>
                          </td>
                          <td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06); text-align: right;">
                            <span style="color: rgba(255,255,255,0.9); font-size: 13px; font-weight: 600;">${planLabel}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
                            <span style="color: rgba(255,255,255,0.5); font-size: 13px;">valid until</span>
                          </td>
                          <td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06); text-align: right;">
                            <span style="color: rgba(255,255,255,0.9); font-size: 13px;">${expiryDate}</span>
                          </td>
                        </tr>
                        <tr>
                          <td colspan="2" style="padding: 16px 0 0;">
                            <div style="color: rgba(255,255,255,0.4); font-size: 11px; margin-bottom: 8px;">includes:</div>
                            ${planFeatures.map(feature => `
                              <div style="color: rgba(255,255,255,0.7); font-size: 13px; padding: 4px 0;">
                                <span style="color: rgba(255,255,255,0.3); margin-right: 8px;">✓</span>${feature}
                              </div>
                            `).join('')}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- CTA Button -->
            <tr>
              <td align="center" style="padding: 0 32px 24px;">
                <a href="${claimUrl}" style="
                  display: inline-block;
                  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
                  color: #0a0a0a;
                  text-decoration: none;
                  padding: 16px 48px;
                  border-radius: 12px;
                  font-size: 15px;
                  font-weight: 600;
                  letter-spacing: -0.2px;
                ">claim your access →</a>
              </td>
            </tr>

            <!-- Urgency -->
            <tr>
              <td align="center" style="padding: 0 32px 40px;">
                <p style="color: rgba(255,255,255,0.4); font-size: 13px; margin: 0;">
                  this invitation is yours for the next 7 days.<br>
                  after that, we'll offer your spot to someone else.
                </p>
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="padding: 0 32px;">
                <div style="border-top: 1px solid rgba(255,255,255,0.06);"></div>
              </td>
            </tr>

            <!-- Personal Sign-off -->
            <tr>
              <td style="padding: 32px;">
                <p style="color: rgba(255,255,255,0.7); font-size: 14px; line-height: 1.7; margin: 0 0 20px;">
                  looking forward to having you,
                </p>
                
                <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0 0 4px;">
                  raj
                </p>
                <p style="color: rgba(255,255,255,0.4); font-size: 13px; margin: 0 0 20px;">
                  founder, utm.one
                </p>
                
                <p style="color: rgba(255,255,255,0.5); font-size: 13px; font-style: italic; margin: 0;">
                  p.s. reply anytime — i read every email.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      email, 
      name, 
      invite_token, 
      plan_tier = 'growth',
      plan_duration_days = 30
    }: ApprovalRequest = await req.json();

    const foundingNumber = await getFoundingNumber();
    const displayName = name || email.split('@')[0];
    
    const claimUrl = `${Deno.env.get("SUPABASE_URL")?.replace("https://", "https://")}/claim-access?token=${invite_token}`;
    
    const emailHtml = createPremiumApprovalEmail(
      displayName,
      claimUrl,
      foundingNumber,
      plan_tier,
      plan_duration_days
    );

    const emailResponse = await resend.emails.send({
      from: "raj from utm.one <raj@utm.one>",
      to: [email],
      subject: `✨ you're #${foundingNumber} of 100 — welcome to utm.one`,
      html: emailHtml,
    });

    console.log("Premium approval email sent successfully:", emailResponse);

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
