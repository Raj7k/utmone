import { Link, useLocation } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Menu, ChevronRight, BookOpen, FileText, Layout, CheckSquare, 
  Network, Image, BookMarked, GraduationCap, Calculator, BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ResourcesNavigation - Light mode navigation for Resources section
 * Dark text on white background
 */
export const ResourcesNavigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const location = useLocation();
  
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const resourceLinks = [
    { label: "Guides", href: "/resources/guides", icon: BookOpen, description: "Long-form content on tracking and analytics" },
    { label: "Playbooks", href: "/resources/playbooks", icon: FileText, description: "Step-by-step tactical workflows" },
    { label: "Templates", href: "/resources/templates", icon: Layout, description: "Copy/paste templates for UTM setup" },
    { label: "Checklists", href: "/resources/checklists", icon: CheckSquare, description: "Actionable audit checklists" },
    { label: "Frameworks", href: "/resources/frameworks", icon: Network, description: "Mental models for clean tracking" },
    { label: "Examples", href: "/resources/examples", icon: Image, description: "Real-world UTM examples" },
    { label: "Glossary", href: "/resources/glossary", icon: BookMarked, description: "Canonical definitions" },
    { label: "Academy", href: "/resources/academy", icon: GraduationCap, description: "Micro lessons on UTM" },
    { label: "Tools", href: "/resources/tools", icon: Calculator, description: "Interactive calculators" },
    { label: "Reports", href: "/resources/reports", icon: BarChart3, description: "Research and benchmarks" },
  ];

  return (
    <header className={`sticky top-0 z-50 py-4 px-4 md:px-8 transition-all duration-300`}>
      <nav 
        className={`max-w-[1280px] mx-auto backdrop-blur-xl rounded-full px-6 md:px-8 py-3 md:py-4 flex items-center justify-between relative transition-all duration-300 ${
          isScrolled ? 'scale-95 shadow-lg bg-white/95 border border-black/[0.08]' : 'scale-100 bg-white/80 border border-black/[0.08]'
        }`}
        style={{
          boxShadow: isScrolled 
            ? '0 4px 24px -4px hsl(0 0% 0% / 0.1), inset 0 1px 0 0 hsl(0 0% 100% / 1)' 
            : 'inset 0 1px 0 0 hsl(0 0% 100% / 0.5)'
        }}
      >
        {/* Scroll Progress Bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] origin-left rounded-full bg-gradient-to-r from-black/20 via-black/40 to-black/20"
          style={{ width: progressWidth }}
        />

        {/* Logo */}
        <Link to="/" className="flex items-center group transition-all hover:opacity-70">
          <UtmOneLogo size="lg" variant="dark" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          <NavigationMenu>
            <NavigationMenuList className="gap-1">
              {/* Resources Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9 px-3 text-sm font-medium text-zinc-600 hover:text-zinc-900 data-[state=open]:text-zinc-900 bg-transparent transition-colors">
                  Resources
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[500px] p-4 bg-white/[0.98] backdrop-blur-[40px] border border-black/10 shadow-lg">
                    <div className="grid grid-cols-2 gap-2">
                      {resourceLinks.map((link) => {
                        const IconComponent = link.icon;
                        return (
                          <Link
                            key={link.href}
                            to={link.href}
                            className="group block select-none rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-zinc-100"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-md flex items-center justify-center bg-zinc-100 group-hover:bg-zinc-200 transition-colors">
                                <IconComponent className="w-4 h-4 text-zinc-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-zinc-900">{link.label}</div>
                                <p className="text-xs text-zinc-500 leading-snug mt-0.5">
                                  {link.description}
                                </p>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Product Link */}
              <NavigationMenuItem>
                <Link 
                  to="/product" 
                  className="h-9 px-3 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors flex items-center"
                >
                  Product
                </Link>
              </NavigationMenuItem>

              {/* Pricing Link */}
              <NavigationMenuItem>
                <Link 
                  to="/pricing" 
                  className="h-9 px-3 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors flex items-center"
                >
                  Pricing
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Link to="/sign-in">
            <Button variant="ghost" size="sm" className="text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100">
              Sign In
            </Button>
          </Link>
          <Link to="/early-access">
            <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-800">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-zinc-900 hover:bg-zinc-100">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-white border-zinc-200">
              <div className="flex flex-col gap-6 mt-8">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-3 mb-2">Resources</p>
                  {resourceLinks.map((link) => {
                    const IconComponent = link.icon;
                    return (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                      >
                        <IconComponent className="w-4 h-4" />
                        <span className="text-sm font-medium">{link.label}</span>
                      </Link>
                    );
                  })}
                </div>

                <div className="border-t border-zinc-200 pt-6 space-y-3">
                  <Link to="/product" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-zinc-600 hover:text-zinc-900">
                      Product
                    </Button>
                  </Link>
                  <Link to="/pricing" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-zinc-600 hover:text-zinc-900">
                      Pricing
                    </Button>
                  </Link>
                </div>

                <div className="border-t border-zinc-200 pt-6 space-y-3">
                  <Link to="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-zinc-300 text-zinc-900">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/early-access" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-zinc-900 text-white hover:bg-zinc-800">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};
