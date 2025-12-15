// AppSessionContext - Unified session management with cached defaults
// This context is NEVER undefined - it always provides valid state
import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

// Cache keys
const SESSION_CACHE_KEY = 'utm_session_cache';
const WORKSPACE_CACHE_KEY = 'currentWorkspaceData';
const WORKSPACES_CACHE_KEY = 'utm_workspaces_cache';

interface Workspace {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  plan_tier?: string;
  is_client_workspace?: boolean;
  parent_workspace_id?: string;
  created_at?: string;
  onboarding_completed?: boolean;
}

interface AppSessionState {
  // Auth
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  
  // Workspace
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  
  // Loading
  isReady: boolean; // True when we have enough to render (cached or fresh)
  isFullyLoaded: boolean; // True when fresh data is loaded
  error: Error | null;
  
  // Actions
  switchWorkspace: (workspaceId: string) => void;
  signOut: () => Promise<void>;
  refresh: () => void;
}

// ============================================
// SYNCHRONOUS CACHE READS - Module level
// These execute BEFORE React component mounts
// ============================================

// Cache TTL constant - 30 minutes (must match across all files)
const SESSION_CACHE_TTL = 30 * 60 * 1000;

function getCachedSession(): { user: User | null; accessToken: string | null; timestamp: number } | null {
  try {
    const cached = localStorage.getItem(SESSION_CACHE_KEY);
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    // 30 min expiry - aligned across all auth files
    if (Date.now() - parsed.timestamp > SESSION_CACHE_TTL) {
      localStorage.removeItem(SESSION_CACHE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function getCachedWorkspace(): Workspace | null {
  try {
    const cached = localStorage.getItem(WORKSPACE_CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

function getCachedWorkspaces(): Workspace[] | null {
  try {
    const cached = localStorage.getItem(WORKSPACES_CACHE_KEY);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > 10 * 60 * 1000) return null;
    return data;
  } catch {
    return null;
  }
}

// ============================================
// MODULE-LEVEL CACHE CONSTANTS
// Read synchronously before any React renders
// ============================================
const INITIAL_SESSION = getCachedSession();
const INITIAL_WORKSPACE = getCachedWorkspace();
const INITIAL_WORKSPACES = getCachedWorkspaces();

// ============================================
// DEFAULT CONTEXT VALUE
// Provides valid defaults so context is NEVER undefined
// Uses cached values for instant availability
// ============================================
const DEFAULT_SESSION_STATE: AppSessionState = {
  user: INITIAL_SESSION?.user ?? null,
  session: null,
  isAuthenticated: !!INITIAL_SESSION?.user,
  currentWorkspace: INITIAL_WORKSPACE,
  workspaces: INITIAL_WORKSPACES ?? [],
  isReady: !!(INITIAL_SESSION?.user && INITIAL_WORKSPACE),
  isFullyLoaded: false,
  error: null,
  switchWorkspace: () => {},
  signOut: async () => {},
  refresh: () => {},
};

const AppSessionContext = createContext<AppSessionState>(DEFAULT_SESSION_STATE);

// ============================================
// DYNAMIC CACHE CHECK FUNCTION
// Called at render time, not module load time
// This allows detecting fresh logins within same session
// ============================================
export function checkHasValidCachedAuth(): boolean {
  const session = getCachedSession();
  const workspaceId = localStorage.getItem('currentWorkspaceId');
  return !!(session?.user && workspaceId);
}

// Legacy export for backward compatibility
export const hasValidCachedAuth = !!(INITIAL_SESSION?.user && INITIAL_WORKSPACE);

function cacheSession(session: Session | null): void {
  try {
    if (session?.user) {
      localStorage.setItem(SESSION_CACHE_KEY, JSON.stringify({
        user: session.user,
        accessToken: session.access_token,
        timestamp: Date.now(),
      }));
    } else {
      localStorage.removeItem(SESSION_CACHE_KEY);
    }
  } catch {}
}

function cacheWorkspace(workspace: Workspace | null): void {
  try {
    if (workspace) {
      localStorage.setItem(WORKSPACE_CACHE_KEY, JSON.stringify(workspace));
      localStorage.setItem('currentWorkspaceId', workspace.id);
    }
  } catch {}
}

function cacheWorkspaces(workspaces: Workspace[]): void {
  try {
    localStorage.setItem(WORKSPACES_CACHE_KEY, JSON.stringify({
      data: workspaces,
      timestamp: Date.now(),
    }));
  } catch {}
}

export const AppSessionProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state from cache at MOUNT time (fresh read), with module-level fallback
  const [user, setUser] = useState<User | null>(INITIAL_SESSION?.user ?? null);
  const [session, setSession] = useState<Session | null>(null);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(() => getCachedWorkspace() ?? INITIAL_WORKSPACE);
  const [workspaces, setWorkspaces] = useState<Workspace[]>(INITIAL_WORKSPACES ?? []);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // ============================================
  // DYNAMIC isReady CALCULATION
  // Ready = we have enough auth state to render routes/redirect
  // Workspace readiness is handled by dashboard shell/pages.
  // ============================================
  const isAuthenticated = !!user;
  const isReady = !!user || !!INITIAL_SESSION?.user || isFullyLoaded;

  // Fetch workspaces for a user
  const fetchWorkspaces = useCallback(async (userId: string): Promise<Workspace[]> => {
    try {
      const [ownedResult, memberResult] = await Promise.all([
        supabase.from("workspaces").select("*").eq("owner_id", userId),
        supabase.from("workspace_members").select(`workspace_id, role, workspaces (*)`).eq("user_id", userId),
      ]);

      const owned = ownedResult.data || [];
      const memberWorkspaces = memberResult.data?.map(m => m.workspaces).filter(Boolean) || [];
      return [...owned, ...memberWorkspaces] as Workspace[];
    } catch (err) {
      console.error("[AppSession] Workspace fetch error:", err);
      return [];
    }
  }, []);

  // Main initialization - runs once on mount
  useEffect(() => {
    let isMounted = true;
    
    const initialize = async () => {
      // FAST PATH: If we have valid cached session AND workspace, render immediately
      // Background validation with timeout to prevent stale sessions from causing issues
      if (INITIAL_SESSION?.user && INITIAL_WORKSPACE) {
        // IMPORTANT: Do NOT mark fully loaded yet; validate in background (or timeout)
        const validationTimeout = setTimeout(() => {
          if (!isMounted) return;
          // Timeout means we trust cached data
          setIsFullyLoaded(true);
        }, 3000);

        // Background refresh - non-blocking but handles session expiry
        supabase.auth
          .getSession()
          .then(async ({ data: { session } }) => {
            clearTimeout(validationTimeout);
            if (!isMounted) return;

            if (session?.user) {
              setSession(session);
              cacheSession(session);

              // Refresh workspaces in background
              const freshWorkspaces = await fetchWorkspaces(session.user.id);
              if (isMounted && freshWorkspaces.length > 0) {
                setWorkspaces(freshWorkspaces);
                cacheWorkspaces(freshWorkspaces);

                // Ensure current workspace stays valid
                const savedId = localStorage.getItem("currentWorkspaceId");
                const existing = savedId ? freshWorkspaces.find((w) => w.id === savedId) : null;
                const selected = existing || freshWorkspaces[0];
                setCurrentWorkspace(selected);
                cacheWorkspace(selected);
              }

              setIsFullyLoaded(true);
            } else {
              // Session expired - clear cache and force re-auth
              if (isMounted) {
                setUser(null);
                setSession(null);
                setCurrentWorkspace(null);
                setWorkspaces([]);
                setIsFullyLoaded(true);
                localStorage.removeItem(SESSION_CACHE_KEY);
                localStorage.removeItem(WORKSPACE_CACHE_KEY);
                localStorage.removeItem("currentWorkspaceId");
              }
            }
          })
          .catch((err) => {
            clearTimeout(validationTimeout);
            console.error("[AppSession] Background validation error:", err);
            // On error, trust cached data
            if (isMounted) setIsFullyLoaded(true);
          });

        return;
      }

      // SLOW PATH: No cache - must wait for auth with fallback recovery
      try {
        // First try getSession (uses stored tokens)
        let { data: { session: freshSession }, error: authError } = await supabase.auth.getSession();
        
        // FALLBACK: If no session from getSession, try refreshing from stored refresh token
        if (!freshSession && !authError) {
          console.log("[AppSession] No session from getSession, attempting token refresh...");
          const refreshResult = await supabase.auth.refreshSession();
          if (refreshResult.data.session) {
            freshSession = refreshResult.data.session;
            console.log("[AppSession] Session recovered via refresh token");
          }
        }
        
        if (authError) {
          console.error("[AppSession] Auth error:", authError);
          if (isMounted) {
            setError(authError);
            setIsFullyLoaded(true);
          }
          return;
        }

        if (!freshSession?.user) {
          // Not authenticated - clear everything
          if (isMounted) {
            setUser(null);
            setSession(null);
            setCurrentWorkspace(null);
            setWorkspaces([]);
            setIsFullyLoaded(true);
            localStorage.removeItem(SESSION_CACHE_KEY);
            localStorage.removeItem(WORKSPACE_CACHE_KEY);
            localStorage.removeItem('currentWorkspaceId');
          }
          return;
        }

        // Authenticated - cache and fetch workspaces
        cacheSession(freshSession);
        
        if (isMounted) {
          setUser(freshSession.user);
          setSession(freshSession);
        }

        // Fetch workspaces
        const fetchedWorkspaces = await fetchWorkspaces(freshSession.user.id);
        
        if (isMounted) {
          setWorkspaces(fetchedWorkspaces);
          cacheWorkspaces(fetchedWorkspaces);
          
          // Set current workspace
          if (fetchedWorkspaces.length > 0) {
            const savedId = localStorage.getItem('currentWorkspaceId');
            const existing = savedId ? fetchedWorkspaces.find(w => w.id === savedId) : null;
            const selected = existing || fetchedWorkspaces[0];
            setCurrentWorkspace(selected);
            cacheWorkspace(selected);
          }
          
          setIsFullyLoaded(true);
        }
      } catch (err) {
        console.error("[AppSession] Init error:", err);
        if (isMounted) {
          setError(err as Error);
          setIsFullyLoaded(true);
        }
      }
    };

    initialize();

    // Auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        // Use setTimeout to prevent deadlocks
        setTimeout(() => {
          if (!isMounted) return;
          
          if (newSession?.user) {
            setUser(newSession.user);
            setSession(newSession);
            cacheSession(newSession);
          } else {
            setUser(null);
            setSession(null);
            setCurrentWorkspace(null);
            setWorkspaces([]);
            localStorage.removeItem(SESSION_CACHE_KEY);
            localStorage.removeItem(WORKSPACE_CACHE_KEY);
            localStorage.removeItem('currentWorkspaceId');
          }
        }, 0);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchWorkspaces]);

  const switchWorkspace = useCallback((workspaceId: string) => {
    const workspace = workspaces.find(w => w.id === workspaceId);
    if (workspace) {
      setCurrentWorkspace(workspace);
      cacheWorkspace(workspace);
    }
  }, [workspaces]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setCurrentWorkspace(null);
    setWorkspaces([]);
    localStorage.removeItem(SESSION_CACHE_KEY);
    localStorage.removeItem(WORKSPACE_CACHE_KEY);
    localStorage.removeItem('currentWorkspaceId');
    localStorage.removeItem(WORKSPACES_CACHE_KEY);
  }, []);

  const refresh = useCallback(() => {
    setIsFullyLoaded(false);
    window.location.reload();
  }, []);

  const contextValue = useMemo<AppSessionState>(() => ({
    user,
    session,
    isAuthenticated,
    currentWorkspace,
    workspaces,
    isReady,
    isFullyLoaded,
    error,
    switchWorkspace,
    signOut,
    refresh,
  }), [user, session, isAuthenticated, currentWorkspace, workspaces, isReady, isFullyLoaded, error, switchWorkspace, signOut, refresh]);

  return (
    <AppSessionContext.Provider value={contextValue}>
      {children}
    </AppSessionContext.Provider>
  );
};

// Hook for consuming the context
// Context is NEVER undefined due to default value
export const useAppSession = (): AppSessionState => {
  return useContext(AppSessionContext);
};

// Compatibility exports for gradual migration
export const getCachedUserId = (): string | null => {
  const cached = getCachedSession();
  return cached?.user?.id ?? null;
};

export const getCachedWorkspaceId = (): string | null => {
  try {
    return localStorage.getItem('currentWorkspaceId');
  } catch {
    return null;
  }
};
