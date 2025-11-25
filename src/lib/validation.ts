import { z } from "zod";

// URL validation with proper protocol check
export const urlSchema = z
  .string()
  .min(1, "URL is required")
  .refine((url) => {
    try {
      const parsed = new URL(url);
      return ["http:", "https:"].includes(parsed.protocol);
    } catch {
      return false;
    }
  }, "please enter a valid URL starting with http:// or https://");

// Slug validation (alphanumeric, hyphens, underscores)
export const slugSchema = z
  .string()
  .min(3, "slug must be at least 3 characters")
  .max(50, "slug must be less than 50 characters")
  .regex(/^[a-zA-Z0-9_-]+$/, "slug can only contain letters, numbers, hyphens, and underscores")
  .refine((slug) => !slug.startsWith("-") && !slug.endsWith("-"), "slug cannot start or end with hyphens");

// Email validation
export const emailSchema = z
  .string()
  .min(1, "email is required")
  .email("please enter a valid email address");

// UTM parameter validation
export const utmSchema = z
  .string()
  .max(100, "must be less than 100 characters")
  .regex(/^[a-zA-Z0-9_-]*$/, "can only contain letters, numbers, hyphens, and underscores")
  .optional();

// Domain validation
export const domainSchema = z
  .string()
  .min(1, "domain is required")
  .regex(
    /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/,
    "please enter a valid domain (e.g., example.com)"
  );

// Password validation (for protected links)
export const passwordSchema = z
  .string()
  .min(6, "password must be at least 6 characters")
  .max(100, "password must be less than 100 characters");

// Validation helper functions
export const validateUrl = (url: string): boolean => {
  try {
    urlSchema.parse(url);
    return true;
  } catch {
    return false;
  }
};

export const validateSlug = (slug: string): boolean => {
  try {
    slugSchema.parse(slug);
    return true;
  } catch {
    return false;
  }
};

export const sanitizeSlug = (input: string): string => {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove invalid characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
    .slice(0, 50); // Max 50 characters
};
