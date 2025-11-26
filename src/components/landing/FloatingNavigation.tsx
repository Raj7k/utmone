import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export const FloatingNavigation = () => {
  const [showFloating, setShowFloating] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloating(window.scrollY > 600);
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {showFloating && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 
                     bg-white/95 backdrop-blur-xl shadow-lg 
                     rounded-full border border-border/30 
                     px-4 md:px-6 py-2 md:py-3
                     max-w-[95vw] md:max-w-none"
        >
          <div className="flex items-center gap-2 md:gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center transition-apple hover:opacity-70">
              <UtmOneLogo size="sm" showIcon={false} />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center">
              <NavigationMenu>
                <NavigationMenuList className="gap-1">
                  {/* Product Dropdown */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="h-8 px-3 text-xs font-medium text-foreground/70 hover:text-foreground data-[state=open]:text-foreground bg-transparent transition-apple">
                      product
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[350px] gap-2 p-3">
                        <li>
                          <Link
                            to="/features/short-links"
                            className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary"
                          >
                            <div className="text-xs font-medium leading-none">Short Links</div>
                            <p className="line-clamp-1 text-xs leading-snug text-muted-foreground">
                              branded, memorable links
                            </p>
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/features/utm-builder"
                            className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary"
                          >
                            <div className="text-xs font-medium leading-none">UTM Builder</div>
                            <p className="line-clamp-1 text-xs leading-snug text-muted-foreground">
                              consistent parameters
                            </p>
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/features/qr-generator"
                            className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary"
                          >
                            <div className="text-xs font-medium leading-none">QR Generator</div>
                            <p className="line-clamp-1 text-xs leading-snug text-muted-foreground">
                              on-brand codes
                            </p>
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/features/analytics"
                            className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary"
                          >
                            <div className="text-xs font-medium leading-none">Analytics</div>
                            <p className="line-clamp-1 text-xs leading-snug text-muted-foreground">
                              clear data, better decisions
                            </p>
                          </Link>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {/* Solutions Dropdown */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="h-8 px-3 text-xs font-medium text-foreground/70 hover:text-foreground data-[state=open]:text-foreground bg-transparent transition-apple">
                      solutions
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[350px] gap-2 p-3">
                        <li>
                          <Link
                            to="/solutions/marketers"
                            className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary"
                          >
                            <div className="text-xs font-medium leading-none">For Marketers</div>
                            <p className="line-clamp-1 text-xs leading-snug text-muted-foreground">
                              campaigns work better
                            </p>
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/solutions/sales"
                            className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary"
                          >
                            <div className="text-xs font-medium leading-none">For Sales</div>
                            <p className="line-clamp-1 text-xs leading-snug text-muted-foreground">
                              share faster, cleaner
                            </p>
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/solutions/marketing-ops"
                            className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary"
                          >
                            <div className="text-xs font-medium leading-none">For Marketing Ops</div>
                            <p className="line-clamp-1 text-xs leading-snug text-muted-foreground">
                              governance without friction
                            </p>
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/solutions/developers"
                            className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary"
                          >
                            <div className="text-xs font-medium leading-none">For Developers</div>
                            <p className="line-clamp-1 text-xs leading-snug text-muted-foreground">
                              a clean api
                            </p>
                          </Link>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-2 ml-auto">
              <Link to="/auth">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 px-3 text-xs hover:bg-primary/10 hover:text-primary transition-apple hidden md:inline-flex"
                >
                  sign in
                </Button>
              </Link>
              <Link to="/early-access">
                <Button 
                  size="sm"
                  className="h-8 px-4 text-xs rounded-full bg-gradient-to-r from-blazeOrange to-blazeOrange/90 hover:from-blazeOrange/90 hover:to-blazeOrange/80 text-white shadow-md transition-apple"
                >
                  get early access
                </Button>
              </Link>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};
