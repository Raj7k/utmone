import { ReactNode } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { AppHeader } from "./AppHeader";
import { FoundingMemberBadge } from "@/components/dashboard/FoundingMemberBadge";
import { AdminToolbar } from "@/components/admin/AdminToolbar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-grouped-background flex w-full overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block flex-shrink-0">
        <DashboardSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AppHeader />

        {/* Founding Member Badge */}
        <div className="px-4 md:px-6 pt-4">
          <FoundingMemberBadge />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-group w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Admin God Mode Toolbar */}
      <AdminToolbar />
    </div>
  );
};
