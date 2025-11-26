import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";
import { ChevronUp } from "lucide-react";
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
    
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {showFloating && (
        <motion.nav
          initial={{ y: 100, x: "-50%", opacity: 0 }}
          animate={{ y: 0, x: "-50%", opacity: 1 }}
          exit={{ y: 100, x: "-50%", opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-8 left-1/2 z-50
                     bg-white/95 backdrop-blur-xl shadow-xl 
                     rounded-full border-2 border-border/10 
                     px-4 md:px-6 py-2 md:py-3
                     max-w-[95vw] md:max-w-none"
        >
          <div className="flex items-center gap-2 md:gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center transition-apple hover:opacity-70">
              <UtmOneLogo size="sm" showIcon={false} />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {/* Product Dropdown */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="h-8 px-3 text-xs font-medium text-foreground/70 hover:bg-primary/10 hover:text-primary transition-apple"
                  >
                    product <ChevronUp className="ml-1 h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  side="top" 
                  align="center" 
                  sideOffset={12}
                  className="w-[350px] p-3 bg-white/95 backdrop-blur-xl z-[60]"
                >
                  <ul className="grid gap-2">
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
                </PopoverContent>
              </Popover>

              {/* Solutions Dropdown */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="h-8 px-3 text-xs font-medium text-foreground/70 hover:bg-primary/10 hover:text-primary transition-apple"
                  >
                    solutions <ChevronUp className="ml-1 h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  side="top" 
                  align="center" 
                  sideOffset={12}
                  className="w-[350px] p-3 bg-white/95 backdrop-blur-xl z-[60]"
                >
                  <ul className="grid gap-2">
                    <li>
                      <Link
                        to="/solutions/marketers"
                        className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary"
                      >
                        <div className="text-xs font-medium">Marketing Teams</div>
                        <p className="text-xs text-muted-foreground">campaigns work better when links do</p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/solutions/sales"
                        className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary"
                      >
                        <div className="text-xs font-medium">Sales Teams</div>
                        <p className="text-xs text-muted-foreground">share faster, share cleaner</p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/solutions/marketing-ops"
                        className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary"
                      >
                        <div className="text-xs font-medium">Marketing Ops</div>
                        <p className="text-xs text-muted-foreground">governance without the friction</p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/solutions/developers"
                        className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary"
                      >
                        <div className="text-xs font-medium">Developers</div>
                        <p className="text-xs text-muted-foreground">a clean api for a cleaner stack</p>
                      </Link>
                    </li>
                  </ul>
                </PopoverContent>
              </Popover>

              {/* Resources Dropdown */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="h-8 px-3 text-xs font-medium text-foreground/70 hover:bg-primary/10 hover:text-primary transition-apple"
                  >
                    resources <ChevronUp className="ml-1 h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  side="top" 
                  align="center" 
                  sideOffset={12}
                  className="w-[350px] p-3 bg-white/95 backdrop-blur-xl z-[60]"
                >
                  <ul className="grid gap-2">
                    <li>
                      <Link
                        to="/resources/guides"
                        className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary"
                      >
                        <div className="text-xs font-medium">Guides</div>
                        <p className="text-xs text-muted-foreground">long-form educational content</p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/resources/playbooks"
                        className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary"
                      >
                        <div className="text-xs font-medium">Playbooks</div>
                        <p className="text-xs text-muted-foreground">step-by-step implementation</p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/resources/templates"
                        className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary"
                      >
                        <div className="text-xs font-medium">Templates</div>
                        <p className="text-xs text-muted-foreground">ready-to-use resources</p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/resources/glossary"
                        className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary"
                      >
                        <div className="text-xs font-medium">Glossary</div>
                        <p className="text-xs text-muted-foreground">utm & tracking terms explained</p>
                      </Link>
                    </li>
                  </ul>
                </PopoverContent>
              </Popover>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-2">
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
