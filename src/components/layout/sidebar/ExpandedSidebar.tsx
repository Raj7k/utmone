import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { formatText } from "@/utils/textFormatter";
import { 
  ChevronLeft,
  Search,
  Plus,
  Building2,
  ChevronDown,
  HelpCircle
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
import { LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  appNavigation, 
  toolsNavigation, 
  intelligenceNavigation, 
  settingsNavigation 
} from "@/config/navigation";
import { featureHelpDescriptions, newFeatures } from "@/config/featureHelp";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: boolean | string;
  isNew?: boolean;
}

interface NavGroupProps {
  name: string;
  items: NavItem[];
  isOpen: boolean;
  onToggle: () => void;
  isActive: (href: string) => boolean;
  pendingCount?: number;
  visitedFeatures?: string[];
}

const NavGroup = ({ name, items, isOpen, onToggle, isActive, pendingCount, visitedFeatures = [] }: NavGroupProps) => {
  const hasActiveItem = items.some(item => isActive(item.href));
  const shouldBeOpen = isOpen || hasActiveItem;

  return (
    <div className="space-y-1">
      {/* Group Header */}
      <button 
        onClick={onToggle}
        className={cn(
          "w-full px-3 py-2 flex items-center justify-between rounded-lg",
          "text-[11px] font-semibold uppercase tracking-widest",
          "text-foreground/40 hover:text-foreground/60",
          "hover:bg-muted/40 transition-all duration-200"
        )}
      >
        <span>{name}</span>
        <motion.div
          animate={{ rotate: shouldBeOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <ChevronDown className="h-3 w-3" />
        </motion.div>
      </button>

      {/* Animated Content */}
      <AnimatePresence initial={false}>
        {shouldBeOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-0.5 pt-1">
              {items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                const showBadge = item.badge && pendingCount && pendingCount > 0;
                const helpText = featureHelpDescriptions[item.name];
                const isNewFeature = newFeatures.includes(item.name) && !visitedFeatures.includes(item.name);

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                      active
                        ? "bg-primary text-primary-foreground font-medium shadow-sm"
                        : "text-foreground/70 hover:text-foreground hover:bg-muted/60"
                    )}
                  >
                    <Icon className={cn(
                      "h-[18px] w-[18px] flex-shrink-0",
                      active ? "opacity-100" : "opacity-70"
                    )} />
                    <span className="flex-1 text-[13px]">{formatText(item.name)}</span>
                    
                    {/* NEW Badge */}
                    {isNewFeature && !active && (
                      <span className="px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide rounded-full bg-primary/10 text-primary">
                        new
                      </span>
                    )}
                    
                    {/* Pending Count Badge */}
                    {showBadge && (
                      <span className="flex h-5 min-w-5 px-1.5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-semibold">
                        {pendingCount > 9 ? '9+' : pendingCount}
                      </span>
                    )}
                    
                    {/* Help Tooltip */}
                    {helpText && !active && (
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
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ExpandedSidebar = () => {
  const location = useLocation();
  const { currentWorkspace, workspaces } = useWorkspaceContext();
  const { toggleSidebar, openSearch } = useSidebar();
  
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Core: true,
    Create: true,
    Insights: true,
    Settings: true,
  });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  // Track visited features for NEW badges
  const [visitedFeatures, setVisitedFeatures] = useState<string[]>(() => {
    const stored = localStorage.getItem('visited_features');
    return stored ? JSON.parse(stored) : [];
  });

  // Mark feature as visited when navigating to it
  const allNavItems = [...appNavigation, ...toolsNavigation, ...intelligenceNavigation, ...settingsNavigation];
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

  const toggleGroup = (groupName: string) => {
    setOpenGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
  };

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
    return location.pathname.startsWith(href);
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

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        <NavGroup
          name="Core"
          items={appNavigation}
          isOpen={openGroups.Core}
          onToggle={() => toggleGroup('Core')}
          isActive={isActive}
          pendingCount={pendingCount}
          visitedFeatures={visitedFeatures}
        />

        <NavGroup
          name="Create"
          items={toolsNavigation}
          isOpen={openGroups.Create}
          onToggle={() => toggleGroup('Create')}
          isActive={isActive}
          visitedFeatures={visitedFeatures}
        />

        <NavGroup
          name="Insights"
          items={intelligenceNavigation}
          isOpen={openGroups.Insights}
          onToggle={() => toggleGroup('Insights')}
          isActive={isActive}
          visitedFeatures={visitedFeatures}
        />

        <NavGroup
          name="Settings"
          items={settingsNavigation}
          isOpen={openGroups.Settings}
          onToggle={() => toggleGroup('Settings')}
          isActive={isActive}
          visitedFeatures={visitedFeatures}
        />
      </nav>

      {/* Team Section */}
      {workspaces && workspaces.length > 0 && (
        <div className="px-3 py-3 border-t border-border/50 space-y-2">
          <div className="px-3 mb-1">
            <p className="text-[11px] font-semibold text-foreground/40 uppercase tracking-widest">
              Team
            </p>
          </div>
          <div className="px-3 py-2.5 rounded-xl bg-muted/40 flex items-center gap-2">
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
