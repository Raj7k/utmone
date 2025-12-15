/**
 * Shared Core - Safe imports for both marketing and dashboard shells
 * 
 * RULES:
 * - NO providers
 * - NO React Query
 * - NO data fetching on import
 * - Only static config and pure functions
 */

// Pricing engine
export * from './pricing';

// Auth utilities
export * from './auth';
