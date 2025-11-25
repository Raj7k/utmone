/**
 * Security Validation Utilities
 * Centralized validation and rate limiting for all user-facing forms
 */

import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

/**
 * Check rate limit before allowing form submissions
 */
export async function checkRateLimit(
  endpoint: string,
  maxRequests: number = 5,
  windowMinutes: number = 60
): Promise<{ allowed: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('check-early-access-rate-limit', {
      body: { endpoint, maxRequests, windowMinutes },
    });

    if (error) {
      console.error('Rate limit check error:', error);
      return { allowed: true }; // Fail open on error
    }

    if (!data.allowed) {
      return {
        allowed: false,
        error: `Too many requests. Please try again in ${windowMinutes} minutes.`,
      };
    }

    return { allowed: true };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return { allowed: true }; // Fail open on error
  }
}

/**
 * Validate link creation input
 */
export const linkCreationSchema = z.object({
  destination_url: z.string().url('Invalid URL format').max(2048, 'URL too long'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100, 'Slug too long')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Slug can only contain letters, numbers, hyphens, and underscores'),
  title: z.string().max(200, 'Title too long').optional(),
  utm_campaign: z.string().max(100, 'Campaign name too long').optional(),
  utm_source: z.string().max(100, 'Source too long').optional(),
  utm_medium: z.string().max(100, 'Medium too long').optional(),
  utm_term: z.string().max(100, 'Term too long').optional(),
  utm_content: z.string().max(100, 'Content too long').optional(),
});

/**
 * Validate QR code creation input
 */
export const qrCreationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  variant: z.string().max(50, 'Variant name too long').optional(),
  link_id: z.string().uuid('Invalid link ID'),
});

/**
 * Validate early access form input
 */
export const earlyAccessSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email('Invalid email address').max(255, 'Email too long'),
  team_size: z.string().min(1, 'Team size is required'),
  company_domain: z.string().max(100, 'Domain too long').optional(),
  role: z.string().max(50, 'Role too long').optional(),
  reason_for_joining: z.string().max(50, 'Reason too long').optional(),
  reason_details: z.string().max(500, 'Details too long').optional(),
  how_heard: z.string().max(100, 'Source too long').optional(),
});

/**
 * Sanitize HTML content to prevent XSS
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate API key format
 */
export function validateApiKeyFormat(key: string): boolean {
  return /^utm_[a-zA-Z0-9]{32}$/.test(key);
}
