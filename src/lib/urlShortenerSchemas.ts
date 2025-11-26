/**
 * Zod Validation Schemas for URL Shortener
 * Enterprise-grade input validation
 */

import { z } from 'zod';
import { MAX_URL_LENGTH, MIN_SLUG_LENGTH, MAX_SLUG_LENGTH, SLUG_PATTERN } from './constants';

// Base URL Schema
export const urlSchema = z.object({
  url: z.string()
    .url('Invalid URL format')
    .max(MAX_URL_LENGTH, `URL too long (max ${MAX_URL_LENGTH} characters)`),
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title too long (max 200 characters)'),
  slug: z.string()
    .min(MIN_SLUG_LENGTH, `Slug must be at least ${MIN_SLUG_LENGTH} characters`)
    .max(MAX_SLUG_LENGTH, `Slug too long (max ${MAX_SLUG_LENGTH} characters)`)
    .regex(SLUG_PATTERN, 'Only lowercase letters, numbers, and hyphens allowed'),
  domain: z.string().min(1, 'Domain is required'),
  expires_at: z.string().optional(),
  max_clicks: z.number().positive().optional(),
  fallback_url: z.string().url().optional().or(z.literal('')),
});

// Basic URL Creation
export const basicUrlSchema = z.object({
  url: z.string().url('Invalid URL').max(MAX_URL_LENGTH),
});

// Pro URL Creation with UTM
export const proUrlSchema = urlSchema.extend({
  utm_source: z.string().max(100).optional(),
  utm_medium: z.string().max(100).optional(),
  utm_campaign: z.string().max(100).optional(),
  utm_term: z.string().max(100).optional(),
  utm_content: z.string().max(100).optional(),
  password: z.string().min(6).optional().or(z.literal('')),
  folder_id: z.string().uuid().optional().nullable(),
  tags: z.array(z.string()).optional(),
});

// Ultimate URL Creation with Versioning
export const ultimateUrlSchema = proUrlSchema.extend({
  version: z.number().int().positive().optional(),
  parent_link_id: z.string().uuid().optional().nullable(),
  is_ab_test: z.boolean().optional(),
  duplicate_strategy: z.enum(['smart', 'ask', 'always-new', 'use-existing']).optional(),
});

// Bulk URL Input
export const bulkUrlSchema = z.object({
  urls: z.array(z.string().url()).min(1, 'At least one URL required'),
  domain: z.string().min(1),
  utm_defaults: z.object({
    source: z.string().optional(),
    medium: z.string().optional(),
    campaign: z.string().optional(),
    term: z.string().optional(),
    content: z.string().optional(),
  }).optional(),
  smart_options: z.object({
    auto_alias: z.boolean().optional(),
    remove_query_params: z.boolean().optional(),
    qr_enabled: z.boolean().optional(),
  }).optional(),
});

// URL Update Schema
export const urlUpdateSchema = z.object({
  title: z.string().max(200).optional(),
  destination_url: z.string().url().max(MAX_URL_LENGTH).optional(),
  expires_at: z.string().nullable().optional(),
  max_clicks: z.number().positive().nullable().optional(),
  fallback_url: z.string().url().nullable().optional(),
  password: z.string().min(6).nullable().optional(),
  status: z.enum(['active', 'paused', 'archived']).optional(),
});

// Export Types
export type URLFormData = z.infer<typeof urlSchema>;
export type BasicURLFormData = z.infer<typeof basicUrlSchema>;
export type ProURLFormData = z.infer<typeof proUrlSchema>;
export type UltimateURLFormData = z.infer<typeof ultimateUrlSchema>;
export type BulkURLFormData = z.infer<typeof bulkUrlSchema>;
export type URLUpdateFormData = z.infer<typeof urlUpdateSchema>;
