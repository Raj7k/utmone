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
import { Badge } from "@/components/ui/badge";
import { Menu, ChevronRight, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatText } from "@/utils/textFormatter";

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hideNav, setHideNav] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const location = useLocation();
  
  // Transform scroll progress to width percentage
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
    // Check if any announcement is currently visible
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
    
    // Poll for changes
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
        className={`max-w-[1280px] mx-auto bg-white backdrop-blur-xl rounded-full border border-gray-200 px-6 md:px-8 py-3 md:py-4 flex items-center justify-between relative transition-all duration-300 ${
          isScrolled ? 'scale-95' : 'scale-100'
        }`}
        style={{
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.03)"
        }}
      >
        {/* Scroll Progress Bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-accent-teal via-accent-yellow-green to-accent-mint origin-left rounded-full"
          style={{ width: progressWidth }}
        />
          {/* Logo with hover effect */}
          <Link to="/" className="flex items-center group transition-apple hover:opacity-70">
            <UtmOneLogo size="lg" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center">
            <NavigationMenu>
              <NavigationMenuList className="gap-2">
                {/* Features Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-9 px-3 text-small-text font-medium text-foreground/70 hover:text-foreground data-[state=open]:text-foreground bg-transparent transition-apple">
                    {formatText("features")}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[500px] grid-cols-2 gap-2 p-4">
                      {/* Core Features */}
                      <li className="col-span-2">
                        <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Core
                        </div>
                      </li>
                      <li>
                        <Link
                          to="/features/short-links"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                        >
                          <div className="text-sm font-medium leading-none">{formatText("Short Links")}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {formatText("branded, memorable links that work")}
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/features/utm-builder"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                        >
                          <div className="text-sm font-medium leading-none">UTM Builder</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            consistent parameters, every time
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/features/qr-generator"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                        >
                          <div className="text-sm font-medium leading-none">QR Generator</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            on-brand codes that convert
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/features/analytics"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                        >
                          <div className="text-sm font-medium leading-none">Analytics</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            clear data, better decisions
                          </p>
                        </Link>
                      </li>
                      
                      {/* Intelligence */}
                      <li className="col-span-2 mt-2">
                        <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Intelligence
                        </div>
                      </li>
                      <li>
                        <Link
                          to="/features/predictive-analytics"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                        >
                          <div className="text-sm font-medium leading-none">Predictive Analytics</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            forecast clicks before they happen
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/features/attribution-graph"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                        >
                          <div className="text-sm font-medium leading-none">Attribution Graph</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            bayesian multi-touch attribution
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/features/smart-routing"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                        >
                          <div className="text-sm font-medium leading-none">Smart Routing</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            contextual bandit geo-targeting
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/features/link-immunity"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                        >
                          <div className="text-sm font-medium leading-none">Link Immunity</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            zero broken links guaranteed
                          </p>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Solutions Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-9 px-3 text-small-text font-medium text-foreground/70 hover:text-foreground data-[state=open]:text-foreground bg-transparent transition-apple">
                    {formatText("solutions")}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-2 p-4">
                      <li>
                        <Link
                          to="/solutions/enterprise"
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary",
                            location.pathname === "/solutions/enterprise" && "bg-primary/10"
                          )}
                        >
                          <div className="text-sm font-medium leading-none">Enterprise</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            security, scale, governance
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/solutions/agencies"
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary",
                            location.pathname === "/solutions/agencies" && "bg-primary/10"
                          )}
                        >
                          <div className="text-sm font-medium leading-none">Agencies</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            multi-client workspaces
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/solutions/marketers"
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary",
                            location.pathname === "/solutions/marketers" && "bg-primary/10"
                          )}
                        >
                          <div className="text-sm font-medium leading-none">For Marketing Teams</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            campaigns work better when links do
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/solutions/sales"
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary",
                            location.pathname === "/solutions/sales" && "bg-primary/10"
                          )}
                        >
                          <div className="text-sm font-medium leading-none">For Sales Teams</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            share faster, share cleaner
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/solutions/marketing-ops"
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary",
                            location.pathname === "/solutions/marketing-ops" && "bg-primary/10"
                          )}
                        >
                          <div className="text-sm font-medium leading-none">For Marketing Ops</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            governance, without the friction
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/solutions/developers"
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary",
                            location.pathname === "/solutions/developers" && "bg-primary/10"
                          )}
                        >
                          <div className="text-sm font-medium leading-none">For Developers</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            a clean api for a cleaner stack
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/solutions/partner-managers"
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary",
                            location.pathname === "/solutions/partner-managers" && "bg-primary/10"
                          )}
                        >
                          <div className="text-sm font-medium leading-none">For Partner Managers</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            clear attribution, zero manual work
                          </p>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* How It Works - Top Level Link */}
                <NavigationMenuItem>
                  <Link
                    to="/how-it-works"
                    className="inline-flex h-9 items-center px-3 text-small-text font-medium text-foreground/70 hover:text-foreground transition-apple"
                  >
                    {formatText("how it works")}
                  </Link>
                </NavigationMenuItem>

                {/* Resources Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-9 px-3 text-small-text font-medium text-foreground/70 hover:text-foreground data-[state=open]:text-foreground bg-transparent transition-apple">
                    {formatText("resources")}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[500px] grid-cols-2 gap-2 p-4">
                      <li>
                        <Link
                          to="/resources/guides"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                        >
                          <div className="text-sm font-medium leading-none">Guides</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            long-form educational content
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/resources/playbooks"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                        >
                          <div className="text-sm font-medium leading-none">Playbooks</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            step-by-step implementation
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/resources/templates"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                        >
                          <div className="text-sm font-medium leading-none">Templates</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            ready-to-use resources
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/resources/frameworks"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                        >
                          <div className="text-sm font-medium leading-none">Frameworks</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            mental models & methodologies
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/resources/examples"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                        >
                          <div className="text-sm font-medium leading-none">Examples</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            real-world use cases
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/resources/glossary"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                        >
                          <div className="text-sm font-medium leading-none">Glossary</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            utm & analytics terminology
                          </p>
                        </Link>
                      </li>
                      
                      {/* Free Tools Section */}
                      <li className="col-span-2 mt-2">
                        <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Free Tools
                        </div>
                      </li>
                      <li>
                        <Link
                          to="/tools/shorten"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                        >
                          <div className="text-sm font-medium leading-none">URL Shortener</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            instant short links
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tools/utm-builder"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                        >
                          <div className="text-sm font-medium leading-none">UTM Builder</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            build clean utm urls
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tools/qr"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                        >
                          <div className="text-sm font-medium leading-none">QR Generator</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            branded qr codes
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tools/link-health-checker"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                        >
                          <div className="text-sm font-medium leading-none">Link Health Checker</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            check for broken links
                          </p>
                        </Link>
                      </li>
                          <div className="text-sm font-medium leading-none">Glossary</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            70+ defined terms
                          </p>
                        </Link>
                      </li>
                      <li>
                        <span className="block select-none space-y-1 rounded-md p-3 leading-none opacity-50 pointer-events-none">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium leading-none">2026 Salary Report</span>
                            <span className="px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground border border-border rounded">Coming Soon</span>
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            comprehensive salary benchmarks
                          </p>
                        </span>
                      </li>
                      <li>
                        <Link
                          to="/resources/tools"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Tools</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            interactive calculators
                          </p>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link 
                    to="/pricing"
                    className={cn(
                      "inline-flex h-9 w-max items-center justify-center rounded-md px-3 text-small-text font-medium text-foreground/70 hover:opacity-70 transition-apple",
                      location.pathname === "/pricing" && "text-foreground"
                    )}
                  >
                    pricing
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link 
                    to="/about"
                    className={cn(
                      "inline-flex h-9 w-max items-center justify-center rounded-md px-3 text-small-text font-medium text-foreground/70 hover:opacity-70 transition-apple",
                      location.pathname === "/about" && "text-foreground"
                    )}
                  >
                    about
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link 
                    to="/partners/apply"
                    className={cn(
                      "inline-flex h-9 w-max items-center justify-center rounded-md px-3 text-small-text font-medium text-foreground/70 hover:opacity-70 transition-apple",
                      location.pathname.startsWith("/partners") && "text-foreground"
                    )}
                  >
                    partners
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                {/* Logo at top of mobile menu */}
                <div className="flex items-center gap-2 mb-6">
                  <UtmOneLogo size="md" />
                </div>
                
                <nav className="flex flex-col gap-4 mt-8">
                  {/* How It Works */}
                  <div className="space-y-1">
                    <Link to="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors">
                      <span>How It Works</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-muted-foreground px-3 mb-2">Features</p>
                    <Link to="/features/short-links" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
                      <span>Short Links</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                    <Link to="/features/utm-builder" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
                      <span>UTM Builder</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                    <Link to="/features/qr-generator" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
                      <span>QR Generator</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                    <Link to="/features/analytics" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
                      <span>Analytics</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                    <Link to="/features/governance" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
                      <span>Enterprise Control</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                    <Link to="/features/clean-track" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
                      <span>Clean-Track</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                    <Link to="/features/partner-program" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
                      <span>Partner Program</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-muted-foreground px-3 mb-2">Solutions</p>
                    <Link to="/solutions/marketers" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
                      <span>For Marketing Teams</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                    <Link to="/solutions/sales" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
                      <span>For Sales Teams</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                    <Link to="/solutions/marketing-ops" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
                      <span>For Marketing Ops</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                    <Link to="/solutions/developers" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
                      <span>For Developers</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-muted-foreground px-3 mb-2">Resources</p>
                    <Link to="/resources/tools" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
                      <span>Salary Tools</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                    <span className="flex items-center justify-between px-3 py-2 text-sm rounded-md opacity-50 pointer-events-none">
                      <div className="flex items-center gap-2">
                        <span>2026 Salary Report</span>
                        <Badge className="bg-muted text-muted-foreground text-xs border border-border">Coming Soon</Badge>
                      </div>
                    </span>
                    <Link to="/resources" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
                      <span>All Resources</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="border-t pt-4 space-y-1">
                    <Link to="/partners/apply" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
                      <span>Partners</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                    <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
                      <span>Pricing</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                    <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
                      <span>About</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="border-t pt-4">
                    <Link to="/early-access" onClick={() => setMobileMenuOpen(false)}>
                      <MagneticButton className="w-full rounded-full" strength={0.15}>
                        Get Early Access
                      </MagneticButton>
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Right: CTA */}
          <div className="flex items-center gap-3">
            <Link to="/early-access">
              <MagneticButton
                variant="default"
                size="sm"
                className="font-medium rounded-full"
                strength={0.2}
              >
                get early access
              </MagneticButton>
            </Link>
          </div>
        </nav>
      </header>
    );
  };
