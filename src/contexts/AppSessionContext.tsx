import { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo, ReactNode } from "react";
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

const AppSessionContext = createContext<AppSessionState | undefined>(undefined);

// Instant cache reads - no async
function getCachedSession(): { user: User | null; accessToken: string | null } | null {
  try {
    const cached = sessionStorage.getItem(SESSION_CACHE_KEY);
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    // 15 min expiry
    if (Date.now() - parsed.timestamp > 15 * 60 * 1000) {
      sessionStorage.removeItem(SESSION_CACHE_KEY);
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

function cacheSession(session: Session | null): void {
  try {
    if (session?.user) {
      sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify({
        user: session.user,
        accessToken: session.access_token,
        timestamp: Date.now(),
      }));
    } else {
      sessionStorage.removeItem(SESSION_CACHE_KEY);
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
  // Read caches synchronously for instant state
  const cachedSession = useRef(getCachedSession());
  const cachedWorkspace = useRef(getCachedWorkspace());
  const cachedWorkspaces = useRef(getCachedWorkspaces());
  
  // State initialized from cache
  const [user, setUser] = useState<User | null>(cachedSession.current?.user ?? null);
  const [session, setSession] = useState<Session | null>(null);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(cachedWorkspace.current);
  const [workspaces, setWorkspaces] = useState<Workspace[]>(cachedWorkspaces.current ?? []);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchInProgress = useRef(false);
  
  // isReady = we have cached data OR fresh data loaded
  const isReady = !!(user || cachedSession.current?.user) || isFullyLoaded;
  const isAuthenticated = !!user;

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
    if (fetchInProgress.current) return;
    fetchInProgress.current = true;
    
    let isMounted = true;
    
    const initialize = async () => {
      try {
        // Single auth call
        const { data: { session: freshSession }, error: authError } = await supabase.auth.getSession();
        
        if (authError) {
          console.error("[AppSession] Auth error:", authError);
          if (isMounted) {
            setError(authError);
            setIsFullyLoaded(true);
          }
          return;
        }

        if (!freshSession?.user) {
          // Not authenticated
          if (isMounted) {
            setUser(null);
            setSession(null);
            setCurrentWorkspace(null);
            setWorkspaces([]);
            setIsFullyLoaded(true);
            // Clear caches
            sessionStorage.removeItem(SESSION_CACHE_KEY);
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
            sessionStorage.removeItem(SESSION_CACHE_KEY);
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
    sessionStorage.removeItem(SESSION_CACHE_KEY);
    localStorage.removeItem(WORKSPACE_CACHE_KEY);
    localStorage.removeItem('currentWorkspaceId');
    localStorage.removeItem(WORKSPACES_CACHE_KEY);
  }, []);

  const refresh = useCallback(() => {
    fetchInProgress.current = false;
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
export const useAppSession = (): AppSessionState => {
  const context = useContext(AppSessionContext);
  if (context === undefined) {
    // Return safe defaults when outside provider (shouldn't happen in normal usage)
    return {
      user: null,
      session: null,
      isAuthenticated: false,
      currentWorkspace: null,
      workspaces: [],
      isReady: false,
      isFullyLoaded: false,
      error: null,
      switchWorkspace: () => {},
      signOut: async () => {},
      refresh: () => {},
    };
  }
  return context;
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
