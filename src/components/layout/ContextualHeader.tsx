import { Button } from "@/components/ui/button";
import { Plus, Menu } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useModal } from "@/contexts/ModalContext";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { ExpandedSidebar } from "./sidebar/ExpandedSidebar";

interface PageMeta {
  title: string;
  subtitle: string;
}

const getPageMeta = (pathname: string): PageMeta => {
  const pageMap: Record<string, PageMeta> = {
    '/dashboard': { title: 'dashboard', subtitle: 'your command center' },
    '/dashboard/links': { title: 'links', subtitle: 'manage your short links' },
    '/dashboard/qr-codes': { title: 'qr codes', subtitle: 'generate branded codes' },
    '/dashboard/analytics': { title: 'intelligence', subtitle: 'insights & attribution' },
    '/dashboard/sales': { title: 'sales', subtitle: 'track prospect engagement' },
    '/dashboard/events': { title: 'events', subtitle: 'field marketing attribution' },
    '/dashboard/campaigns': { title: 'campaigns', subtitle: 'organize your marketing' },
    '/dashboard/experiments': { title: 'the lab', subtitle: 'a/b testing' },
    '/dashboard/targeting': { title: 'geo targeting', subtitle: 'location-based routing' },
    '/dashboard/attribution': { title: 'attribution', subtitle: 'revenue intelligence' },
    '/settings': { title: 'settings', subtitle: 'configure your workspace' },
  };

  // Check for exact match first
  if (pageMap[pathname]) return pageMap[pathname];

  // Check for partial matches
  for (const [path, meta] of Object.entries(pageMap)) {
    if (pathname.startsWith(path) && path !== '/dashboard') {
      return meta;
    }
  }

  return { title: 'dashboard', subtitle: 'your command center' };
};

export const ContextualHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setCreateModalOpen } = useModal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { title, subtitle } = getPageMeta(location.pathname);

  return (
    <header className="h-20 border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="h-full px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Mobile menu + Page context */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              <ExpandedSidebar />
            </SheetContent>
          </Sheet>

          {/* Page Title & Subtitle */}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button 
            onClick={() => setCreateModalOpen(true)} 
            size="default"
            className="gap-2 h-10 px-5 rounded-xl shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Create New</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
