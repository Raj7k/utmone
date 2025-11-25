import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = req.headers.get('x-api-key');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ errors: [{ message: 'Missing API key' }] }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Validate API key and get workspace
    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('workspace_id, is_active')
      .eq('key_prefix', apiKey.split('_')[1])
      .single();

    if (keyError || !keyData?.is_active) {
      return new Response(
        JSON.stringify({ errors: [{ message: 'Invalid API key' }] }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const workspaceId = keyData.workspace_id;
    const { query, variables } = await req.json();

    // Simple GraphQL resolver
    const result = await resolveGraphQL(query, variables, workspaceId, supabase);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('GraphQL error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ errors: [{ message }] }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function resolveGraphQL(query: string, variables: any, workspaceId: string, supabase: any) {
  // Parse query to determine operation
  if (query.includes('links')) {
    const page = variables?.page || 1;
    const perPage = variables?.perPage || 50;
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const { data, error } = await supabase
      .from('links')
      .select('id, title, short_url, destination_url, total_clicks, unique_clicks, created_at')
      .eq('workspace_id', workspaceId)
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data: { links: data } };
  }

  if (query.includes('link(') && variables?.id) {
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .eq('id', variables.id)
      .eq('workspace_id', workspaceId)
      .single();

    if (error) throw error;

    return { data: { link: data } };
  }

  if (query.includes('linkAnalytics') && variables?.id) {
    const { data: link, error: linkError } = await supabase
      .from('links')
      .select('total_clicks, unique_clicks')
      .eq('id', variables.id)
      .eq('workspace_id', workspaceId)
      .single();

    if (linkError) throw linkError;

    const { data: clicks, error: clicksError } = await supabase
      .from('link_clicks')
      .select('device_type, country, browser, os')
      .eq('link_id', variables.id);

    if (clicksError) throw clicksError;

    const devices = clicks.reduce((acc: any, click: any) => {
      const device = click.device_type || 'unknown';
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {});

    const countries = clicks.reduce((acc: any, click: any) => {
      const country = click.country || 'unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {});

    return {
      data: {
        linkAnalytics: {
          totalClicks: link.total_clicks,
          uniqueClicks: link.unique_clicks,
          devices,
          countries
        }
      }
    };
  }

  if (query.includes('createLink')) {
    const input = variables?.input;
    if (!input) throw new Error('Missing input');

    const { data, error } = await supabase
      .from('links')
      .insert({
        workspace_id: workspaceId,
        title: input.title,
        destination_url: input.destination_url,
        domain: input.domain || 'utm.one',
        path: input.path || 'go',
        slug: input.slug,
        utm_source: input.utm_source,
        utm_medium: input.utm_medium,
        utm_campaign: input.utm_campaign,
        utm_term: input.utm_term,
        utm_content: input.utm_content,
        created_by: workspaceId // Using workspace_id as fallback
      })
      .select()
      .single();

    if (error) throw error;

    return { data: { createLink: data } };
  }

  throw new Error('Unknown query');
}
