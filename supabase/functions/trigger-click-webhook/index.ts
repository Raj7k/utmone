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

    // Fetch link and workspace info
    const { data: link, error: linkError } = await supabase
      .from('links')
      .select('*, workspaces!inner(id)')
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

    // Trigger all matching webhooks
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
