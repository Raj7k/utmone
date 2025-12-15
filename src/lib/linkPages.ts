import { supabase } from "@/integrations/supabase/client";

// Link page status type - simple string until we add database enum
export type LinkPageStatus = 'draft' | 'published';

// Link page block type - simple string until we add database enum
export type LinkPageBlockType = 'link' | 'header' | 'text' | 'image' | 'divider' | 'social';

// Link page event type - simple string until we add database enum
export type LinkPageEventType = 'page_view' | 'block_click';

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
  bio: string | null;
  theme: string;
  is_published: boolean;
  metadata: Record<string, unknown>;
}

export function filterEnabledBlocks(blocks: LinkPageBlock[]): LinkPageBlock[] {
  return [...blocks]
    .filter(block => block.is_enabled !== false)
    .sort((a, b) => a.order_index - b.order_index);
}

export async function hashVisitorIdentifier(value: string): Promise<string> {
  if (typeof globalThis !== "undefined" && (globalThis as unknown as { crypto?: Crypto }).crypto?.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(value);
    const hashBuffer = await (globalThis as unknown as { crypto: Crypto }).crypto.subtle.digest("SHA-256", data);
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
  // Placeholder - will implement when analytics tracking is needed
  console.log('Link page event:', payload);
}

export async function fetchPublishedPage(slug: string) {
  const { data, error } = await supabase
    .from('link_pages')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  
  if (error) throw error;
  return data as PublicLinkPageResponse | undefined;
}
