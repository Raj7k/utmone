import { createContext, useContext, useMemo, useRef, useEffect, ReactNode } from "react";
import { useAppSession } from "@/contexts/AppSessionContext";

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
  isWorkspaceLoading: boolean;
  isRefreshing: boolean;
  hasNoWorkspaces: boolean;
  hasTimedOut: boolean;
  error: Error | null;
  switchWorkspace: (workspaceId: string) => void;
  retry: () => void;
}

// ============================================
// CACHED WORKSPACE FOR DEFAULT VALUE
// Read synchronously at module load
// ============================================
const getCachedWorkspaceSync = (): Workspace | null => {
  try {
    const cached = localStorage.getItem('currentWorkspaceData');
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
};

const CACHED_WORKSPACE = getCachedWorkspaceSync();

// ============================================
// DEFAULT CONTEXT VALUE
// Provides valid defaults so context is NEVER undefined
// ============================================
const DEFAULT_CONTEXT: WorkspaceContextType = {
  currentWorkspace: CACHED_WORKSPACE,
  workspaces: CACHED_WORKSPACE ? [CACHED_WORKSPACE] : [],
  isLoading: !CACHED_WORKSPACE, // Not loading if we have cache
  isWorkspaceLoading: !CACHED_WORKSPACE,
  isRefreshing: false,
  hasNoWorkspaces: false,
  hasTimedOut: false,
  error: null,
  switchWorkspace: () => {},
  retry: () => {},
};

const WorkspaceContext = createContext<WorkspaceContextType>(DEFAULT_CONTEXT);

const cacheWorkspace = (workspace: Workspace | null): void => {
  try {
    if (workspace) {
      localStorage.setItem('currentWorkspaceData', JSON.stringify(workspace));
      localStorage.setItem('currentWorkspaceId', workspace.id);
    }
  } catch {}
};

/**
 * WorkspaceProvider - Thin wrapper around AppSessionContext
 * Maintains backward compatibility with existing code
 */
export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const { 
    currentWorkspace: sessionWorkspace, 
    workspaces, 
    isReady, 
    isFullyLoaded, 
    error, 
    switchWorkspace, 
    refresh 
  } = useAppSession();

  const lastWorkspaceRef = useRef<Workspace | null>(CACHED_WORKSPACE);

  useEffect(() => {
    if (sessionWorkspace) {
      lastWorkspaceRef.current = sessionWorkspace;
      cacheWorkspace(sessionWorkspace);
    }
  }, [sessionWorkspace]);

  const resolvedWorkspace = sessionWorkspace ?? lastWorkspaceRef.current;
  const resolvedWorkspaces = workspaces.length > 0
    ? workspaces
    : (resolvedWorkspace ? [resolvedWorkspace] : []);

  // Compute loading state - NOT loading if ready (cached) or fully loaded
  const isLoading = !isReady && !isFullyLoaded;
  
  // More granular loading states for progressive rendering
  const isWorkspaceLoading = !isFullyLoaded && !resolvedWorkspace;
  const isRefreshing = !isFullyLoaded && !!resolvedWorkspace;
  const hasNoWorkspaces = isFullyLoaded && resolvedWorkspaces.length === 0;
  
  // hasTimedOut is now managed by AppSession, but we keep the interface
  const hasTimedOut = !isLoading && !resolvedWorkspace && resolvedWorkspaces.length === 0 && isFullyLoaded;

  const contextValue = useMemo(() => ({
    currentWorkspace: resolvedWorkspace,
    workspaces: resolvedWorkspaces,
    isLoading,
    isWorkspaceLoading,
    isRefreshing,
    hasNoWorkspaces,
    hasTimedOut,
    error,
    switchWorkspace,
    retry: refresh,
  }), [resolvedWorkspace, resolvedWorkspaces, isLoading, isWorkspaceLoading, isRefreshing, hasNoWorkspaces, hasTimedOut, error, switchWorkspace, refresh]);

  return (
    <WorkspaceContext.Provider value={contextValue}>
      {children}
    </WorkspaceContext.Provider>
  );
};

// Hook for consuming the context
// Context is NEVER undefined due to default value
export const useWorkspaceContext = () => {
  return useContext(WorkspaceContext);
};
