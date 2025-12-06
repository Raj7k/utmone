// Dashboard layout component with sidebar and header
import { ReactNode, useEffect, useState } from "react";
import { AppHeader } from "./AppHeader";
import { FoundingMemberBadge } from "@/components/dashboard/FoundingMemberBadge";
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import { ImpersonationBanner } from "@/components/admin/ImpersonationBanner";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { useCurrentPlan } from "@/hooks/useCurrentPlan";
import { AlertTriangle } from "lucide-react";
import { CreateLinkModal } from "@/components/CreateLinkModal";
import { SidebarProvider, DashboardSidebarV2 } from "./sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams } from "react-router-dom";

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
      <div className="min-h-screen bg-grouped-background flex w-full overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block flex-shrink-0">
          <DashboardSidebarV2 />
        </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Impersonation Banner (highest priority) */}
        {impersonatedUser && (
          <ImpersonationBanner
            userEmail={impersonatedUser.email}
            userFullName={impersonatedUser.full_name}
          />
        )}

        {/* Admin Simulation Warning Banner */}
        {_source === 'SIMULATION' && (
          <div className="bg-red-600 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium">
            <AlertTriangle className="h-4 w-4" />
            ⚠️ TEST MODE: Simulating {displayName} Plan
          </div>
        )}
        
        <AppHeader />

        {/* Main Content Area with max-width constraint */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Global Create Link Modal */}
      <CreateLinkModal />

      {/* Admin God Mode Toolbar */}
      <AdminToolbar />

      {/* Floating Feedback Widget */}
      <FeedbackWidget />
      </div>
    </SidebarProvider>
  );
};
