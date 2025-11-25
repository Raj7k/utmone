/**
 * Security Headers for utm.one Edge Functions
 * 
 * This utility provides standardized security headers for all edge functions
 * to protect against common web vulnerabilities.
 */

// CORS headers for cross-origin requests
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const securityHeaders = {
  // Content Security Policy - Prevent XSS and injection attacks
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "frame-ancestors 'none'",
  ].join('; '),
  
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Control referrer information
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions policy - disable unnecessary browser features
  'Permissions-Policy': [
    'accelerometer=()',
    'camera=()',
    'geolocation=()',
    'gyroscope=()',
    'magnetometer=()',
    'microphone=()',
    'payment=()',
    'usb=()',
  ].join(', '),
  
  // Strict Transport Security (HTTPS only)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
};

/**
 * Merge security headers with CORS headers and other custom headers
 */
export function getResponseHeaders(additionalHeaders: Record<string, string> = {}): Record<string, string> {
  return {
    ...securityHeaders,
    ...additionalHeaders,
  };
}

/**
 * Get security headers for CORS-enabled responses
 */
export function getSecureCorsHeaders(additionalHeaders: Record<string, string> = {}): Record<string, string> {
  return {
    ...corsHeaders,
    ...securityHeaders,
    ...additionalHeaders,
  };
}
