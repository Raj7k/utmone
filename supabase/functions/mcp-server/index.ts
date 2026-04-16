import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

/**
 * utm.one MCP Server — Supabase Edge Function
 *
 * Exposes utm.one tools via the MCP Streamable HTTP transport.
 * Runs inside Lovable Cloud with automatic access to SUPABASE_SERVICE_ROLE_KEY.
 *
 * Endpoints:
 *   POST /  — MCP JSON-RPC requests (tools/list, tools/call, resources/list, etc.)
 *   GET  /  — Health check / server info
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type, x-api-key, mcp-session-id',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// ─── Supabase Client ───

function getSupabase() {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );
}

function buildShortUrl(link: Record<string, unknown>): string {
  if (link.short_url && typeof link.short_url === 'string' && link.short_url.trim().length > 0) {
    return link.short_url;
  }
  const domain = (link.domain as string) || 'utm.click';
  const slug = (link.slug as string) || '';
  return `https://${domain}/${slug}`;
}

// ─── Tool Definitions ───

const TOOLS = [
  {
    name: 'create_link',
    description: 'Create a tracked short link with UTM parameters. Returns the short URL, link ID, and QR code URL.',
    inputSchema: {
      type: 'object',
      properties: {
        destination_url: { type: 'string', description: 'The full destination URL to redirect to' },
        title: { type: 'string', description: 'Human-readable title for the link' },
        slug: { type: 'string', description: 'Custom slug (random if omitted)' },
        domain: { type: 'string', description: 'Custom domain (default: utm.click)' },
        workspace_id: { type: 'string', description: 'Workspace ID' },
        utm_source: { type: 'string', description: 'UTM source (e.g. linkedin, newsletter)' },
        utm_medium: { type: 'string', description: 'UTM medium (e.g. social, email, cpc)' },
        utm_campaign: { type: 'string', description: 'UTM campaign name' },
        utm_term: { type: 'string', description: 'UTM term (for paid search)' },
        utm_content: { type: 'string', description: 'UTM content (for A/B testing)' },
      },
      required: ['destination_url', 'workspace_id'],
    },
  },
  {
    name: 'get_link_analytics',
    description: 'Get click analytics for a link with device, geo, browser, and referrer breakdown.',
    inputSchema: {
      type: 'object',
      properties: {
        link_id: { type: 'string', description: 'The link ID to analyze' },
        period: { type: 'string', description: '7d, 30d, or 90d (default: 7d)' },
      },
      required: ['link_id'],
    },
  },
  {
    name: 'get_workspace_summary',
    description: 'Dashboard overview of a workspace — total links, clicks, active experiments, and recent activity.',
    inputSchema: {
      type: 'object',
      properties: {
        workspace_id: { type: 'string', description: 'Workspace to summarize' },
      },
      required: ['workspace_id'],
    },
  },
  {
    name: 'get_campaign_performance',
    description: 'Aggregated campaign analytics broken down by source, medium, and link.',
    inputSchema: {
      type: 'object',
      properties: {
        workspace_id: { type: 'string', description: 'Workspace ID' },
        utm_campaign: { type: 'string', description: 'Campaign name to analyze' },
      },
      required: ['workspace_id', 'utm_campaign'],
    },
  },
  {
    name: 'create_experiment',
    description: 'Set up a Bayesian A/B test between original and variant URLs.',
    inputSchema: {
      type: 'object',
      properties: {
        link_id: { type: 'string', description: 'Link to test (control)' },
        variant_url: { type: 'string', description: 'Alternative destination URL' },
        traffic_split: { type: 'number', description: 'Percentage of traffic to variant (default: 50)' },
        workspace_id: { type: 'string', description: 'Workspace ID' },
      },
      required: ['link_id', 'variant_url', 'workspace_id'],
    },
  },
  {
    name: 'get_experiment_results',
    description: 'Get live Bayesian stats for an A/B test including win probability.',
    inputSchema: {
      type: 'object',
      properties: {
        experiment_id: { type: 'string', description: 'Experiment ID' },
      },
      required: ['experiment_id'],
    },
  },
  {
    name: 'check_link_health',
    description: 'Verify a destination URL is reachable and returns a healthy status code.',
    inputSchema: {
      type: 'object',
      properties: {
        link_id: { type: 'string', description: 'Link ID to check' },
      },
      required: ['link_id'],
    },
  },
  {
    name: 'list_links',
    description: 'List links in a workspace with optional filtering by campaign, source, or status.',
    inputSchema: {
      type: 'object',
      properties: {
        workspace_id: { type: 'string', description: 'Workspace ID' },
        utm_campaign: { type: 'string', description: 'Filter by campaign name' },
        utm_source: { type: 'string', description: 'Filter by source' },
        limit: { type: 'number', description: 'Max results (default: 50)' },
      },
      required: ['workspace_id'],
    },
  },
  {
    name: 'launch_campaign',
    description: 'Compound tool: create multiple tracked links for a campaign across channels in one call.',
    inputSchema: {
      type: 'object',
      properties: {
        destination_url: { type: 'string', description: 'Landing page URL' },
        campaign_name: { type: 'string', description: 'Campaign name (becomes utm_campaign)' },
        channels: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              source: { type: 'string' },
              medium: { type: 'string' },
            },
          },
          description: 'Array of {source, medium} pairs, e.g. [{source:"linkedin",medium:"social"}]',
        },
        workspace_id: { type: 'string', description: 'Workspace ID' },
      },
      required: ['destination_url', 'campaign_name', 'channels', 'workspace_id'],
    },
  },
  {
    name: 'get_smart_insights',
    description: 'AI-generated insights based on recent link and campaign performance.',
    inputSchema: {
      type: 'object',
      properties: {
        workspace_id: { type: 'string', description: 'Workspace ID' },
      },
      required: ['workspace_id'],
    },
  },
];

// ─── Tool Handlers ───

async function handleToolCall(
  name: string,
  args: Record<string, unknown>
): Promise<string> {
  const supabase = getSupabase();

  switch (name) {
    case 'create_link': {
      const slug = (args.slug as string) || crypto.randomUUID().slice(0, 8);
      const domain = (args.domain as string) || 'utm.click';

      const { data, error } = await supabase.from('links').insert({
        destination_url: args.destination_url,
        title: args.title || null,
        slug,
        domain,
        workspace_id: args.workspace_id,
        utm_source: args.utm_source || null,
        utm_medium: args.utm_medium || null,
        utm_campaign: args.utm_campaign || null,
        utm_term: args.utm_term || null,
        utm_content: args.utm_content || null,
      }).select().single();

      if (error) return JSON.stringify({ error: error.message });
      return JSON.stringify({
        link_id: data.id,
        short_url: buildShortUrl(data),
        destination_url: data.destination_url,
        utm_params: {
          source: data.utm_source,
          medium: data.utm_medium,
          campaign: data.utm_campaign,
        },
        created_at: data.created_at,
      });
    }

    case 'get_link_analytics': {
      const period = (args.period as string) || '7d';
      const days = period === '90d' ? 90 : period === '30d' ? 30 : 7;
      const since = new Date(Date.now() - days * 86400000).toISOString();

      const [linkRes, clicksRes] = await Promise.all([
        supabase.from('links').select('*').eq('id', args.link_id).single(),
        supabase.from('link_clicks').select('*').eq('link_id', args.link_id).gte('clicked_at', since),
      ]);

      if (linkRes.error) return JSON.stringify({ error: linkRes.error.message });
      const clicks = clicksRes.data || [];

      const devices: Record<string, number> = {};
      const browsers: Record<string, number> = {};
      const countries: Record<string, number> = {};
      const referrers: Record<string, number> = {};

      for (const c of clicks) {
        const dev = (c.device_type as string) || 'unknown';
        const br = (c.browser as string) || 'unknown';
        const co = (c.country as string) || 'unknown';
        const ref = (c.referrer as string) || 'direct';
        devices[dev] = (devices[dev] || 0) + 1;
        browsers[br] = (browsers[br] || 0) + 1;
        countries[co] = (countries[co] || 0) + 1;
        referrers[ref] = (referrers[ref] || 0) + 1;
      }

      return JSON.stringify({
        link: {
          id: linkRes.data.id,
          short_url: buildShortUrl(linkRes.data),
          destination: linkRes.data.destination_url,
          title: linkRes.data.title,
        },
        period,
        total_clicks: clicks.length,
        breakdown: { devices, browsers, countries, referrers },
      });
    }

    case 'get_workspace_summary': {
      const [linksRes, experimentsRes] = await Promise.all([
        supabase.from('links').select('id, slug, domain, destination_url, title, utm_campaign, created_at, short_url', { count: 'exact' })
          .eq('workspace_id', args.workspace_id).order('created_at', { ascending: false }).limit(10),
        supabase.from('experiments').select('*', { count: 'exact' })
          .eq('workspace_id', args.workspace_id).eq('status', 'running'),
      ]);

      const linkIds = (linksRes.data || []).map((l: Record<string, unknown>) => l.id);
      let totalClicks = 0;
      if (linkIds.length > 0) {
        const { count } = await supabase.from('link_clicks').select('id', { count: 'exact', head: true })
          .in('link_id', linkIds);
        totalClicks = count || 0;
      }

      return JSON.stringify({
        workspace_id: args.workspace_id,
        total_links: linksRes.count || 0,
        total_clicks_recent: totalClicks,
        active_experiments: experimentsRes.count || 0,
        recent_links: (linksRes.data || []).map((l: Record<string, unknown>) => ({
          id: l.id,
          short_url: buildShortUrl(l),
          title: l.title,
          campaign: l.utm_campaign,
        })),
      });
    }

    case 'get_campaign_performance': {
      const { data: links, error } = await supabase.from('links')
        .select('id, slug, domain, destination_url, title, utm_source, utm_medium, short_url')
        .eq('workspace_id', args.workspace_id)
        .eq('utm_campaign', args.utm_campaign);

      if (error) return JSON.stringify({ error: error.message });
      if (!links || links.length === 0) return JSON.stringify({ error: 'No links found for this campaign' });

      const linkIds = links.map((l: Record<string, unknown>) => l.id as string);
      const { data: clicks } = await supabase.from('link_clicks').select('link_id').in('link_id', linkIds);

      const clickCounts: Record<string, number> = {};
      for (const c of (clicks || [])) {
        clickCounts[c.link_id] = (clickCounts[c.link_id] || 0) + 1;
      }

      return JSON.stringify({
        campaign: args.utm_campaign,
        total_links: links.length,
        total_clicks: (clicks || []).length,
        links: links.map((l: Record<string, unknown>) => ({
          id: l.id,
          short_url: buildShortUrl(l),
          title: l.title,
          source: l.utm_source,
          medium: l.utm_medium,
          clicks: clickCounts[l.id as string] || 0,
        })),
      });
    }

    case 'create_experiment': {
      const { data, error } = await supabase.from('experiments').insert({
        link_id: args.link_id,
        variant_url: args.variant_url,
        traffic_split: args.traffic_split || 50,
        workspace_id: args.workspace_id,
        status: 'running',
        name: `Experiment on ${args.link_id}`,
      }).select().single();

      if (error) return JSON.stringify({ error: error.message });
      return JSON.stringify({
        experiment_id: data.id,
        status: 'running',
        link_id: data.link_id,
        variant_url: data.variant_url,
        traffic_split: data.traffic_split,
      });
    }

    case 'get_experiment_results': {
      const { data: exp, error } = await supabase.from('experiments')
        .select('*').eq('id', args.experiment_id).single();

      if (error) return JSON.stringify({ error: error.message });

      // Bayesian calculation (Beta-Binomial)
      const controlClicks = (exp.control_clicks as number) || 0;
      const controlConversions = (exp.control_conversions as number) || 0;
      const variantClicks = (exp.variant_clicks as number) || 0;
      const variantConversions = (exp.variant_conversions as number) || 0;

      const alphaC = 1 + controlConversions;
      const betaC = 1 + controlClicks - controlConversions;
      const alphaV = 1 + variantConversions;
      const betaV = 1 + variantClicks - variantConversions;

      // Approximate probability variant > control using normal approximation
      const meanC = alphaC / (alphaC + betaC);
      const meanV = alphaV / (alphaV + betaV);
      const varC = (alphaC * betaC) / ((alphaC + betaC) ** 2 * (alphaC + betaC + 1));
      const varV = (alphaV * betaV) / ((alphaV + betaV) ** 2 * (alphaV + betaV + 1));
      const z = (meanV - meanC) / Math.sqrt(varC + varV || 1);
      const probVariantWins = 0.5 * (1 + erf(z / Math.SQRT2));

      let recommendation = 'Keep testing — not enough data yet.';
      if (controlClicks + variantClicks > 100) {
        if (probVariantWins > 0.95) recommendation = 'Strong evidence: variant is better. Consider switching.';
        else if (probVariantWins < 0.05) recommendation = 'Strong evidence: control is better. Keep the original.';
        else if (probVariantWins > 0.8) recommendation = 'Variant is likely better, but more data would help.';
        else if (probVariantWins < 0.2) recommendation = 'Control is likely better, but more data would help.';
      }

      return JSON.stringify({
        experiment_id: exp.id,
        status: exp.status,
        control: { clicks: controlClicks, conversions: controlConversions, rate: meanC },
        variant: { clicks: variantClicks, conversions: variantConversions, rate: meanV },
        probability_variant_wins: Math.round(probVariantWins * 1000) / 1000,
        recommendation,
      });
    }

    case 'check_link_health': {
      const { data: link, error } = await supabase.from('links')
        .select('destination_url').eq('id', args.link_id).single();

      if (error) return JSON.stringify({ error: error.message });

      try {
        const resp = await fetch(link.destination_url as string, {
          method: 'HEAD',
          redirect: 'follow',
          signal: AbortSignal.timeout(10000),
        });
        return JSON.stringify({
          url: link.destination_url,
          status: resp.status,
          healthy: resp.status >= 200 && resp.status < 400,
          final_url: resp.url,
        });
      } catch (e) {
        return JSON.stringify({
          url: link.destination_url,
          healthy: false,
          error: e instanceof Error ? e.message : 'Request failed',
        });
      }
    }

    case 'list_links': {
      let query = supabase.from('links')
        .select('id, slug, domain, destination_url, title, utm_source, utm_medium, utm_campaign, created_at, short_url')
        .eq('workspace_id', args.workspace_id)
        .order('created_at', { ascending: false })
        .limit((args.limit as number) || 50);

      if (args.utm_campaign) query = query.eq('utm_campaign', args.utm_campaign);
      if (args.utm_source) query = query.eq('utm_source', args.utm_source);

      const { data, error } = await query;
      if (error) return JSON.stringify({ error: error.message });

      return JSON.stringify({
        count: (data || []).length,
        links: (data || []).map((l: Record<string, unknown>) => ({
          id: l.id,
          short_url: buildShortUrl(l),
          destination: l.destination_url,
          title: l.title,
          campaign: l.utm_campaign,
          source: l.utm_source,
          medium: l.utm_medium,
          created: l.created_at,
        })),
      });
    }

    case 'launch_campaign': {
      const channels = args.channels as Array<{ source: string; medium: string }>;
      const results = [];

      for (const ch of channels) {
        const slug = crypto.randomUUID().slice(0, 8);
        const { data, error } = await supabase.from('links').insert({
          destination_url: args.destination_url,
          title: `${args.campaign_name} — ${ch.source}`,
          slug,
          domain: 'utm.click',
          workspace_id: args.workspace_id,
          utm_source: ch.source,
          utm_medium: ch.medium,
          utm_campaign: args.campaign_name,
        }).select().single();

        if (error) {
          results.push({ source: ch.source, error: error.message });
        } else {
          results.push({
            source: ch.source,
            medium: ch.medium,
            link_id: data.id,
            short_url: buildShortUrl(data),
          });
        }
      }

      return JSON.stringify({
        campaign: args.campaign_name,
        links_created: results.filter((r) => !('error' in r)).length,
        results,
      });
    }

    case 'get_smart_insights': {
      // Aggregate recent data for insights
      const { data: links } = await supabase.from('links')
        .select('id, title, utm_campaign, utm_source, created_at')
        .eq('workspace_id', args.workspace_id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (!links || links.length === 0) {
        return JSON.stringify({ insights: ['No links found. Create some links to get started.'] });
      }

      const linkIds = links.map((l: Record<string, unknown>) => l.id as string);
      const since = new Date(Date.now() - 30 * 86400000).toISOString();
      const { data: clicks } = await supabase.from('link_clicks')
        .select('link_id, clicked_at')
        .in('link_id', linkIds)
        .gte('clicked_at', since);

      const clicksByLink: Record<string, number> = {};
      for (const c of (clicks || [])) {
        clicksByLink[c.link_id] = (clicksByLink[c.link_id] || 0) + 1;
      }

      const insights: string[] = [];
      insights.push(`You have ${links.length} links total with ${(clicks || []).length} clicks in the last 30 days.`);

      // Top link
      const sorted = Object.entries(clicksByLink).sort(([, a], [, b]) => b - a);
      if (sorted.length > 0) {
        const topLink = links.find((l: Record<string, unknown>) => l.id === sorted[0][0]);
        insights.push(`Top performer: "${topLink?.title || sorted[0][0]}" with ${sorted[0][1]} clicks.`);
      }

      // Stale links
      const stale = links.filter((l: Record<string, unknown>) => !clicksByLink[l.id as string]);
      if (stale.length > 5) {
        insights.push(`${stale.length} links have zero clicks in the past 30 days — consider refreshing or archiving them.`);
      }

      // Campaign diversity
      const campaigns = new Set(links.map((l: Record<string, unknown>) => l.utm_campaign).filter(Boolean));
      insights.push(`Active across ${campaigns.size} campaign${campaigns.size === 1 ? '' : 's'}.`);

      return JSON.stringify({ insights });
    }

    default:
      return JSON.stringify({ error: `Unknown tool: ${name}` });
  }
}

// ─── Error function (Gauss) for Bayesian calculation ───
function erf(x: number): number {
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429;
  const p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
}

// ─── MCP JSON-RPC Handler ───

function mcpResponse(id: unknown, result: unknown) {
  return { jsonrpc: '2.0', id, result };
}

function mcpError(id: unknown, code: number, message: string) {
  return { jsonrpc: '2.0', id, error: { code, message } };
}

// ─── Server Info ───

const SERVER_INFO = {
  name: 'utmone',
  version: '0.1.0',
  protocolVersion: '2025-03-26',
  capabilities: {
    tools: { listChanged: false },
  },
};

// ─── Main Handler ───

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const headers = { ...corsHeaders, 'Content-Type': 'application/json' };

  // Health check
  if (req.method === 'GET') {
    return new Response(JSON.stringify({
      name: 'utm.one MCP Server',
      version: '0.1.0',
      status: 'healthy',
      tools: TOOLS.length,
      documentation: 'https://utm.one/docs/mcp',
    }), { headers });
  }

  // MCP JSON-RPC
  if (req.method === 'POST') {
    try {
      const body = await req.json();
      const { id, method, params } = body;

      switch (method) {
        case 'initialize':
          return new Response(JSON.stringify(mcpResponse(id, {
            ...SERVER_INFO,
            instructions: 'utm.one link management and analytics. Use tools to create links, get analytics, run A/B tests, and manage campaigns.',
          })), { headers });

        case 'tools/list':
          return new Response(JSON.stringify(mcpResponse(id, { tools: TOOLS })), { headers });

        case 'tools/call': {
          const toolName = params?.name;
          const toolArgs = params?.arguments || {};
          const result = await handleToolCall(toolName, toolArgs);
          return new Response(JSON.stringify(mcpResponse(id, {
            content: [{ type: 'text', text: result }],
          })), { headers });
        }

        case 'resources/list':
          return new Response(JSON.stringify(mcpResponse(id, { resources: [] })), { headers });

        case 'prompts/list':
          return new Response(JSON.stringify(mcpResponse(id, { prompts: [] })), { headers });

        case 'ping':
          return new Response(JSON.stringify(mcpResponse(id, {})), { headers });

        default:
          return new Response(JSON.stringify(mcpError(id, -32601, `Method not found: ${method}`)), {
            status: 200, // MCP errors use 200 with error in body
            headers,
          });
      }
    } catch (e) {
      return new Response(JSON.stringify(mcpError(null, -32700, 'Parse error')), {
        status: 400,
        headers,
      });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
});
