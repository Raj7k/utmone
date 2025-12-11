import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

interface AnomalyAlertRequest {
  workspaceId: string;
  workspaceName: string;
  anomaly: {
    id: string;
    anomaly_type: string;
    severity: string;
    title: string;
    description: string;
    baseline_value?: number;
    current_value?: number;
    change_percent?: number;
    metadata?: Record<string, any>;
  };
  link?: {
    id: string;
    title: string;
    short_url: string;
  } | null;
  settings: {
    email_enabled?: boolean;
    email_recipients?: string[];
    slack_enabled?: boolean;
    slack_webhook_url_encrypted?: string;
  };
}

// Get severity emoji and color
function getSeverityStyle(severity: string): { emoji: string; color: string } {
  switch (severity) {
    case 'critical':
      return { emoji: '🔴', color: '#dc2626' };
    case 'high':
      return { emoji: '🟠', color: '#ea580c' };
    case 'medium':
      return { emoji: '🟡', color: '#ca8a04' };
    default:
      return { emoji: '🔵', color: '#2563eb' };
  }
}

// Get anomaly type icon
function getTypeIcon(type: string): string {
  switch (type) {
    case 'traffic_spike':
      return '🚀';
    case 'traffic_drop':
      return '⚠️';
    case 'new_referrer':
      return '🆕';
    case 'new_country':
      return '🌍';
    default:
      return '📊';
  }
}

// Build email HTML
function buildEmailHtml(data: AnomalyAlertRequest): string {
  const { anomaly, link, workspaceName } = data;
  const { emoji, color } = getSeverityStyle(anomaly.severity);
  const dashboardUrl = `https://utm.one/dashboard/analytics`;
  const linkUrl = link ? `https://utm.one/dashboard/links/${link.id}` : dashboardUrl;
  const changePercent = anomaly.change_percent ?? 0;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pulse Watchdog Alert</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050505; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #050505; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #18181b; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 1px solid rgba(255,255,255,0.1);">
              <table width="100%">
                <tr>
                  <td>
                    <span style="font-size: 24px; font-weight: 700; color: #ffffff;">utm.one</span>
                    <span style="font-size: 12px; color: #a1a1aa; margin-left: 8px;">pulse watchdog</span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; padding: 4px 12px; background-color: ${color}22; color: ${color}; border-radius: 20px; font-size: 12px; font-weight: 600;">
                      ${emoji} ${anomaly.severity.toUpperCase()}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <h1 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #ffffff;">
                ${anomaly.title}
              </h1>
              <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #a1a1aa;">
                ${anomaly.description}
              </p>
              
              ${link ? `
              <table style="width: 100%; background-color: #27272a; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px;">
                    <div style="font-size: 12px; color: #71717a; margin-bottom: 4px;">affected link</div>
                    <div style="font-size: 14px; color: #ffffff; font-weight: 500;">${link.title}</div>
                    <div style="font-size: 13px; color: #a1a1aa;">${link.short_url}</div>
                  </td>
                </tr>
              </table>
              ` : ''}
              
              ${anomaly.baseline_value !== undefined && anomaly.current_value !== undefined ? `
              <table style="width: 100%; margin-bottom: 24px;">
                <tr>
                  <td style="width: 50%; padding: 16px; background-color: #27272a; border-radius: 8px 0 0 8px;">
                    <div style="font-size: 12px; color: #71717a; margin-bottom: 4px;">expected</div>
                    <div style="font-size: 24px; font-weight: 600; color: #a1a1aa;">~${Math.round(anomaly.baseline_value)}</div>
                  </td>
                  <td style="width: 50%; padding: 16px; background-color: #27272a; border-radius: 0 8px 8px 0; border-left: 1px solid #3f3f46;">
                    <div style="font-size: 12px; color: #71717a; margin-bottom: 4px;">actual</div>
                    <div style="font-size: 24px; font-weight: 600; color: ${anomaly.current_value > anomaly.baseline_value ? '#22c55e' : '#ef4444'};">
                      ${anomaly.current_value}
                      <span style="font-size: 14px; font-weight: 500;">
                        (${changePercent > 0 ? '+' : ''}${changePercent}%)
                      </span>
                    </div>
                  </td>
                </tr>
              </table>
              ` : ''}
              
              <a href="${linkUrl}" style="display: inline-block; padding: 12px 24px; background-color: #ffffff; color: #000000; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
                investigate now →
              </a>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; border-top: 1px solid rgba(255,255,255,0.1);">
              <p style="margin: 0; font-size: 12px; color: #71717a;">
                workspace: ${workspaceName} · <a href="${dashboardUrl}" style="color: #a1a1aa;">open dashboard</a>
              </p>
              <p style="margin: 8px 0 0; font-size: 11px; color: #52525b;">
                you're receiving this because you have anomaly alerts enabled. 
                <a href="https://utm.one/settings/notifications" style="color: #71717a;">manage preferences</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// Build Slack message blocks
function buildSlackMessage(data: AnomalyAlertRequest): object {
  const { anomaly, link, workspaceName } = data;
  const { emoji } = getSeverityStyle(anomaly.severity);
  const dashboardUrl = `https://utm.one/dashboard/analytics`;
  const linkUrl = link ? `https://utm.one/dashboard/links/${link.id}` : dashboardUrl;
  const changePercent = anomaly.change_percent ?? 0;

  const blocks: any[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `${getTypeIcon(anomaly.anomaly_type)} ${anomaly.title}`,
        emoji: true,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: anomaly.description,
      },
    },
  ];

  if (anomaly.baseline_value !== undefined && anomaly.current_value !== undefined) {
    blocks.push({
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Expected:*\n~${Math.round(anomaly.baseline_value)} clicks/hour`,
        },
        {
          type: 'mrkdwn',
          text: `*Actual:*\n${anomaly.current_value} clicks/hour (${changePercent > 0 ? '+' : ''}${changePercent}%)`,
        },
      ],
    });
  }

  if (link) {
    blocks.push({
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `📎 *Link:* ${link.title} (${link.short_url})`,
        },
      ],
    });
  }

  blocks.push({
    type: 'actions',
    elements: [
      {
        type: 'button',
        text: {
          type: 'plain_text',
          text: 'Investigate →',
          emoji: true,
        },
        url: linkUrl,
        style: 'primary',
      },
    ],
  });

  blocks.push({
    type: 'context',
    elements: [
      {
        type: 'mrkdwn',
        text: `${emoji} Severity: ${anomaly.severity} · Workspace: ${workspaceName}`,
      },
    ],
  });

  return {
    text: `${getTypeIcon(anomaly.anomaly_type)} ${anomaly.title}`,
    blocks,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: AnomalyAlertRequest = await req.json();
    const { settings, anomaly, workspaceName } = data;

    console.log(`[Anomaly Alert] Sending notification for anomaly ${anomaly.id}`);

    const results: { email?: boolean; slack?: boolean } = {};

    // Send Email via Resend
    if (settings.email_enabled && settings.email_recipients && settings.email_recipients.length > 0 && RESEND_API_KEY) {
      try {
        const emailHtml = buildEmailHtml(data);
        const subject = `${getTypeIcon(anomaly.anomaly_type)} ${anomaly.title}`;

        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: 'utm.one Pulse Watchdog <alerts@send.utm.one>',
            to: settings.email_recipients,
            subject: subject,
            html: emailHtml,
          }),
        });

        if (emailResponse.ok) {
          results.email = true;
          console.log(`[Anomaly Alert] Email sent to ${settings.email_recipients.join(', ')}`);
        } else {
          console.error('[Anomaly Alert] Email failed:', await emailResponse.text());
          results.email = false;
        }
      } catch (error) {
        console.error('[Anomaly Alert] Email error:', error);
        results.email = false;
      }
    }

    // Send Slack notification
    if (settings.slack_enabled && settings.slack_webhook_url_encrypted) {
      try {
        // Decrypt webhook URL
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data: decrypted } = await supabase.rpc('decrypt_sensitive_data', {
          ciphertext: settings.slack_webhook_url_encrypted,
          encryption_key: Deno.env.get('ENCRYPTION_KEY') || 'default-key',
        });

        if (decrypted) {
          const slackMessage = buildSlackMessage(data);
          const slackResponse = await fetch(decrypted, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(slackMessage),
          });

          if (slackResponse.ok) {
            results.slack = true;
            console.log('[Anomaly Alert] Slack notification sent');
          } else {
            console.error('[Anomaly Alert] Slack failed:', await slackResponse.text());
            results.slack = false;
          }
        }
      } catch (error) {
        console.error('[Anomaly Alert] Slack error:', error);
        results.slack = false;
      }
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Anomaly Alert] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});