import { z } from 'zod';
import { validateEmailSmart } from './emailValidator';

/**
 * Custom Zod refinement for smart email validation
 * Use this in your zod schemas for email fields
 */
export const smartEmailSchema = z.string()
  .trim()
  .min(1, "email is required")
  .max(255, "email is too long")
  .refine((email) => {
    const result = validateEmailSmart(email, { allowDisposable: true });
    return result.isValid || !!result.suggestion; // Allow suggestions or soft disposable warnings
  }, {
    message: "please enter a valid email address"
  })
  .refine((email) => {
    const result = validateEmailSmart(email);
    return result.isValid;
  }, (email) => {
    const result = validateEmailSmart(email);
    return { message: result.error || "invalid email" };
  });

/**
 * Strict version that blocks all invalid emails including typos
 */
export const strictEmailSchema = z.string()
  .trim()
  .min(1, "email is required")
  .max(255, "email is too long")
  .refine((email) => {
    const result = validateEmailSmart(email);
    return result.isValid;
  }, (email) => {
    const result = validateEmailSmart(email);
    return { message: result.error || "please enter a valid email address" };
  });
