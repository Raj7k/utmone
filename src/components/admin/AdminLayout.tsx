import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { AdminMFAGuard } from "@/components/admin/AdminMFAGuard";
import { 
  LayoutDashboard, 
  Users, 
  Megaphone, 
  BarChart3,
  LogOut,
  ChevronRight,
  Activity,
  Flag,
  TestTube,
  Shield
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: "/admin", label: "dashboard", icon: LayoutDashboard },
  { path: "/admin/waitlist", label: "waitlist", icon: Users },
  { path: "/admin/landing", label: "landing page", icon: Megaphone },
  { path: "/admin/product", label: "product analytics", icon: BarChart3 },
  { path: "/admin/system", label: "system monitoring", icon: Activity },
  { path: "/admin/feature-flags", label: "feature flags", icon: Flag },
  { path: "/admin/security", label: "security", icon: Shield },
  { path: "/admin/tests", label: "system tests", icon: TestTube },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, isLoading } = useAdminAuth();

  // Show loading state while checking authorization
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-foreground border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Verifying authorization...</p>
        </div>
      </div>
    );
  }

  // Don't render if not admin (redirect handled by hook)
  if (!isAdmin) {
    return null;
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <AdminMFAGuard>
      <div className="min-h-screen flex bg-background">
        {/* Sidebar */}
        <aside className="w-64 fixed h-full bg-card backdrop-blur-xl border-r border-border">
          <div className="p-6">
            <Link to="/" className="text-xl font-bold text-foreground">
              utm.one
            </Link>
            <p className="text-xs mt-1 text-muted-foreground">admin dashboard</p>
          </div>

          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive 
                      ? "bg-primary text-primary-foreground font-medium" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-6 left-3 right-3">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-3" />
              sign out
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64">
          {children}
        </main>
      </div>
    </AdminMFAGuard>
  );
}
