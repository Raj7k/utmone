/**
 * MCP Resources — live data that agents can subscribe to.
 */
import { getSupabase, buildShortUrl } from "./supabase.js";

export const resourceDefinitions = [
  {
    uri: "utmone://links/{link_id}",
    name: "Link Details",
    description: "Live link object with current click count, status, UTM parameters, and metadata",
    mimeType: "application/json",
  },
  {
    uri: "utmone://analytics/{workspace_id}/{period}",
    name: "Workspace Analytics",
    description: "Dashboard analytics for a workspace over a time period (7d, 30d, 90d)",
    mimeType: "application/json",
  },
  {
    uri: "utmone://experiment/{experiment_id}",
    name: "Experiment Status",
    description: "Live A/B test statistics with Bayesian probability and recommendation",
    mimeType: "application/json",
  },
  {
    uri: "utmone://campaign/{workspace_id}/{utm_campaign}",
    name: "Campaign Overview",
    description: "All links and aggregate performance for a UTM campaign",
    mimeType: "application/json",
  },
];

export async function handleResource(uri: string): Promise<string> {
  const sb = getSupabase();

  // Parse URI
  const linkMatch = uri.match(/^utmone:\/\/links\/(.+)$/);
  if (linkMatch) {
    const linkId = linkMatch[1];
    const { data, error } = await sb.from("links")
      .select("id, title, description, destination_url, short_url, domain, slug, status, utm_source, utm_medium, utm_campaign, utm_term, utm_content, total_clicks, created_at, updated_at")
      .eq("id", linkId).single();

    if (error) return JSON.stringify({ error: error.message });
    return JSON.stringify({ ...data, short_url: buildShortUrl(data) });
  }

  const analyticsMatch = uri.match(/^utmone:\/\/analytics\/([^/]+)\/(\w+)$/);
  if (analyticsMatch) {
    const [, wsId, period] = analyticsMatch;
    const days = period === "7d" ? 7 : period === "90d" ? 90 : 30;
    const since = new Date(Date.now() - days * 86400000).toISOString();

    const [linksRes, clicksRes] = await Promise.all([
      sb.from("links").select("id, title, slug, domain, short_url, total_clicks, status").eq("workspace_id", wsId).order("total_clicks", { ascending: false }).limit(20),
      sb.from("link_clicks").select("id").eq("workspace_id", wsId).gte("created_at", since),
    ]);

    return JSON.stringify({
      workspace_id: wsId,
      period,
      total_links: (linksRes.data || []).length,
      clicks_in_period: (clicksRes.data || []).length,
      top_links: (linksRes.data || []).slice(0, 5).map(l => ({
        id: l.id, title: l.title, short_url: buildShortUrl(l), clicks: l.total_clicks,
      })),
    });
  }

  const expMatch = uri.match(/^utmone:\/\/experiment\/(.+)$/);
  if (expMatch) {
    const { data, error } = await sb.from("experiments").select("*").eq("id", expMatch[1]).single();
    if (error) return JSON.stringify({ error: error.message });
    return JSON.stringify(data);
  }

  const campMatch = uri.match(/^utmone:\/\/campaign\/([^/]+)\/(.+)$/);
  if (campMatch) {
    const [, wsId, campaign] = campMatch;
    const { data } = await sb.from("links")
      .select("id, title, slug, domain, short_url, total_clicks, utm_source, utm_medium")
      .eq("workspace_id", wsId).eq("utm_campaign", decodeURIComponent(campaign));

    const links = data || [];
    return JSON.stringify({
      campaign: decodeURIComponent(campaign),
      total_links: links.length,
      total_clicks: links.reduce((s, l) => s + (l.total_clicks || 0), 0),
      links: links.map(l => ({ ...l, short_url: buildShortUrl(l) })),
    });
  }

  return JSON.stringify({ error: `Unknown resource URI: ${uri}` });
}
