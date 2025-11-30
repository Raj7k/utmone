import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UnlockEmailRequest {
  email: string;
  name: string;
  referral_count: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, referral_count }: UnlockEmailRequest = await req.json();
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }

    console.log('[Referral Unlock] Sending unlock email to:', email);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #191265 0%, #3B82F6 100%);
            color: white;
            padding: 40px 30px;
            border-radius: 12px 12px 0 0;
            text-align: center;
          }
          .badge {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 8px 20px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 20px;
          }
          .content {
            background: white;
            padding: 40px 30px;
            border: 1px solid #e5e7eb;
            border-top: none;
          }
          .cta-button {
            display: inline-block;
            background: #191265;
            color: white;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
          }
          .footer {
            background: #f9fafb;
            padding: 30px;
            border-radius: 0 0 12px 12px;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
          }
          .stats {
            background: #f0fdf4;
            border: 2px solid #10b981;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="badge">🎉 Access Granted</div>
          <h1 style="margin: 0; font-size: 32px;">You're In!</h1>
        </div>
        
        <div class="content">
          <p>Hey ${name},</p>
          
          <p><strong>Congratulations!</strong> You've unlocked early access to utm.one by referring ${referral_count} friends.</p>
          
          <div class="stats">
            <h2 style="margin: 0 0 10px 0; color: #10b981; font-size: 24px;">🚀 Your Rewards</h2>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li>✅ Instant Access to utm.one</li>
              <li>✅ Founding Member Badge</li>
              <li>✅ 1 Month Pro Plan Free</li>
              <li>✅ Priority Support</li>
            </ul>
          </div>
          
          <p>You skipped the line and earned exclusive founding member status. Your referral link will continue to work, and you'll get additional perks for every 5 more referrals.</p>
          
          <div style="text-align: center;">
            <a href="https://utm.one/auth" class="cta-button">
              Create Your Account →
            </a>
          </div>
          
          <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">
            <strong>What's Next?</strong><br>
            Create your account and start building smarter links with UTM tracking, branded QR codes, and enterprise-grade analytics.
          </p>
        </div>
        
        <div class="footer">
          <p style="margin: 0;">
            utm.one – clarity creates confidence<br>
            <a href="https://utm.one" style="color: #191265; text-decoration: none;">utm.one</a>
          </p>
        </div>
      </body>
      </html>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'utm.one <hello@utm.one>',
        to: [email],
        subject: "🎉 You're In! Access Unlocked via Referrals",
        html: htmlContent,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[Referral Unlock] Resend error:', error);
      throw new Error(`Resend API error: ${error}`);
    }

    const data = await response.json();
    console.log('[Referral Unlock] Email sent successfully:', data);

    return new Response(
      JSON.stringify({ success: true, email_id: data.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[Referral Unlock] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
