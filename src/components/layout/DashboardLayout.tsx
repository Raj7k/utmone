import { ReactNode, useEffect, useState, lazy, Suspense } from "react";
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
import { useCurrentPlan } from "@/hooks/useCurrentPlan";
import { AlertTriangle, Loader2 } from "lucide-react";
import { TourProvider } from "@/components/onboarding";
import { KeyboardShortcutsProvider } from "@/components/keyboard/KeyboardShortcutsProvider";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { useAppSession } from "@/contexts/AppSessionContext";

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
  const { currentWorkspace, isLoading: isWorkspaceLoading, isRefreshing } = useWorkspaceContext();
  const { isFullyLoaded } = useAppSession();
  const [searchParams] = useSearchParams();
  const [impersonatedUser, setImpersonatedUser] = useState<{ email: string; full_name?: string } | null>(null);

  // Check if we're in impersonation mode
  useEffect(() => {
    const isImpersonating = searchParams.get('impersonating') === 'true';
    
    if (isImpersonating) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          setImpersonatedUser({
            email: user.email || '',
            full_name: user.user_metadata?.full_name,
          });
        }
      });
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
                {(isWorkspaceLoading || isRefreshing || !isFullyLoaded) && (
                  <div className="mb-4">
                    <div className="flex items-start gap-3 rounded-lg border border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-sm">
                      <Loader2 className="h-4 w-4 animate-spin text-primary mt-0.5" />
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {currentWorkspace ? "Refreshing workspace data" : "Loading your workspace"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {currentWorkspace
                            ? "Using cached workspace while we pull the latest updates."
                            : "Setting up your workspace — this only takes a moment."}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
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
