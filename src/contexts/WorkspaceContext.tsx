import { createContext, useContext, useState, useEffect, ReactNode } from "react";
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
  switchWorkspace: (workspaceId: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const { workspaces = [], isLoading } = useClientWorkspaces();
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [queryCompleted, setQueryCompleted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { data: isAdmin = false } = useIsAdmin();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error("Auth check error:", error);
          setIsAuthenticated(false);
          return;
        }
        
        setIsAuthenticated(!!user);
        
        // Redirect to auth if not authenticated and on protected route
        if (!user && location.pathname.startsWith('/dashboard')) {
          navigate("/auth");
        }
      } catch (err) {
        console.error("Auth check exception:", err);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user);
      
      // Force refetch of workspaces on login to prevent race condition
      if (session?.user) {
        queryClient.invalidateQueries({ queryKey: ["client-workspaces"] });
      }
    });
    
    return () => subscription.unsubscribe();
  }, [location.pathname, navigate]);

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
    if (!isLoading && isAuthenticated !== null) {
      setQueryCompleted(true);
    }
  }, [isLoading, isAuthenticated]);

  // Redirect to onboarding if user has no workspaces (with race condition protection)
  useEffect(() => {
    const checkWorkspaces = async () => {
      try {
        // Wait for query to complete
        if (isLoading || isAuthenticated === null || !queryCompleted) return;
        
        // Don't redirect if already on auth, onboarding, or accept-invite pages
        if (location.pathname === "/auth" || location.pathname === "/onboarding" || location.pathname === "/accept-invite") return;
        
        // Admin bypass - admins should not be redirected to onboarding
        if (isAdmin) return;
        
        // Only redirect to onboarding if user is authenticated, query completed, and genuinely has no workspaces
        if (isAuthenticated && workspaces.length === 0) {
          navigate("/onboarding");
        }
      } catch (err) {
        console.error("Workspace check error:", err);
      }
    };

    checkWorkspaces();
  }, [workspaces, isLoading, isAuthenticated, queryCompleted, isAdmin, navigate, location.pathname]);

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
