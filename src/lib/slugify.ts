/**
 * Generates a URL-friendly slug from a title string
 * @param title - The title to convert to a slug
 * @returns A lowercase, hyphen-separated slug
 * 
 * @example
 * generateSlugFromTitle("Summer Campaign 2024") // "summer-campaign-2024"
 * generateSlugFromTitle("Product Launch - Q4") // "product-launch-q4"
 * generateSlugFromTitle("Black Friday Sale!!!") // "black-friday-sale"
 */
export function generateSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    // Replace spaces and underscores with hyphens
    .replace(/[\s_]+/g, '-')
    // Remove special characters except hyphens
    .replace(/[^a-z0-9-]/g, '')
    // Remove multiple consecutive hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Limit to 50 characters
    .substring(0, 50);
}
