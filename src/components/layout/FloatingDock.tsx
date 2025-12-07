import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { 
  LayoutGrid, 
  Link2, 
  BarChart3, 
  QrCode, 
  Settings
} from "lucide-react";

const dockItems = [
  { name: "Home", href: "/dashboard", icon: LayoutGrid },
  { name: "Links", href: "/dashboard/links", icon: Link2 },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "QR", href: "/dashboard/qr-codes", icon: QrCode },
  { name: "Settings", href: "/settings", icon: Settings },
];

export const FloatingDock = () => {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/dashboard") return location.pathname === href;
    if (href === "/settings") return location.pathname.startsWith("/settings");
    return location.pathname.startsWith(href);
  };

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="h-16 px-6 rounded-full bg-zinc-900/80 backdrop-blur-2xl border border-white/10 shadow-2xl flex items-center gap-2">
        {dockItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.href}
              className="relative group"
            >
              <motion.div
                whileHover={{ scale: 1.2, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                  active 
                    ? "bg-white/10 text-white" 
                    : "text-zinc-400 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5" />
              </motion.div>
              
              {/* Active indicator - glowing dot */}
              {active && (
                <motion.div
                  layoutId="dock-indicator"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.6)]"
                />
              )}

              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-zinc-800 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                {item.name}
              </div>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
};
