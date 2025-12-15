/**
 * AppProvider - Unified provider combining session and workspace contexts
 * Reduces provider nesting from 9 levels to 5 levels
*/
import { ReactNode } from "react";
import { AppSessionProvider } from "./AppSessionContext";
import { WorkspaceProvider } from "./WorkspaceContext";

interface AppProviderProps {
  children: ReactNode;
}

/**
 * Combined provider that wraps session and workspace contexts
 * This reduces the provider tree depth and improves render performance
 */
export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <AppSessionProvider>
      <WorkspaceProvider>
        {children}
      </WorkspaceProvider>
    </AppSessionProvider>
  );
};

// Re-export hooks for convenience
export { useAppSession, getCachedUserId, getCachedWorkspaceId } from "./AppSessionContext";
export { useWorkspaceContext } from "./WorkspaceContext";
export { useNotificationContext } from "./NotificationContext";
