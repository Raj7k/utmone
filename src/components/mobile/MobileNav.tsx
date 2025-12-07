import { Home, Link2, BarChart3, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  appNavigation, 
  toolsNavigation, 
  intelligenceNavigation, 
  growthNavigation,
  settingsNavigation 
} from "@/config/navigation";
import { formatText } from "@/utils/textFormatter";

export const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sheetOpen, setSheetOpen] = useState(false);

  // Fixed primary nav items with correct paths
  const primaryNavItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Link2, label: "Links", path: "/dashboard/links" },
    { icon: BarChart3, label: "Analytics", path: "/dashboard/analytics" },
  ];

  const handleNavigation = (path: string) => {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    navigate(path);
    setSheetOpen(false);
  };

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const renderNavSection = (label: string, items: typeof appNavigation) => (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">
        {label}
      </p>
      {items.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return (
          <button
            key={item.href}
            onClick={() => handleNavigation(item.href)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
              active
                ? "bg-primary/10 text-primary font-medium"
                : "text-foreground hover:bg-muted"
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{formatText(item.name)}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border md:hidden z-50">
      <div className="flex items-center justify-around h-16">
        {primaryNavItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <motion.button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors relative",
                active ? "text-primary" : "text-muted-foreground"
              )}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {active && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-lg bg-primary/10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className={cn("h-5 w-5 relative z-10", active && "text-primary")} />
              <span className={cn("text-xs font-medium relative z-10", active && "text-primary")}>
                {item.label}
              </span>
            </motion.button>
          );
        })}

        {/* More Menu */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <motion.button
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors text-muted-foreground"
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Menu className="h-5 w-5 relative z-10" />
              <span className="text-xs font-medium relative z-10">More</span>
            </motion.button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl">
            <SheetHeader>
              <SheetTitle className="text-left">Navigation</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6 overflow-y-auto max-h-[calc(80vh-100px)]">
            {renderNavSection("Core", appNavigation)}
              {renderNavSection("Create", toolsNavigation)}
              {renderNavSection("Insights", intelligenceNavigation)}
              {renderNavSection("Growth", growthNavigation)}
              {renderNavSection("Settings", settingsNavigation)}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};
