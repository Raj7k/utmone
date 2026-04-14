import { lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelpPanel } from "./HelpPanel";

// PHASE C: Defer AdminSimulationProvider to admin routes only
const AdminSimulationProvider = lazy(() => import("@/contexts/AdminSimulationContext").then(m => ({ default: m.AdminSimulationProvider })));

interface AppWithHelpProps {
  children: React.ReactNode;
}

// Helper component to conditionally show HelpPanel and wrap with route-specific providers
export const AppWithHelp = ({ children }: AppWithHelpProps) => {
  const location = useLocation();
  
  // Show HelpPanel on product pages only (not landing/marketing pages)
  const shouldShowHelp = [
    '/dashboard',
    '/links',
    '/analytics',
    '/settings',
    '/onboarding',
    '/workspaces'
  ].some(path => location.pathname.startsWith(path));
  
  // Only load AdminSimulationProvider for admin routes
  const isAdminRoute = location.pathname.startsWith('/admin');

  // PERF: TooltipProvider is only needed on product/dashboard/admin routes.
  // Skipping it on marketing pages avoids mounting Radix UI tooltip machinery for visitors.
  const needsTooltipProvider = shouldShowHelp || isAdminRoute;

  const content = (
    <>
      {children}
      {shouldShowHelp && <HelpPanel />}
    </>
  );

  const wrapped = isAdminRoute ? (
    <Suspense fallback={null}>
      <AdminSimulationProvider>
        {content}
      </AdminSimulationProvider>
    </Suspense>
  ) : (
    content
  );

  return needsTooltipProvider ? (
    <TooltipProvider>{wrapped}</TooltipProvider>
  ) : (
    wrapped
  );
};
