import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.83.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AlertConfig {
  id: string;
  alert_name: string;
  metric_type: string;
  threshold_value: number;
  comparison_operator: string;
  email_enabled: boolean;
  email_recipients: string[];
  slack_enabled: boolean;
  webhook_enabled: boolean;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Checking metric alerts...');

    // Get current system metrics (from request body or simulated)
    const { metrics } = await req.json();
    const currentMetrics = metrics || {
      latency_p95: 85,
      error_rate: 0.3,
      cache_hit_rate: 87.5
    };

    // Get active alert configurations
    const { data: alerts, error: alertsError } = await supabase
      .from('alert_configurations')
      .select('*')
      .eq('is_enabled', true);

    if (alertsError) throw alertsError;

    const triggeredAlerts = [];

    // Check each alert condition
    for (const alert of alerts || []) {
      const metricValue = currentMetrics[alert.metric_type];
      
      if (metricValue === undefined) continue;

      let triggered = false;
      
      switch (alert.comparison_operator) {
        case '>':
          triggered = metricValue > alert.threshold_value;
          break;
        case '<':
          triggered = metricValue < alert.threshold_value;
          break;
        case '>=':
          triggered = metricValue >= alert.threshold_value;
          break;
        case '<=':
          triggered = metricValue <= alert.threshold_value;
          break;
      }

      if (triggered) {
        triggeredAlerts.push({
          alert,
          metric_value: metricValue,
          threshold: alert.threshold_value
        });

        console.log(`Alert triggered: ${alert.alert_name} (${metricValue} ${alert.comparison_operator} ${alert.threshold_value})`);

        // Send notifications
        if (alert.email_enabled && alert.email_recipients?.length > 0) {
          await sendEmailAlert(alert, metricValue);
        }

        if (alert.slack_enabled) {
          await sendSlackAlert(alert, metricValue);
        }

        if (alert.webhook_enabled) {
          await sendWebhookAlert(alert, metricValue);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        checked: alerts?.length || 0,
        triggered: triggeredAlerts.length,
        alerts: triggeredAlerts
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error checking alerts:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function sendEmailAlert(alert: AlertConfig, metricValue: number) {
  // In production, integrate with Resend or SendGrid
  console.log(`[EMAIL] Sending to ${alert.email_recipients?.join(', ')}`);
  console.log(`Subject: Alert: ${alert.alert_name}`);
  console.log(`Body: ${alert.metric_type} is ${metricValue} (threshold: ${alert.threshold_value})`);
  
  // Placeholder for email integration
  // const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
  // await resend.emails.send({
  //   from: 'alerts@utm.one',
  //   to: alert.email_recipients,
  //   subject: `Alert: ${alert.alert_name}`,
  //   html: `<p>${alert.metric_type} is ${metricValue} (threshold: ${alert.threshold_value})</p>`
  // });
}

async function sendSlackAlert(alert: AlertConfig, metricValue: number) {
  console.log('[SLACK] Sending alert notification');
  
  // Placeholder for Slack integration
  // if (alert.slack_webhook_url) {
  //   await fetch(alert.slack_webhook_url, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       text: `🚨 *Alert: ${alert.alert_name}*\n${alert.metric_type}: ${metricValue} (threshold: ${alert.threshold_value})`
  //     })
  //   });
  // }
}

async function sendWebhookAlert(alert: AlertConfig, metricValue: number) {
  console.log('[WEBHOOK] Sending alert notification');
  
  // Placeholder for custom webhook integration
  // if (alert.webhook_url) {
  //   await fetch(alert.webhook_url, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       alert_name: alert.alert_name,
  //       metric_type: alert.metric_type,
  //       metric_value: metricValue,
  //       threshold: alert.threshold_value,
  //       timestamp: new Date().toISOString()
  //     })
  //   });
  // }
}
