import { ReactNode, useEffect, useState, lazy, Suspense } from "react";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { SidebarProvider } from "./sidebar/SidebarProvider";
import { DashboardSidebarV2 } from "./sidebar/DashboardSidebarV2";
import { ContextualHeader } from "./ContextualHeader";
import { ImpersonationBanner } from "@/components/admin/ImpersonationBanner";
import { SubscriptionExpiryBanner } from "@/components/subscription/SubscriptionExpiryBanner";
import { MobileNav } from "@/components/mobile/MobileNav";
import { NavigationProgress } from "@/components/navigation/NavigationProgress";
import { DashboardErrorBoundary } from "./DashboardErrorBoundary";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getCachedUser } from "@/lib/getCachedUser";
import { useCurrentPlan } from "@/hooks/useCurrentPlan";
import { AlertTriangle } from "lucide-react";
import { TourProvider } from "@/components/onboarding";
import { KeyboardShortcutsProvider } from "@/components/keyboard/KeyboardShortcutsProvider";

// Lazy load non-critical components
const CreateLinkModal = lazy(() => import("@/components/CreateLinkModal").then(m => ({ default: m.CreateLinkModal })));
const AdminToolbar = lazy(() => import("@/components/admin/AdminToolbar").then(m => ({ default: m.AdminToolbar })));
const FeedbackWidget = lazy(() => import("@/components/FeedbackWidget").then(m => ({ default: m.FeedbackWidget })));
const TourOverlay = lazy(() => import("@/components/onboarding").then(m => ({ default: m.TourOverlay })));

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { _source, displayName } = useCurrentPlan();
  const { currentWorkspace } = useWorkspaceContext();
  const [searchParams] = useSearchParams();
  const [impersonatedUser, setImpersonatedUser] = useState<{ email: string; full_name?: string } | null>(null);

  // REMOVED: Workspace loading gate - layout renders immediately
  // Children (DashboardHome, etc.) handle their own loading states
  // This eliminates the second sequential loading screen

  useEffect(() => {
    const isImpersonating = searchParams.get('impersonating') === 'true';
    
    if (isImpersonating) {
      const user = getCachedUser();
      if (user) {
        setImpersonatedUser({
          email: user.email || '',
          full_name: undefined, // metadata not available in cache
        });
      }
    } else {
      setImpersonatedUser(null);
    }
  }, [searchParams]);

  return (
    <DashboardErrorBoundary>
      <TourProvider>
        <KeyboardShortcutsProvider>
          <SidebarProvider>
          {/* Navigation Progress Bar */}
          <NavigationProgress />
          
          <div className="dashboard-root min-h-screen bg-background flex w-full overflow-hidden">
            {/* Sidebar - Desktop only */}
            <div className="hidden lg:block flex-shrink-0">
              <DashboardSidebarV2 />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              {/* Subscription Expiry Banner */}
              <SubscriptionExpiryBanner />

              {/* Impersonation Banner */}
              {impersonatedUser && (
                <ImpersonationBanner
                  userEmail={impersonatedUser.email}
                  userFullName={impersonatedUser.full_name}
                />
              )}

              {/* Simulation Mode Warning */}
              {_source === 'SIMULATION' && (
                <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center justify-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="h-4 w-4" />
                  <strong>TEST MODE</strong> — Simulating {displayName} Plan
                </div>
              )}

              {/* Contextual Header */}
              <ContextualHeader />

              {/* Page Content - with proper overflow and mobile bottom padding */}
              <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 lg:px-8 lg:py-6 pb-24 md:pb-6">
                <div className="max-w-full">
                  {children}
                </div>
              </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <MobileNav />

            {/* Lazy-loaded non-critical components */}
            <Suspense fallback={null}>
              <CreateLinkModal />
              <AdminToolbar />
              <FeedbackWidget />
              <TourOverlay />
            </Suspense>
          </div>
        </SidebarProvider>
        </KeyboardShortcutsProvider>
      </TourProvider>
    </DashboardErrorBoundary>
  );
};
