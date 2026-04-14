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
    const { action, slackWebhookUrl, message, linkData } = await req.json();

    if (action === 'shorten') {
      // Handle /utm shorten slash command
      const { destination_url, title } = linkData;

      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Create short link
      const slug = Math.random().toString(36).substring(2, 8);
      const { data: link, error } = await supabase
        .from('links')
        .insert({
          workspace_id: linkData.workspace_id,
          created_by: linkData.user_id,
          title: title || 'Slack Link',
          destination_url,
          // Use the actual short-link domain (utm.click) and omit `path` since
          // it no longer exists on the links table.
          domain: 'utm.click',
          slug,
          final_url: destination_url,
          utm_source: 'slack',
          utm_medium: 'internal',
          utm_campaign: 'slack-link',
        })
        .select()
        .single();

      if (error) throw error;

      const shortUrl = `https://utm.one/go/${slug}`;

      return new Response(
        JSON.stringify({
          response_type: 'in_channel',
          text: `✨ short link created: ${shortUrl}`,
          attachments: [
            {
              color: '#36a64f',
              fields: [
                { title: 'Original URL', value: destination_url, short: false },
                { title: 'Short URL', value: shortUrl, short: false },
              ],
            },
          ],
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'notify' && slackWebhookUrl) {
      // Send notification to Slack
      const response = await fetch(slackWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: message || '🔔 utm.one notification',
          blocks: linkData
            ? [
                {
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text: `*${linkData.title}* reached ${linkData.clicks} clicks!`,
                  },
                },
              ]
            : [],
        }),
      });

      if (!response.ok) {
        throw new Error('Slack notification failed');
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Slack integration error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
