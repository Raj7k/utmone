import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";
import { 
  ChevronUp, Link2, Network, QrCode, Database,
  Tags, BarChart3, Route, Shield,
  Building2, Megaphone, Briefcase, Code,
  BookOpen, ClipboardList
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const FloatingNavigation = () => {
  const [showFloating, setShowFloating] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloating(window.scrollY > 600);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed bottom-4 md:bottom-8 left-1/2 z-50 rounded-full px-3 md:px-6 py-2 md:py-3 max-w-[calc(100vw-2rem)] md:max-w-none overflow-x-auto scrollbar-hide obsidian-glass-80 backdrop-blur-xl border border-white-10 shadow-[inset_0_1px_0_0_hsl(var(--white-10)),0_25px_50px_-12px_hsl(0_0%_0%/0.5)] transition-all duration-300 ease-out ${
        showFloating 
          ? 'opacity-100 translate-y-0 -translate-x-1/2' 
          : 'opacity-0 translate-y-24 -translate-x-1/2 pointer-events-none'
      }`}
    >
      <div className="flex items-center gap-1 md:gap-4 whitespace-nowrap">
        {/* Logo */}
        <Link to="/" className="flex items-center transition-apple hover:opacity-70 shrink-0">
          <UtmOneLogo size="sm" showIcon={false} className="[&>span]:text-white" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {/* Product Dropdown */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-8 px-3 text-xs font-medium transition-apple hover:bg-white/10 text-white-70 hover:text-white-90"
              >
                product <ChevronUp className="ml-1 h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              side="top" 
              align="center" 
              sideOffset={12}
              className="w-[500px] p-3 z-[60] obsidian-glass-80 backdrop-blur-xl border border-white-10"
            >
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/products/link-orchestration"
                  className="group block select-none space-y-1.5 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-md flex items-center justify-center group-hover:bg-white/10 transition-colors bg-white-05">
                      <Link2 className="w-3.5 h-3.5 text-white-80" />
                    </div>
                    <div className="text-xs font-medium leading-none text-white-90">Link Orchestration</div>
                  </div>
                  <p className="text-[10px] leading-snug text-white-50">control & reliability</p>
                </Link>

                <Link
                  to="/products/journey-intelligence"
                  className="group block select-none space-y-1.5 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-md flex items-center justify-center group-hover:bg-white/10 transition-colors bg-white-05">
                      <Network className="w-3.5 h-3.5 text-white-80" />
                    </div>
                    <div className="text-xs font-medium leading-none text-white-90">Journey Intelligence</div>
                  </div>
                  <p className="text-[10px] leading-snug text-white-50">truth & revenue</p>
                </Link>

                <Link
                  to="/products/qr-studio"
                  className="group block select-none space-y-1.5 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-md flex items-center justify-center group-hover:bg-white/10 transition-colors bg-white-05">
                      <QrCode className="w-3.5 h-3.5 text-white-80" />
                    </div>
                    <div className="text-xs font-medium leading-none text-white-90">QR Studio</div>
                  </div>
                  <p className="text-[10px] leading-snug text-white-50">physical reliability</p>
                </Link>

                <Link
                  to="/products/data-pipeline"
                  className="group block select-none space-y-1.5 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-md flex items-center justify-center group-hover:bg-white/10 transition-colors bg-white-05">
                      <Database className="w-3.5 h-3.5 text-white-80" />
                    </div>
                    <div className="text-xs font-medium leading-none text-white-90">Data Pipeline</div>
                  </div>
                  <p className="text-[10px] leading-snug text-white-50">freedom & scale</p>
                </Link>
              </div>
            </PopoverContent>
          </Popover>

          {/* Features Dropdown */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-8 px-3 text-xs font-medium hover:bg-white/10 transition-apple text-white-70 hover:text-white-90"
              >
                features <ChevronUp className="ml-1 h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              side="top" 
              align="center" 
              sideOffset={12}
              className="w-[500px] p-3 z-[60] obsidian-glass-80 backdrop-blur-xl border border-white-10"
            >
              <div className="flex gap-3">
                {/* Featured Features */}
                <div className="w-[180px] flex flex-col gap-1.5">
                  <Link 
                    to="/features/analytics" 
                    className="group rounded-xl p-2 flex items-center gap-2 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-[1.03] shadow-sm bg-white-05"
                  >
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-white-10">
                      <BarChart3 className="w-3 h-3 text-white-80" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[10px] font-semibold leading-tight text-white-90">clean-track™</h3>
                    </div>
                  </Link>

                  <Link 
                    to="/features/link-immunity" 
                    className="group rounded-xl p-2 flex items-center gap-2 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-[1.03] shadow-sm bg-white-05"
                  >
                    <div className="w-6 h-6 rounded-xl flex items-center justify-center shrink-0 bg-white-10">
                      <Shield className="w-3 h-3 text-white-80" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[10px] font-semibold leading-tight text-white-90">link immunity</h3>
                    </div>
                  </Link>

                  <Link 
                    to="/features/smart-routing" 
                    className="group rounded-xl p-2 flex items-center gap-2 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-[1.03] shadow-sm bg-white-05"
                  >
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 bg-white-10">
                      <Route className="w-3 h-3 text-white-80" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[10px] font-semibold leading-tight text-white-90">smart routing</h3>
                    </div>
                  </Link>
                </div>

                {/* Grid */}
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/features/short-links"
                      className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-white/10"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded flex items-center justify-center group-hover:bg-white/10 transition-colors bg-white-05">
                          <Link2 className="w-3 h-3 text-white-80" />
                        </div>
                        <span className="text-xs font-medium text-white-90">Short Links</span>
                      </div>
                    </Link>

                    <Link
                      to="/features/utm-builder"
                      className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-white/10"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded flex items-center justify-center group-hover:bg-white/10 transition-colors bg-white-05">
                          <Tags className="w-3 h-3 text-white-80" />
                        </div>
                        <span className="text-xs font-medium text-white-90">UTM Builder</span>
                      </div>
                    </Link>

                    <Link
                      to="/features/qr-generator"
                      className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-white/10"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded flex items-center justify-center group-hover:bg-white/10 transition-colors bg-white-05">
                          <QrCode className="w-3 h-3 text-white-80" />
                        </div>
                        <span className="text-xs font-medium text-white-90">QR Gen</span>
                      </div>
                    </Link>

                    <Link
                      to="/features/analytics"
                      className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-white/10"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded flex items-center justify-center group-hover:bg-white/10 transition-colors bg-white-05">
                          <BarChart3 className="w-3 h-3 text-white-80" />
                        </div>
                        <span className="text-xs font-medium text-white-90">Analytics</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Solutions Dropdown */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-8 px-3 text-xs font-medium hover:bg-white/10 transition-apple text-white-70 hover:text-white-90"
              >
                solutions <ChevronUp className="ml-1 h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              side="top" 
              align="center" 
              sideOffset={12}
              className="w-[400px] p-3 z-[60] obsidian-glass-80 backdrop-blur-xl border border-white-10"
            >
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/solutions/marketers"
                  className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-white/10"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded flex items-center justify-center group-hover:bg-white/10 transition-colors bg-white-05">
                      <Megaphone className="w-3 h-3 text-white-80" />
                    </div>
                    <span className="text-xs font-medium text-white-90">Marketing</span>
                  </div>
                </Link>

                <Link
                  to="/solutions/sales"
                  className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-white/10"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded flex items-center justify-center group-hover:bg-white/10 transition-colors bg-white-05">
                      <Briefcase className="w-3 h-3 text-white-80" />
                    </div>
                    <span className="text-xs font-medium text-white-90">Sales</span>
                  </div>
                </Link>

                <Link
                  to="/solutions/developers"
                  className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-white/10"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded flex items-center justify-center group-hover:bg-white/10 transition-colors bg-white-05">
                      <Code className="w-3 h-3 text-white-80" />
                    </div>
                    <span className="text-xs font-medium text-white-90">Developers</span>
                  </div>
                </Link>

                <Link
                  to="/solutions/enterprise"
                  className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-white/10"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded flex items-center justify-center group-hover:bg-white/10 transition-colors bg-white-05">
                      <Building2 className="w-3 h-3 text-white-80" />
                    </div>
                    <span className="text-xs font-medium text-white-90">Enterprise</span>
                  </div>
                </Link>
              </div>
            </PopoverContent>
          </Popover>

          {/* Resources Dropdown */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-8 px-3 text-xs font-medium hover:bg-white/10 transition-apple text-white-70 hover:text-white-90"
              >
                resources <ChevronUp className="ml-1 h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              side="top" 
              align="center" 
              sideOffset={12}
              className="w-[300px] p-3 z-[60] obsidian-glass-80 backdrop-blur-xl border border-white-10"
            >
              <div className="flex flex-col gap-2">
                <Link
                  to="/docs"
                  className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-white/10"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded flex items-center justify-center group-hover:bg-white/10 transition-colors bg-white-05">
                      <BookOpen className="w-3 h-3 text-white-80" />
                    </div>
                    <span className="text-xs font-medium text-white-90">Documentation</span>
                  </div>
                </Link>

                <Link
                  to="/resources/playbooks"
                  className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-white/10"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded flex items-center justify-center group-hover:bg-white/10 transition-colors bg-white-05">
                      <ClipboardList className="w-3 h-3 text-white-80" />
                    </div>
                    <span className="text-xs font-medium text-white-90">Playbooks</span>
                  </div>
                </Link>
              </div>
            </PopoverContent>
          </Popover>

          <Link to="/pricing">
            <Button 
              variant="ghost" 
              className="h-8 px-3 text-xs font-medium hover:bg-white/10 transition-apple text-white-70 hover:text-white-90"
            >
              pricing
            </Button>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-1">
          <Link to="/product">
            <Button variant="ghost" className="h-7 px-2 text-[11px] font-medium hover:bg-white/10 text-white-70">
              product
            </Button>
          </Link>
          <Link to="/pricing">
            <Button variant="ghost" className="h-7 px-2 text-[11px] font-medium hover:bg-white/10 text-white-70">
              pricing
            </Button>
          </Link>
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-1.5 md:gap-2 ml-1 md:ml-2 shrink-0">
          <Link to="/auth" className="hidden md:block">
            <Button 
              variant="ghost" 
              className="h-8 px-3 text-xs font-medium hover:bg-white/10 transition-apple text-white-70 hover:text-white-90"
            >
              sign in
            </Button>
          </Link>
          <Link to="/auth?mode=signup">
            <Button className="h-7 md:h-8 px-3 md:px-4 text-[11px] md:text-xs font-medium bg-white text-black hover:bg-white/90 transition-apple rounded-full">
              get started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};