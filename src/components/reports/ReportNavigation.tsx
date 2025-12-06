import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface ReportNavigationProps {
  onScrollToSection: (sectionId: string) => void;
  activeSection?: string;
}

export const ReportNavigation = ({ onScrollToSection, activeSection }: ReportNavigationProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  
  // Transform scroll progress to width percentage
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (sectionId: string) => {
    onScrollToSection(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className={`h-[72px] border-b border-white/10 backdrop-blur-xl sticky top-0 z-50 transition-apple ${
        isScrolled ? "bg-zinc-900/95 shadow-sm" : "bg-zinc-900/80"
      }`}
    >
      {/* Scroll Progress Bar - Obsidian Platinum */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-white/20 via-white/40 to-white/20 origin-left"
        style={{ width: progressWidth }}
      />
      
      <div className="max-w-[1280px] mx-auto px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center group transition-apple hover:opacity-70">
            <span className="text-xl font-bold text-foreground">utm.one</span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <NavigationMenu>
              <NavigationMenuList className="gap-2">
                {/* Insights Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-9 px-3 text-small-text font-medium text-foreground/70 hover:text-foreground data-[state=open]:text-foreground bg-transparent transition-apple">
                    Insights
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-2 p-4">
                      <li>
                        <button
                          onClick={() => scrollTo("marketing-section")}
                          className="w-full text-left block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Global Salary Benchmarks</div>
                          <p className="line-clamp-2 text-sm leading-snug text-secondary-label">
                            comprehensive salary data across roles
                          </p>
                        </button>
                      </li>
                      <li>
                        <div className="w-full text-left block select-none space-y-1 rounded-md p-3 leading-none opacity-50 cursor-not-allowed">
                          <div className="text-sm font-medium leading-none">Quarterly Talent Report</div>
                          <p className="line-clamp-2 text-sm leading-snug text-secondary-label">
                            Coming Soon
                          </p>
                        </div>
                      </li>
                      <li>
                        <div className="w-full text-left block select-none space-y-1 rounded-md p-3 leading-none opacity-50 cursor-not-allowed">
                          <div className="text-sm font-medium leading-none">GTM Hiring Index</div>
                          <p className="line-clamp-2 text-sm leading-snug text-secondary-label">
                            Coming Soon
                          </p>
                        </div>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Roles Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-9 px-3 text-small-text font-medium text-foreground/70 hover:text-foreground data-[state=open]:text-foreground bg-transparent transition-apple">
                    Roles
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-2 p-4">
                      <li>
                        <button
                          onClick={() => scrollTo("marketing-section")}
                          className="w-full text-left block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Marketing</div>
                          <p className="line-clamp-2 text-sm leading-snug text-secondary-label">
                            roles, salaries, and benchmarks
                          </p>
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => scrollTo("sales-section")}
                          className="w-full text-left block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Sales</div>
                          <p className="line-clamp-2 text-sm leading-snug text-secondary-label">
                            OTE, quotas, and comp structures
                          </p>
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => scrollTo("revops-section")}
                          className="w-full text-left block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">RevOps & Marketing Ops</div>
                          <p className="line-clamp-2 text-sm leading-snug text-secondary-label">
                            ops roles with high demand
                          </p>
                        </button>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Regions Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-9 px-3 text-small-text font-medium text-foreground/70 hover:text-foreground data-[state=open]:text-foreground bg-transparent transition-apple">
                    Regions
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-2 p-4">
                      <li>
                        <button
                          onClick={() => scrollTo("regional-section")}
                          className="w-full text-left block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">United States</div>
                          <p className="line-clamp-2 text-sm leading-snug text-secondary-label">
                            state-by-state salary breakdown
                          </p>
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => scrollTo("regional-section")}
                          className="w-full text-left block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">India</div>
                          <p className="line-clamp-2 text-sm leading-snug text-secondary-label">
                            city-level insights and trends
                          </p>
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => scrollTo("regional-section")}
                          className="w-full text-left block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Europe & APAC</div>
                          <p className="line-clamp-2 text-sm leading-snug text-secondary-label">
                            international markets
                          </p>
                        </button>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Data Library Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-9 px-3 text-small-text font-medium text-foreground/70 hover:text-foreground data-[state=open]:text-foreground bg-transparent transition-apple">
                    Data Library
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-2 p-4">
                      <li>
                        <button
                          onClick={() => scrollTo("marketing-section")}
                          className="w-full text-left block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Salary Tables</div>
                          <p className="line-clamp-2 text-sm leading-snug text-secondary-label">
                            role-specific compensation data
                          </p>
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => scrollTo("skill-section")}
                          className="w-full text-left block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Skill Taxonomy</div>
                          <p className="line-clamp-2 text-sm leading-snug text-secondary-label">
                            in-demand skills and premiums
                          </p>
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => scrollTo("calculator-section")}
                          className="w-full text-left block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Interactive Tools</div>
                          <p className="line-clamp-2 text-sm leading-snug text-secondary-label">
                            calculators and benchmarking
                          </p>
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => scrollTo("data-sources")}
                          className="w-full text-left block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Methodology</div>
                          <p className="line-clamp-2 text-sm leading-snug text-secondary-label">
                            data sources and methodology
                          </p>
                        </button>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <button
                    onClick={() => scrollTo("data-sources")}
                    className="inline-flex h-9 w-max items-center justify-center rounded-md px-3 text-small-text font-medium text-foreground/70 hover:text-foreground transition-apple"
                  >
                    Open-Source
                  </button>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Open navigation menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-4 mt-8">
                  <button
                    onClick={() => scrollTo("marketing-section")}
                    className="text-left text-sm font-medium hover:text-blazeOrange transition-apple"
                  >
                    Global Salary Benchmarks
                  </button>
                  <button
                    onClick={() => scrollTo("marketing-section")}
                    className="text-left text-sm font-medium hover:text-blazeOrange transition-apple"
                  >
                    Marketing Roles
                  </button>
                  <button
                    onClick={() => scrollTo("sales-section")}
                    className="text-left text-sm font-medium hover:text-blazeOrange transition-apple"
                  >
                    Sales Roles
                  </button>
                  <button
                    onClick={() => scrollTo("revops-section")}
                    className="text-left text-sm font-medium hover:text-blazeOrange transition-apple"
                  >
                    RevOps & Marketing Ops
                  </button>
                  <button
                    onClick={() => scrollTo("regional-section")}
                    className="text-left text-sm font-medium hover:text-blazeOrange transition-apple"
                  >
                    Regional Deep Dives
                  </button>
                  <button
                    onClick={() => scrollTo("skill-section")}
                    className="text-left text-sm font-medium hover:text-blazeOrange transition-apple"
                  >
                    Skills Analysis
                  </button>
                  <button
                    onClick={() => scrollTo("calculator-section")}
                    className="text-left text-sm font-medium hover:text-blazeOrange transition-apple"
                  >
                    Salary Calculator
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};