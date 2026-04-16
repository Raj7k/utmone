/**
 * Normalize a user-entered URL by prepending https:// if no protocol is present.
 * Handles common patterns: "google.com", "www.google.com", "http://..."
 */
export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return trimmed;

  // Already has a protocol
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  // Has a protocol-like prefix (ftp, etc.) — leave as-is
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) return trimmed;

  // Prepend https://
  return `https://${trimmed}`;
}
