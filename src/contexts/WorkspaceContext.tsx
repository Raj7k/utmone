import { createContext, useContext, useMemo, ReactNode } from "react";
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
  hasTimedOut: false,
  error: null,
  switchWorkspace: () => {},
  retry: () => {},
};

const WorkspaceContext = createContext<WorkspaceContextType>(DEFAULT_CONTEXT);

/**
 * WorkspaceProvider - Thin wrapper around AppSessionContext
 * Maintains backward compatibility with existing code
 */
export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const { 
    currentWorkspace, 
    workspaces, 
    isReady, 
    isFullyLoaded, 
    error, 
    switchWorkspace, 
    refresh 
  } = useAppSession();

  // Compute loading state - NOT loading if ready (cached) or fully loaded
  const isLoading = !isReady && !isFullyLoaded;
  
  // hasTimedOut is now managed by AppSession, but we keep the interface
  const hasTimedOut = !isLoading && !currentWorkspace && workspaces.length === 0 && isFullyLoaded;

  const contextValue = useMemo(() => ({
    currentWorkspace,
    workspaces,
    isLoading,
    hasTimedOut,
    error,
    switchWorkspace,
    retry: refresh,
  }), [currentWorkspace, workspaces, isLoading, hasTimedOut, error, switchWorkspace, refresh]);

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
