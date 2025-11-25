import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useClientWorkspaces } from "@/hooks/useClientWorkspaces";

interface Workspace {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  is_client_workspace?: boolean;
  parent_workspace_id?: string;
  created_at?: string;
  onboarding_completed?: boolean;
}

interface WorkspaceContextType {
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  isLoading: boolean;
  switchWorkspace: (workspaceId: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const { workspaces = [], isLoading } = useClientWorkspaces();
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);

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

  const switchWorkspace = (workspaceId: string) => {
    const workspace = workspaces.find((w) => w.id === workspaceId);
    if (workspace) {
      setCurrentWorkspace(workspace);
      localStorage.setItem("currentWorkspaceId", workspaceId);
    }
  };

  return (
    <WorkspaceContext.Provider
      value={{
        currentWorkspace,
        workspaces,
        isLoading,
        switchWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspaceContext = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspaceContext must be used within a WorkspaceProvider");
  }
  return context;
};
