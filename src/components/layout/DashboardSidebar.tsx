import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Link2, QrCode, BarChart3, Settings, Building2, Target, CheckSquare, Users, Brain } from "lucide-react";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";

interface DashboardSidebarProps {
  onNavigate?: () => void;
}

const navigation = [
  { name: "overview", href: "/dashboard", icon: Home },
  { name: "links", href: "/dashboard/links", icon: Link2 },
  { name: "ai shortener", href: "/dashboard/ai-shortener", icon: Brain },
  { name: "qr codes", href: "/dashboard/qr-codes", icon: QrCode },
  { name: "analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "workspaces", href: "/client-workspaces", icon: Building2 },
  { name: "targeting", href: "/dashboard/targeting", icon: Target },
  { name: "approvals", href: "/approval-queue", icon: CheckSquare },
  { name: "waitlist", href: "/admin/waitlist", icon: Users },
  { name: "settings", href: "/settings", icon: Settings },
];

export const DashboardSidebar = ({ onNavigate }: DashboardSidebarProps) => {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <aside className="w-64 h-screen border-r border-separator bg-system-background flex flex-col">
      {/* Logo */}
      <div className="h-[72px] flex items-center px-6 border-b border-separator">
        <UtmOneLogo size="md" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navigation.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-apple transition-apple",
                active
                  ? "bg-fill-primary text-label font-medium"
                  : "text-secondary-label hover:bg-fill-tertiary hover:text-label"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-separator">
        <p className="text-xs text-tertiary-label text-center">
          clarity creates confidence.
        </p>
      </div>
    </aside>
  );
};
