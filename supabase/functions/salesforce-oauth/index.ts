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
      const salesforceClientId = Deno.env.get('SALESFORCE_CLIENT_ID');
      const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/salesforce-oauth?action=callback`;
      
      const authUrl = `https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=${salesforceClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=api%20refresh_token`;

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

      const salesforceClientId = Deno.env.get('SALESFORCE_CLIENT_ID');
      const salesforceClientSecret = Deno.env.get('SALESFORCE_CLIENT_SECRET');
      const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/salesforce-oauth?action=callback`;

      const tokenResponse = await fetch('https://login.salesforce.com/services/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: salesforceClientId!,
          client_secret: salesforceClientSecret!,
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
          provider: 'salesforce',
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          config: { instance_url: tokens.instance_url },
          is_active: true,
          created_by: user.id,
        });

      console.log('Salesforce integration connected for workspace:', workspaceId);

      return new Response(
        `<html><body><script>window.opener.postMessage({type: 'salesforce-connected'}, '*'); window.close();</script></body></html>`,
        { headers: { ...corsHeaders, 'Content-Type': 'text/html' } }
      );
    }

    if (action === 'sync-click') {
      // Sync click event to Salesforce as Task/Activity
      const { clickId } = await req.json();

      // Get integration
      const { data: integration } = await supabaseClient
        .from('integrations')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('provider', 'salesforce')
        .eq('is_active', true)
        .single();

      if (!integration) {
        throw new Error('Salesforce integration not found');
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

      const instanceUrl = integration.config?.instance_url || 'https://na1.salesforce.com';

      // Create Task in Salesforce
      const task = {
        Subject: `Link Click: ${click.links.title}`,
        Description: `User clicked on ${click.links.short_url}\nDestination: ${click.links.destination_url}\nDevice: ${click.device_type}\nLocation: ${click.city}, ${click.country}`,
        Status: 'Completed',
        ActivityDate: new Date(click.clicked_at).toISOString().split('T')[0],
        Type: 'utm.one Link Click',
      };

      await fetch(`${instanceUrl}/services/data/v57.0/sobjects/Task`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${integration.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });

      console.log('Click synced to Salesforce:', clickId);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid action');
  } catch (error) {
    console.error('Error in salesforce-oauth:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
