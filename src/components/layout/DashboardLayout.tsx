import { ReactNode, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentPlan } from "@/hooks/useCurrentPlan";
import { AppHeader } from "./AppHeader";
import { ImpersonationBanner } from "@/components/admin/ImpersonationBanner";
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { CreateLinkModal } from "@/components/CreateLinkModal";
import { SidebarProvider } from "./sidebar/SidebarProvider";
import { DashboardSidebarV2 } from "./sidebar/DashboardSidebarV2";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { _source, displayName } = useCurrentPlan();
  const [searchParams] = useSearchParams();
  const [impersonatedUser, setImpersonatedUser] = useState<{ email: string; full_name?: string } | null>(null);

  useEffect(() => {
    const isImpersonating = searchParams.get('impersonating') === 'true';
    if (isImpersonating) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          setImpersonatedUser({ email: user.email || '', full_name: user.user_metadata?.full_name });
        }
      });
    } else {
      setImpersonatedUser(null);
    }
  }, [searchParams]);

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-grouped-background flex w-full overflow-hidden">
        <DashboardSidebarV2 />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {impersonatedUser && (
            <ImpersonationBanner userEmail={impersonatedUser.email} userFullName={impersonatedUser.full_name} />
          )}
          {_source === 'SIMULATION' && (
            <div className="bg-red-600 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium">
              <AlertTriangle className="h-4 w-4" />
              ⚠️ TEST MODE: Simulating {displayName} Plan
            </div>
          )}
          <AppHeader />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 w-full">{children}</div>
          </main>
        </div>

        <CreateLinkModal />
        <AdminToolbar />
        <FeedbackWidget />
      </div>
    </SidebarProvider>
  );
};
