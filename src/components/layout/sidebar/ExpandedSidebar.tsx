import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  ChevronLeft,
  Search,
  LucideIcon,
  LayoutGrid,
  Link2,
  BarChart3,
  DollarSign,
  CalendarDays,
  Clock,
  QrCode,
  Target,
  Layers,
  Brain,
  Beaker,
  Waves,
  Scan,
  Settings,
  Bug,
  ChevronRight
} from "lucide-react";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { useSidebar } from "./SidebarProvider";
import { motion } from "framer-motion";
import { newFeatures } from "@/config/featureHelp";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: boolean | string;
  isNew?: boolean;
  tourId?: string;
}

const coreNavigation: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutGrid, tourId: "nav-dashboard" },
  { name: "Links", href: "/dashboard/links", icon: Link2, tourId: "nav-links" },
  { name: "Intelligence", href: "/dashboard/intelligence", icon: BarChart3, tourId: "nav-intelligence" },
  { name: "Sales", href: "/dashboard/sales", icon: DollarSign, tourId: "nav-sales" },
  { name: "Events", href: "/dashboard/events", icon: CalendarDays, isNew: true, tourId: "nav-events" },
  { name: "Approvals", href: "/dashboard/approvals", icon: Clock, badge: true },
];

const toolsNavigation: NavItem[] = [
  { name: "QR Codes", href: "/dashboard/qr-codes", icon: QrCode, tourId: "nav-qr-codes" },
  { name: "Geo Targeting", href: "/dashboard/targeting", icon: Target },
  { name: "Bulk Create", href: "/dashboard/bulk-create", icon: Layers },
  { name: "Link Validator", href: "/dashboard/onelink-validator", icon: Brain },
  { name: "A/B Testing", href: "/dashboard/experiments", icon: Beaker },
  { name: "Event Halo", href: "/dashboard/events", icon: Waves, isNew: true },
  { name: "One-Tap Scanner", href: "/scan", icon: Scan, isNew: true },
];

const NavItemComponent = ({ 
  item, 
  isActive, 
  pendingCount, 
  visitedFeatures 
}: { 
  item: NavItem; 
  isActive: boolean; 
  pendingCount?: number;
  visitedFeatures: string[];
}) => {
  const Icon = item.icon;
  const showBadge = item.badge && pendingCount && pendingCount > 0;
  const isNewFeature = newFeatures.includes(item.name) && !visitedFeatures.includes(item.name);

  return (
    <Link
      to={item.href}
      data-tour={item.tourId}
      className={cn(
        "group flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
        isActive
          ? "bg-primary text-primary-foreground font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      )}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span className="flex-1">{item.name}</span>
      
      {isNewFeature && !isActive && (
        <span className="px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide rounded bg-primary/10 text-primary">
          new
        </span>
      )}
      
      {showBadge && (
        <span className="flex h-5 min-w-5 px-1 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-semibold">
          {pendingCount > 9 ? '9+' : pendingCount}
        </span>
      )}

      {isActive && <ChevronRight className="h-4 w-4 ml-auto opacity-50" />}
    </Link>
  );
};

export const ExpandedSidebar = () => {
  const location = useLocation();
  const { currentWorkspace } = useWorkspaceContext();
  const { toggleSidebar, openSearch } = useSidebar();
  
  const [visitedFeatures, setVisitedFeatures] = useState<string[]>(() => {
    const stored = localStorage.getItem('visited_features');
    return stored ? JSON.parse(stored) : [];
  });

  const allNavItems = [...coreNavigation, ...toolsNavigation];
  const currentFeature = allNavItems.find(item => {
    if (item.href === "/dashboard") return location.pathname === item.href;
    return location.pathname.startsWith(item.href.split('?')[0]);
  });

  useEffect(() => {
    if (currentFeature && newFeatures.includes(currentFeature.name) && !visitedFeatures.includes(currentFeature.name)) {
      const updated = [...visitedFeatures, currentFeature.name];
      setVisitedFeatures(updated);
      localStorage.setItem('visited_features', JSON.stringify(updated));
    }
  }, [location.pathname]);

  const { data: pendingCount } = useQuery({
    queryKey: ['pending-approvals-count', currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return 0;
      const { count } = await supabase
        .from('links')
        .select('*', { count: 'exact', head: true })
        .eq('approval_status', 'pending')
        .eq('workspace_id', currentWorkspace.id);
      return count || 0;
    },
    enabled: !!currentWorkspace?.id,
    refetchInterval: 30000,
  });

  const isActive = (href: string) => {
    if (href === "/dashboard") return location.pathname === href;
    return location.pathname.startsWith(href.split('?')[0]);
  };

  const openFeedback = () => {
    const feedbackTrigger = document.querySelector('.feedback-widget-trigger') as HTMLButtonElement;
    if (feedbackTrigger) {
      feedbackTrigger.click();
    }
  };

  return (
    <aside className="w-64 h-screen bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-border/50">
        <Link to="/" className="flex items-center">
          <UtmOneLogo size="md" />
        </Link>
        <motion.button
          onClick={toggleSidebar}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </motion.button>
      </div>

      {/* Search */}
      <div className="px-3 py-3">
        <motion.button
          onClick={openSearch}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full h-9 px-3 rounded-lg border border-border/50 bg-muted/30 flex items-center gap-2 text-sm text-muted-foreground hover:border-border hover:bg-muted/50 transition-colors"
        >
          <Search className="h-4 w-4" />
          <span>Search...</span>
          <kbd className="ml-auto inline-flex h-5 items-center gap-1 rounded border border-border/50 bg-muted/50 px-1.5 font-mono text-[10px] text-muted-foreground">
            ⌘F
          </kbd>
        </motion.button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {coreNavigation.map((item) => (
          <NavItemComponent
            key={item.name}
            item={item}
            isActive={isActive(item.href)}
            pendingCount={pendingCount}
            visitedFeatures={visitedFeatures}
          />
        ))}

        <div className="my-3 border-t border-border/50" />

        <p className="px-3 mb-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          Tools
        </p>
        {toolsNavigation.map((item) => (
          <NavItemComponent
            key={item.name}
            item={item}
            isActive={isActive(item.href)}
            visitedFeatures={visitedFeatures}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-border/50 space-y-1">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
        <button
          data-tour="feedback-link"
          onClick={openFeedback}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Bug className="h-4 w-4" />
          Report Bug
        </button>
      </div>
    </aside>
  );
};
