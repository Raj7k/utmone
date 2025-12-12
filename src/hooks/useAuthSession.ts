import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session, User } from '@supabase/supabase-js';

// Session cache keys
const SESSION_CACHE_KEY = 'utm_session_cache';
const SESSION_CACHE_EXPIRY = 15 * 60 * 1000; // 15 minutes

interface CachedSession {
  user: User | null;
  accessToken: string | null;
  timestamp: number;
}

interface AuthSessionState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
}

// Get cached session from sessionStorage - instant
function getCachedSession(): CachedSession | null {
  try {
    const cached = sessionStorage.getItem(SESSION_CACHE_KEY);
    if (!cached) return null;
    
    const parsed: CachedSession = JSON.parse(cached);
    
    // Check expiry
    if (Date.now() - parsed.timestamp > SESSION_CACHE_EXPIRY) {
      sessionStorage.removeItem(SESSION_CACHE_KEY);
      return null;
    }
    
    return parsed;
  } catch {
    return null;
  }
}

// Cache session to sessionStorage
function cacheSession(session: Session | null): void {
  try {
    if (session?.user) {
      const cached: CachedSession = {
        user: session.user,
        accessToken: session.access_token,
        timestamp: Date.now(),
      };
      sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(cached));
    } else {
      sessionStorage.removeItem(SESSION_CACHE_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}

// Clear session cache
export function clearSessionCache(): void {
  try {
    sessionStorage.removeItem(SESSION_CACHE_KEY);
  } catch {
    // Ignore storage errors
  }
}

// Singleton to share session state across components
let sharedSession: Session | null = null;
let sharedUser: User | null = null;
let sessionFetchPromise: Promise<Session | null> | null = null;
let lastFetchTime = 0;
const FETCH_COOLDOWN = 2000; // 2 seconds between fetches

/**
 * Unified auth session hook - single source of truth
 * Uses in-memory cache, sessionStorage, and deduplicates Supabase calls
 */
export function useAuthSession(): AuthSessionState {
  // Initialize from cache for instant render
  const cachedSession = useRef(getCachedSession());
  
  const [state, setState] = useState<AuthSessionState>(() => ({
    user: cachedSession.current?.user ?? sharedUser,
    session: sharedSession,
    isLoading: cachedSession.current === null && !sharedSession,
    isAuthenticated: !!(cachedSession.current?.user || sharedUser),
    error: null,
  }));

  const fetchSession = useCallback(async (): Promise<Session | null> => {
    // Deduplicate concurrent requests
    if (sessionFetchPromise) {
      return sessionFetchPromise;
    }

    // Cooldown to prevent rapid re-fetching
    const now = Date.now();
    if (now - lastFetchTime < FETCH_COOLDOWN && sharedSession) {
      return sharedSession;
    }

    sessionFetchPromise = (async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[useAuthSession] Session error:', error);
          throw error;
        }

        // Update shared state
        sharedSession = session;
        sharedUser = session?.user ?? null;
        lastFetchTime = Date.now();

        // Cache to sessionStorage
        cacheSession(session);

        return session;
      } catch (err) {
        console.error('[useAuthSession] Fetch failed:', err);
        throw err;
      } finally {
        sessionFetchPromise = null;
      }
    })();

    return sessionFetchPromise;
  }, []);

  useEffect(() => {
    let isMounted = true;

    // If we have cached data, trust it and validate in background
    if (cachedSession.current?.user || sharedUser) {
      setState(prev => ({
        ...prev,
        user: cachedSession.current?.user ?? sharedUser,
        isLoading: false,
        isAuthenticated: true,
      }));
    }

    // Fetch fresh session
    fetchSession()
      .then(session => {
        if (!isMounted) return;
        setState({
          user: session?.user ?? null,
          session,
          isLoading: false,
          isAuthenticated: !!session?.user,
          error: null,
        });
      })
      .catch(error => {
        if (!isMounted) return;
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error as Error,
        }));
      });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // Defer to prevent deadlocks
        setTimeout(() => {
          if (!isMounted) return;
          
          sharedSession = session;
          sharedUser = session?.user ?? null;
          cacheSession(session);
          
          setState({
            user: session?.user ?? null,
            session,
            isLoading: false,
            isAuthenticated: !!session?.user,
            error: null,
          });
        }, 0);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchSession]);

  return state;
}

/**
 * Get cached user ID synchronously - for queries that need workspace ID
 */
export function getCachedUserId(): string | null {
  const cached = getCachedSession();
  return cached?.user?.id ?? sharedUser?.id ?? null;
}

/**
 * Get cached workspace ID from localStorage
 */
export function getCachedWorkspaceId(): string | null {
  try {
    return localStorage.getItem('currentWorkspaceId');
  } catch {
    return null;
  }
}
