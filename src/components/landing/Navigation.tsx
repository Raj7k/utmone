import { Link, useLocation } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/magnetic";
import { useState, useEffect } from "react";
import { announcements } from "@/lib/announcementConfig";
import { AnnouncementScheduler } from "@/lib/announcementScheduler";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, ChevronRight, ChevronDown, Link as LinkIcon, Link2, Network, QrCode, Database, Layers,
  Tags, BarChart3, TrendingUp, GitBranch, Route, Shield,
  Building2, Users, Rocket, Megaphone, Settings, Briefcase, Code, 
  DollarSign, Handshake, FileBarChart,
  BookOpen, ClipboardList, FileText, Puzzle, FolderOpen, BookMarked, SearchCheck, Wrench,
  Sparkles, Bot, Target, Radio, Scan, Waves
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatText } from "@/utils/textFormatter";
import { ProductMegaDropdown } from "./mega-dropdown/ProductMegaDropdown";
import { FeaturesMegaDropdown } from "./mega-dropdown/features/FeaturesMegaDropdown";
import { SolutionsMegaDropdown } from "./mega-dropdown/solutions/SolutionsMegaDropdown";
import { ResourcesMegaDropdown } from "./mega-dropdown/resources/ResourcesMegaDropdown";

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hideNav, setHideNav] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const location = useLocation();
  
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setHideNav(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkAnnouncementVisibility = () => {
      const announcementsToUse = announcements;
      const selected = AnnouncementScheduler.selectAnnouncement(announcementsToUse, false);
      
      if (selected) {
        const dismissKey = `announcement-dismissed-${selected.id}`;
        const isDismissed = localStorage.getItem(dismissKey);
        setAnnouncementVisible(!isDismissed);
      } else {
        setAnnouncementVisible(false);
      }
    };
    
    checkAnnouncementVisibility();
    const interval = setInterval(checkAnnouncementVisibility, 100);
    
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header 
      className={`sticky z-50 py-4 px-4 md:px-8 transition-all duration-300 ${
        announcementVisible ? "top-[48px]" : "top-0"
      } ${
        hideNav ? "opacity-0 pointer-events-none -translate-y-full" : "opacity-100"
      }`}
    >
      <nav 
        className={cn(
          "max-w-[1280px] mx-auto backdrop-blur-xl rounded-full px-6 md:px-8 py-3 md:py-4 flex items-center justify-between relative transition-all duration-300",
          "obsidian-glass-80 border border-white-08 shadow-[inset_0_1px_0_0_hsl(var(--white-10)),0_25px_50px_-12px_hsl(0_0%_0%/0.5)]",
          isScrolled ? 'scale-95' : 'scale-100'
        )}
      >
        {/* Scroll Progress Bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] origin-left rounded-full bg-gradient-to-r from-white/30 via-white/60 to-white/30"
          style={{ width: progressWidth }}
        />
        
        {/* Logo */}
        <Link to="/" className="flex items-center group transition-apple hover:opacity-70">
          <UtmOneLogo size="lg" className="[&>span]:text-white" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center">
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              {/* Product Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9 px-3 text-small-text font-medium bg-transparent transition-apple text-white-70 hover:text-white-90 data-[state=open]:text-white-90">
                  {formatText("product")}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ProductMegaDropdown />
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Features Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9 px-3 text-small-text font-medium bg-transparent transition-apple text-white-70 hover:text-white-90 data-[state=open]:text-white-90">
                  {formatText("features")}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <FeaturesMegaDropdown />
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Solutions Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9 px-3 text-small-text font-medium bg-transparent transition-apple text-white-70 hover:text-white-90 data-[state=open]:text-white-90">
                  {formatText("solutions")}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <SolutionsMegaDropdown />
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Resources Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9 px-3 text-small-text font-medium bg-transparent transition-apple text-white-70 hover:text-white-90 data-[state=open]:text-white-90">
                  {formatText("resources")}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ResourcesMegaDropdown />
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Pricing Link */}
              <NavigationMenuItem>
                <Link 
                  to="/pricing" 
                  className="h-9 px-3 text-small-text font-medium transition-apple inline-flex items-center justify-center text-white-70 hover:text-white-90"
                >
                  {formatText("pricing")}
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right Side - CTAs */}
        <div className="flex items-center gap-3">
          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/early-access">
              <Button variant="marketing" className="rounded-full">
                get early access
              </Button>
            </Link>
          </div>

          {/* Mobile Header Actions */}
          <div className="flex lg:hidden items-center gap-2">
            <Link to="/early-access">
              <Button variant="halo" size="sm" className="rounded-full text-xs h-9 px-4">
                get access
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden text-white-70 hover:text-white-90 hover:bg-white/10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] obsidian-glass-80 border-l border-white-08 backdrop-blur-xl overflow-y-auto">
              <nav className="flex flex-col gap-2 mt-8">
                {/* Product Section */}
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-lg font-medium text-white-80 hover:text-white-90 transition-colors">
                    Product
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 [&[data-state=open]>svg]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-4 space-y-2 pb-2">
                    <Link to="/product" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-white-60 hover:text-white-80 py-1">Overview</Link>
                    <Link to="/features/short-links" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-white-60 hover:text-white-80 py-1">Link Orchestration</Link>
                    <Link to="/features/analytics" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-white-60 hover:text-white-80 py-1">Journey Intelligence</Link>
                    <Link to="/features/qr-generator" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-white-60 hover:text-white-80 py-1">QR Studio</Link>
                    <Link to="/features/integrations" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-white-60 hover:text-white-80 py-1">Data Pipeline</Link>
                  </CollapsibleContent>
                </Collapsible>

                {/* Features Section */}
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-lg font-medium text-white-80 hover:text-white-90 transition-colors">
                    Features
                    <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-4 space-y-3 pb-2">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-white-40 mb-2">Core Features</p>
                      <div className="space-y-1">
                        <Link to="/features/short-links" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-white-60 hover:text-white-80 py-1">Short Links</Link>
                        <Link to="/features/utm-builder" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-white-60 hover:text-white-80 py-1">UTM Builder</Link>
                        <Link to="/features/qr-generator" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-white-60 hover:text-white-80 py-1">QR Generator</Link>
                        <Link to="/features/analytics" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-white-60 hover:text-white-80 py-1">Analytics</Link>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-white-40 mb-2">AI Intelligence</p>
                      <div className="space-y-1">
                        <Link to="/intelligence/predictive-analytics" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-white-60 hover:text-white-80 py-1">Predictive Analytics</Link>
                        <Link to="/intelligence/attribution-graph" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-white-60 hover:text-white-80 py-1">Attribution Graph</Link>
                        <Link to="/intelligence/smart-routing" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-white-60 hover:text-white-80 py-1">Smart Routing</Link>
                        <Link to="/intelligence/link-immunity" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-white-60 hover:text-white-80 py-1">Link Immunity</Link>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-white-40 mb-2">New Features</p>
                      <div className="space-y-1">
                        <Link to="/features/event-halo" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-sm text-white-60 hover:text-white-80 py-1">
                          Event Halo <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-white/20 text-white/80">NEW</span>
                        </Link>
                        <Link to="/features/one-tap-scanner" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-sm text-white-60 hover:text-white-80 py-1">
                          One-Tap Scanner <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-white/20 text-white/80">NEW</span>
                        </Link>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Solutions Section */}
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-lg font-medium text-white-80 hover:text-white-90 transition-colors">
                    Solutions
                    <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-4 space-y-1 pb-2">
                    <Link to="/solutions/marketers" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-white-60 hover:text-white-80 py-1">For Marketers</Link>
                    <Link to="/solutions/sales" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-white-60 hover:text-white-80 py-1">For Sales</Link>
                    <Link to="/solutions/marketing-ops" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-white-60 hover:text-white-80 py-1">For Marketing Ops</Link>
                    <Link to="/solutions/developers" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-white-60 hover:text-white-80 py-1">For Developers</Link>
                    <Link to="/solutions/partner-managers" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-white-60 hover:text-white-80 py-1">For Partners</Link>
                    <Link to="/solutions/revops" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-white-60 hover:text-white-80 py-1">For RevOps</Link>
                  </CollapsibleContent>
                </Collapsible>

                {/* Direct Links */}
                <Link 
                  to="/resources" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-lg font-medium text-white-80 hover:text-white-90 transition-colors"
                >
                  Resources
                </Link>
                <Link 
                  to="/pricing" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-lg font-medium text-white-80 hover:text-white-90 transition-colors"
                >
                  Pricing
                </Link>
                
                <div className="border-t border-white-10 pt-4 mt-4 flex flex-col gap-3">
                  <Link to="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-white-70 hover:text-white-90 hover:bg-white/10">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/early-access" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="marketing" className="w-full rounded-full bg-white text-black hover:bg-white/90">
                      Get Early Access
                    </Button>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};
