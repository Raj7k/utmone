import { Button } from "@/components/ui/button";
import { LogOut, Menu, Plus } from "lucide-react";
import { formatText } from "@/utils/textFormatter";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { WorkspaceSwitcher } from "@/components/navigation/WorkspaceSwitcher";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";
import { ExpandedSidebar } from "./sidebar/ExpandedSidebar";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ChevronRight } from "lucide-react";
import { useModal } from "@/contexts/ModalContext";

const getBreadcrumbs = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = [{ label: "Home", path: "/dashboard" }];
  
  if (segments.length > 1) {
    const pageMap: Record<string, string> = {
      "links": "Links",
      "qr-codes": "QR Codes",
      "analytics": "Analytics",
      "settings": "Settings",
      "onelink-validator": "OneLink Validator",
      "targeting": "Targeting",
      "bulk-create": "Bulk Create",
      "campaigns": "Campaigns",
      "experiments": "The Lab",
      "cache-monitoring": "Cache",
      "analytics-performance": "Performance",
      "link-health": "Link Health",
      "billing": "Billing",
      "team": "Team"
    };
    
    const page = segments[1];
    if (pageMap[page]) {
      breadcrumbs.push({ label: pageMap[page], path: pathname });
    }
  }
  
  return breadcrumbs;
};

export const AppHeader = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setCreateModalOpen } = useModal();
  const [, setTextModeUpdate] = useState(0);
  
  const breadcrumbs = getBreadcrumbs(location.pathname);

  // Listen for text mode changes
  useEffect(() => {
    const handleTextModeChange = () => {
      setTextModeUpdate(prev => prev + 1);
    };
    
    window.addEventListener('text-mode-change', handleTextModeChange);
    return () => window.removeEventListener('text-mode-change', handleTextModeChange);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "signed out",
      description: "you have been signed out successfully",
    });
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <header className="h-[72px] border-b border-separator bg-system-background/80 backdrop-blur-xl sticky top-0 z-50 dark:bg-zinc-900/80 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-2 md:gap-8">
            {/* Mobile Menu Toggle */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" aria-label="Open navigation menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72 z-50">
                <ExpandedSidebar />
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <div 
              className="cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              <UtmOneLogo size="md" />
            </div>
            
            {/* Breadcrumbs */}
            <div className="hidden md:flex items-center gap-2 text-caption-1 text-secondary-label">
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.path} className="flex items-center gap-2">
                  {index > 0 && <ChevronRight className="h-3 w-3" />}
                  <button
                    onClick={() => navigate(crumb.path)}
                    className={index === breadcrumbs.length - 1 
                      ? "text-label font-medium" 
                      : "hover:text-label transition-colors"}
                  >
                    {formatText(crumb.label)}
                  </button>
                </div>
              ))}
            </div>
            
            {/* Workspace Switcher */}
            <div className="hidden md:block">
              <WorkspaceSwitcher />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => setCreateModalOpen(true)} 
              size="sm" 
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden md:inline">Create New</span>
            </Button>
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
