import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Bell, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { useSidebar } from "./SidebarProvider";
import { 
  appNavigation, 
  toolsNavigation, 
  intelligenceNavigation, 
  settingsNavigation 
} from "@/config/navigation";
import { useAppSession } from "@/contexts/AppSessionContext";
import { usePendingApprovalsCount } from "@/hooks/usePendingApprovalsCount";
import { useDashboardPrefetch } from "@/hooks/dashboard";
import { useCallback } from "react";

// Flatten all navigation items for collapsed sidebar
const navigation = [
  ...appNavigation,
  ...toolsNavigation,
  ...intelligenceNavigation,
  ...settingsNavigation,
];

export const CollapsedSidebar = () => {
  const location = useLocation();
  const { currentWorkspace } = useWorkspaceContext();
  const { toggleSidebar } = useSidebar();
  const { user } = useAppSession();
  const userId = user?.id;
  const { 
    prefetchLinks, 
    prefetchIntelligence, 
    prefetchSales, 
    prefetchDashboard, 
    prefetchQRCodes,
    prefetchAnalytics,
    prefetchCampaigns,
    prefetchSettings 
  } = useDashboardPrefetch();

  const { data: pendingCount } = usePendingApprovalsCount();

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

  // Create prefetch handler map for routes
  const getPrefetchHandler = useCallback((href: string) => {
    switch (href) {
      case "/dashboard":
        return prefetchDashboard;
      case "/dashboard/links":
        return prefetchLinks;
      case "/dashboard/intelligence":
        return prefetchIntelligence;
      case "/dashboard/sales":
        return prefetchSales;
      case "/dashboard/qr-codes":
        return prefetchQRCodes;
      case "/dashboard/analytics":
        return prefetchAnalytics;
      case "/dashboard/campaigns":
        return prefetchCampaigns;
      case "/settings":
        return prefetchSettings;
      default:
        return undefined;
    }
  }, [prefetchLinks, prefetchIntelligence, prefetchSales, prefetchDashboard, prefetchQRCodes, prefetchAnalytics, prefetchCampaigns, prefetchSettings]);

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <aside className="w-16 h-screen bg-card flex flex-col items-center py-4 z-40 border-r border-border/50">
      <TooltipProvider delayDuration={0}>
        {/* Logo */}
        <button 
          onClick={toggleSidebar}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-foreground/50 hover:text-foreground/80 hover:bg-muted/50 transition-all duration-200 mb-6 hover:scale-105 active:scale-95"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-primary">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Navigation Icons */}
        <nav className="flex-1 flex flex-col gap-1 w-full px-2 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          {navigation.map((item, index) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            const showBadge = item.badge && pendingCount && pendingCount > 0;

            return (
              <Tooltip key={`${item.name}-${item.href}-${index}`}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.href}
                    onMouseEnter={getPrefetchHandler(item.href)}
                    className={cn(
                      "relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 mx-auto hover:scale-105 active:scale-95",
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-foreground/50 hover:text-foreground/80 hover:bg-muted/50"
                    )}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                    {showBadge && (
                      <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-semibold flex items-center justify-center">
                        {pendingCount > 9 ? '9+' : pendingCount}
                      </span>
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent 
                  side="right" 
                  className="bg-popover border-border/50 text-foreground text-[13px] font-medium"
                >
                  {item.name}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="flex flex-col gap-2 w-full px-2 pt-3 border-t border-border/50 mt-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link 
                to="/settings?tab=notifications"
                className="w-10 h-10 rounded-xl flex items-center justify-center text-foreground/50 hover:text-foreground/80 hover:bg-muted/50 transition-all duration-200 mx-auto hover:scale-105 active:scale-95"
              >
                <Bell className="h-[18px] w-[18px]" />
              </Link>
            </TooltipTrigger>
            <TooltipContent 
              side="right"
              className="bg-popover border-border/50 text-foreground text-[13px] font-medium"
            >
              Notifications
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={toggleSidebar}
                className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-muted/50 transition-all duration-200 overflow-hidden mx-auto hover:scale-105 active:scale-95"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                    {getInitials(profile?.full_name || null)}
                  </AvatarFallback>
                </Avatar>
              </button>
            </TooltipTrigger>
            <TooltipContent 
              side="right"
              className="bg-popover border-border/50 text-foreground text-[13px] font-medium"
            >
              Profile
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      {/* Expand Indicator */}
      <div className="absolute top-1/2 -right-3 -translate-y-1/2">
        <button 
          onClick={toggleSidebar}
          className="w-6 h-6 rounded-full bg-card border border-border/50 flex items-center justify-center text-foreground/40 hover:text-foreground/70 hover:border-border transition-all duration-200 shadow-sm hover:scale-110 active:scale-90"
        >
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </aside>
  );
};
