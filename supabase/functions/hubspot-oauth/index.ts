import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    // Get user's workspace
    const { data: workspaceData } = await supabaseClient
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', user.id)
      .single();

    if (!workspaceData) {
      throw new Error('No workspace found');
    }

    const workspaceId = workspaceData.workspace_id;

    if (action === 'connect') {
      // Step 1: Generate OAuth URL
      const hubspotClientId = Deno.env.get('HUBSPOT_CLIENT_ID');
      const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/hubspot-oauth?action=callback`;
      
      const authUrl = `https://app.hubspot.com/oauth/authorize?client_id=${hubspotClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=crm.objects.contacts.read%20crm.objects.contacts.write%20timeline`;

      return new Response(JSON.stringify({ authUrl }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'callback') {
      // Step 2: Exchange code for tokens
      const code = url.searchParams.get('code');
      if (!code) {
        throw new Error('No authorization code provided');
      }

      const hubspotClientId = Deno.env.get('HUBSPOT_CLIENT_ID');
      const hubspotClientSecret = Deno.env.get('HUBSPOT_CLIENT_SECRET');
      const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/hubspot-oauth?action=callback`;

      const tokenResponse = await fetch('https://api.hubapi.com/oauth/v1/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: hubspotClientId!,
          client_secret: hubspotClientSecret!,
          redirect_uri: redirectUri,
          code: code,
        }),
      });

      const tokens = await tokenResponse.json();

      // Store tokens in integrations table
      await supabaseClient
        .from('integrations')
        .upsert({
          workspace_id: workspaceId,
          provider: 'hubspot',
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
          is_active: true,
          created_by: user.id,
        });

      console.log('HubSpot integration connected for workspace:', workspaceId);

      return new Response(
        `<html><body><script>window.opener.postMessage({type: 'hubspot-connected'}, '*'); window.close();</script></body></html>`,
        { headers: { ...corsHeaders, 'Content-Type': 'text/html' } }
      );
    }

    if (action === 'sync-click') {
      // Sync click event to HubSpot timeline
      const { clickId } = await req.json();

      // Get integration
      const { data: integration } = await supabaseClient
        .from('integrations')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('provider', 'hubspot')
        .eq('is_active', true)
        .single();

      if (!integration) {
        throw new Error('HubSpot integration not found');
      }

      // Get click data
      const { data: click } = await supabaseClient
        .from('link_clicks')
        .select('*, links(*)')
        .eq('id', clickId)
        .single();

      if (!click) {
        throw new Error('Click not found');
      }

      // Create timeline event in HubSpot
      const timelineEvent = {
        eventTypeId: '1234567', // Replace with your custom timeline event type ID
        email: click.user_agent, // You'd typically have email from conversion tracking
        properties: {
          link_url: click.links.short_url,
          destination: click.links.destination_url,
          device: click.device_type,
          country: click.country,
          city: click.city,
          referrer: click.referrer,
        },
      };

      await fetch('https://api.hubapi.com/crm/v3/timeline/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${integration.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(timelineEvent),
      });

      console.log('Click synced to HubSpot:', clickId);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid action');
  } catch (error) {
    console.error('Error in hubspot-oauth:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
