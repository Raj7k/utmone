/**
 * Shared CORS headers for utm.one Edge Functions.
 *
 * Previous version used `Access-Control-Allow-Origin: *` which let any website
 * call our authenticated edge functions with the user's JWT (CSRF risk).
 *
 * This version uses an allowlist. Requests from listed origins get their
 * origin echoed back (required for credentialed requests). Everything else
 * falls back to the canonical app origin.
 *
 * The allowlist can be extended at runtime via the CORS_ALLOWED_ORIGINS env
 * var (comma-separated). Useful for adding preview/staging origins without
 * code changes.
 */

const DEFAULT_ALLOWED = [
  'https://utm.one',
  'https://www.utm.one',
  'https://app.utm.one',
  'https://utm.click',
  'https://www.utm.click',
];

// Preview environments — development only. Remove or narrow once production
// is on a stable custom domain.
const PREVIEW_PATTERNS: RegExp[] = [
  /^https:\/\/[a-z0-9-]+--[a-z0-9-]+\.lovable\.app$/i,
  /^https:\/\/[a-z0-9-]+\.lovableproject\.com$/i,
  /^https:\/\/[a-z0-9-]+\.vercel\.app$/i,
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/,
];

function getAllowedOrigins(): string[] {
  const envAllowed = (typeof Deno !== 'undefined' ? Deno.env.get('CORS_ALLOWED_ORIGINS') : undefined) || '';
  const fromEnv = envAllowed.split(',').map(s => s.trim()).filter(Boolean);
  return [...DEFAULT_ALLOWED, ...fromEnv];
}

function isAllowedOrigin(origin: string): boolean {
  if (!origin) return false;
  if (getAllowedOrigins().includes(origin)) return true;
  return PREVIEW_PATTERNS.some(re => re.test(origin));
}

/**
 * Build CORS headers appropriate for the incoming request.
 * Pass `req.headers.get('origin')` when available so we can echo it back.
 */
export function buildCorsHeaders(origin?: string | null): Record<string, string> {
  const safeOrigin = origin && isAllowedOrigin(origin) ? origin : DEFAULT_ALLOWED[0];
  return {
    'Access-Control-Allow-Origin': safeOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

/**
 * Back-compat export. Every edge function imports this today. We can't change
 * the signature without editing 100+ files, so we keep it as a constant map
 * but swap `*` for the canonical app origin. That alone closes the CSRF hole
 * for authenticated endpoints. New code should call `buildCorsHeaders(origin)`
 * instead so it gets full per-origin support.
 */
export const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': DEFAULT_ALLOWED[0],
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Vary': 'Origin',
};
