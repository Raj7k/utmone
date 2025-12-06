// Dashboard layout component - v10 (working without sidebar while debugging)
import { ReactNode, useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { AlertTriangle, LayoutGrid, Link2, BarChart3, QrCode, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentPlan } from "@/hooks/useCurrentPlan";
import { AppHeader } from "./AppHeader";
import { ImpersonationBanner } from "@/components/admin/ImpersonationBanner";
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { CreateLinkModal } from "@/components/CreateLinkModal";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { name: "Links", href: "/dashboard/links", icon: Link2 },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "QR Codes", href: "/dashboard/qr-codes", icon: QrCode },
  { name: "Settings", href: "/settings/workspace", icon: Settings },
];

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
    <div className="min-h-screen bg-grouped-background flex w-full overflow-hidden">
      {/* Simple sidebar */}
      <aside className="hidden lg:flex w-64 bg-card border-r border-separator flex-col p-4">
        <div className="mb-6">
          <span className="text-xl font-display font-bold text-foreground">utm.one</span>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

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
  );
};