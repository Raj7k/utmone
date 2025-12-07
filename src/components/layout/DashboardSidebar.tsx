import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { formatText } from "@/utils/textFormatter";
import { 
  LogOut, 
  Palette, 
  Sun, 
  Moon, 
  Monitor,
  ChevronDown,
  User
} from "lucide-react";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger, 
  DropdownMenuSub, 
  DropdownMenuSubTrigger, 
  DropdownMenuSubContent, 
  DropdownMenuPortal 
} from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { 
  appNavigation, 
  toolsNavigation, 
  intelligenceNavigation, 
  growthNavigation,
  settingsGroups,
  NavItem 
} from "@/config/navigation";
import { Badge } from "@/components/ui/badge";

interface DashboardSidebarProps {
  onNavigate?: () => void;
}

export const DashboardSidebar = ({ onNavigate }: DashboardSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setTheme } = useTheme();
  const { currentWorkspace } = useWorkspaceContext();
  
  const [toolsOpen, setToolsOpen] = useState(true);
  const [intelligenceOpen, setIntelligenceOpen] = useState(true);
  const [growthOpen, setGrowthOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [, setTextModeUpdate] = useState(0);

  // Listen for text mode changes
  useEffect(() => {
    const handleTextModeChange = () => {
      setTextModeUpdate(prev => prev + 1);
    };
    
    window.addEventListener('text-mode-change', handleTextModeChange);
    return () => window.removeEventListener('text-mode-change', handleTextModeChange);
  }, []);

  // Query for pending approvals count
  const { data: pendingCount } = useQuery({
    queryKey: ['pending-approvals-count', currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return 0;
      
      const { count, error } = await supabase
        .from('links')
        .select('*', { count: 'exact', head: true })
        .eq('approval_status', 'pending')
        .eq('workspace_id', currentWorkspace.id);
      
      if (error) {
        console.error('Error fetching pending count:', error);
        return 0;
      }
      
      return count || 0;
    },
    enabled: !!currentWorkspace?.id,
    refetchInterval: 30000,
  });

  const { data: profile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, email, avatar_url')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
    toast({ title: "Signed out successfully" });
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };
  
  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Check if current route is in any group to keep it open
  const hasActiveToolsRoute = toolsNavigation.some(item => isActive(item.href));
  const hasActiveIntelligenceRoute = intelligenceNavigation.some(item => isActive(item.href));
  const hasActiveGrowthRoute = growthNavigation.some(item => isActive(item.href));
  const hasActiveSettingsRoute = location.pathname.startsWith('/settings');

  const renderNavItem = (item: typeof appNavigation[0], showBadge = false) => {
    const active = isActive(item.href);
    const Icon = item.icon;
    const badgeCount = item.badge && pendingCount && pendingCount > 0 ? pendingCount : 0;

    return (
      <Link
        key={item.name}
        to={item.href}
        onClick={onNavigate}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-apple transition-apple",
          active
            ? "bg-muted text-foreground font-medium"
            : "text-label hover:bg-fill-tertiary"
        )}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        <span className="flex-1">{formatText(item.name)}</span>
        {showBadge && badgeCount > 0 && (
          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-xs font-medium">
            {badgeCount > 9 ? '9+' : badgeCount}
          </span>
        )}
        {item.isNew && (
          <span className="ml-auto text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
            New
          </span>
        )}
      </Link>
    );
  };

  const renderCollapsibleSection = (
    label: string,
    items: typeof toolsNavigation,
    isOpen: boolean,
    setOpen: (open: boolean) => void,
    hasActiveRoute: boolean
  ) => (
    <Collapsible open={isOpen || hasActiveRoute} onOpenChange={setOpen}>
      <div className="space-y-1">
        <CollapsibleTrigger className="w-full px-3 mb-2 flex items-center justify-between group">
          <p className="text-xs font-medium text-tertiary-label uppercase tracking-wider">
            {label}
          </p>
          <ChevronDown className={cn(
            "h-3 w-3 text-tertiary-label transition-transform",
            (isOpen || hasActiveRoute) && "rotate-180"
          )} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1">
          {items.map((item) => renderNavItem(item))}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );

  return (
    <aside className="w-64 h-screen border-r border-separator bg-system-background vibrancy-light flex flex-col z-40">
      {/* Logo */}
      <Link 
        to="/" 
        className="h-[72px] flex items-center px-6 border-b border-separator hover:bg-fill-tertiary transition-apple"
      >
        <UtmOneLogo size="md" />
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-6 overflow-y-auto">
        {/* CORE Category */}
        <div className="space-y-1">
          <div className="px-3 mb-2">
            <p className="text-xs font-medium text-tertiary-label uppercase tracking-wider">
              Core
            </p>
          </div>
          {appNavigation.map((item) => renderNavItem(item, item.badge === true))}
        </div>

        {/* CREATE Category */}
        {renderCollapsibleSection("Create", toolsNavigation, toolsOpen, setToolsOpen, hasActiveToolsRoute)}

        {/* INSIGHTS Category */}
        {renderCollapsibleSection("Insights", intelligenceNavigation, intelligenceOpen, setIntelligenceOpen, hasActiveIntelligenceRoute)}

        {/* GROWTH Category */}
        {renderCollapsibleSection("Growth", growthNavigation, growthOpen, setGrowthOpen, hasActiveGrowthRoute)}
      </nav>

      {/* SETTINGS (Bottom Section) */}
      <div className="px-3 py-4 border-t border-separator space-y-1">
        <Collapsible open={settingsOpen || hasActiveSettingsRoute} onOpenChange={setSettingsOpen}>
          <CollapsibleTrigger className="w-full px-3 mb-2 flex items-center justify-between group">
            <p className="text-xs font-medium text-tertiary-label uppercase tracking-wider">
              Settings
            </p>
            <ChevronDown className={cn(
              "h-3 w-3 text-tertiary-label transition-transform",
              (settingsOpen || hasActiveSettingsRoute) && "rotate-180"
            )} />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3">
            {settingsGroups.map((group) => (
              <div key={group.name} className="space-y-1">
                <p className="px-3 text-[10px] font-medium text-tertiary-label/60 uppercase tracking-wider">
                  {group.name}
                </p>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = location.pathname === '/settings' && location.search.includes(`tab=${item.href.split('tab=')[1]}`);
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-apple",
                        active
                          ? "bg-muted text-foreground font-medium"
                          : "text-label hover:bg-fill-tertiary"
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="flex-1">{formatText(item.name)}</span>
                      {item.isNew && (
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-1.5 py-0 text-[10px]">
                          New
                        </Badge>
                      )}
                      {typeof item.badge === 'string' && (
                        <Badge variant="outline" className="bg-system-orange/10 text-system-orange border-system-orange/20 px-1.5 py-0 text-[10px]">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-separator">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-fill-tertiary transition-apple">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {getInitials(profile?.full_name || null)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left overflow-hidden">
                <p className="text-sm font-medium text-label truncate">
                  {profile?.full_name || "User"}
                </p>
                <p className="text-xs text-secondary-label truncate">
                  {profile?.email || ""}
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 vibrancy-thick z-50 bg-card">
            <DropdownMenuItem onClick={() => navigate('/settings/profile')}>
              <User className="mr-2 h-4 w-4" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Palette className="mr-2 h-4 w-4" />
                Appearance
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="vibrancy-thick">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Monitor className="mr-2 h-4 w-4" />
                    Auto
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
};
