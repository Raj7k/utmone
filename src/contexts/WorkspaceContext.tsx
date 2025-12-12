import { createContext, useContext, useMemo, ReactNode, useCallback } from "react";
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

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

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
