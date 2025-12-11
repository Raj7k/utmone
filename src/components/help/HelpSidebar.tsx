import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Rocket,
  Link2,
  Tag,
  QrCode,
  BarChart3,
  Network,
  CalendarDays,
  Zap,
  Users,
  Plug,
  Globe,
  CreditCard,
  Shield,
} from "lucide-react";

const helpCategories = [
  { name: "Getting Started", href: "/help/getting-started", icon: Rocket },
  { name: "Link Management", href: "/help/links", icon: Link2 },
  { name: "UTM Parameters", href: "/help/utm", icon: Tag },
  { name: "QR Codes", href: "/help/qr", icon: QrCode },
  { name: "Analytics", href: "/help/analytics", icon: BarChart3 },
  { name: "Attribution", href: "/help/attribution", icon: Network },
  { name: "Events & Field Marketing", href: "/help/events", icon: CalendarDays },
  { name: "Advanced Features", href: "/help/advanced", icon: Zap },
  { name: "Team & Governance", href: "/help/team", icon: Users },
  { name: "Integrations", href: "/help/integrations", icon: Plug },
  { name: "Custom Domains", href: "/help/domains", icon: Globe },
  { name: "Billing & Plans", href: "/help/billing", icon: CreditCard },
  { name: "Security", href: "/help/security", icon: Shield },
];

export const HelpSidebar = () => {
  const location = useLocation();

  return (
    <nav className="sticky top-24 space-y-1">
      <Link
        to="/help"
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
          location.pathname === "/help"
            ? "bg-zinc-100 text-zinc-900"
            : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
        )}
      >
        Help Center
      </Link>
      
      <div className="pt-4 border-t border-zinc-200 mt-4">
        <p className="px-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
          Categories
        </p>
        {helpCategories.map((category) => {
          const Icon = category.icon;
          const isActive = location.pathname === category.href;
          
          return (
            <Link
              key={category.href}
              to={category.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-zinc-100 text-zinc-900 font-medium"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {category.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
