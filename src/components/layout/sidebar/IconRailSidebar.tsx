import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Link2, 
  BarChart3, 
  Users, 
  QrCode, 
  Target, 
  Settings,
  Search
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSidebar } from "./SidebarProvider";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";
import { Separator } from "@/components/ui/separator";
import { useAppSession } from "@/contexts/AppSessionContext";
import { createPreloadHandler, preloaders } from "@/lib/routePreloader";

// PERF: Attach a route-preload key so hovering a sidebar item warms the chunk.
// Reduced navigation - 8 items max following Apple HIG
const primaryNav = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, preload: "dashboard" as const },
  { name: "Links", href: "/dashboard/links", icon: Link2, preload: "links" as const },
  { name: "Intelligence", href: "/dashboard/analytics", icon: BarChart3, preload: "analytics" as const },
  { name: "Sales", href: "/dashboard/sales", icon: Users, preload: undefined },
];

const secondaryNav = [
  { name: "QR Codes", href: "/dashboard/qr-codes", icon: QrCode, preload: undefined },
  { name: "Campaigns", href: "/dashboard/campaigns", icon: Target, preload: undefined },
  { name: "Settings", href: "/settings", icon: Settings, preload: "settings" as const },
];

export const IconRailSidebar = () => {
  const location = useLocation();
  const { openSearch } = useSidebar();
  const { user } = useAppSession();
  const userId = user?.id;

  const { data: profile } = useQuery({
    queryKey: ['user-profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', userId)
        .single();
      return data;
    },
    enabled: !!userId,
  });

  const isActive = (href: string) => {
    if (href === "/dashboard") return location.pathname === href;
    return location.pathname.startsWith(href);
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <aside className="w-16 h-screen bg-card border-r border-border flex flex-col items-center py-4 z-40">
      <TooltipProvider delayDuration={0}>
        {/* Logo */}
        <Link 
          to="/dashboard"
          className="w-10 h-10 rounded-xl flex items-center justify-center mb-2 hover:bg-muted transition-colors"
        >
          <UtmOneLogo size="sm" />
        </Link>

        {/* Search */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={openSearch}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors mb-4"
            >
              <Search className="h-5 w-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            Search
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              ⌘K
            </kbd>
          </TooltipContent>
        </Tooltip>

        {/* Primary Navigation */}
        <nav className="flex-1 flex flex-col gap-1 w-full px-2">
          {primaryNav.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            const preload = item.preload ? createPreloadHandler(item.preload) : undefined;

            return (
              <Tooltip key={item.name}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.href}
                    onMouseEnter={preload}
                    onFocus={preload}
                    className={cn(
                      "relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 mx-auto",
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {item.name}
                </TooltipContent>
              </Tooltip>
            );
          })}

          <Separator className="my-3 mx-2" />

          {/* Secondary Navigation */}
          {secondaryNav.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            const preload = item.preload ? createPreloadHandler(item.preload) : undefined;

            return (
              <Tooltip key={item.name}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.href}
                    onMouseEnter={preload}
                    onFocus={preload}
                    className={cn(
                      "relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 mx-auto",
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {item.name}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        {/* User Avatar at Bottom */}
        <div className="mt-auto pt-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/settings"
                className="w-10 h-10 rounded-xl flex items-center justify-center hover:ring-2 hover:ring-border transition-all overflow-hidden"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                    {getInitials(profile?.full_name || null)}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              Profile & Settings
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </aside>
  );
};
