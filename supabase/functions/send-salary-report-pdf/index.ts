import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  fullName: string;
  email: string;
  jobTitle: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fullName, email, jobTitle }: EmailRequest = await req.json();

    console.log("Sending salary report to:", email);

    const emailResponse = await resend.emails.send({
      from: "utm.one <reports@send.utm.one>",
      replyTo: "hello@send.utm.one",
      to: [email],
      subject: "Your 2026 Global Salary Benchmark Report",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .header { text-align: center; margin-bottom: 40px; }
            .logo { font-size: 24px; font-weight: 700; color: #FF5B04; margin-bottom: 10px; }
            .title { font-size: 28px; font-weight: 700; margin: 20px 0; }
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
              <h1 class="title">Your 2026 Salary Benchmark Report is Ready</h1>
            </div>
            
            <p>Hi ${fullName},</p>
            
            <p>Thank you for requesting the <strong>2026 Global Marketing & Sales Operations Salary Benchmark Report</strong>.</p>
            
            <div class="content">
              <h2 style="margin-top: 0;">📊 What's Inside:</h2>
              <ul>
                <li><strong>100+ pages</strong> of comprehensive salary data</li>
                <li><strong>15+ countries</strong> with state/city-level breakdowns</li>
                <li><strong>50+ roles</strong> across Marketing, Sales, RevOps, and Operations</li>
                <li><strong>Interactive calculators</strong> to find your exact market value</li>
                <li><strong>Skill premium analysis</strong> showing high-value competencies</li>
                <li><strong>Negotiation blueprints</strong> with proven scripts</li>
              </ul>
            </div>
            
            <center>
              <a href="https://28313d35-a772-45d5-8b5f-41cdf224a4f8.lovableproject.com/resources/reports/salary-benchmark-2025" class="button">
                View Full Report
              </a>
            </center>
            
            <p><strong>Your role:</strong> ${jobTitle}</p>
            
            <p>Based on your role, we recommend checking out:</p>
            <ul>
              <li>Section on ${jobTitle.includes("Marketing") ? "Marketing" : jobTitle.includes("Sales") ? "Sales" : "RevOps"} salary benchmarks</li>
              <li>Interactive salary calculator (Section 8)</li>
              <li>Negotiation blueprint with walk-away calculator</li>
            </ul>
            
            <div class="content">
              <p><strong>🎁 Bonus:</strong> You'll receive <span class="highlight">quarterly updates</span> as new salary data becomes available. Stay ahead of market trends.</p>
            </div>
            
            <div class="footer">
              <p>Questions? Reply to this email or visit <a href="https://utm.one">utm.one</a></p>
              <p style="font-size: 12px; margin-top: 20px;">
                You received this email because you requested the 2026 Salary Benchmark Report.<br>
                <a href="#">Unsubscribe from quarterly updates</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
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
    console.error("Error sending salary report email:", error);
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
