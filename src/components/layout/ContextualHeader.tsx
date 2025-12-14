import { Menu, Plus } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useModal } from "@/contexts/ModalContext";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, lazy, Suspense } from "react";
import { WorkspaceSwitcher } from "@/components/navigation/WorkspaceSwitcher";
import { UserAvatarMenu } from "@/components/navigation/UserAvatarMenu";
import { Button } from "@/components/ui/button";

// Lazy load ExpandedSidebar - only needed on mobile
const ExpandedSidebar = lazy(() => import("./sidebar/ExpandedSidebar").then(m => ({ default: m.ExpandedSidebar })));

interface PageMeta {
  title: string;
  subtitle: string;
}

const getPageMeta = (pathname: string): PageMeta => {
  const pageMap: Record<string, PageMeta> = {
    '/dashboard': { title: 'dashboard', subtitle: 'your command center' },
    '/dashboard/links': { title: 'links', subtitle: 'manage your short links' },
    '/dashboard/qr-codes': { title: 'QR codes', subtitle: 'generate branded codes' },
    '/dashboard/intelligence': { title: 'intelligence', subtitle: 'analytics & attribution' },
    '/dashboard/sales': { title: 'sales', subtitle: 'track prospect engagement' },
    '/dashboard/events': { title: 'events', subtitle: 'field marketing attribution' },
    '/dashboard/campaigns': { title: 'campaigns', subtitle: 'organize your marketing' },
    '/dashboard/experiments': { title: 'the lab', subtitle: 'A/B testing' },
    '/dashboard/targeting': { title: 'geo targeting', subtitle: 'location-based routing' },
    '/dashboard/attribution': { title: 'attribution', subtitle: 'revenue intelligence' },
    '/dashboard/approvals': { title: 'approvals', subtitle: 'pending link reviews' },
    '/settings': { title: 'settings', subtitle: 'configure your workspace' },
  };

  if (pageMap[pathname]) return pageMap[pathname];

  for (const [path, meta] of Object.entries(pageMap)) {
    if (pathname.startsWith(path) && path !== '/dashboard') {
      return meta;
    }
  }

  return { title: 'dashboard', subtitle: 'your command center' };
};

export const ContextualHeader = () => {
  const location = useLocation();
  const { setCreateModalOpen } = useModal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { title, subtitle } = getPageMeta(location.pathname);

  return (
    <header className="h-14 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="h-full px-4 flex items-center gap-4">
        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <Suspense fallback={<div className="w-64 h-full bg-card animate-pulse" />}>
              <ExpandedSidebar />
            </Suspense>
          </SheetContent>
        </Sheet>

        {/* Workspace Switcher - Left */}
        <div className="hidden sm:block shrink-0" data-tour="workspace-switcher">
          <WorkspaceSwitcher />
        </div>

        {/* Page Title - Center */}
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-medium text-foreground truncate">{title}</h1>
          <p className="text-xs text-muted-foreground truncate hidden sm:block">{subtitle}</p>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle />
          
          <Button 
            onClick={() => setCreateModalOpen(true)} 
            size="sm"
            className="h-8 gap-1.5 hidden sm:flex"
          >
            <Plus className="h-4 w-4" />
            <span>New</span>
          </Button>

          <Button 
            onClick={() => setCreateModalOpen(true)} 
            size="icon"
            className="h-8 w-8 sm:hidden"
          >
            <Plus className="h-4 w-4" />
          </Button>

          <UserAvatarMenu />
        </div>
      </div>
    </header>
  );
};
