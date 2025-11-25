import { Home, Link2, TrendingUp, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Link2, label: "Links", path: "/links" },
    { icon: TrendingUp, label: "Analytics", path: "/analytics" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-system-background/95 backdrop-blur-xl border-t border-separator md:hidden z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                isActive ? "text-primary" : "text-secondary-label"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
              <span className={cn("text-xs font-medium", isActive && "text-primary")}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
