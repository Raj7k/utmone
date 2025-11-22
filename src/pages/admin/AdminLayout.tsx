import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { 
  LayoutDashboard, 
  Users, 
  Megaphone, 
  BarChart3, 
  Activity, 
  Flag,
  Handshake,
  LogOut 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card p-6 fixed h-screen overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-foreground">Admin Panel</h2>
          <p className="text-sm text-muted-foreground">System Management</p>
        </div>

        <nav className="space-y-2">
          <NavLink 
            to="/admin" 
            end
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors"
            activeClassName="bg-accent text-foreground font-medium"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink 
            to="/admin/waitlist"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors"
            activeClassName="bg-accent text-foreground font-medium"
          >
            <Users className="h-4 w-4" />
            <span>Waitlist</span>
          </NavLink>

          <NavLink 
            to="/admin/landing"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors"
            activeClassName="bg-accent text-foreground font-medium"
          >
            <Megaphone className="h-4 w-4" />
            <span>Landing Page</span>
          </NavLink>

          <NavLink 
            to="/admin/product"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors"
            activeClassName="bg-accent text-foreground font-medium"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Product Analytics</span>
          </NavLink>

          <NavLink 
            to="/admin/system"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors"
            activeClassName="bg-accent text-foreground font-medium"
          >
            <Activity className="h-4 w-4" />
            <span>System Monitoring</span>
          </NavLink>

          <NavLink 
            to="/admin/feature-flags"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors"
            activeClassName="bg-accent text-foreground font-medium"
          >
            <Flag className="h-4 w-4" />
            <span>Feature Flags</span>
          </NavLink>

          <NavLink 
            to="/admin/partners"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors"
            activeClassName="bg-accent text-foreground font-medium"
          >
            <Handshake className="h-4 w-4" />
            <span>Partners</span>
          </NavLink>
        </nav>

        <div className="mt-auto pt-6 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
};
