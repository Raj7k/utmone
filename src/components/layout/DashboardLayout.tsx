import { ReactNode } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { WorkspaceSwitcher } from "@/components/navigation/WorkspaceSwitcher";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/utm-one-logo.svg";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "signed out",
      description: "you have been signed out successfully",
    });
  };

  return (
    <div className="min-h-screen bg-grouped-background flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <DashboardSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-[72px] border-b border-separator bg-system-background/80 backdrop-blur-xl sticky top-0 z-40">
          <div className="h-full px-4 md:px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Toggle */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72">
                  <DashboardSidebar onNavigate={() => setMobileMenuOpen(false)} />
                </SheetContent>
              </Sheet>

              <div className="flex items-center gap-2 lg:hidden">
                <img 
                  src={logo}
                  alt="utm.one" 
                  className="h-7 w-auto"
                />
              </div>
              
              <WorkspaceSwitcher />
            </div>

            <div className="flex items-center gap-4">
              <span className="text-footnote text-secondary-label hidden md:block">
                {user?.email}
              </span>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 md:px-6 py-group">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
