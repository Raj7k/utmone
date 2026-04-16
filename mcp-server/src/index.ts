#!/usr/bin/env node
/**
 * utm.one MCP Server
 *
 * Gives AI agents full access to link management, analytics,
 * A/B testing, and attribution via the Model Context Protocol.
 *
 * Transport: stdio (compatible with Claude Desktop, Claude Code, Cursor, etc.)
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { toolDefinitions, handleTool } from "./tools.js";
import { resourceDefinitions, handleResource } from "./resources.js";
import { promptDefinitions, handlePrompt } from "./prompts.js";

// ─── Server Setup ───

const server = new Server(
  {
    name: "utmone",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  }
);

// ─── Tools ───

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: toolDefinitions,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    const result = await handleTool(name, (args as Record<string, unknown>) || {});
    return {
      content: [{ type: "text", text: result }],
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      content: [{ type: "text", text: JSON.stringify({ error: message }) }],
      isError: true,
    };
  }
});

// ─── Resources ───

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: resourceDefinitions,
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  const data = await handleResource(uri);
  return {
    contents: [
      {
        uri,
        mimeType: "application/json",
        text: data,
      },
    ],
  };
});

// ─── Prompts ───

server.setRequestHandler(ListPromptsRequestSchema, async () => ({
  prompts: promptDefinitions,
}));

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  return handlePrompt(name, (args as Record<string, string>) || {});
});

// ─── Start ───

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("utm.one MCP server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
