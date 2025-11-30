import { ReactNode } from "react";
import { AppHeader } from "./AppHeader";
import { FoundingMemberBadge } from "@/components/dashboard/FoundingMemberBadge";
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { useCurrentPlan } from "@/hooks/useCurrentPlan";
import { AlertTriangle } from "lucide-react";
import { CreateLinkModal } from "@/components/CreateLinkModal";
import { SidebarProvider, DashboardSidebarV2 } from "./sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { _source, displayName } = useCurrentPlan();

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-grouped-background flex w-full overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block flex-shrink-0">
          <DashboardSidebarV2 />
        </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Admin Simulation Warning Banner */}
        {_source === 'SIMULATION' && (
          <div className="bg-red-600 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium">
            <AlertTriangle className="h-4 w-4" />
            ⚠️ TEST MODE: Simulating {displayName} Plan
          </div>
        )}
        
        <AppHeader />

        {/* Founding Member Badge */}
        <div className="px-4 md:px-6 pt-4">
          <FoundingMemberBadge />
        </div>

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
