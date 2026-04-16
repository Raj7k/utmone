/**
 * Supabase client for the MCP server.
 * Uses service-role key for reads, scoped auth for writes.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
      "Set these environment variables before starting the MCP server. " +
      "You can find them in your Supabase project settings → API."
    );
  }

  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return client;
}

/** Helper to build a short URL from domain + slug */
export function buildShortUrl(link: { domain?: string; slug?: string; short_url?: string | null }): string {
  if (link.short_url && link.short_url.trim().length > 0) return link.short_url;
  return `https://${link.domain || "utm.click"}/${link.slug || ""}`;
}
