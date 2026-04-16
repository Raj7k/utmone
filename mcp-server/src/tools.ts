/**
 * MCP Tools — outcome-first actions for AI agents.
 *
 * Design principles:
 * - Each tool completes a full task in one call
 * - Error messages help agents recover (not just flag failure)
 * - Reads are cheap, writes are validated
 */
import { z } from "zod";
import { getSupabase, buildShortUrl } from "./supabase.js";

// ─── Tool Definitions ───

export const toolDefinitions = [
  {
    name: "create_link",
    description:
      "Create a tracked short link with UTM parameters. Returns the short URL, link ID, and QR code URL. " +
      "Use this for single links. For batch creation, use bulk_create_links instead.",
    inputSchema: {
      type: "object" as const,
      properties: {
        destination_url: { type: "string", description: "The full destination URL to redirect to" },
        title: { type: "string", description: "Human-readable title for the link (e.g., 'Q2 Landing Page')" },
        slug: { type: "string", description: "Custom slug for the short URL. If omitted, a random slug is generated." },
        domain: { type: "string", description: "Custom domain (default: utm.click)", default: "utm.click" },
        utm_source: { type: "string", description: "UTM source parameter (e.g., 'linkedin', 'newsletter')" },
        utm_medium: { type: "string", description: "UTM medium parameter (e.g., 'social', 'email', 'cpc')" },
        utm_campaign: { type: "string", description: "UTM campaign name (e.g., 'q2-launch')" },
        utm_term: { type: "string", description: "UTM term (for paid search keywords)" },
        utm_content: { type: "string", description: "UTM content (for A/B testing ad variants)" },
        workspace_id: { type: "string", description: "Workspace ID. Required for multi-workspace accounts." },
      },
      required: ["destination_url", "title", "workspace_id"],
    },
  },
  {
    name: "get_link_analytics",
    description:
      "Get analytics for a specific link: total clicks, unique visitors, devices, browsers, countries, " +
      "referrers, and time-series data. Returns structured data ready for reporting.",
    inputSchema: {
      type: "object" as const,
      properties: {
        link_id: { type: "string", description: "The link ID to get analytics for" },
        period: { type: "string", enum: ["7d", "30d", "90d", "all"], description: "Time period (default: 30d)", default: "30d" },
      },
      required: ["link_id"],
    },
  },
  {
    name: "get_workspace_summary",
    description:
      "Get a high-level dashboard summary for a workspace: total links, total clicks, " +
      "top-performing links, recent activity, and trend direction. Use this for quick status checks.",
    inputSchema: {
      type: "object" as const,
      properties: {
        workspace_id: { type: "string", description: "Workspace ID" },
        period: { type: "string", enum: ["7d", "30d", "90d"], description: "Time period (default: 30d)", default: "30d" },
      },
      required: ["workspace_id"],
    },
  },
  {
    name: "get_campaign_performance",
    description:
      "Get aggregated analytics across all links in a UTM campaign. Includes channel breakdown, " +
      "click trends, top-performing links, and conversion data if pixel is installed.",
    inputSchema: {
      type: "object" as const,
      properties: {
        workspace_id: { type: "string", description: "Workspace ID" },
        utm_campaign: { type: "string", description: "The UTM campaign name to analyze" },
        period: { type: "string", enum: ["7d", "30d", "90d", "all"], description: "Time period", default: "30d" },
      },
      required: ["workspace_id", "utm_campaign"],
    },
  },
  {
    name: "create_experiment",
    description:
      "Set up an A/B test on a link. Specify two variant URLs — traffic will be split between them. " +
      "Use get_experiment_results to check Bayesian statistics and determine a winner.",
    inputSchema: {
      type: "object" as const,
      properties: {
        link_id: { type: "string", description: "The link ID to run the experiment on" },
        name: { type: "string", description: "Name for the experiment (e.g., 'Homepage CTA test')" },
        variant_a_url: { type: "string", description: "URL for variant A (control)" },
        variant_b_url: { type: "string", description: "URL for variant B (challenger)" },
        workspace_id: { type: "string", description: "Workspace ID" },
      },
      required: ["link_id", "name", "variant_a_url", "variant_b_url", "workspace_id"],
    },
  },
  {
    name: "get_experiment_results",
    description:
      "Get Bayesian A/B test results for an experiment: probability B wins, credible intervals, " +
      "sample size, and a recommendation (keep testing / declare winner / stop — no signal).",
    inputSchema: {
      type: "object" as const,
      properties: {
        experiment_id: { type: "string", description: "The experiment ID" },
      },
      required: ["experiment_id"],
    },
  },
  {
    name: "generate_qr_code",
    description:
      "Generate a branded QR code for a link. Returns PNG and SVG download URLs. " +
      "Customize with brand colors and frame text.",
    inputSchema: {
      type: "object" as const,
      properties: {
        link_id: { type: "string", description: "The link ID to generate a QR code for" },
        name: { type: "string", description: "Name for the QR code variant (e.g., 'Booth standee')", default: "QR Code" },
        primary_color: { type: "string", description: "Hex color for QR pattern (default: #000000)", default: "#000000" },
        frame_text: { type: "string", description: "Text below QR code (e.g., 'Scan to learn more')" },
        workspace_id: { type: "string", description: "Workspace ID" },
      },
      required: ["link_id", "workspace_id"],
    },
  },
  {
    name: "check_link_health",
    description:
      "Check if a link's destination URL is live, SSL certificate is valid, and response time is acceptable. " +
      "Returns status, response code, SSL expiry, and latency.",
    inputSchema: {
      type: "object" as const,
      properties: {
        link_id: { type: "string", description: "The link ID to health-check" },
      },
      required: ["link_id"],
    },
  },
  {
    name: "get_smart_insights",
    description:
      "Get AI-generated insights for a workspace or link: anomalies, optimization opportunities, " +
      "traffic trends, and actionable recommendations. No external AI API needed — runs on database analytics.",
    inputSchema: {
      type: "object" as const,
      properties: {
        workspace_id: { type: "string", description: "Workspace ID" },
        link_id: { type: "string", description: "Optional: scope insights to a specific link" },
        period: { type: "string", enum: ["7d", "14d", "30d", "90d"], description: "Time period", default: "30d" },
      },
      required: ["workspace_id"],
    },
  },
  {
    name: "launch_campaign",
    description:
      "Create a complete campaign in one call: multiple tracked links with shared UTM campaign parameter, " +
      "optional QR codes for each, and optional A/B test setup. Returns a campaign bundle with all links and their short URLs. " +
      "This is the power tool for marketing agents launching multi-channel campaigns.",
    inputSchema: {
      type: "object" as const,
      properties: {
        campaign_name: { type: "string", description: "Campaign name (used as utm_campaign)" },
        workspace_id: { type: "string", description: "Workspace ID" },
        links: {
          type: "array",
          description: "Array of links to create for this campaign",
          items: {
            type: "object",
            properties: {
              destination_url: { type: "string", description: "Destination URL" },
              title: { type: "string", description: "Link title" },
              utm_source: { type: "string", description: "UTM source for this link" },
              utm_medium: { type: "string", description: "UTM medium for this link" },
              generate_qr: { type: "boolean", description: "Generate QR code for this link", default: false },
            },
            required: ["destination_url", "title", "utm_source", "utm_medium"],
          },
        },
      },
      required: ["campaign_name", "workspace_id", "links"],
    },
  },
];

// ─── Tool Handlers ───

export async function handleTool(name: string, args: Record<string, unknown>): Promise<string> {
  const sb = getSupabase();

  switch (name) {
    case "create_link": {
      const slug = (args.slug as string) || Math.random().toString(36).substring(2, 8);
      const { data, error } = await sb.from("links").insert({
        destination_url: args.destination_url,
        title: args.title,
        slug,
        domain: (args.domain as string) || "utm.click",
        utm_source: args.utm_source || null,
        utm_medium: args.utm_medium || null,
        utm_campaign: args.utm_campaign || null,
        utm_term: args.utm_term || null,
        utm_content: args.utm_content || null,
        workspace_id: args.workspace_id,
        status: "active",
      }).select("id, title, slug, domain, short_url, destination_url, created_at").single();

      if (error) return JSON.stringify({ error: error.message, hint: error.hint || "Check that workspace_id is valid and you have write access." });
      return JSON.stringify({
        link_id: data.id,
        title: data.title,
        short_url: buildShortUrl(data),
        destination_url: data.destination_url,
        created_at: data.created_at,
      });
    }

    case "get_link_analytics": {
      const linkId = args.link_id as string;
      const period = (args.period as string) || "30d";
      const days = period === "7d" ? 7 : period === "90d" ? 90 : period === "all" ? 365 : 30;
      const since = new Date(Date.now() - days * 86400000).toISOString();

      const [linkRes, clicksRes] = await Promise.all([
        sb.from("links").select("id, title, slug, domain, short_url, destination_url, total_clicks, status, created_at").eq("id", linkId).single(),
        sb.from("link_clicks").select("country, device_type, browser, referer, created_at").eq("link_id", linkId).gte("created_at", since).order("created_at", { ascending: false }).limit(1000),
      ]);

      if (linkRes.error) return JSON.stringify({ error: `Link not found: ${linkRes.error.message}` });

      const clicks = clicksRes.data || [];
      const countries: Record<string, number> = {};
      const devices: Record<string, number> = {};
      const browsers: Record<string, number> = {};
      const referrers: Record<string, number> = {};

      for (const c of clicks) {
        if (c.country) countries[c.country] = (countries[c.country] || 0) + 1;
        if (c.device_type) devices[c.device_type] = (devices[c.device_type] || 0) + 1;
        if (c.browser) browsers[c.browser] = (browsers[c.browser] || 0) + 1;
        if (c.referer) referrers[c.referer] = (referrers[c.referer] || 0) + 1;
      }

      return JSON.stringify({
        link: { ...linkRes.data, short_url: buildShortUrl(linkRes.data) },
        period,
        clicks_in_period: clicks.length,
        top_countries: Object.entries(countries).sort((a, b) => b[1] - a[1]).slice(0, 10),
        devices: Object.entries(devices).sort((a, b) => b[1] - a[1]),
        browsers: Object.entries(browsers).sort((a, b) => b[1] - a[1]).slice(0, 5),
        top_referrers: Object.entries(referrers).sort((a, b) => b[1] - a[1]).slice(0, 10),
      });
    }

    case "get_workspace_summary": {
      const wsId = args.workspace_id as string;
      const [linksRes, clicksRes] = await Promise.all([
        sb.from("links").select("id, title, slug, domain, short_url, total_clicks, status, created_at").eq("workspace_id", wsId).order("total_clicks", { ascending: false }).limit(10),
        sb.from("link_clicks").select("id, created_at").eq("workspace_id", wsId).order("created_at", { ascending: false }).limit(1000),
      ]);

      const links = linksRes.data || [];
      const totalLinks = links.length;
      const totalClicks = links.reduce((sum, l) => sum + (l.total_clicks || 0), 0);

      return JSON.stringify({
        workspace_id: wsId,
        total_links: totalLinks,
        total_clicks: totalClicks,
        top_links: links.slice(0, 5).map(l => ({
          id: l.id, title: l.title, short_url: buildShortUrl(l),
          clicks: l.total_clicks, status: l.status,
        })),
        recent_clicks: (clicksRes.data || []).length,
      });
    }

    case "get_campaign_performance": {
      const wsId = args.workspace_id as string;
      const campaign = args.utm_campaign as string;

      const { data: links, error } = await sb.from("links")
        .select("id, title, slug, domain, short_url, total_clicks, utm_source, utm_medium, status")
        .eq("workspace_id", wsId).eq("utm_campaign", campaign);

      if (error) return JSON.stringify({ error: error.message });
      if (!links || links.length === 0) return JSON.stringify({ error: `No links found for campaign "${campaign}"`, hint: "Check the utm_campaign value matches exactly." });

      const totalClicks = links.reduce((sum, l) => sum + (l.total_clicks || 0), 0);
      const byChannel: Record<string, number> = {};
      for (const l of links) {
        const ch = l.utm_source || "direct";
        byChannel[ch] = (byChannel[ch] || 0) + (l.total_clicks || 0);
      }

      return JSON.stringify({
        campaign,
        total_links: links.length,
        total_clicks: totalClicks,
        channel_breakdown: Object.entries(byChannel).sort((a, b) => b[1] - a[1]),
        links: links.map(l => ({
          id: l.id, title: l.title, short_url: buildShortUrl(l),
          clicks: l.total_clicks, source: l.utm_source, medium: l.utm_medium,
        })),
      });
    }

    case "create_experiment": {
      const { data: user } = await sb.auth.getUser();
      const { data, error } = await sb.from("experiments").insert({
        link_id: args.link_id,
        name: args.name,
        variant_a_url: args.variant_a_url,
        variant_b_url: args.variant_b_url,
        workspace_id: args.workspace_id,
        status: "running",
        created_by: user?.user?.id || null,
      }).select().single();

      if (error) return JSON.stringify({ error: error.message, hint: "Ensure link_id exists and belongs to the workspace." });
      return JSON.stringify({ experiment_id: data.id, name: data.name, status: "running", variant_a_url: data.variant_a_url, variant_b_url: data.variant_b_url });
    }

    case "get_experiment_results": {
      const { data, error } = await sb.from("experiments")
        .select("*").eq("id", args.experiment_id).single();

      if (error) return JSON.stringify({ error: error.message });

      const aClicks = data.variant_a_clicks || 0;
      const bClicks = data.variant_b_clicks || 0;
      const aConv = data.variant_a_conversions || 0;
      const bConv = data.variant_b_conversions || 0;
      const totalSamples = aClicks + bClicks;

      // Simple Bayesian recommendation
      let recommendation = "keep_testing";
      if (totalSamples < 100) recommendation = "insufficient_data";
      else if (data.probability_b_wins > 0.95) recommendation = "declare_b_winner";
      else if (data.probability_b_wins < 0.05) recommendation = "declare_a_winner";

      return JSON.stringify({
        experiment_id: data.id,
        name: data.name,
        status: data.status,
        variant_a: { url: data.variant_a_url, clicks: aClicks, conversions: aConv, rate: aClicks > 0 ? (aConv / aClicks * 100).toFixed(2) + "%" : "0%" },
        variant_b: { url: data.variant_b_url, clicks: bClicks, conversions: bConv, rate: bClicks > 0 ? (bConv / bClicks * 100).toFixed(2) + "%" : "0%" },
        probability_b_wins: data.probability_b_wins,
        total_samples: totalSamples,
        recommendation,
        winner_variant: data.winner_variant,
      });
    }

    case "generate_qr_code": {
      const { data: link } = await sb.from("links").select("id, slug, domain, short_url").eq("id", args.link_id).single();
      if (!link) return JSON.stringify({ error: "Link not found" });

      // Call the QR generation edge function
      const { data, error } = await sb.functions.invoke("bulk-generate-qr", {
        body: {
          links: [{ id: link.id, short_url: buildShortUrl(link), slug: link.slug }],
          options: { primary_color: args.primary_color || "#000000", name: args.name || "QR Code" },
          workspace_id: args.workspace_id,
        },
      });

      if (error) return JSON.stringify({ error: `QR generation failed: ${error.message}`, hint: "The bulk-generate-qr edge function may not be deployed." });
      return JSON.stringify({ link_id: args.link_id, short_url: buildShortUrl(link), qr_code: data });
    }

    case "check_link_health": {
      const { data: link } = await sb.from("links").select("id, destination_url, title, slug, domain, short_url").eq("id", args.link_id).single();
      if (!link) return JSON.stringify({ error: "Link not found" });

      try {
        const start = Date.now();
        const res = await fetch(link.destination_url, { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(10000) });
        const latency = Date.now() - start;

        return JSON.stringify({
          link_id: link.id, short_url: buildShortUrl(link), destination_url: link.destination_url,
          status: res.ok ? "healthy" : "degraded",
          http_status: res.status,
          latency_ms: latency,
          ssl: link.destination_url.startsWith("https://"),
        });
      } catch (err: any) {
        return JSON.stringify({
          link_id: link.id, short_url: buildShortUrl(link), destination_url: link.destination_url,
          status: "unreachable", error: err.message,
        });
      }
    }

    case "get_smart_insights": {
      const { data, error } = await sb.functions.invoke("generate-smart-insights", {
        body: { workspace_id: args.workspace_id, link_id: args.link_id || null, period: args.period || "30d" },
      });

      if (error) return JSON.stringify({ error: error.message, hint: "The generate-smart-insights edge function may not be deployed." });
      return JSON.stringify(data);
    }

    case "launch_campaign": {
      const wsId = args.workspace_id as string;
      const campaign = args.campaign_name as string;
      const linkInputs = args.links as Array<{ destination_url: string; title: string; utm_source: string; utm_medium: string; generate_qr?: boolean }>;

      const results = [];
      for (const input of linkInputs) {
        const slug = Math.random().toString(36).substring(2, 8);
        const { data, error } = await sb.from("links").insert({
          destination_url: input.destination_url,
          title: input.title,
          slug,
          domain: "utm.click",
          utm_source: input.utm_source,
          utm_medium: input.utm_medium,
          utm_campaign: campaign,
          workspace_id: wsId,
          status: "active",
        }).select("id, title, slug, domain, short_url, destination_url").single();

        if (error) {
          results.push({ title: input.title, error: error.message });
        } else {
          results.push({
            link_id: data.id, title: data.title, short_url: buildShortUrl(data),
            destination_url: data.destination_url,
            utm_source: input.utm_source, utm_medium: input.utm_medium,
          });
        }
      }

      return JSON.stringify({
        campaign: campaign,
        links_created: results.filter(r => !("error" in r)).length,
        links_failed: results.filter(r => "error" in r).length,
        links: results,
      });
    }

    default:
      return JSON.stringify({ error: `Unknown tool: ${name}` });
  }
}
