import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { formatText } from "@/utils/textFormatter";
import { 
  ChevronLeft,
  Search,
  Plus,
  Building2,
  HelpCircle,
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
  Briefcase,
  CreditCard,
  User
} from "lucide-react";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { useSidebar } from "./SidebarProvider";
import { SidebarUserFooter } from "./SidebarUserFooter";
import { Button } from "@/components/ui/button";
import { CreateWorkspaceDialog } from "@/components/workspace/CreateWorkspaceDialog";
import { motion } from "framer-motion";
import { newFeatures, featureHelpDescriptions } from "@/config/featureHelp";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: boolean | string;
  isNew?: boolean;
}

// Simplified flat navigation
const coreNavigation: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { name: "Links", href: "/dashboard/links", icon: Link2 },
  { name: "Intelligence", href: "/dashboard/intelligence", icon: BarChart3 },
  { name: "Sales", href: "/dashboard/sales", icon: DollarSign },
  { name: "Events", href: "/dashboard/events", icon: CalendarDays, isNew: true },
  { name: "Approvals", href: "/dashboard/approvals", icon: Clock, badge: true },
];

const toolsNavigation: NavItem[] = [
  { name: "QR Codes", href: "/dashboard/qr-codes", icon: QrCode },
  { name: "Geo Targeting", href: "/dashboard/targeting", icon: Target },
  { name: "Bulk Create", href: "/dashboard/bulk-create", icon: Layers },
  { name: "Link Validator", href: "/dashboard/onelink-validator", icon: Brain },
  { name: "A/B Testing", href: "/dashboard/experiments", icon: Beaker },
  { name: "Event Halo", href: "/dashboard/events", icon: Waves, isNew: true },
  { name: "One-Tap Scanner", href: "/scan", icon: Scan, isNew: true },
];

const settingsNavigation: NavItem[] = [
  { name: "Workspace", href: "/settings?tab=domains", icon: Briefcase },
  { name: "Billing", href: "/settings?tab=billing", icon: CreditCard },
  { name: "Account", href: "/settings/profile", icon: User },
];

const NavItem = ({ 
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
  const helpText = featureHelpDescriptions[item.name];
  const isNewFeature = newFeatures.includes(item.name) && !visitedFeatures.includes(item.name);
  const tourId = item.name.toLowerCase().replace(/\s+/g, '-');

  return (
    <Link
      to={item.href}
      data-tour={`nav-${tourId}`}
      className={cn(
        "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
        isActive
          ? "bg-primary text-primary-foreground font-medium shadow-sm"
          : "text-foreground/70 hover:text-foreground hover:bg-muted/60"
      )}
    >
      <Icon className={cn(
        "h-[18px] w-[18px] flex-shrink-0",
        isActive ? "opacity-100" : "opacity-70"
      )} />
      <span className="flex-1 text-[13px]">{formatText(item.name)}</span>
      
      {isNewFeature && !isActive && (
        <span className="px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide rounded-full bg-primary/10 text-primary">
          new
        </span>
      )}
      
      {showBadge && (
        <span className="flex h-5 min-w-5 px-1.5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-semibold">
          {pendingCount > 9 ? '9+' : pendingCount}
        </span>
      )}
      
      {helpText && !isActive && (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span 
                className="p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.preventDefault()}
              >
                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
              </span>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-[180px]">
              <p className="text-xs">{helpText}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </Link>
  );
};

export const ExpandedSidebar = () => {
  const location = useLocation();
  const { currentWorkspace, workspaces } = useWorkspaceContext();
  const { toggleSidebar, openSearch } = useSidebar();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  const [visitedFeatures, setVisitedFeatures] = useState<string[]>(() => {
    const stored = localStorage.getItem('visited_features');
    return stored ? JSON.parse(stored) : [];
  });

  const allNavItems = [...coreNavigation, ...toolsNavigation, ...settingsNavigation];
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

  return (
    <aside className="w-64 h-screen bg-card border-r border-border flex flex-col z-40">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
        <Link to="/" className="flex items-center">
          <UtmOneLogo size="md" />
        </Link>
        <motion.button
          onClick={toggleSidebar}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground/40 hover:text-foreground/70 hover:bg-muted/50 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </motion.button>
      </div>

      {/* Search Bar */}
      <div className="px-3 pt-4 pb-2">
        <motion.button
          onClick={openSearch}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full h-10 px-3 rounded-xl border border-border/50 bg-muted/30 flex items-center gap-2 text-sm text-foreground/50 hover:border-border hover:bg-muted/50 transition-all duration-200"
        >
          <Search className="h-4 w-4" />
          <span className="text-[13px]">Search...</span>
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded-md border border-border/50 bg-muted/50 px-1.5 font-mono text-[10px] font-medium text-foreground/40">
            <span className="text-xs">⌘</span>F
          </kbd>
        </motion.button>
      </div>

      {/* Navigation - Flat list */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {/* Core Navigation */}
        {coreNavigation.map((item) => (
          <NavItem
            key={item.name}
            item={item}
            isActive={isActive(item.href)}
            pendingCount={pendingCount}
            visitedFeatures={visitedFeatures}
          />
        ))}

        {/* Divider */}
        <div className="my-4 border-t border-border/50" />

        {/* Tools */}
        <p className="px-3 mb-2 text-[11px] font-semibold text-foreground/40 uppercase tracking-widest">
          Tools
        </p>
        {toolsNavigation.map((item) => (
          <NavItem
            key={item.name}
            item={item}
            isActive={isActive(item.href)}
            visitedFeatures={visitedFeatures}
          />
        ))}

        {/* Divider */}
        <div className="my-4 border-t border-border/50" />

        {/* Settings */}
        <p className="px-3 mb-2 text-[11px] font-semibold text-foreground/40 uppercase tracking-widest">
          Settings
        </p>
        {settingsNavigation.map((item) => (
          <NavItem
            key={item.name}
            item={item}
            isActive={isActive(item.href)}
            visitedFeatures={visitedFeatures}
          />
        ))}
      </nav>

      {/* Team Section */}
      {workspaces && workspaces.length > 0 && (
        <div className="px-3 py-3 border-t border-border/50 space-y-2">
          <div className="px-3 mb-1">
            <p className="text-[11px] font-semibold text-foreground/40 uppercase tracking-widest">
              Team
            </p>
          </div>
          <div data-tour="workspace-switcher" className="px-3 py-2.5 rounded-xl bg-muted/40 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-foreground/50" />
            <span className="text-[13px] text-foreground/80 font-medium truncate flex-1">
              {currentWorkspace?.name || 'Workspace'}
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start gap-2 h-9 text-foreground/50 hover:text-foreground/80 hover:bg-muted/40 rounded-xl"
            onClick={() => setCreateDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span className="text-[13px]">Add new team</span>
          </Button>
        </div>
      )}

      {/* User Footer */}
      <SidebarUserFooter />

      {/* Create Workspace Dialog */}
      <CreateWorkspaceDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen}
      />
    </aside>
  );
};
