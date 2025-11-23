import { Link, useLocation } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { announcements } from "@/lib/announcementConfig";
import { AnnouncementScheduler } from "@/lib/announcementScheduler";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ChevronRight, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const location = useLocation();
  
  // Transform scroll progress to width percentage
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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
      className={`h-[72px] border-b border-border/50 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 sticky z-50 transition-apple ${
        announcementVisible ? "top-[48px]" : "top-0"
      } ${
        isScrolled ? "bg-white/95 shadow-sm" : "bg-white/80"
      }`}
    >
      {/* Scroll Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-accent-teal via-accent-yellow-green to-accent-mint origin-left"
        style={{ width: progressWidth }}
      />

      <div className="max-w-[1280px] mx-auto px-8 h-full">
        <nav className="flex items-center justify-between h-full">
          {/* Logo with hover effect */}
          <Link to="/" className="flex items-center group transition-apple hover:opacity-70">
            <img 
              src="/src/assets/utm-one-logo.svg" 
              alt="utm.one logo" 
              className="h-10 md:h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center">
            <NavigationMenu>
              <NavigationMenuList className="gap-2">
                {/* Product Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-9 px-3 text-small-text font-medium text-foreground/70 hover:text-foreground data-[state=open]:text-foreground bg-transparent transition-apple">
                    product
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-2 p-4">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/features/short-links"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Short Links</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              branded, memorable links that work
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/features/utm-builder"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">UTM Builder</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              consistent parameters, every time
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/features/qr-generator"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">QR Generator</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              on-brand codes that convert
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/features/analytics"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Analytics</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              clear data, better decisions
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/features/governance"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Enterprise Control</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              governance without the friction
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Solutions Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-9 px-3 text-small-text font-medium text-foreground/70 hover:text-foreground data-[state=open]:text-foreground bg-transparent transition-apple">
                    solutions
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-2 p-4">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/solutions/marketers"
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              location.pathname === "/solutions/marketers" && "bg-accent"
                            )}
                          >
                            <div className="text-sm font-medium leading-none">For Marketing Teams</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              campaigns work better when links do
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/solutions/sales"
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              location.pathname === "/solutions/sales" && "bg-accent"
                            )}
                          >
                            <div className="text-sm font-medium leading-none">For Sales Teams</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              share faster, share cleaner
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/solutions/marketing-ops"
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              location.pathname === "/solutions/marketing-ops" && "bg-accent"
                            )}
                          >
                            <div className="text-sm font-medium leading-none">For Marketing Ops</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              governance, without the friction
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/solutions/developers"
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              location.pathname === "/solutions/developers" && "bg-accent"
                            )}
                          >
                            <div className="text-sm font-medium leading-none">For Developers</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              a clean api for a cleaner stack
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Direct Links */}
                <NavigationMenuItem>
                  <Link to="/docs">
                    <NavigationMenuLink className={cn(
                      "inline-flex h-9 w-max items-center justify-center rounded-md px-3 text-small-text font-medium text-foreground/70 hover:opacity-70 transition-apple",
                      location.pathname === "/docs" && "text-foreground"
                    )}>
                      docs
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/pricing">
                    <NavigationMenuLink className={cn(
                      "inline-flex h-9 w-max items-center justify-center rounded-md px-3 text-small-text font-medium text-foreground/70 hover:opacity-70 transition-apple",
                      location.pathname === "/pricing" && "text-foreground"
                    )}>
                      pricing
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/about">
                    <NavigationMenuLink className={cn(
                      "inline-flex h-9 w-max items-center justify-center rounded-md px-3 text-small-text font-medium text-foreground/70 hover:opacity-70 transition-apple",
                      location.pathname === "/about" && "text-foreground"
                    )}>
                      about
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/partners/apply">
                    <NavigationMenuLink className={cn(
                      "inline-flex h-9 w-max items-center justify-center rounded-md px-3 text-small-text font-medium text-foreground/70 hover:opacity-70 transition-apple",
                      location.pathname.startsWith("/partners") && "text-foreground"
                    )}>
                      partners
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/docs/api">
                    <NavigationMenuLink className={cn(
                      "inline-flex h-9 w-max items-center justify-center rounded-md px-3 text-small-text font-medium text-foreground/70 hover:opacity-70 transition-apple",
                      location.pathname === "/docs/api" && "text-foreground"
                    )}>
                      api
                    </NavigationMenuLink>
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
            <img 
              src="/src/assets/utm-one-logo.svg" 
              alt="utm.one" 
              className="h-8 w-auto"
            />
                </div>
                
                <nav className="flex flex-col gap-4 mt-8">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-muted-foreground px-3 mb-2">Product</p>
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

                  <div className="border-t pt-4 space-y-1">
                    <Link to="/docs" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
                      <span>Docs</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                    <Link to="/docs/api" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
                      <span>API</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
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
                    <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full mb-2">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/early-access" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full rounded-full">
                        Get Early Access
                      </Button>
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Right: Sign In + CTA */}
          <div className="flex items-center gap-3">
            <Link to="/auth" className="hidden lg:inline-flex">
              <Button variant="ghost" size="sm" className="text-[14px] font-medium text-foreground/70 hover:text-foreground">
                Sign In
              </Button>
            </Link>
            <Link to="/early-access">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Button 
                  variant="default"
                  size="sm"
                  className="font-medium rounded-full"
                >
                  get early access
                </Button>
              </motion.div>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};
