import { useNavigate, Link } from "react-router-dom";
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
import { Bell, User, LogOut, Palette, Sun, Moon, Monitor, Bug, Compass } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { useAppSession } from "@/contexts/AppSessionContext";
import { useTour } from "@/components/onboarding";

export const SidebarUserFooter = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setTheme } = useTheme();
  const { user } = useAppSession();
  const { startTour } = useTour();

  const { data: profile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('profiles')
        .select('full_name, email, avatar_url')
        .eq('id', user.id)
        .single();
      return data;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
    toast({ title: "Signed out successfully" });
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="p-3 border-t border-separator space-y-2">
      {/* Notifications */}
      <Link 
        to="/settings?tab=notifications" 
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-label hover:bg-fill-tertiary transition-apple"
      >
        <Bell className="h-5 w-5" />
        <span className="text-sm">Notifications</span>
      </Link>

      {/* Report Bug */}
      <button 
        onClick={() => {
          // Find and click the feedback widget trigger button
          const feedbackTrigger = document.querySelector('.feedback-widget-trigger') as HTMLButtonElement;
          if (feedbackTrigger) {
            feedbackTrigger.click();
          }
        }}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-label hover:bg-fill-tertiary transition-apple"
      >
        <Bug className="h-5 w-5" />
        <span className="text-sm">Report Bug</span>
      </button>

      {/* User Profile Dropdown */}
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
          <DropdownMenuItem onClick={startTour}>
            <Compass className="mr-2 h-4 w-4" />
            Take a Tour
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
  );
};
