import { Link } from "react-router-dom";
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Menu, ChevronDown } from "lucide-react";
import { 
  ProductDropdown, 
  FeaturesDropdown, 
  SolutionsDropdown, 
  ResourcesDropdown 
} from "@/components/lazy/LazyMegaDropdowns";
import { createDropdownPreloadHandler } from "@/lib/dropdownPreloader";

export const ResourcesNavigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Calculate scroll progress
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
      setProgressWidth(progress);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 py-4 px-4 md:px-8 transition-all duration-300">
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
        <div
          className="absolute bottom-0 left-0 h-[2px] origin-left rounded-full bg-gradient-to-r from-black/20 via-black/40 to-black/20 transition-[width] duration-100 ease-out"
          style={{ width: `${progressWidth}%` }}
        />

        <Link to="/" className="flex items-center group transition-all hover:opacity-70">
          <UtmOneLogo size="lg" variant="dark" />
        </Link>

        {/* Desktop Navigation with Mega-Dropdowns */}
        <div className="hidden lg:flex items-center gap-1">
          <NavigationMenu>
            <NavigationMenuList className="gap-1">
              <NavigationMenuItem>
                <NavigationMenuTrigger 
                  className="h-9 px-3 text-sm font-medium text-zinc-600 hover:text-zinc-900 data-[state=open]:text-zinc-900 bg-transparent"
                  onMouseEnter={createDropdownPreloadHandler('product')}
                  onFocus={createDropdownPreloadHandler('product')}
                >
                  Product
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ProductDropdown variant="light" />
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger 
                  className="h-9 px-3 text-sm font-medium text-zinc-600 hover:text-zinc-900 data-[state=open]:text-zinc-900 bg-transparent"
                  onMouseEnter={createDropdownPreloadHandler('features')}
                  onFocus={createDropdownPreloadHandler('features')}
                >
                  Features
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <FeaturesDropdown variant="light" />
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger 
                  className="h-9 px-3 text-sm font-medium text-zinc-600 hover:text-zinc-900 data-[state=open]:text-zinc-900 bg-transparent"
                  onMouseEnter={createDropdownPreloadHandler('solutions')}
                  onFocus={createDropdownPreloadHandler('solutions')}
                >
                  Solutions
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <SolutionsDropdown variant="light" />
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger 
                  className="h-9 px-3 text-sm font-medium text-zinc-600 hover:text-zinc-900 data-[state=open]:text-zinc-900 bg-transparent"
                  onMouseEnter={createDropdownPreloadHandler('resources')}
                  onFocus={createDropdownPreloadHandler('resources')}
                >
                  Resources
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ResourcesDropdown variant="light" />
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/pricing" className="h-9 px-3 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors flex items-center">
                  Pricing
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Link to="/sign-in">
            <Button variant="ghost" size="sm" className="text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100">Sign In</Button>
          </Link>
          <Link to="/early-access">
            <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-800">Get Started</Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden flex items-center gap-2">
          <Link to="/early-access">
            <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-full text-xs h-9 px-4">get access</Button>
          </Link>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-zinc-900 hover:bg-zinc-100"><Menu className="w-5 h-5" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] bg-white border-zinc-200 overflow-y-auto">
              <nav className="flex flex-col gap-2 mt-8">
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-lg font-medium text-zinc-700 hover:text-zinc-900">
                    Product <ChevronDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-4 space-y-2 pb-2">
                    <Link to="/product" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-zinc-500 hover:text-zinc-800 py-1">Overview</Link>
                    <Link to="/features/short-links" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-zinc-500 hover:text-zinc-800 py-1">Short Links</Link>
                    <Link to="/features/analytics" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-zinc-500 hover:text-zinc-800 py-1">Analytics</Link>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-lg font-medium text-zinc-700 hover:text-zinc-900">
                    Features <ChevronDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-4 space-y-2 pb-2">
                    <Link to="/features/utm-builder" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-zinc-500 hover:text-zinc-800 py-1">UTM Builder</Link>
                    <Link to="/features/qr-generator" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-zinc-500 hover:text-zinc-800 py-1">QR Generator</Link>
                    <Link to="/features/event-halo" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-800 py-1">
                      Event Halo <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-zinc-200 text-zinc-600">NEW</span>
                    </Link>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-lg font-medium text-zinc-700 hover:text-zinc-900">
                    Solutions <ChevronDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-4 space-y-2 pb-2">
                    <Link to="/solutions/marketers" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-zinc-500 hover:text-zinc-800 py-1">For Marketers</Link>
                    <Link to="/solutions/sales" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-zinc-500 hover:text-zinc-800 py-1">For Sales</Link>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-lg font-medium text-zinc-700 hover:text-zinc-900">
                    Resources <ChevronDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-4 space-y-2 pb-2">
                    <Link to="/resources/guides" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-zinc-500 hover:text-zinc-800 py-1">Guides</Link>
                    <Link to="/resources/playbooks" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-zinc-500 hover:text-zinc-800 py-1">Playbooks</Link>
                    <Link to="/resources/reports" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-zinc-500 hover:text-zinc-800 py-1">Reports</Link>
                  </CollapsibleContent>
                </Collapsible>

                <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="py-2 text-lg font-medium text-zinc-700 hover:text-zinc-900">Pricing</Link>

                <div className="border-t border-zinc-200 pt-4 mt-4 space-y-3">
                  <Link to="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-zinc-300 text-zinc-900">Sign In</Button>
                  </Link>
                  <Link to="/early-access" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-zinc-900 text-white hover:bg-zinc-800">Get Started</Button>
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
