import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  workspace_id: string;
  user_id: string;
  total_links: number;
  successful: number;
  failed: number;
  batch_id?: string;
  notification_channels: ('email' | 'webhook' | 'in_app')[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { 
      workspace_id, 
      user_id, 
      total_links, 
      successful, 
      failed,
      batch_id,
      notification_channels = ['in_app']
    }: NotificationRequest = await req.json();

    console.log('Processing bulk upload notification:', { workspace_id, user_id, total_links, successful, failed });

    const notifications = [];

    // 1. In-app notification
    if (notification_channels.includes('in_app')) {
      notifications.push(
        supabaseClient
          .from('notifications')
          .insert({
            user_id,
            workspace_id,
            type: 'bulk_upload_complete',
            title: 'Bulk upload complete',
            message: `${successful} of ${total_links} links created successfully${failed > 0 ? `, ${failed} failed` : ''}`,
            metadata: {
              total_links,
              successful,
              failed,
              batch_id,
            },
            read: false,
          })
      );
    }

    // 2. Webhook notification
    if (notification_channels.includes('webhook')) {
      const { data: webhooks } = await supabaseClient
        .from('webhook_subscriptions')
        .select('*')
        .eq('workspace_id', workspace_id)
        .eq('is_active', true)
        .contains('events', ['bulk_upload.completed']);

      if (webhooks && webhooks.length > 0) {
        for (const webhook of webhooks) {
          const webhookPayload = {
            event: 'bulk_upload.completed',
            timestamp: new Date().toISOString(),
            workspace_id,
            data: {
              batch_id,
              total_links,
              successful,
              failed,
              success_rate: (successful / total_links * 100).toFixed(2),
            },
          };

          const webhookRequest = fetch(webhook.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Webhook-Signature': await generateSignature(webhookPayload, webhook.secret),
            },
            body: JSON.stringify(webhookPayload),
          }).catch(error => {
            console.error('Webhook delivery failed:', error);
            return null;
          });

          notifications.push(webhookRequest);
        }
      }
    }

    // 3. Email notification (if configured)
    if (notification_channels.includes('email')) {
      const { data: user } = await supabaseClient
        .from('profiles')
        .select('email')
        .eq('id', user_id)
        .single();

      if (user?.email) {
        const emailPayload = {
          to: user.email,
          subject: `Bulk Upload Complete - ${successful}/${total_links} links created`,
          html: generateEmailHTML(total_links, successful, failed),
        };

        // Queue email for sending
        notifications.push(
          supabaseClient
            .from('email_queue')
            .insert({
              user_id,
              campaign_id: null,
              scheduled_at: new Date().toISOString(),
              status: 'pending',
              metadata: emailPayload,
            })
        );
      }
    }

    await Promise.all(notifications);

    console.log('Notifications sent successfully');

    return new Response(
      JSON.stringify({ 
        success: true,
        notifications_sent: notification_channels.length,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error('Error sending notifications:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        success: false,
        error: errorMessage,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

async function generateSignature(payload: any, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(payload));
  const key = encoder.encode(secret);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, data);
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function generateEmailHTML(total: number, successful: number, failed: number): string {
  const successRate = (successful / total * 100).toFixed(1);
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #1a1a1a; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4285F4, #34A853); color: white; padding: 30px; border-radius: 8px; }
          .stats { display: flex; gap: 20px; margin: 30px 0; }
          .stat { flex: 1; text-align: center; padding: 20px; background: #f5f5f5; border-radius: 8px; }
          .stat-value { font-size: 32px; font-weight: bold; color: #4285F4; }
          .stat-label { font-size: 14px; color: #666; margin-top: 5px; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Bulk Upload Complete</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your bulk link creation has finished processing</p>
          </div>
          
          <div class="stats">
            <div class="stat">
              <div class="stat-value">${total}</div>
              <div class="stat-label">Total Links</div>
            </div>
            <div class="stat">
              <div class="stat-value" style="color: #34A853;">${successful}</div>
              <div class="stat-label">Successful</div>
            </div>
            ${failed > 0 ? `
              <div class="stat">
                <div class="stat-value" style="color: #EA4335;">${failed}</div>
                <div class="stat-label">Failed</div>
              </div>
            ` : ''}
            <div class="stat">
              <div class="stat-value">${successRate}%</div>
              <div class="stat-label">Success Rate</div>
            </div>
          </div>
          
          ${failed > 0 ? `
            <div style="background: #FFF3CD; border: 1px solid #FFE69C; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <strong>⚠️ Some links failed</strong><br>
              ${failed} link${failed !== 1 ? 's' : ''} could not be created. Please check your dashboard for details and retry if needed.
            </div>
          ` : ''}
          
          <div style="margin: 30px 0;">
            <a href="${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'utm.one')}/dashboard/links" 
               style="display: inline-block; background: #4285F4; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 500;">
              View Dashboard
            </a>
          </div>
          
          <div class="footer">
            <p>This is an automated notification from utm.one</p>
            <p>clarity creates confidence.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
