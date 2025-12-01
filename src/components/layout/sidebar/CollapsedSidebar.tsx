import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutGrid, 
  Link2, 
  BarChart3, 
  QrCode, 
  Target,
  Layers,
  Brain,
  Megaphone,
  Clock,
  Briefcase, 
  CreditCard, 
  User,
  Bell,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { useSidebar } from "./SidebarProvider";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { name: "Links", href: "/dashboard/links", icon: Link2 },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Approvals", href: "/dashboard/approvals", icon: Clock, badge: true },
  { name: "QR Codes", href: "/dashboard/qr-codes", icon: QrCode },
  { name: "Targeting", href: "/dashboard/targeting", icon: Target },
  { name: "Bulk Create", href: "/dashboard/bulk-create", icon: Layers },
  { name: "OneLink Validator", href: "/dashboard/onelink-validator", icon: Brain },
  { name: "AI Optimization", href: "/dashboard/ai-optimization", icon: Sparkles },
  { name: "Send Time", href: "/dashboard/ai-send-time", icon: Clock },
  { name: "Campaigns", href: "/dashboard/campaigns", icon: Megaphone },
  { name: "Workspace", href: "/settings/workspace", icon: Briefcase },
  { name: "Billing", href: "/settings/billing", icon: CreditCard },
  { name: "Account", href: "/settings/profile", icon: User },
];

export const CollapsedSidebar = () => {
  const location = useLocation();
  const { currentWorkspace } = useWorkspaceContext();
  const { toggleSidebar } = useSidebar();

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

  const { data: profile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const { data } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single();
      return data;
    },
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
    <aside className="w-14 h-screen bg-mirage flex flex-col items-center py-4 z-40 border-r border-white/10">
      <TooltipProvider delayDuration={0}>
        {/* Logo */}
        <button 
          onClick={toggleSidebar}
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/5 transition-colors mb-6"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-electric-blue">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Navigation Icons */}
        <nav className="flex-1 flex flex-col gap-1 w-full px-1">
          {navigation.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            const showBadge = item.badge && pendingCount && pendingCount > 0;

            return (
              <Tooltip key={item.name}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.href}
                    className={cn(
                      "relative w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                      active
                        ? "bg-white/10 text-white"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {showBadge && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blaze-orange text-white text-[10px] font-medium flex items-center justify-center">
                        {pendingCount > 9 ? '9+' : pendingCount}
                      </span>
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-mirage text-white border-white/10">
                  {item.name}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="flex flex-col gap-2 w-full px-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                <Bell className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-mirage text-white border-white/10">
              Notifications
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={toggleSidebar}
                className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors overflow-hidden"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-blaze-orange to-electric-blue text-white text-xs font-medium">
                    {getInitials(profile?.full_name || null)}
                  </AvatarFallback>
                </Avatar>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-mirage text-white border-white/10">
              Profile
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      {/* Expand Indicator */}
      <div className="absolute top-1/2 -right-3 -translate-y-1/2">
        <button 
          onClick={toggleSidebar}
          className="w-6 h-6 rounded-full bg-mirage border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/20 transition-colors"
        >
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </aside>
  );
};
