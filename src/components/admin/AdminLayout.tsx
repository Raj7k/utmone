import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  Megaphone, 
  BarChart3,
  LogOut,
  ChevronRight,
  Activity,
  Flag,
  TestTube
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
  { path: "/admin/tests", label: "system tests", icon: TestTube },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // Check admin role
  const { data: userRoles } = useQuery({
    queryKey: ['admin-auth'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Redirect if not admin
  if (userRoles && userRoles.role !== 'admin') {
    navigate('/');
    return null;
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-muted/20">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r fixed h-full">
        <div className="p-6">
          <Link to="/" className="text-xl font-bold">
            utm.one
          </Link>
          <p className="text-xs text-secondary-label mt-1">admin dashboard</p>
        </div>

        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                  transition-colors
                  ${isActive 
                    ? 'bg-primary text-primary-foreground font-medium' 
                    : 'text-secondary-label hover:bg-muted hover:text-foreground'
                  }
                `}
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
            className="w-full justify-start text-secondary-label"
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
  );
}
