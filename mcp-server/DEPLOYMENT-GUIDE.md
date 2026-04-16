# utm.one MCP Server — Deployment & Publishing Guide

## Architecture Overview

You now have **two versions** of the MCP server:

| Version | Location | Transport | Use Case |
|---------|----------|-----------|----------|
| **Edge Function** | `supabase/functions/mcp-server/` | HTTP (JSON-RPC) | Lovable connector, web clients, any HTTP-based agent |
| **npm Package** | `mcp-server/` | stdio | Claude Desktop, Claude Code, Cursor, MCP Registry |

Both share the same tools and talk to the same Supabase backend. The Edge Function runs inside Lovable Cloud (no keys to manage). The npm package runs locally on a developer's machine.

---

## Part 1: Deploy Edge Function (for Lovable)

### Step 1: Deploy via Lovable

The Edge Function is already in your project at `supabase/functions/mcp-server/index.ts`. To deploy:

1. Open your project in **Lovable**
2. The function will deploy automatically on your next push, OR
3. Prompt Lovable: *"Deploy the mcp-server edge function"*

### Step 2: Test the endpoint

Once deployed, your MCP endpoint will be at:

```
https://whgnsmjdubnvbmarnjfx.supabase.co/functions/v1/mcp-server
```

Test with curl:

```bash
# Health check
curl https://whgnsmjdubnvbmarnjfx.supabase.co/functions/v1/mcp-server

# List tools (MCP JSON-RPC)
curl -X POST https://whgnsmjdubnvbmarnjfx.supabase.co/functions/v1/mcp-server \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'

# Call a tool
curl -X POST https://whgnsmjdubnvbmarnjfx.supabase.co/functions/v1/mcp-server \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"get_workspace_summary","arguments":{"workspace_id":"YOUR_WORKSPACE_ID"}}}'
```

### Step 3: Connect to Lovable as Personal Connector

1. In Lovable, go to **Settings → Connectors → Personal connectors**
2. Click **New MCP server**
3. Enter:
   - **Name:** utm.one
   - **Server URL:** `https://whgnsmjdubnvbmarnjfx.supabase.co/functions/v1/mcp-server`
   - **Authentication:** No authentication (it runs inside your own Supabase)
4. Click **Add & authorize**

Now Lovable's AI can use utm.one tools while building your app! Try prompting:
> "Create a dashboard component that shows utm.one workspace analytics using the MCP tools"

---

## Part 2: Publish to npm (for MCP Registry)

### Step 1: Create an npm account

If you don't have one, go to [npmjs.com/signup](https://www.npmjs.com/signup)

### Step 2: Login and publish

```bash
cd mcp-server

# Login to npm
npm login

# Build
npm run build

# Publish (first time — creates the package)
npm publish --access public
```

Your package will be at: `https://www.npmjs.com/package/utmone-mcp-server`

Anyone can now install it with:

```bash
npx utmone-mcp-server
```

### Step 3: Verify

```bash
# Test install globally
npm install -g utmone-mcp-server

# Run it (will error about missing env vars — that's expected)
SUPABASE_URL=test SUPABASE_SERVICE_ROLE_KEY=test utmone-mcp
```

---

## Part 3: Publish to MCP Registry

### Step 1: Install mcp-publisher

```bash
# macOS
brew install modelcontextprotocol/tap/mcp-publisher

# OR via curl (Linux/macOS)
curl -fsSL https://registry.modelcontextprotocol.io/install.sh | sh
```

### Step 2: Authenticate

```bash
mcp-publisher login
```

This opens a browser for GitHub authentication. Follow the prompts.

### Step 3: Publish

```bash
cd mcp-server

# Validate your server.json
mcp-publisher validate server.json

# Publish to the registry
mcp-publisher publish server.json
```

After publishing, utm.one will appear on [registry.modelcontextprotocol.io](https://registry.modelcontextprotocol.io/) and be discoverable by any MCP-compatible agent.

---

## Part 4: Add to Claude Desktop & Claude Code

### Claude Desktop

Since you're on Lovable Cloud, use the **Edge Function URL** instead of the local stdio server:

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "utmone": {
      "url": "https://whgnsmjdubnvbmarnjfx.supabase.co/functions/v1/mcp-server"
    }
  }
}
```

> Note: If Claude Desktop doesn't support HTTP MCP servers directly, use the npm package with stdio instead (requires Supabase service_role key).

### Claude Code

```bash
# Option A: HTTP endpoint (no keys needed)
claude mcp add utmone --transport http https://whgnsmjdubnvbmarnjfx.supabase.co/functions/v1/mcp-server

# Option B: npm package (needs service_role key)
claude mcp add utmone -- npx utmone-mcp-server
```

---

## Summary: What's Where

```
utm.one project/
├── supabase/functions/mcp-server/     ← Edge Function (HTTP, runs in Lovable Cloud)
│   └── index.ts                       ← 10 tools, MCP JSON-RPC handler
│
├── mcp-server/                        ← npm package (stdio, for local agents)
│   ├── src/                           ← TypeScript source
│   │   ├── index.ts                   ← Entry point (MCP SDK + stdio)
│   │   ├── tools.ts                   ← 10 tool definitions + handlers
│   │   ├── resources.ts               ← 4 resource definitions + handlers
│   │   ├── prompts.ts                 ← 4 workflow prompt templates
│   │   └── supabase.ts                ← Supabase client wrapper
│   ├── dist/                          ← Compiled JS (ready to run)
│   ├── package.json                   ← npm config with mcpName
│   ├── server.json                    ← MCP Registry metadata
│   └── README.md                      ← Usage documentation
```
