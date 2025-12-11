import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const adminEmail = Deno.env.get('ADMIN_EMAIL')!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  request_id: string;
  name: string;
  email: string;
  team_size: string;
  role: string;
  reason: string;
  how_heard: string;
  company_domain: string | null;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { request_id, name, email, team_size, role, reason, how_heard, company_domain }: NotificationRequest = await req.json();

    console.log('Processing notification for request:', request_id);

    // Get all admin emails from user_roles table
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: adminRoles, error: adminError } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin');

    if (adminError) {
      console.error('Error fetching admin roles:', adminError);
      throw adminError;
    }

    // Get admin user emails from profiles
    const adminUserIds = adminRoles?.map(r => r.user_id) || [];
    
    let adminEmails: string[] = [];
    
    if (adminUserIds.length > 0) {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('email')
        .in('id', adminUserIds);

      if (profilesError) {
        console.error('Error fetching admin profiles:', profilesError);
      } else {
        adminEmails = profiles?.map(p => p.email) || [];
      }
    }

    // Fallback to ADMIN_EMAIL env variable if no admin emails found
    if (adminEmails.length === 0) {
      console.log('No admin users found, using ADMIN_EMAIL env variable');
      adminEmails = [adminEmail];
    }

    console.log('Sending notification to admins:', adminEmails);

    // Send email to all admins
    const emailResponse = await resend.emails.send({
      from: "utm.one <onboarding@utm.one>",
      replyTo: "hello@utm.one",
      to: adminEmails,
      subject: "🎯 New Early Access Request",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
                line-height: 1.6;
                color: #1a1a1a;
                margin: 0;
                padding: 0;
                background-color: #f5f5f5;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
              }
              .header {
                background: linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%);
                padding: 40px 32px;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                color: #ffffff;
                font-size: 28px;
                font-weight: 700;
              }
              .content {
                padding: 40px 32px;
              }
              .intro {
                font-size: 16px;
                color: #4a4a4a;
                margin-bottom: 32px;
              }
              .request-details {
                background-color: #f9f9f9;
                border-left: 4px solid #1a1a1a;
                padding: 24px;
                margin-bottom: 32px;
              }
              .detail-row {
                display: flex;
                padding: 12px 0;
                border-bottom: 1px solid #e5e5e5;
              }
              .detail-row:last-child {
                border-bottom: none;
              }
              .detail-label {
                font-weight: 600;
                color: #1a1a1a;
                min-width: 140px;
                text-transform: lowercase;
              }
              .detail-value {
                color: #4a4a4a;
                flex: 1;
              }
              .team-badge {
                display: inline-block;
                background-color: #1a1a1a;
                color: #ffffff;
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 14px;
                font-weight: 500;
              }
              .cta-section {
                text-align: center;
                margin: 40px 0;
              }
              .cta-button {
                display: inline-block;
                background-color: #1a1a1a;
                color: #ffffff;
                padding: 16px 32px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                transition: all 0.2s;
              }
              .cta-button:hover {
                background-color: #333333;
                transform: scale(1.02);
              }
              .footer {
                background-color: #f9f9f9;
                padding: 24px 32px;
                text-align: center;
                color: #888888;
                font-size: 14px;
              }
              .footer a {
                color: #1a1a1a;
                text-decoration: none;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>new early access request</h1>
              </div>
              
              <div class="content">
                <p class="intro">
                  A new user has requested early access to utm.one. Review their application below and take action from the admin dashboard.
                </p>
                
                <div class="request-details">
                  <div class="detail-row">
                    <span class="detail-label">name</span>
                    <span class="detail-value"><strong>${name}</strong></span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">email</span>
                    <span class="detail-value">${email}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">role</span>
                    <span class="detail-value"><span class="team-badge">${role}</span></span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">team size</span>
                    <span class="detail-value"><span class="team-badge">${team_size}</span></span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">reason</span>
                    <span class="detail-value">${reason}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">how they heard</span>
                    <span class="detail-value">${how_heard}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">company domain</span>
                    <span class="detail-value">${company_domain || '—'}</span>
                  </div>
                </div>
                
                <div class="cta-section">
                  <a href="${supabaseUrl.replace('.supabase.co', '.lovable.app')}/admin/early-access" class="cta-button">
                    review request
                  </a>
                </div>
                
                <p style="color: #888888; font-size: 14px; text-align: center; margin-top: 32px;">
                  This request is currently <strong>pending</strong>. Log in to the admin dashboard to approve or reject.
                </p>
              </div>
              
              <div class="footer">
                <p>
                  utm.one admin notifications<br>
                  <a href="${supabaseUrl.replace('.supabase.co', '.lovable.app')}">utm.one</a>
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, email_id: emailResponse.data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in notify-admin-new-request function:", error);
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
