/**
 * useAuthSession - Backward compatibility wrapper
 * 
 * This hook now wraps the unified AppSessionContext.
 * Use useAppSession() directly for new code.
 */

import { useAppSession, getCachedUserId, getCachedWorkspaceId } from "@/contexts/AppSessionContext";

// Re-export cache helpers
export { getCachedUserId, getCachedWorkspaceId };

// Legacy clearSessionCache - now clears localStorage
export function clearSessionCache(): void {
  try {
    localStorage.removeItem('utm_session_cache');
  } catch {
    // Ignore storage errors
  }
}

interface AuthSessionState {
  user: import('@supabase/supabase-js').User | null;
  session: import('@supabase/supabase-js').Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
}

/**
 * Unified auth session hook - backward compatible
 * Now wraps useAppSession for single source of truth
 */
export function useAuthSession(): AuthSessionState {
  const { user, session, isAuthenticated, isReady, isFullyLoaded, error } = useAppSession();
  
  // isLoading = NOT ready (no cache) AND not fully loaded
  const isLoading = !isReady && !isFullyLoaded;
  
  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    error,
  };
}
