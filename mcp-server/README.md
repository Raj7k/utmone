# utm.one MCP Server

An MCP (Model Context Protocol) server that gives AI agents full access to utm.one — link management, analytics, A/B testing, and attribution.

## What agents can do

**10 Tools** — create links, get analytics, run A/B tests, generate QR codes, check link health, get AI insights, and launch full campaigns in a single call.

**4 Resources** — subscribe to live data for links, workspace analytics, experiments, and campaigns.

**4 Prompts** — workflow templates for campaign launches, weekly reviews, A/B test setup, and attribution reports.

## Quick Start

### 1. Install

```bash
cd mcp-server
npm install
npm run build
```

### 2. Configure Environment

You need two environment variables from your Supabase project (Settings > API):

```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="eyJ..."
```

### 3. Add to Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "utmone": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server/dist/index.js"],
      "env": {
        "SUPABASE_URL": "https://your-project.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "eyJ..."
      }
    }
  }
}
```

### 4. Add to Claude Code

```bash
claude mcp add utmone -- node /absolute/path/to/mcp-server/dist/index.js
```

Then set environment variables in your shell profile or `.env`.

### 5. Add to Cursor

In Cursor settings, add an MCP server with:
- **Command:** `node /absolute/path/to/mcp-server/dist/index.js`
- **Environment:** `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

## Tools Reference

| Tool | Description |
|------|-------------|
| `create_link` | Create a tracked short link with UTM parameters |
| `get_link_analytics` | Click analytics with device/geo/browser breakdown |
| `get_workspace_summary` | Dashboard overview — links, clicks, experiments |
| `get_campaign_performance` | Aggregated campaign analytics by source/medium |
| `create_experiment` | Set up a Bayesian A/B test |
| `get_experiment_results` | Live Bayesian stats with win probability |
| `generate_qr_code` | Branded QR code for any link |
| `check_link_health` | Verify destination URL is reachable |
| `get_smart_insights` | AI-generated insights from your data |
| `launch_campaign` | Compound tool: create multiple links + QR codes in one call |

## Resources Reference

| URI Pattern | Description |
|-------------|-------------|
| `utmone://links/{link_id}` | Live link data with click count and UTM params |
| `utmone://analytics/{workspace_id}/{period}` | Dashboard analytics (7d, 30d, 90d) |
| `utmone://experiment/{experiment_id}` | Live A/B test statistics |
| `utmone://campaign/{workspace_id}/{utm_campaign}` | All links and performance for a campaign |

## Prompts Reference

| Prompt | Description |
|--------|-------------|
| `launch_campaign` | Step-by-step campaign launch guide |
| `weekly_performance_review` | Weekly marketing performance report |
| `ab_test_setup` | A/B test planning and creation |
| `attribution_report` | Multi-touch attribution analysis |

## Example Agent Conversations

**Marketing agent:**
> "Create a LinkedIn campaign for our Q2 product launch pointing to https://utm.one/launch, then generate QR codes for the event booth."

**Developer agent:**
> "Check the health of all links in workspace abc-123 and flag any that return 4xx or 5xx errors."

**GTM agent:**
> "Pull this week's performance for workspace abc-123, compare to last week, and draft a summary for the #marketing Slack channel."

## Architecture

```
src/
  index.ts      — Entry point, wires up MCP SDK with stdio transport
  tools.ts      — 10 tool definitions + handlers (Supabase queries)
  resources.ts  — 4 resource definitions + URI-based handlers
  prompts.ts    — 4 workflow prompt templates
  supabase.ts   — Supabase client singleton + URL helpers
```

## License

MIT
