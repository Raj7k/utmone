import { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo, ReactNode, startTransition } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useClientWorkspaces } from "@/hooks/useClientWorkspaces";
import { useAuthSession, getCachedWorkspaceId } from "@/hooks/useAuthSession";
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

// Reduced timeout for faster perceived performance
const WORKSPACE_TIMEOUT_MS = 2000;

// Get cached workspace from localStorage for instant render
function getCachedWorkspace(): Workspace | null {
  try {
    const cached = localStorage.getItem('currentWorkspaceData');
    if (!cached) return null;
    return JSON.parse(cached);
  } catch {
    return null;
  }
}

function cacheWorkspace(workspace: Workspace | null): void {
  try {
    if (workspace) {
      localStorage.setItem('currentWorkspaceData', JSON.stringify(workspace));
      localStorage.setItem('currentWorkspaceId', workspace.id);
    }
  } catch {
    // Ignore storage errors
  }
}

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  // Use unified auth session - no duplicate auth calls
  const { isAuthenticated, user } = useAuthSession();
  
  // Workspaces query - starts immediately with cached data
  const { workspaces = [], isLoading: isQueryLoading, error: workspacesError, refetch } = useClientWorkspaces();
  
  // Initialize from cache for instant render
  const cachedWorkspace = useRef(getCachedWorkspace());
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(cachedWorkspace.current);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { data: isAdmin = false } = useIsAdmin();

  // Safety timeout - reduced for faster failure
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (isQueryLoading && !hasTimedOut && !cachedWorkspace.current) {
      timeoutRef.current = setTimeout(() => {
        console.warn("[WorkspaceContext] Timeout - forcing completion");
        setHasTimedOut(true);
      }, WORKSPACE_TIMEOUT_MS);
    }

    if (!isQueryLoading && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isQueryLoading, hasTimedOut]);

  // Initialize workspace when data arrives - use startTransition for non-urgent updates
  useEffect(() => {
    if (workspaces.length > 0 && !currentWorkspace) {
      const savedWorkspaceId = getCachedWorkspaceId();
      const workspace = savedWorkspaceId
        ? workspaces.find((w) => w.id === savedWorkspaceId)
        : null;
      
      startTransition(() => {
        if (!workspace) {
          localStorage.removeItem("currentWorkspaceId");
          setCurrentWorkspace(workspaces[0]);
          cacheWorkspace(workspaces[0]);
        } else {
          setCurrentWorkspace(workspace);
          cacheWorkspace(workspace);
        }
      });
    } else if (workspaces.length > 0 && currentWorkspace) {
      // Validate cached workspace is still valid
      const stillValid = workspaces.some(w => w.id === currentWorkspace.id);
      if (!stillValid) {
        startTransition(() => {
          setCurrentWorkspace(workspaces[0]);
          cacheWorkspace(workspaces[0]);
        });
      }
    }
  }, [workspaces, currentWorkspace]);

  // Invalidate workspaces on auth change
  useEffect(() => {
    if (user) {
      queryClient.invalidateQueries({ queryKey: ["client-workspaces"] });
    }
  }, [user?.id, queryClient]);

  const switchWorkspace = useCallback((workspaceId: string) => {
    const workspace = workspaces.find((w) => w.id === workspaceId);
    if (workspace) {
      setCurrentWorkspace(workspace);
      cacheWorkspace(workspace);
    }
  }, [workspaces]);

  const retry = useCallback(() => {
    setHasTimedOut(false);
    refetch();
  }, [refetch]);

  // Loading is false if we have cached workspace OR query finished
  const isLoading = (isQueryLoading && !cachedWorkspace.current && !hasTimedOut);

  const contextValue = useMemo(() => ({
    currentWorkspace,
    workspaces,
    isLoading,
    hasTimedOut,
    error: workspacesError as Error | null,
    switchWorkspace,
    retry,
  }), [currentWorkspace, workspaces, isLoading, hasTimedOut, workspacesError, switchWorkspace, retry]);

  return (
    <WorkspaceContext.Provider value={contextValue}>
      {children}
    </WorkspaceContext.Provider>
  );
};

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
  if (context === undefined) {
    console.warn("[useWorkspaceContext] Context not available yet");
    return DEFAULT_CONTEXT;
  }
  return context;
};
