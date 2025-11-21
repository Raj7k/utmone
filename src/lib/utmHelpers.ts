import { generateSlugFromTitle } from "./slugify";

/**
 * Generates a UTM campaign name from a link title
 * @param title - The link title
 * @returns A URL-friendly campaign name
 */
export function generateUTMCampaignFromTitle(title: string): string {
  return generateSlugFromTitle(title);
}

/**
 * Suggests a UTM source based on keywords in the title
 * @param title - The link title
 * @returns Suggested UTM source or empty string
 */
export function suggestUTMSource(title: string): string {
  const lower = title.toLowerCase();
  
  // Pattern matching for common sources
  if (lower.includes('linkedin')) return 'linkedin';
  if (lower.includes('twitter') || lower.includes('x.com')) return 'twitter';
  if (lower.includes('facebook') || lower.includes('fb')) return 'facebook';
  if (lower.includes('instagram') || lower.includes('ig')) return 'instagram';
  if (lower.includes('email') || lower.includes('newsletter')) return 'newsletter';
  if (lower.includes('blog')) return 'blog';
  if (lower.includes('website')) return 'website';
  if (lower.includes('youtube') || lower.includes('yt')) return 'youtube';
  if (lower.includes('tiktok')) return 'tiktok';
  
  return ''; // No suggestion
}

/**
 * Suggests a UTM medium based on keywords in the title and source
 * @param title - The link title
 * @param source - The UTM source (if already selected)
 * @returns Suggested UTM medium or empty string
 */
export function suggestUTMMedium(title: string, source: string): string {
  const lower = title.toLowerCase();
  
  // Pattern matching for common mediums
  if (lower.includes('ad') || lower.includes('paid')) return 'cpc';
  if (lower.includes('email')) return 'email';
  if (lower.includes('social') || ['linkedin', 'twitter', 'facebook', 'instagram', 'tiktok'].includes(source)) return 'social';
  if (lower.includes('organic')) return 'organic';
  if (lower.includes('referral')) return 'referral';
  if (lower.includes('banner')) return 'display';
  
  return ''; // No suggestion
}
