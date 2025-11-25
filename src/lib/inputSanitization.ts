/**
 * Input Sanitization Utilities
 * 
 * Provides functions to sanitize user input and prevent XSS attacks
 */

/**
 * Sanitize text input by removing potentially harmful characters
 * Use this for any user-provided text that will be displayed
 */
export function sanitizeText(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize URL to prevent javascript: and data: protocol attacks
 */
export function sanitizeUrl(url: string): string | null {
  if (!url) return null;
  
  const trimmedUrl = url.trim().toLowerCase();
  
  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  if (dangerousProtocols.some(protocol => trimmedUrl.startsWith(protocol))) {
    console.warn('Blocked dangerous URL protocol:', url);
    return null;
  }
  
  // Ensure URL starts with http:// or https://
  if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
    return `https://${url.trim()}`;
  }
  
  return url.trim();
}

/**
 * Validate and sanitize email address
 */
export function sanitizeEmail(email: string): string {
  if (!email) return '';
  
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
  
  return email.toLowerCase().trim();
}

/**
 * Sanitize domain name
 */
export function sanitizeDomain(domain: string): string {
  if (!domain) return '';
  
  return domain
    .toLowerCase()
    .trim()
    .replace(/^www\./, '') // Remove www prefix
    .replace(/[^a-z0-9.-]/g, ''); // Remove invalid characters
}

/**
 * Enforce maximum length on text input
 */
export function enforceMaxLength(input: string, maxLength: number): string {
  if (!input) return '';
  return input.slice(0, maxLength);
}

/**
 * Strip HTML tags from input (for plain text fields)
 */
export function stripHtmlTags(input: string): string {
  if (!input) return '';
  return input.replace(/<[^>]*>/g, '');
}
