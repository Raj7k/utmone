import { ReactNode, useEffect, useState } from "react";
import { SidebarProvider } from "./sidebar/SidebarProvider";
import { DashboardSidebarV2 } from "./sidebar/DashboardSidebarV2";
import { ContextualHeader } from "./ContextualHeader";
import { CreateLinkModal } from "@/components/CreateLinkModal";
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { ImpersonationBanner } from "@/components/admin/ImpersonationBanner";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentPlan } from "@/hooks/useCurrentPlan";
import { AlertTriangle } from "lucide-react";

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
    <SidebarProvider>
      <div className="dashboard-root min-h-screen bg-background flex w-full overflow-hidden">
        {/* Sidebar - Desktop only */}
        <div className="hidden lg:block flex-shrink-0">
          <DashboardSidebarV2 />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
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

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>

        {/* Modals & Widgets */}
        <CreateLinkModal />
        <AdminToolbar />
        <FeedbackWidget />
      </div>
    </SidebarProvider>
  );
};
