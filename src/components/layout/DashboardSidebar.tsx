import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutGrid, 
  Link2, 
  BarChart3, 
  QrCode, 
  Megaphone, 
  Briefcase, 
  CreditCard, 
  User,
  LogOut, 
  Palette, 
  Sun, 
  Moon, 
  Monitor,
  ChevronDown
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
import { useState } from "react";

interface DashboardSidebarProps {
  onNavigate?: () => void;
}

const appNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { name: "Links", href: "/dashboard/links", icon: Link2 },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
];

const toolsNavigation = [
  { name: "QR Codes", href: "/dashboard/qr-codes", icon: QrCode },
];

const growthNavigation = [
  { name: "Campaigns", href: "/dashboard/campaigns", icon: Megaphone },
];

const settingsNavigation = [
  { name: "Workspace", href: "/settings/workspace", icon: Briefcase },
  { name: "Billing", href: "/settings/billing", icon: CreditCard },
  { name: "Account", href: "/settings/profile", icon: User },
];

export const DashboardSidebar = ({ onNavigate }: DashboardSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setTheme } = useTheme();
  
  const [toolsOpen, setToolsOpen] = useState(true);
  const [growthOpen, setGrowthOpen] = useState(true);

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
  const hasActiveGrowthRoute = growthNavigation.some(item => isActive(item.href));

  return (
    <aside className="w-64 h-screen border-r border-separator bg-system-background vibrancy flex flex-col">
      {/* Logo */}
      <Link 
        to="/" 
        className="h-[72px] flex items-center px-6 border-b border-separator hover:bg-fill-tertiary transition-apple"
      >
        <UtmOneLogo size="md" />
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-6 overflow-y-auto">
        {/* APP Category */}
        <div className="space-y-1">
          <div className="px-3 mb-2">
            <p className="text-xs font-medium text-tertiary-label uppercase tracking-wider">
              App
            </p>
          </div>
          {appNavigation.map((item) => {
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
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                    : "text-secondary-label hover:bg-fill-tertiary hover:text-label"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.name}</span>
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
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-apple transition-apple",
                      active
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                        : "text-secondary-label hover:bg-fill-tertiary hover:text-label"
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* GROWTH Category */}
        <Collapsible open={growthOpen || hasActiveGrowthRoute} onOpenChange={setGrowthOpen}>
          <div className="space-y-1">
            <CollapsibleTrigger className="w-full px-3 mb-2 flex items-center justify-between group">
              <p className="text-xs font-medium text-tertiary-label uppercase tracking-wider">
                Growth
              </p>
              <ChevronDown className={cn(
                "h-3 w-3 text-tertiary-label transition-transform",
                (growthOpen || hasActiveGrowthRoute) && "rotate-180"
              )} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1">
              {growthNavigation.map((item) => {
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
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                        : "text-secondary-label hover:bg-fill-tertiary hover:text-label"
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </CollapsibleContent>
          </div>
        </Collapsible>
      </nav>

      {/* SETTINGS (Bottom Section) */}
      <div className="px-3 py-4 border-t border-separator space-y-1">
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
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-apple transition-apple",
                active
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                  : "text-secondary-label hover:bg-fill-tertiary hover:text-label"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-separator">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-fill-tertiary transition-apple">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
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
          <DropdownMenuContent align="end" className="w-56 vibrancy-thick">
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
