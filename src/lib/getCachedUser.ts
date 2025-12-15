/**
 * getCachedUser - Get user ID from cache without network call
 * 
 * This eliminates the redundant supabase.auth.getUser() network calls
 * that were slowing down every mutation in the app.
 * 
 * Usage:
 * - In mutations: Use getCachedUserId() for simple user ID checks
 * - In components: Use useAppSession() hook for reactive user state
 */

import { supabase } from "@/integrations/supabase/client";

// Session cache key - matches AppSessionContext
const SESSION_CACHE_KEY = 'utm_session_cache';

interface CachedSession {
  user: {
    id: string;
    email?: string;
  };
  timestamp: number;
}

/**
 * Get cached user ID synchronously - no network call
 * Falls back to null if no cache exists
 */
export function getCachedUserId(): string | null {
  try {
    const cached = localStorage.getItem(SESSION_CACHE_KEY);
    if (!cached) return null;
    
    const parsed: CachedSession = JSON.parse(cached);
    // 30 minute cache validity
    if (Date.now() - parsed.timestamp > 30 * 60 * 1000) {
      return null;
    }
    
    return parsed.user?.id || null;
  } catch {
    return null;
  }
}

/**
 * Get cached user synchronously - no network call
 * Falls back to null if no cache exists
 */
export function getCachedUser(): { id: string; email?: string } | null {
  try {
    const cached = localStorage.getItem(SESSION_CACHE_KEY);
    if (!cached) return null;
    
    const parsed: CachedSession = JSON.parse(cached);
    // 30 minute cache validity
    if (Date.now() - parsed.timestamp > 30 * 60 * 1000) {
      return null;
    }
    
    return parsed.user || null;
  } catch {
    return null;
  }
}

/**
 * Get user ID with fallback to network call
 * Use this ONLY when you absolutely need a valid user ID
 * and the cached version might be stale
 */
export async function getUserIdWithFallback(): Promise<string | null> {
  // Try cache first
  const cachedId = getCachedUserId();
  if (cachedId) return cachedId;
  
  // Fallback to network call
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}

/**
 * Require authenticated user - throws if not authenticated
 * Use this in mutations that require authentication
 */
export function requireUserId(): string {
  const userId = getCachedUserId();
  if (!userId) {
    throw new Error("Not authenticated");
  }
  return userId;
}
