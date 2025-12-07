import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { formatText } from "@/utils/textFormatter";
import { 
  LayoutGrid, 
  Link2, 
  BarChart3, 
  QrCode, 
  Target,
  Layers,
  Brain,
  Clock,
  Briefcase, 
  CreditCard, 
  User,
  ChevronLeft,
  Search,
  Plus,
  Building2,
  Shield,
  Beaker,
  Zap,
  TrendingUp,
  GitBranch,
  Route
} from "lucide-react";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { useSidebar } from "./SidebarProvider";
import { SidebarUserFooter } from "./SidebarUserFooter";
import { Button } from "@/components/ui/button";
import { CreateWorkspaceDialog } from "@/components/workspace/CreateWorkspaceDialog";

const appNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { name: "Links", href: "/dashboard/links", icon: Link2 },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Approvals", href: "/dashboard/approvals", icon: Clock, badge: true },
];

const toolsNavigation = [
  { name: "QR Codes", href: "/dashboard/qr-codes", icon: QrCode },
  { name: "Targeting", href: "/dashboard/targeting", icon: Target },
  { name: "Bulk Create", href: "/dashboard/bulk-create", icon: Layers },
  { name: "OneLink Validator", href: "/dashboard/onelink-validator", icon: Brain },
  { name: "Link Guard", href: "/dashboard/link-health", icon: Shield },
  { name: "Smart Testing", href: "/dashboard/experiments", icon: Beaker },
];

const intelligenceNavigation = [
  { name: "Instant Links", href: "/dashboard/cache-monitoring", icon: Zap },
  { name: "Fast Insights", href: "/dashboard/analytics-performance", icon: TrendingUp },
  { name: "Revenue Attribution", href: "/dashboard/attribution", icon: GitBranch },
  { name: "Geo-Targeting", href: "/dashboard/targeting", icon: Route },
  { name: "Experiments", href: "/dashboard/experiments", icon: Beaker },
];

// Growth navigation hidden for now
// const growthNavigation = [
//   { name: "Campaigns", href: "/dashboard/campaigns", icon: Megaphone },
// ];

const settingsNavigation = [
  { name: "Workspace", href: "/settings/workspace", icon: Briefcase },
  { name: "Billing", href: "/settings/billing", icon: CreditCard },
  { name: "Account", href: "/settings/profile", icon: User },
];

export const ExpandedSidebar = () => {
  const location = useLocation();
  const { currentWorkspace, workspaces } = useWorkspaceContext();
  const { toggleSidebar, openSearch } = useSidebar();
  
  const [toolsOpen, setToolsOpen] = useState(true);
  const [intelligenceOpen, setIntelligenceOpen] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

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

  const hasActiveToolsRoute = toolsNavigation.some(item => isActive(item.href));
  const hasActiveIntelligenceRoute = intelligenceNavigation.some(item => isActive(item.href));

  return (
    <aside className="w-64 h-screen bg-card border-r border-separator flex flex-col z-40">
      {/* Header */}
      <div className="h-[72px] flex items-center justify-between px-4 border-b border-separator">
        <Link to="/" className="flex items-center">
          <UtmOneLogo size="md" />
        </Link>
        <button
          onClick={toggleSidebar}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary-label hover:text-label hover:bg-muted transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-3 pt-4 pb-2">
        <button
          onClick={openSearch}
          className="w-full h-9 px-3 rounded-lg border border-input bg-background/50 flex items-center gap-2 text-sm text-secondary-label hover:border-input-hover transition-colors"
        >
          <Search className="h-4 w-4" />
          <span>Search...</span>
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>F
          </kbd>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {/* WORKSPACE Category */}
        <div className="space-y-1">
          <div className="px-3 mb-2">
            <p className="text-xs font-medium text-tertiary-label uppercase tracking-wider">
              Workspace
            </p>
          </div>
          {appNavigation.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            const showBadge = item.badge && pendingCount && pendingCount > 0;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-apple transition-apple",
                  active
                    ? "bg-muted text-foreground font-medium"
                    : "text-label hover:bg-fill-tertiary"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1">{formatText(item.name)}</span>
                {showBadge && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-xs font-medium">
                    {pendingCount > 9 ? '9+' : pendingCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* TOOLS Category */}
        <Collapsible open={toolsOpen || hasActiveToolsRoute} onOpenChange={setToolsOpen}>
          <div className="space-y-1">
            <CollapsibleTrigger className="w-full px-3 mb-2 flex items-center justify-between group">
              <p className="text-xs font-medium text-tertiary-label uppercase tracking-wider">
                Tools
              </p>
              <ChevronDown className={cn(
                "h-3 w-3 text-tertiary-label transition-transform",
                (toolsOpen || hasActiveToolsRoute) && "rotate-180"
              )} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1">
              {toolsNavigation.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-apple transition-apple",
                      active ? "bg-muted text-foreground font-medium" : "text-label hover:bg-fill-tertiary"
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span>{formatText(item.name)}</span>
                  </Link>
                );
              })}
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* INTELLIGENCE Category */}
        <Collapsible open={intelligenceOpen || hasActiveIntelligenceRoute} onOpenChange={setIntelligenceOpen}>
          <div className="space-y-1">
            <CollapsibleTrigger className="w-full px-3 mb-2 flex items-center justify-between group">
              <p className="text-xs font-medium text-tertiary-label uppercase tracking-wider">
                Intelligence
              </p>
              <ChevronDown className={cn(
                "h-3 w-3 text-tertiary-label transition-transform",
                (intelligenceOpen || hasActiveIntelligenceRoute) && "rotate-180"
              )} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1">
              {intelligenceNavigation.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-apple transition-apple",
                      active ? "bg-muted text-foreground font-medium" : "text-label hover:bg-fill-tertiary"
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span>{formatText(item.name)}</span>
                  </Link>
                );
              })}
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* SETTINGS */}
        <div className="space-y-1">
          <div className="px-3 mb-2">
            <p className="text-xs font-medium text-tertiary-label uppercase tracking-wider">
              Settings
            </p>
          </div>
          {settingsNavigation.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-apple transition-apple",
                  active ? "bg-muted text-foreground font-medium" : "text-label hover:bg-fill-tertiary"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{formatText(item.name)}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Team Section */}
      {workspaces && workspaces.length > 0 && (
        <div className="px-3 py-3 border-t border-separator space-y-2">
          <div className="px-3 mb-1">
            <p className="text-xs font-medium text-tertiary-label uppercase tracking-wider">
              Team
            </p>
          </div>
          <div className="px-3 py-2 rounded-lg bg-muted/50 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-secondary-label" />
            <span className="text-sm text-label font-medium truncate flex-1">
              {currentWorkspace?.name || 'Workspace'}
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start gap-2 h-9 text-secondary-label hover:text-label"
            onClick={() => setCreateDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add new team
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
