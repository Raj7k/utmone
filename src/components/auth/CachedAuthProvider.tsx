import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Cache keys for sessionStorage
const CACHE_KEYS = {
  session: 'utm_cached_session',
  lastCheck: 'utm_auth_last_check',
};

// Cache validity period (5 minutes)
const CACHE_VALIDITY_MS = 5 * 60 * 1000;

/**
 * Check if cached session is still valid
 */
function getCachedSession(): Session | null {
  try {
    const lastCheck = sessionStorage.getItem(CACHE_KEYS.lastCheck);
    if (!lastCheck) return null;
    
    const elapsed = Date.now() - parseInt(lastCheck, 10);
    if (elapsed > CACHE_VALIDITY_MS) {
      // Cache expired
      sessionStorage.removeItem(CACHE_KEYS.session);
      sessionStorage.removeItem(CACHE_KEYS.lastCheck);
      return null;
    }
    
    const cached = sessionStorage.getItem(CACHE_KEYS.session);
    if (!cached) return null;
    
    return JSON.parse(cached) as Session;
  } catch {
    return null;
  }
}

/**
 * Cache session data
 */
function cacheSession(session: Session | null) {
  try {
    if (session) {
      sessionStorage.setItem(CACHE_KEYS.session, JSON.stringify(session));
      sessionStorage.setItem(CACHE_KEYS.lastCheck, Date.now().toString());
    } else {
      sessionStorage.removeItem(CACHE_KEYS.session);
      sessionStorage.removeItem(CACHE_KEYS.lastCheck);
    }
  } catch {
    // Ignore storage errors
  }
}

export function CachedAuthProvider({ children }: { children: ReactNode }) {
  // Initialize from cache for instant render
  const cachedSession = getCachedSession();
  
  const [state, setState] = useState<AuthState>({
    user: cachedSession?.user ?? null,
    session: cachedSession,
    isLoading: !cachedSession, // Only loading if no cache
    isAuthenticated: !!cachedSession,
  });

  const refreshSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("[CachedAuthProvider] Session error:", error);
        cacheSession(null);
        setState({
          user: null,
          session: null,
          isLoading: false,
          isAuthenticated: false,
        });
        return;
      }
      
      cacheSession(session);
      setState({
        user: session?.user ?? null,
        session,
        isLoading: false,
        isAuthenticated: !!session,
      });
    } catch (error) {
      console.error("[CachedAuthProvider] Refresh failed:", error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const signOut = useCallback(async () => {
    cacheSession(null);
    await supabase.auth.signOut();
    setState({
      user: null,
      session: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }, []);

  useEffect(() => {
    // Validate cached session in background
    refreshSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        cacheSession(session);
        setState({
          user: session?.user ?? null,
          session,
          isLoading: false,
          isAuthenticated: !!session,
        });
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshSession]);

  return (
    <AuthContext.Provider value={{ ...state, signOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within CachedAuthProvider");
  }
  return context;
}

/**
 * Hook for quick auth status check (uses cache first)
 */
export function useIsAuthenticated() {
  const { isAuthenticated, isLoading } = useAuthContext();
  return { isAuthenticated, isLoading };
}
