import { useLocation } from "react-router-dom";
import { HelpPanel } from "./HelpPanel";

interface AppWithHelpProps {
  children: React.ReactNode;
}

// Helper component to conditionally show HelpPanel
export const AppWithHelp = ({ children }: AppWithHelpProps) => {
  const location = useLocation();
  
  // Show HelpPanel on product pages only (not landing/marketing pages)
  const shouldShowHelp = [
    '/dashboard',
    '/links',
    '/analytics',
    '/settings',
    '/onboarding',
    '/approval-queue',
    '/workspaces'
  ].some(path => location.pathname.startsWith(path));

  return (
    <>
      {children}
      {shouldShowHelp && <HelpPanel />}
    </>
  );
};
