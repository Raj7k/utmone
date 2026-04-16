# utm.one MCP Server — Setup Guide

## Prerequisites

1. **Node.js 18+** installed on your machine
2. Your **Supabase service_role key** (see Step 1 below)

---

## Step 1: Get Your Supabase Service Role Key

Since you're on Lovable Cloud, your Supabase is managed by Lovable. To get the service_role key:

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Log in with the **same account** linked to your Lovable project
3. Select project: **whgnsmjdubnvbmarnjfx**
4. Go to **Settings → API**
5. Under "Project API keys", copy the **service_role** key (NOT the anon key)

> **Your Supabase URL:** `https://whgnsmjdubnvbmarnjfx.supabase.co`
> (already known from your project)

---

## Step 2: Install the MCP Server

```bash
cd mcp-server
npm install
npm run build
```

This compiles TypeScript to `dist/` — the compiled files are already included, so you can skip the build if you prefer.

---

## Step 3A: Add to Claude Desktop

1. Open Claude Desktop
2. Go to **Settings → Developer → Edit Config** (or manually open the config file):
   - **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

3. Add this to the `mcpServers` section:

```json
{
  "mcpServers": {
    "utmone": {
      "command": "node",
      "args": ["/FULL/PATH/TO/mcp-server/dist/index.js"],
      "env": {
        "SUPABASE_URL": "https://whgnsmjdubnvbmarnjfx.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "YOUR_SERVICE_ROLE_KEY_HERE"
      }
    }
  }
}
```

4. Replace `/FULL/PATH/TO/` with the actual path on your machine
5. Replace `YOUR_SERVICE_ROLE_KEY_HERE` with the key from Step 1
6. **Restart Claude Desktop**

After restart, you'll see a hammer icon in the chat input — click it to see all 10 utm.one tools available.

---

## Step 3B: Add to Claude Code (CLI)

```bash
# Add the MCP server
claude mcp add utmone -- node /FULL/PATH/TO/mcp-server/dist/index.js

# Set environment variables (add to your shell profile: ~/.zshrc or ~/.bashrc)
export SUPABASE_URL="https://whgnsmjdubnvbmarnjfx.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY_HERE"
```

Then in any Claude Code session, the utm.one tools will be available automatically.

---

## Step 4: Verify It Works

In Claude Desktop or Claude Code, try these prompts:

- "Show me a summary of my utm.one workspace"
- "Create a short link for https://utm.one pointing to the homepage"
- "What are my top performing links this week?"

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Tools don't appear | Restart Claude Desktop. Check the config JSON is valid. |
| "Missing SUPABASE_URL" error | Ensure env vars are set in the config (Desktop) or shell (Code) |
| Permission denied errors | Make sure you're using the **service_role** key, not the anon key |
| "Cannot find module" error | Run `npm install && npm run build` in the mcp-server directory |
