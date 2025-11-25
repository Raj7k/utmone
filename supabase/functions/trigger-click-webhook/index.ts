import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { linkId, clickData } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch link and workspace info with GA4 config
    const { data: link, error: linkError } = await supabase
      .from('links')
      .select('*, workspaces!inner(id, ga4_measurement_id, ga4_api_secret)')
      .eq('id', linkId)
      .single();

    if (linkError || !link) {
      throw new Error('Link not found');
    }

    // Fetch active webhooks for workspace
    const { data: webhooks, error: webhooksError } = await supabase
      .from('webhook_subscriptions')
      .select('*')
      .eq('workspace_id', link.workspace_id)
      .eq('is_active', true);

    if (webhooksError || !webhooks || webhooks.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No active webhooks' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Filter webhooks that listen to link.clicked
    const clickWebhooks = webhooks.filter(w => w.event_type.split(',').includes('link.clicked'));

    // Check for milestone events
    const totalClicks = link.total_clicks || 0;
    const milestones = [100, 1000, 10000, 50000, 100000];
    const milestoneWebhooks = webhooks.filter(w => w.event_type.split(',').includes('analytics.milestone'));
    
    if (milestones.includes(totalClicks) && milestoneWebhooks.length > 0) {
      for (const webhook of milestoneWebhooks) {
        try {
          await supabase.functions.invoke('send-webhook', {
            body: {
              event: 'analytics.milestone',
              data: {
                link_id: linkId,
                title: link.title,
                short_url: `https://${link.domain}/${link.path}/${link.slug}`,
                milestone: totalClicks,
                reached_at: new Date().toISOString(),
              },
              webhookUrl: webhook.webhook_url,
              secret: webhook.secret,
            },
          });
        } catch (error) {
          console.error('Milestone webhook failed:', error);
        }
      }
    }

    // Check for anomaly webhooks
    const { data: anomalies } = await supabase
      .from('analytics_anomalies')
      .select('*')
      .eq('link_id', linkId)
      .eq('is_dismissed', false)
      .order('detected_at', { ascending: false })
      .limit(1);

    const anomalyWebhooks = webhooks.filter(w => w.event_type.split(',').includes('analytics.anomaly'));
    
    if (anomalies && anomalies.length > 0 && anomalyWebhooks.length > 0) {
      const anomaly = anomalies[0];
      for (const webhook of anomalyWebhooks) {
        try {
          await supabase.functions.invoke('send-webhook', {
            body: {
              event: 'analytics.anomaly',
              data: {
                link_id: linkId,
                anomaly_type: anomaly.anomaly_type,
                severity: anomaly.severity,
                title: anomaly.title,
                description: anomaly.description,
                detected_at: anomaly.detected_at,
              },
              webhookUrl: webhook.webhook_url,
              secret: webhook.secret,
            },
          });
        } catch (error) {
          console.error('Anomaly webhook failed:', error);
        }
      }
    }

    // Send server-side GA4 event if configured
    const workspace = link.workspaces as any;
    if (workspace?.ga4_measurement_id && workspace?.ga4_api_secret) {
      try {
        const ga4Payload = {
          client_id: clickData.ip_address || 'unknown',
          events: [{
            name: 'link_click',
            params: {
              link_id: linkId,
              link_title: link.title,
              short_url: `https://${link.domain}/${link.path}/${link.slug}`,
              destination_url: link.destination_url,
              device_type: clickData.device_type,
              country: clickData.country,
              referrer: clickData.referrer,
              utm_source: link.utm_source,
              utm_medium: link.utm_medium,
              utm_campaign: link.utm_campaign,
              utm_term: link.utm_term,
              utm_content: link.utm_content,
            }
          }]
        };

        const ga4Response = await fetch(
          `https://www.google-analytics.com/mp/collect?measurement_id=${workspace.ga4_measurement_id}&api_secret=${workspace.ga4_api_secret}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ga4Payload),
          }
        );

        if (!ga4Response.ok) {
          console.error('GA4 event failed:', await ga4Response.text());
        } else {
          console.log('✅ GA4 link_click event sent');
        }
      } catch (error) {
        console.error('GA4 tracking error:', error);
      }
    }

    // Trigger all matching click webhooks
    for (const webhook of clickWebhooks) {
      try {
        await supabase.functions.invoke('send-webhook', {
          body: {
            event: 'link.clicked',
            data: {
              link_id: linkId,
              title: link.title,
              short_url: `https://${link.domain}/${link.path}/${link.slug}`,
              clicked_at: clickData.clicked_at,
              device_type: clickData.device_type,
              country: clickData.country,
              referrer: clickData.referrer,
            },
            webhookUrl: webhook.webhook_url,
            secret: webhook.secret,
          },
        });
      } catch (error) {
        console.error('Webhook delivery failed:', error);
      }
    }

    return new Response(
      JSON.stringify({ success: true, webhooks_triggered: clickWebhooks.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Click webhook error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
