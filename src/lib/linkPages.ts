import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export type LinkPageStatus = Database["public"]["Enums"]["link_page_status"];
export type LinkPageBlockType = Database["public"]["Enums"]["link_page_block_type"];
export type LinkPageEventType = Database["public"]["Enums"]["link_page_event_type"];

export const LINK_PAGE_SLUG_REGEX = /^[a-z0-9](?:[a-z0-9-]{1,62}[a-z0-9])?$/i;

export function isValidLinkPageSlug(slug: string): boolean {
  if (!slug) return false;
  const trimmed = slug.trim();
  if (trimmed.length < 3 || trimmed.length > 64) return false;
  return LINK_PAGE_SLUG_REGEX.test(trimmed);
}

export interface LinkPageBlock {
  id: string;
  page_id: string;
  type: LinkPageBlockType;
  order_index: number;
  data: Record<string, unknown>;
  is_enabled?: boolean;
}

export interface PublicLinkPageResponse {
  id: string;
  workspace_id: string;
  slug: string;
  title: string;
  description: string | null;
  avatar_url: string | null;
  theme: Record<string, unknown>;
  published_at: string | null;
  blocks: LinkPageBlock[];
}

export function filterEnabledBlocks(blocks: LinkPageBlock[]): LinkPageBlock[] {
  return [...blocks]
    .filter(block => block.is_enabled !== false)
    .sort((a, b) => a.order_index - b.order_index);
}

export async function hashVisitorIdentifier(value: string): Promise<string> {
  if (typeof globalThis !== "undefined" && (globalThis as Crypto).crypto?.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(value);
    const hashBuffer = await (globalThis as Crypto).crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
  }

  const encoded = new TextEncoder().encode(value);
  return btoa(String.fromCharCode(...encoded)).slice(0, 32);
}

export interface LinkPageEventPayload {
  pageId: string;
  blockId?: string;
  eventType: LinkPageEventType;
  ipHash?: string | null;
  userAgentHash?: string | null;
  referrer?: string | null;
  country?: string | null;
}

export async function sendLinkPageEvent(payload: LinkPageEventPayload): Promise<void> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) return;

  const body = {
    p_page_id: payload.pageId,
    p_block_id: payload.blockId ?? null,
    p_event_type: payload.eventType,
    p_ip_hash: payload.ipHash ?? null,
    p_user_agent_hash: payload.userAgentHash ?? null,
    p_referrer: payload.referrer ?? null,
    p_country: payload.country ?? null,
  };

  const endpoint = `${supabaseUrl}/rest/v1/rpc/log_link_page_event`;
  await fetch(endpoint, {
    method: "POST",
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {
    // Swallow logging errors to keep navigation snappy
  });
}

export async function fetchPublishedPage(slug: string) {
  const { data, error } = await supabase.rpc("get_published_link_page", { p_slug: slug });
  if (error) throw error;
  return data?.[0] as PublicLinkPageResponse | undefined;
}
