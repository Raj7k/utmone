import { ReactNode, useEffect, useState, lazy, Suspense } from "react";
import { SidebarProvider } from "./sidebar/SidebarProvider";
import { ImpersonationBanner } from "@/components/admin/ImpersonationBanner";
import { SubscriptionExpiryBanner } from "@/components/subscription/SubscriptionExpiryBanner";
import { MobileNav } from "@/components/mobile/MobileNav";
import { NavigationProgress } from "@/components/navigation/NavigationProgress";
import { DashboardErrorBoundary } from "./DashboardErrorBoundary";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentPlan } from "@/hooks/useCurrentPlan";
import { AlertTriangle } from "lucide-react";

// PHASE 19: Lazy load heavy layout components
const DashboardSidebarV2 = lazy(() => import("./sidebar/DashboardSidebarV2").then(m => ({ default: m.DashboardSidebarV2 })));
const ContextualHeader = lazy(() => import("./ContextualHeader").then(m => ({ default: m.ContextualHeader })));

// PHASE 11: Lazy load non-critical components
const CreateLinkModal = lazy(() => import("@/components/CreateLinkModal").then(m => ({ default: m.CreateLinkModal })));
const AdminToolbar = lazy(() => import("@/components/admin/AdminToolbar").then(m => ({ default: m.AdminToolbar })));
const FeedbackWidget = lazy(() => import("@/components/FeedbackWidget").then(m => ({ default: m.FeedbackWidget })));
const TourProvider = lazy(() => import("@/components/onboarding").then(m => ({ default: m.TourProvider })));
const TourOverlay = lazy(() => import("@/components/onboarding").then(m => ({ default: m.TourOverlay })));
const KeyboardShortcutsProvider = lazy(() => import("@/components/keyboard/KeyboardShortcutsProvider").then(m => ({ default: m.KeyboardShortcutsProvider })));

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { _source, displayName } = useCurrentPlan();
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
      <SidebarProvider>
        {/* Navigation Progress Bar */}
        <NavigationProgress />
        
        <div className="dashboard-root min-h-screen bg-background flex w-full overflow-hidden">
          {/* Sidebar - Desktop only - PHASE 19: Lazy loaded with inline skeleton */}
          <div className="hidden lg:block flex-shrink-0">
            <Suspense fallback={
              <aside className="w-64 h-screen bg-card border-r border-border flex flex-col">
                <div className="h-14 flex items-center px-4 border-b border-border/50">
                  <div className="h-6 w-24 bg-muted animate-pulse rounded" />
                </div>
                <div className="flex-1 px-3 py-4 space-y-2">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="h-9 bg-muted/50 animate-pulse rounded-lg" />
                  ))}
                </div>
              </aside>
            }>
              <DashboardSidebarV2 />
            </Suspense>
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

            {/* Contextual Header - PHASE 19: Lazy loaded */}
            <Suspense fallback={
              <header className="h-14 border-b border-border/50 flex items-center px-4 gap-4">
                <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                <div className="flex-1" />
                <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
              </header>
            }>
              <ContextualHeader />
            </Suspense>

            {/* Page Content - with proper overflow and mobile bottom padding */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 lg:px-8 lg:py-6 pb-24 md:pb-6">
              <div className="max-w-full">
                {children}
              </div>
            </main>
          </div>

          {/* Mobile Bottom Navigation */}
          <MobileNav />

          {/* PHASE 11: Lazy-loaded non-critical components */}
          <Suspense fallback={null}>
            <CreateLinkModal />
            <AdminToolbar />
            <FeedbackWidget />
            <TourOverlay />
          </Suspense>
        </div>
      </SidebarProvider>
    </DashboardErrorBoundary>
  );
};
