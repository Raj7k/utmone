/**
 * MCP Prompts — reusable workflow templates that agents can invoke.
 */

export const promptDefinitions = [
  {
    name: "launch_campaign",
    description:
      "Step-by-step guide to launch a multi-link UTM campaign with consistent naming, QR codes, and tracking. " +
      "Returns a structured plan the agent can execute tool-by-tool.",
    arguments: [
      { name: "campaign_name", description: "Human-readable campaign name (becomes utm_campaign)", required: true },
      { name: "channels", description: "Comma-separated list of channels (e.g. linkedin,email,twitter)", required: true },
      { name: "destination_url", description: "The landing page all links should point to", required: true },
      { name: "workspace_id", description: "Workspace to create links in", required: true },
    ],
  },
  {
    name: "weekly_performance_review",
    description:
      "Generate a weekly marketing performance review. Pulls workspace analytics, identifies top and under-performing " +
      "links, and drafts a summary suitable for a Slack post or email.",
    arguments: [
      { name: "workspace_id", description: "Workspace to analyze", required: true },
      { name: "period", description: "Time period: 7d (default), 30d, or 90d", required: false },
    ],
  },
  {
    name: "ab_test_setup",
    description:
      "Plan and create an A/B test for a link. Walks through hypothesis, variant URLs, traffic split, and " +
      "success metric selection, then creates the experiment.",
    arguments: [
      { name: "link_id", description: "The link to test (control)", required: true },
      { name: "variant_url", description: "Alternative destination URL to test", required: true },
      { name: "hypothesis", description: "What you expect to happen and why", required: false },
    ],
  },
  {
    name: "attribution_report",
    description:
      "Build a multi-touch attribution report for a campaign. Aggregates click data across all campaign links, " +
      "breaks down by source/medium, and identifies the highest-converting channels.",
    arguments: [
      { name: "workspace_id", description: "Workspace to analyze", required: true },
      { name: "utm_campaign", description: "Campaign name to report on", required: true },
      { name: "include_revenue", description: "Include revenue data if available (true/false)", required: false },
    ],
  },
];

export function handlePrompt(
  name: string,
  args: Record<string, string>
): { messages: Array<{ role: string; content: { type: string; text: string } }> } {
  switch (name) {
    case "launch_campaign": {
      const channels = (args.channels || "").split(",").map((c) => c.trim()).filter(Boolean);
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: [
                `## Campaign Launch Plan: ${args.campaign_name}`,
                "",
                `**Destination:** ${args.destination_url}`,
                `**Channels:** ${channels.join(", ")}`,
                `**Workspace:** ${args.workspace_id}`,
                "",
                "### Steps",
                "",
                "1. **Create links** — For each channel, call `create_link` with:",
                ...channels.map(
                  (ch, i) =>
                    `   ${i + 1}. utm_source="${ch}", utm_medium="${inferMedium(ch)}", utm_campaign="${args.campaign_name}"`
                ),
                "",
                "2. **Generate QR codes** — For any physical or event channels, call `generate_qr_code` on the new link IDs.",
                "",
                "3. **Verify** — Call `check_link_health` on each link to confirm destinations are live.",
                "",
                "4. **Set up monitoring** — Subscribe to `utmone://campaign/${args.workspace_id}/${encodeURIComponent(args.campaign_name)}` for live updates.",
                "",
                "5. **Optional: A/B test** — If testing landing pages, call `create_experiment` on the primary link.",
                "",
                "💡 **Pro tip:** Use `launch_campaign` tool to do steps 1-3 in a single call.",
              ].join("\n"),
            },
          },
        ],
      };
    }

    case "weekly_performance_review": {
      const period = args.period || "7d";
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: [
                `## Weekly Performance Review`,
                "",
                `**Workspace:** ${args.workspace_id}`,
                `**Period:** ${period}`,
                "",
                "### Data Collection Steps",
                "",
                `1. Read resource \`utmone://analytics/${args.workspace_id}/${period}\` for the dashboard summary.`,
                "",
                "2. Call `get_workspace_summary` for total links, clicks, and active experiments.",
                "",
                "3. Call `get_smart_insights` for AI-generated observations.",
                "",
                "### Report Structure",
                "",
                "Compile findings into this format:",
                "- **Headline metric:** Total clicks this period vs. previous",
                "- **Top 3 links:** By click volume with % of total",
                "- **Under-performers:** Links with < 5 clicks that are > 7 days old",
                "- **Experiments:** Any active A/B tests and their current probability",
                "- **Recommendations:** 2-3 actionable next steps",
              ].join("\n"),
            },
          },
        ],
      };
    }

    case "ab_test_setup": {
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: [
                `## A/B Test Setup`,
                "",
                `**Control link:** ${args.link_id}`,
                `**Variant URL:** ${args.variant_url}`,
                args.hypothesis ? `**Hypothesis:** ${args.hypothesis}` : "",
                "",
                "### Steps",
                "",
                `1. Read resource \`utmone://links/${args.link_id}\` to get current link details and baseline clicks.`,
                "",
                "2. Call `create_experiment` with:",
                `   - link_id: "${args.link_id}"`,
                `   - variant_url: "${args.variant_url}"`,
                "   - traffic_split: 50 (even split recommended for fastest results)",
                "",
                "3. **Monitor** — Periodically read `utmone://experiment/{experiment_id}` for live Bayesian stats.",
                "",
                "4. **Decision criteria:**",
                "   - Wait for at least 100 clicks per variant",
                "   - Look for > 95% probability of one variant winning",
                "   - Call `get_experiment_results` for the final recommendation",
                "",
                "5. **Act** — Update the original link's destination to the winner.",
              ].join("\n"),
            },
          },
        ],
      };
    }

    case "attribution_report": {
      const includeRevenue = args.include_revenue === "true";
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: [
                `## Attribution Report: ${args.utm_campaign}`,
                "",
                `**Workspace:** ${args.workspace_id}`,
                `**Campaign:** ${args.utm_campaign}`,
                includeRevenue ? "**Revenue tracking:** Enabled" : "",
                "",
                "### Data Collection",
                "",
                `1. Read resource \`utmone://campaign/${args.workspace_id}/${encodeURIComponent(args.utm_campaign)}\` for all campaign links.`,
                "",
                "2. For each link, call `get_link_analytics` to get device, geo, and referrer breakdowns.",
                "",
                "3. Call `get_campaign_performance` for aggregated source/medium performance.",
                "",
                "### Report Structure",
                "",
                "- **Campaign overview:** Total links, total clicks, date range",
                "- **Channel breakdown:** Clicks by utm_source + utm_medium, sorted by volume",
                "- **Top performing link:** Highest CTR with its UTM parameters",
                "- **Device split:** Desktop vs. mobile vs. tablet percentages",
                "- **Geo distribution:** Top 5 countries/cities",
                includeRevenue
                  ? "- **Revenue attribution:** Revenue per channel, ROAS estimate"
                  : "",
                "- **Recommendations:** Which channels to scale, pause, or test",
              ]
                .filter(Boolean)
                .join("\n"),
            },
          },
        ],
      };
    }

    default:
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Unknown prompt: ${name}. Available prompts: launch_campaign, weekly_performance_review, ab_test_setup, attribution_report.`,
            },
          },
        ],
      };
  }
}

/** Infer a reasonable utm_medium from a channel name */
function inferMedium(channel: string): string {
  const map: Record<string, string> = {
    email: "email",
    linkedin: "social",
    twitter: "social",
    facebook: "social",
    instagram: "social",
    tiktok: "social",
    youtube: "video",
    google: "cpc",
    bing: "cpc",
    reddit: "social",
    newsletter: "email",
    blog: "referral",
    partner: "referral",
    podcast: "audio",
    webinar: "event",
    conference: "event",
    qr: "offline",
    print: "offline",
    tv: "broadcast",
    radio: "broadcast",
  };
  return map[channel.toLowerCase()] || "referral";
}
