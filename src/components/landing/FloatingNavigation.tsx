import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";
import { 
  ChevronUp, Link2, Network, QrCode, Database, Layers,
  Tags, BarChart3, TrendingUp, GitBranch, Route, Shield,
  Building2, Users, Rocket, Megaphone, Settings, Briefcase, Code,
  DollarSign, Handshake, FileBarChart,
  BookOpen, ClipboardList, FileText, Puzzle, FolderOpen, BookMarked, SearchCheck,
  Sparkles
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
          className="fixed bottom-4 md:bottom-8 left-1/2 z-50
                     bg-white/95 backdrop-blur-xl shadow-xl 
                     rounded-full border-2 border-border/10 
                     px-3 md:px-6 py-2 md:py-3
                     max-w-[calc(100vw-2rem)] md:max-w-none
                     overflow-x-auto scrollbar-hide"
        >
          <div className="flex items-center gap-1 md:gap-4 whitespace-nowrap">
            {/* Logo */}
            <Link to="/" className="flex items-center transition-apple hover:opacity-70 shrink-0">
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
                  className="w-[500px] p-3 bg-white/95 backdrop-blur-xl z-[60]"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/products/link-orchestration"
                      className="group block select-none space-y-1.5 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Link2 className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <div className="text-xs font-medium leading-none">Link Orchestration</div>
                      </div>
                      <p className="text-[10px] leading-snug text-muted-foreground">
                        control & reliability
                      </p>
                    </Link>

                    <Link
                      to="/products/journey-intelligence"
                      className="group block select-none space-y-1.5 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Network className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <div className="text-xs font-medium leading-none">Journey Intelligence</div>
                      </div>
                      <p className="text-[10px] leading-snug text-muted-foreground">
                        truth & revenue
                      </p>
                    </Link>

                    <Link
                      to="/products/qr-studio"
                      className="group block select-none space-y-1.5 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <QrCode className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <div className="text-xs font-medium leading-none">QR Studio</div>
                      </div>
                      <p className="text-[10px] leading-snug text-muted-foreground">
                        physical reliability
                      </p>
                    </Link>

                    <Link
                      to="/products/data-pipeline"
                      className="group block select-none space-y-1.5 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Database className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <div className="text-xs font-medium leading-none">Data Pipeline</div>
                      </div>
                      <p className="text-[10px] leading-snug text-muted-foreground">
                        freedom & scale
                      </p>
                    </Link>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Features Dropdown */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="h-8 px-3 text-xs font-medium text-foreground/70 hover:bg-primary/10 hover:text-primary transition-apple"
                  >
                    features <ChevronUp className="ml-1 h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  side="top" 
                  align="center" 
                  sideOffset={12}
                  className="w-[500px] p-3 bg-white/95 backdrop-blur-xl z-[60]"
                >
                  <div className="flex gap-3">
                    {/* Featured Card */}
                    <div className="w-[180px] rounded-lg bg-gradient-to-br from-primary/10 via-primary/5 to-background p-3 flex flex-col justify-between border border-primary/20">
                      <div>
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mb-2">
                          <Sparkles className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="text-xs font-semibold mb-1">feature-first</h3>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                          built for clean data
                        </p>
                      </div>
                      <Link 
                        to="/features" 
                        className="text-[10px] font-medium text-primary hover:underline mt-3 inline-flex items-center gap-1"
                      >
                        explore <ChevronUp className="w-2.5 h-2.5" />
                      </Link>
                    </div>

                    {/* Grid */}
                    <div className="flex-1">
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          to="/features/short-links"
                          className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-primary/10"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <Link2 className="w-3 h-3 text-primary" />
                            </div>
                            <span className="text-xs font-medium">Short Links</span>
                          </div>
                        </Link>

                        <Link
                          to="/features/utm-builder"
                          className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-primary/10"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <Tags className="w-3 h-3 text-primary" />
                            </div>
                            <span className="text-xs font-medium">UTM Builder</span>
                          </div>
                        </Link>

                        <Link
                          to="/features/qr-generator"
                          className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-primary/10"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <QrCode className="w-3 h-3 text-primary" />
                            </div>
                            <span className="text-xs font-medium">QR Gen</span>
                          </div>
                        </Link>

                        <Link
                          to="/features/analytics"
                          className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-primary/10"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <BarChart3 className="w-3 h-3 text-primary" />
                            </div>
                            <span className="text-xs font-medium">Analytics</span>
                          </div>
                        </Link>

                        <Link
                          to="/features/predictive-analytics"
                          className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-primary/10"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <TrendingUp className="w-3 h-3 text-primary" />
                            </div>
                            <span className="text-xs font-medium">Predictive</span>
                          </div>
                        </Link>

                        <Link
                          to="/features/smart-routing"
                          className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-primary/10"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <Route className="w-3 h-3 text-primary" />
                            </div>
                            <span className="text-xs font-medium">Smart Routing</span>
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
                    className="h-8 px-3 text-xs font-medium text-foreground/70 hover:bg-primary/10 hover:text-primary transition-apple"
                  >
                    solutions <ChevronUp className="ml-1 h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  side="top" 
                  align="center" 
                  sideOffset={12}
                  className="w-[500px] p-3 bg-white/95 backdrop-blur-xl z-[60]"
                >
                  <div className="flex gap-3">
                    {/* Featured Card */}
                    <div className="w-[180px] rounded-lg bg-gradient-to-br from-primary/10 via-primary/5 to-background p-3 flex flex-col justify-between border border-primary/20">
                      <div>
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mb-2">
                          <Users className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="text-xs font-semibold mb-1">built for teams</h3>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                          every role gets clean data
                        </p>
                      </div>
                      <Link 
                        to="/solutions" 
                        className="text-[10px] font-medium text-primary hover:underline mt-3 inline-flex items-center gap-1"
                      >
                        see all <ChevronUp className="w-2.5 h-2.5" />
                      </Link>
                    </div>

                    {/* Grid */}
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <Link
                        to="/solutions/enterprise"
                        className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-primary/10"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Building2 className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-xs font-medium">Enterprise</span>
                        </div>
                      </Link>

                      <Link
                        to="/solutions/marketers"
                        className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-primary/10"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Megaphone className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-xs font-medium">Marketing</span>
                        </div>
                      </Link>

                      <Link
                        to="/solutions/agencies"
                        className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-primary/10"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Users className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-xs font-medium">Agencies</span>
                        </div>
                      </Link>

                      <Link
                        to="/solutions/sales"
                        className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-primary/10"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Briefcase className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-xs font-medium">Sales</span>
                        </div>
                      </Link>

                      <Link
                        to="/solutions/developers"
                        className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-primary/10"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Code className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-xs font-medium">Developers</span>
                        </div>
                      </Link>

                      <Link
                        to="/solutions/revops"
                        className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-primary/10"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <DollarSign className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-xs font-medium">RevOps</span>
                        </div>
                      </Link>
                    </div>
                  </div>
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
                  className="w-[500px] p-3 bg-white/95 backdrop-blur-xl z-[60]"
                >
                  <div className="flex gap-3">
                    {/* Featured Card */}
                    <div className="w-[180px] rounded-lg bg-gradient-to-br from-primary/10 via-primary/5 to-background p-3 flex flex-col justify-between border border-primary/20">
                      <div>
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mb-2">
                          <BookOpen className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="text-xs font-semibold mb-1">learn & explore</h3>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                          guides, tools, templates
                        </p>
                      </div>
                      <Link 
                        to="/resources" 
                        className="text-[10px] font-medium text-primary hover:underline mt-3 inline-flex items-center gap-1"
                      >
                        browse <ChevronUp className="w-2.5 h-2.5" />
                      </Link>
                    </div>

                    {/* Grid */}
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <Link
                        to="/resources/guides"
                        className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-primary/10"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <BookOpen className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-xs font-medium">Guides</span>
                        </div>
                      </Link>

                      <Link
                        to="/resources/playbooks"
                        className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-primary/10"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <ClipboardList className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-xs font-medium">Playbooks</span>
                        </div>
                      </Link>

                      <Link
                        to="/resources/templates"
                        className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-primary/10"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <FileText className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-xs font-medium">Templates</span>
                        </div>
                      </Link>

                      <Link
                        to="/resources/glossary"
                        className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-primary/10"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <BookMarked className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-xs font-medium">Glossary</span>
                        </div>
                      </Link>

                      <Link
                        to="/tools/shorten"
                        className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-primary/10"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Link2 className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-xs font-medium">Shortener</span>
                        </div>
                      </Link>

                      <Link
                        to="/tools/qr"
                        className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-primary/10"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <QrCode className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-xs font-medium">QR Gen</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-2">
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
