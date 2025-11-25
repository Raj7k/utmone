import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { userId, emailType } = await req.json();

    // Fetch user data
    const { data: user, error: userError } = await supabase
      .from('early_access_requests')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      throw new Error('User not found');
    }

    // Email templates based on type
    const templates = {
      day_0: {
        subject: `Welcome to utm.one early access, ${user.name.split(' ')[0]}!`,
        html: `
          <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="font-size: 32px; font-weight: 800; color: #18181B; margin-bottom: 16px;">
              You're on the list.
            </h1>
            <p style="font-size: 18px; color: #71717A; line-height: 1.6; margin-bottom: 24px;">
              Hi ${user.name.split(' ')[0]}, thanks for joining utm.one early access.
            </p>
            <p style="font-size: 16px; color: #71717A; line-height: 1.6; margin-bottom: 24px;">
              You're in position <strong style="color: #FF5B04;">#${user.access_level || '—'}</strong> on the waitlist.
            </p>
            <div style="background: #E4EEF0; border-radius: 12px; padding: 24px; margin: 32px 0;">
              <h3 style="font-size: 18px; font-weight: 700; color: #18181B; margin-bottom: 12px;">
                Jump the queue
              </h3>
              <p style="font-size: 14px; color: #71717A; margin-bottom: 16px;">
                Share your unique referral link to move up faster:
              </p>
              <div style="background: white; border-radius: 8px; padding: 16px; font-family: monospace; font-size: 14px; color: #075056; word-break: break-all;">
                https://utm.one/early-access?ref=${user.referral_code}
              </div>
              <p style="font-size: 12px; color: #71717A; margin-top: 12px;">
                For every 3 referrals, you unlock +1 access level. 5 referrals = instant upgrade.
              </p>
            </div>
            <p style="font-size: 14px; color: #71717A; margin-top: 32px;">
              — The utm.one team
            </p>
          </div>
        `,
      },
      day_2: {
        subject: `What to expect from utm.one`,
        html: `
          <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="font-size: 28px; font-weight: 800; color: #18181B; margin-bottom: 16px;">
              What to expect
            </h1>
            <p style="font-size: 16px; color: #71717A; line-height: 1.6; margin-bottom: 24px;">
              utm.one isn't just another link shortener. Here's what makes it different:
            </p>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="margin-bottom: 16px; padding-left: 24px; position: relative;">
                <span style="position: absolute; left: 0; color: #FF5B04; font-weight: 800;">✓</span>
                <strong>Link previews</strong> — see exactly where you're sending people
              </li>
              <li style="margin-bottom: 16px; padding-left: 24px; position: relative;">
                <span style="position: absolute; left: 0; color: #075056; font-weight: 800;">✓</span>
                <strong>Security scanning</strong> — automatic malware & phishing detection
              </li>
              <li style="margin-bottom: 16px; padding-left: 24px; position: relative;">
                <span style="position: absolute; left: 0; color: #FF5B04; font-weight: 800;">✓</span>
                <strong>Branded QR codes</strong> — full customization with your colors
              </li>
              <li style="margin-bottom: 16px; padding-left: 24px; position: relative;">
                <span style="position: absolute; left: 0; color: #075056; font-weight: 800;">✓</span>
                <strong>Self-hosting option</strong> — your data, your infrastructure
              </li>
            </ul>
            <p style="font-size: 14px; color: #71717A; margin-top: 32px;">
              You're at position <strong>#${user.access_level || '—'}</strong>. Keep sharing to move up.
            </p>
          </div>
        `,
      },
      day_5: {
        subject: `${user.name.split(' ')[0]}, you're moving up`,
        html: `
          <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="font-size: 28px; font-weight: 800; color: #18181B; margin-bottom: 16px;">
              You're climbing
            </h1>
            <p style="font-size: 16px; color: #71717A; line-height: 1.6; margin-bottom: 24px;">
              Your current position: <strong style="font-size: 32px; color: #FF5B04;">#${user.access_level || '—'}</strong>
            </p>
            <p style="font-size: 16px; color: #71717A; line-height: 1.6; margin-bottom: 24px;">
              Want to move faster? Share your link:
            </p>
            <div style="background: #E4EEF0; border-radius: 8px; padding: 16px; font-family: monospace; font-size: 14px; color: #075056; word-break: break-all;">
              https://utm.one/early-access?ref=${user.referral_code}
            </div>
            <p style="font-size: 14px; color: #71717A; margin-top: 32px;">
              Current referrals: <strong>${user.referral_score || 0}</strong>
            </p>
          </div>
        `,
      },
      day_10: {
        subject: `Behind the build: utm.one progress update`,
        html: `
          <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="font-size: 28px; font-weight: 800; color: #18181B; margin-bottom: 16px;">
              Behind the build
            </h1>
            <p style="font-size: 16px; color: #71717A; line-height: 1.6; margin-bottom: 24px;">
              Quick update on what we're shipping:
            </p>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="margin-bottom: 12px; color: #71717A;">
                🎨 Custom QR code designer with logo upload
              </li>
              <li style="margin-bottom: 12px; color: #71717A;">
                🔒 Advanced security scanning with VirusTotal
              </li>
              <li style="margin-bottom: 12px; color: #71717A;">
                📊 Real-time analytics dashboard
              </li>
              <li style="margin-bottom: 12px; color: #71717A;">
                🚀 GraphQL API for developers
              </li>
            </ul>
            <p style="font-size: 14px; color: #71717A; margin-top: 32px;">
              You're at position <strong>#${user.access_level || '—'}</strong>.
            </p>
          </div>
        `,
      },
    };

    const template = templates[emailType as keyof typeof templates];
    if (!template) {
      throw new Error('Invalid email type');
    }

    const { error: sendError } = await resend.emails.send({
      from: 'utm.one <onboarding@resend.dev>',
      to: [user.email],
      subject: template.subject,
      html: template.html,
    });

    if (sendError) {
      throw sendError;
    }

    console.log(`Sent ${emailType} email to ${user.email}`);

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
