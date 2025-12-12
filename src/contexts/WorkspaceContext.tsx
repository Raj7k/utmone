import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useClientWorkspaces } from "@/hooks/useClientWorkspaces";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useIsAdmin } from "@/hooks/useIsAdmin";

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

interface WorkspaceContextType {
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  isLoading: boolean;
  hasTimedOut: boolean;
  error: Error | null;
  switchWorkspace: (workspaceId: string) => void;
  retry: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

// Maximum time to wait for workspace data before showing fallback UI
const WORKSPACE_TIMEOUT_MS = 8000;

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const { workspaces = [], isLoading: isQueryLoading, error: workspacesError, refetch } = useClientWorkspaces();
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [queryCompleted, setQueryCompleted] = useState(false);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { data: isAdmin = false } = useIsAdmin();

  // Safety timeout - prevent infinite loading state
  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only set timeout if we're still loading
    if (isQueryLoading && !hasTimedOut) {
      timeoutRef.current = setTimeout(() => {
        console.warn("[WorkspaceContext] Timeout reached after", WORKSPACE_TIMEOUT_MS, "ms - forcing completion");
        setHasTimedOut(true);
        setQueryCompleted(true);
      }, WORKSPACE_TIMEOUT_MS);
    }

    // Clear timeout when loading completes successfully
    if (!isQueryLoading && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isQueryLoading, hasTimedOut]);

  // Check authentication status - defer async work to prevent deadlocks
  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        if (error) {
          console.error("[WorkspaceContext] Auth check error:", error);
          setIsAuthenticated(false);
          return;
        }
        
        setIsAuthenticated(!!session);
      } catch (err) {
        console.error("[WorkspaceContext] Auth check exception:", err);
        if (isMounted) {
          setIsAuthenticated(false);
        }
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // Defer state updates to prevent deadlock
      setTimeout(() => {
        if (!isMounted) return;
        setIsAuthenticated(!!session?.user);
        
        // Force refetch of workspaces on login
        if (session?.user) {
          queryClient.invalidateQueries({ queryKey: ["client-workspaces"] });
        }
      }, 0);
    });
    
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [queryClient]);

  // Initialize current workspace from localStorage or first workspace
  useEffect(() => {
    if (workspaces && workspaces.length > 0 && !currentWorkspace) {
      const savedWorkspaceId = localStorage.getItem("currentWorkspaceId");
      const workspace = savedWorkspaceId
        ? workspaces.find((w) => w.id === savedWorkspaceId)
        : null;
      
      // If saved workspace not found, default to first and clear invalid localStorage
      if (!workspace) {
        localStorage.removeItem("currentWorkspaceId");
        setCurrentWorkspace(workspaces[0]);
        localStorage.setItem("currentWorkspaceId", workspaces[0].id);
      } else {
        setCurrentWorkspace(workspace);
      }
    }
  }, [workspaces, currentWorkspace]);

  // Mark query as completed when loading finishes
  useEffect(() => {
    if (!isQueryLoading && isAuthenticated !== null) {
      setQueryCompleted(true);
    }
  }, [isQueryLoading, isAuthenticated]);

  // Redirect to onboarding if user has no workspaces (with race condition protection)
  useEffect(() => {
    const checkWorkspaces = async () => {
      try {
        // Wait for query to complete
        if (isQueryLoading || isAuthenticated === null || !queryCompleted) return;
        
        // CRITICAL: Don't redirect if already on auth-related paths to prevent loops
        const authPaths = ["/auth", "/signup", "/onboarding", "/auth/callback", "/auth/verify-2fa", "/accept-invite"];
        if (authPaths.some(path => location.pathname.startsWith(path))) return;
        
        // Admin bypass - admins should not be redirected to onboarding
        if (isAdmin) return;
        
        // DISABLED: Auth pages handle onboarding redirect as single source of truth
        // This context should only manage workspace state, not navigation
      } catch (err) {
        console.error("Workspace check error:", err);
      }
    };

    checkWorkspaces();
  }, [workspaces, isQueryLoading, isAuthenticated, queryCompleted, isAdmin, navigate, location.pathname]);

  const switchWorkspace = (workspaceId: string) => {
    const workspace = workspaces.find((w) => w.id === workspaceId);
    if (workspace) {
      setCurrentWorkspace(workspace);
      localStorage.setItem("currentWorkspaceId", workspaceId);
    }
  };

  const retry = () => {
    setHasTimedOut(false);
    setQueryCompleted(false);
    refetch();
  };

  // Combined loading state - false if timed out or query finished
  const isLoading = isQueryLoading && !hasTimedOut;

  return (
    <WorkspaceContext.Provider
      value={{
        currentWorkspace,
        workspaces,
        isLoading,
        hasTimedOut,
        error: workspacesError as Error | null,
        switchWorkspace,
        retry,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

// Safe default for when context is not available (prevents crashes during initialization)
const DEFAULT_CONTEXT: WorkspaceContextType = {
  currentWorkspace: null,
  workspaces: [],
  isLoading: true,
  hasTimedOut: false,
  error: null,
  switchWorkspace: () => {},
  retry: () => {},
};

export const useWorkspaceContext = () => {
  const context = useContext(WorkspaceContext);
  // Return safe defaults instead of throwing - prevents race condition crashes
  if (context === undefined) {
    console.warn("[useWorkspaceContext] Context not available yet, returning defaults");
    return DEFAULT_CONTEXT;
  }
  return context;
};
