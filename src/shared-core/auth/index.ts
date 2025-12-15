/**
 * Shared Auth Utilities
 * Safe to import from both marketing and dashboard shells
 * Lightweight auth helpers - NO providers, NO heavy state management
 */

import { supabase } from '@/integrations/supabase/client';

// Simple auth helpers for signin/signup pages
export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(email: string, password: string, metadata?: Record<string, unknown>) {
  return supabase.auth.signUp({ 
    email, 
    password,
    options: metadata ? { data: metadata } : undefined
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function resetPassword(email: string) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
}

export async function getSession() {
  return supabase.auth.getSession();
}

// Lightweight session check - no providers needed
export async function isAuthenticated(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session?.user;
}

// Get user ID from cache (synchronous, no network)
export function getCachedUserId(): string | null {
  try {
    const cached = localStorage.getItem('utm_session_cache');
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    return parsed?.user?.id ?? null;
  } catch {
    return null;
  }
}

// Get workspace ID from cache (synchronous, no network)
export function getCachedWorkspaceId(): string | null {
  try {
    return localStorage.getItem('currentWorkspaceId');
  } catch {
    return null;
  }
}

// Check if user has cached auth (for redirect decisions)
export function hasValidCachedAuth(): boolean {
  try {
    const sessionCache = localStorage.getItem('utm_session_cache');
    if (!sessionCache) return false;
    const parsed = JSON.parse(sessionCache);
    // Check if cache is still valid (15 min expiry)
    if (Date.now() - parsed.timestamp > 15 * 60 * 1000) return false;
    return !!parsed?.user;
  } catch {
    return false;
  }
}
