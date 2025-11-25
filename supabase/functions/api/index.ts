import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { createHash } from 'https://deno.land/std@0.168.0/node/crypto.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Extract and authenticate API key
    const apiKey = req.headers.get('x-api-key') || req.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: { code: 'missing_api_key', message: 'API key is required' } }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Hash the API key to check against database
    const hash = createHash('sha256').update(apiKey).digest('hex');
    
    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('workspace_id, scopes, rate_limit, is_active')
      .eq('key_hash', hash)
      .eq('is_active', true)
      .single();

    if (keyError || !keyData) {
      return new Response(
        JSON.stringify({ error: { code: 'invalid_api_key', message: 'Invalid or expired API key' } }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update last_used_at
    await supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('key_hash', hash);

    // Parse URL and route to appropriate handler
    const url = new URL(req.url);
    const path = url.pathname.replace('/api/', '');
    const method = req.method;

    // Route handlers
    if (path.startsWith('links')) {
      return await handleLinksEndpoint(req, supabase, keyData, path, method);
    } else if (path.startsWith('analytics')) {
      return await handleAnalyticsEndpoint(req, supabase, keyData, path, method);
    }

    return new Response(
      JSON.stringify({ error: { code: 'not_found', message: 'Endpoint not found' } }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('API error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: { code: 'internal_error', message } }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function handleLinksEndpoint(req: Request, supabase: any, keyData: any, path: string, method: string) {
  const { workspace_id, scopes } = keyData;

  // POST /api/links - Create link
  if (method === 'POST' && path === 'links') {
    if (!scopes.includes('links:write')) {
      return new Response(
        JSON.stringify({ error: { code: 'forbidden', message: 'Insufficient permissions' } }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { destination_url, slug, title, domain, utm_campaign, utm_source, utm_medium } = body;

    if (!destination_url || !slug) {
      return new Response(
        JSON.stringify({ error: { code: 'invalid_request', message: 'destination_url and slug are required' } }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get workspace default domain if not provided
    const useDomain = domain || 'utm.one';

    const { data, error } = await supabase
      .from('links')
      .insert({
        workspace_id,
        destination_url,
        slug,
        title: title || destination_url,
        domain: useDomain,
        final_url: destination_url,
        short_url: `https://${useDomain}/${slug}`,
        utm_campaign,
        utm_source,
        utm_medium,
        created_by: workspace_id, // Use workspace_id as fallback
      })
      .select()
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ error: { code: 'create_failed', message: error.message } }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ data }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // GET /api/links - List links
  if (method === 'GET' && path === 'links') {
    if (!scopes.includes('links:read')) {
      return new Response(
        JSON.stringify({ error: { code: 'forbidden', message: 'Insufficient permissions' } }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const perPage = parseInt(url.searchParams.get('per_page') || '50');
    const offset = (page - 1) * perPage;

    const { data, error, count } = await supabase
      .from('links')
      .select('*', { count: 'exact' })
      .eq('workspace_id', workspace_id)
      .order('created_at', { ascending: false })
      .range(offset, offset + perPage - 1);

    if (error) {
      return new Response(
        JSON.stringify({ error: { code: 'query_failed', message: error.message } }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        data,
        meta: {
          page,
          per_page: perPage,
          total: count,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // GET /api/links/:id - Get link details
  const linkIdMatch = path.match(/^links\/([a-zA-Z0-9-]+)$/);
  if (method === 'GET' && linkIdMatch) {
    if (!scopes.includes('links:read')) {
      return new Response(
        JSON.stringify({ error: { code: 'forbidden', message: 'Insufficient permissions' } }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const linkId = linkIdMatch[1];
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .eq('id', linkId)
      .eq('workspace_id', workspace_id)
      .single();

    if (error || !data) {
      return new Response(
        JSON.stringify({ error: { code: 'not_found', message: 'Link not found' } }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // PATCH /api/links/:id - Update link
  if (method === 'PATCH' && linkIdMatch) {
    if (!scopes.includes('links:write')) {
      return new Response(
        JSON.stringify({ error: { code: 'forbidden', message: 'Insufficient permissions' } }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const linkId = linkIdMatch[1];
    const body = await req.json();

    const { data, error } = await supabase
      .from('links')
      .update(body)
      .eq('id', linkId)
      .eq('workspace_id', workspace_id)
      .select()
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ error: { code: 'update_failed', message: error.message } }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // DELETE /api/links/:id - Delete link
  if (method === 'DELETE' && linkIdMatch) {
    if (!scopes.includes('links:write')) {
      return new Response(
        JSON.stringify({ error: { code: 'forbidden', message: 'Insufficient permissions' } }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const linkId = linkIdMatch[1];
    const { error } = await supabase
      .from('links')
      .delete()
      .eq('id', linkId)
      .eq('workspace_id', workspace_id);

    if (error) {
      return new Response(
        JSON.stringify({ error: { code: 'delete_failed', message: error.message } }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Link deleted successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ error: { code: 'not_found', message: 'Endpoint not found' } }),
    { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleAnalyticsEndpoint(req: Request, supabase: any, keyData: any, path: string, method: string) {
  const { workspace_id, scopes } = keyData;

  if (!scopes.includes('analytics:read')) {
    return new Response(
      JSON.stringify({ error: { code: 'forbidden', message: 'Insufficient permissions' } }),
      { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const url = new URL(req.url);

  // GET /api/analytics/summary - Workspace-wide metrics
  if (method === 'GET' && path === 'analytics/summary') {
    const { data: links, error: linksError } = await supabase
      .from('links')
      .select('id, title, short_url, total_clicks, unique_clicks')
      .eq('workspace_id', workspace_id)
      .order('total_clicks', { ascending: false })
      .limit(5);

    const { count: totalLinks } = await supabase
      .from('links')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspace_id);

    const { data: clicksData } = await supabase
      .from('link_clicks')
      .select('id, is_unique')
      .in('link_id', (await supabase.from('links').select('id').eq('workspace_id', workspace_id)).data?.map((l: any) => l.id) || []);

    const totalClicks = clicksData?.length || 0;
    const uniqueVisitors = clicksData?.filter((c: any) => c.is_unique).length || 0;

    return new Response(
      JSON.stringify({
        data: {
          total_links: totalLinks || 0,
          total_clicks: totalClicks,
          unique_visitors: uniqueVisitors,
          top_links: links || [],
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // GET /api/analytics/trends?period=7d|30d|90d - Time-series click data
  if (method === 'GET' && path === 'analytics/trends') {
    const period = url.searchParams.get('period') || '7d';
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase.rpc('get_time_series_analytics', {
      p_workspace_id: workspace_id,
      p_days: days,
    });

    if (error) {
      return new Response(
        JSON.stringify({ error: { code: 'query_failed', message: error.message } }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // GET /api/analytics/devices - Device/browser/OS breakdown
  if (method === 'GET' && path === 'analytics/devices') {
    const { data, error } = await supabase.rpc('get_device_analytics', {
      p_workspace_id: workspace_id,
    });

    if (error) {
      return new Response(
        JSON.stringify({ error: { code: 'query_failed', message: error.message } }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // GET /api/analytics/geography - Country/city click distribution
  if (method === 'GET' && path === 'analytics/geography') {
    const { data, error } = await supabase.rpc('get_geolocation_analytics', {
      p_workspace_id: workspace_id,
    });

    if (error) {
      return new Response(
        JSON.stringify({ error: { code: 'query_failed', message: error.message } }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // GET /api/analytics/campaigns - UTM campaign performance rollups
  if (method === 'GET' && path === 'analytics/campaigns') {
    const { data, error } = await supabase.rpc('get_utm_analytics', {
      p_workspace_id: workspace_id,
    });

    if (error) {
      return new Response(
        JSON.stringify({ error: { code: 'query_failed', message: error.message } }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // GET /api/analytics/heatmap - Hour/day click distribution
  if (method === 'GET' && path === 'analytics/heatmap') {
    const { data: clicks, error } = await supabase
      .from('link_clicks')
      .select('clicked_at')
      .in('link_id', (await supabase.from('links').select('id').eq('workspace_id', workspace_id)).data?.map((l: any) => l.id) || []);

    if (error) {
      return new Response(
        JSON.stringify({ error: { code: 'query_failed', message: error.message } }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Group by hour and day of week
    const heatmap = Array.from({ length: 7 }, () => Array(24).fill(0));
    clicks?.forEach((click: any) => {
      const date = new Date(click.clicked_at);
      const day = date.getDay();
      const hour = date.getHours();
      heatmap[day][hour]++;
    });

    return new Response(
      JSON.stringify({ data: heatmap }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // GET /api/analytics/links/:id - Get link analytics
  const linkAnalyticsMatch = path.match(/^analytics\/links\/([a-zA-Z0-9-]+)$/);
  if (method === 'GET' && linkAnalyticsMatch) {
    const linkId = linkAnalyticsMatch[1];
    
    const { data: clicks, error } = await supabase
      .from('link_clicks')
      .select('*')
      .eq('link_id', linkId)
      .order('clicked_at', { ascending: false })
      .limit(100);

    if (error) {
      return new Response(
        JSON.stringify({ error: { code: 'query_failed', message: error.message } }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ data: clicks }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ error: { code: 'not_found', message: 'Endpoint not found' } }),
    { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
