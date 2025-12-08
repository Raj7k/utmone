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
import { 
  Menu, ChevronRight, Link as LinkIcon, Link2, Network, QrCode, Database, Layers,
  Tags, BarChart3, TrendingUp, GitBranch, Route, Shield,
  Building2, Users, Rocket, Megaphone, Settings, Briefcase, Code, 
  DollarSign, Handshake, FileBarChart,
  BookOpen, ClipboardList, FileText, Puzzle, FolderOpen, BookMarked, SearchCheck, Wrench,
  Sparkles, Bot, Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatText } from "@/utils/textFormatter";

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
                  <div className="w-[650px] p-4 flex gap-4 obsidian-glass-80 backdrop-blur-xl border border-white-10">
                    {/* Featured Card - Left */}
                    <div className="w-[220px] rounded-lg p-4 flex flex-col justify-between bg-white-05 border border-white-10">
                      <div>
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-white-10">
                          <Layers className="w-5 h-5 text-white-80" />
                        </div>
                        <h3 className="text-sm font-semibold mb-2 text-white-90">customer-journey</h3>
                        <p className="text-xs leading-relaxed text-white-50">
                          from shortening to attribution, manage every link touchpoint in one place
                        </p>
                      </div>
                      <Link 
                        to="/product" 
                        className="text-xs font-medium hover:underline mt-4 inline-flex items-center gap-1 text-white-80 hover:text-white-90"
                      >
                        explore platform <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>

                    {/* Products Grid - Right */}
                    <div className="flex-1">
                      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider mb-2 text-white-50">
                        Products
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          to="/products/link-orchestration"
                          className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-md flex items-center justify-center transition-colors bg-white-10">
                              <Link2 className="w-4 h-4 text-white-80" />
                            </div>
                            <div className="text-sm font-medium leading-none text-white-90">Link Orchestration</div>
                          </div>
                          <p className="text-xs leading-snug text-white-50">control & reliability</p>
                        </Link>

                        <Link
                          to="/products/journey-intelligence"
                          className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-md flex items-center justify-center transition-colors bg-white-10">
                              <Network className="w-4 h-4 text-white-80" />
                            </div>
                            <div className="text-sm font-medium leading-none text-white-90">Journey Intelligence</div>
                          </div>
                          <p className="text-xs leading-snug text-white-50">truth & revenue</p>
                        </Link>

                        <Link
                          to="/products/qr-studio"
                          className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-md flex items-center justify-center transition-colors bg-white-10">
                              <QrCode className="w-4 h-4 text-white-80" />
                            </div>
                            <div className="text-sm font-medium leading-none text-white-90">QR Studio</div>
                          </div>
                          <p className="text-xs leading-snug text-white-50">physical reliability</p>
                        </Link>

                        <Link
                          to="/products/data-pipeline"
                          className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-md flex items-center justify-center transition-colors bg-white-10">
                              <Database className="w-4 h-4 text-white-80" />
                            </div>
                            <div className="text-sm font-medium leading-none text-white-90">Data Pipeline</div>
                          </div>
                          <p className="text-xs leading-snug text-white-50">freedom & scale</p>
                        </Link>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Features Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9 px-3 text-small-text font-medium bg-transparent transition-apple text-white-70 hover:text-white-90 data-[state=open]:text-white-90">
                  {formatText("features")}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[650px] p-4 flex gap-4 obsidian-glass-80 backdrop-blur-xl border border-white-10">
                    {/* Featured Features - Left */}
                    <div className="w-[220px] flex flex-col gap-2">
                      <Link 
                        to="/features/analytics" 
                        className="group rounded-xl p-3 flex items-center gap-3 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl shadow-sm bg-white-05"
                      >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-white-10">
                          <BarChart3 className="w-4 h-4 text-white-80" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs font-semibold mb-0.5 text-white-90">clean-track™</h3>
                          <p className="text-[10px] leading-tight text-white-50">data you can trust</p>
                        </div>
                      </Link>

                      <Link 
                        to="/features/link-immunity" 
                        className="group rounded-xl p-3 flex items-center gap-3 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl shadow-sm bg-white-05"
                      >
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-white-10">
                          <Shield className="w-4 h-4 text-white-80" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs font-semibold mb-0.5 text-white-90">link immunity</h3>
                          <p className="text-[10px] leading-tight text-white-50">zero broken links</p>
                        </div>
                      </Link>

                      <Link 
                        to="/features/smart-routing" 
                        className="group rounded-xl p-3 flex items-center gap-3 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl shadow-sm bg-white-05"
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white-10">
                          <Route className="w-4 h-4 text-white-80" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs font-semibold mb-0.5 text-white-90">smart routing</h3>
                          <p className="text-[10px] leading-tight text-white-50">geo-targeting magic</p>
                        </div>
                      </Link>
                    </div>

                    {/* Features Grid - Right */}
                    <div className="flex-1">
                      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider mb-2 text-white-50">
                        Core Features
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <Link
                          to="/features/short-links"
                          className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-md flex items-center justify-center transition-colors bg-white-10">
                              <Link2 className="w-4 h-4 text-white-80" />
                            </div>
                            <div className="text-sm font-medium leading-none text-white-90">Short Links</div>
                          </div>
                          <p className="text-xs leading-snug text-white-50">branded, memorable links</p>
                        </Link>

                        <Link
                          to="/features/utm-builder"
                          className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-md flex items-center justify-center transition-colors bg-white-10">
                              <Tags className="w-4 h-4 text-white-80" />
                            </div>
                            <div className="text-sm font-medium leading-none text-white-90">UTM Builder</div>
                          </div>
                          <p className="text-xs leading-snug text-white-50">consistent campaign tracking</p>
                        </Link>

                        <Link
                          to="/features/qr-generator"
                          className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-md flex items-center justify-center transition-colors bg-white-10">
                              <QrCode className="w-4 h-4 text-white-80" />
                            </div>
                            <div className="text-sm font-medium leading-none text-white-90">QR Generator</div>
                          </div>
                          <p className="text-xs leading-snug text-white-50">branded, trackable codes</p>
                        </Link>

                        <Link
                          to="/features/analytics"
                          className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-md flex items-center justify-center transition-colors bg-white-10">
                              <TrendingUp className="w-4 h-4 text-white-80" />
                            </div>
                            <div className="text-sm font-medium leading-none text-white-90">Analytics</div>
                          </div>
                          <p className="text-xs leading-snug text-white-50">real-time insights</p>
                        </Link>
                      </div>

                      {/* AI Intelligence Section */}
                      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider mb-2 text-white-50">
                        AI Intelligence
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          to="/features/predictive-analytics"
                          className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-md flex items-center justify-center transition-colors bg-white-10">
                              <Sparkles className="w-4 h-4 text-white-80" />
                            </div>
                            <div className="text-sm font-medium leading-none text-white-90">Predictive</div>
                          </div>
                          <p className="text-xs leading-snug text-white-50">forecast performance</p>
                        </Link>

                        <Link
                          to="/features/attribution-graph"
                          className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-md flex items-center justify-center transition-colors bg-white-10">
                              <GitBranch className="w-4 h-4 text-white-80" />
                            </div>
                            <div className="text-sm font-medium leading-none text-white-90">Attribution</div>
                          </div>
                          <p className="text-xs leading-snug text-white-50">revenue mapping</p>
                        </Link>

                        <Link
                          to="/features/smart-routing"
                          className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-md flex items-center justify-center transition-colors bg-white-10">
                              <Route className="w-4 h-4 text-white-80" />
                            </div>
                            <div className="text-sm font-medium leading-none text-white-90">Smart Routing</div>
                          </div>
                          <p className="text-xs leading-snug text-white-50">geo-targeting magic</p>
                        </Link>

                        <Link
                          to="/features/link-immunity"
                          className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-md flex items-center justify-center transition-colors bg-white-10">
                              <Shield className="w-4 h-4 text-white-80" />
                            </div>
                            <div className="text-sm font-medium leading-none text-white-90">Link Immunity</div>
                          </div>
                          <p className="text-xs leading-snug text-white-50">zero broken links</p>
                        </Link>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Solutions Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9 px-3 text-small-text font-medium bg-transparent transition-apple text-white-70 hover:text-white-90 data-[state=open]:text-white-90">
                  {formatText("solutions")}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[650px] p-4 flex gap-4 obsidian-glass-80 backdrop-blur-xl border border-white-10">
                    {/* By Segment - Left */}
                    <div className="w-[200px]">
                      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider mb-2 text-white-50">
                        By Segment
                      </div>
                      <div className="flex flex-col gap-1">
                        <Link
                          to="/solutions/enterprise"
                          className="group block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-md flex items-center justify-center transition-colors bg-white-10">
                              <Building2 className="w-4 h-4 text-white-80" />
                            </div>
                            <div className="text-sm font-medium leading-none text-white-90">Enterprise</div>
                          </div>
                        </Link>

                        <Link
                          to="/solutions/agencies"
                          className="group block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-md flex items-center justify-center transition-colors bg-white-10">
                              <Users className="w-4 h-4 text-white-80" />
                            </div>
                            <div className="text-sm font-medium leading-none text-white-90">Agencies</div>
                          </div>
                        </Link>

                        <Link
                          to="/solutions/startups"
                          className="group block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-md flex items-center justify-center transition-colors bg-white-10">
                              <Rocket className="w-4 h-4 text-white-80" />
                            </div>
                            <div className="text-sm font-medium leading-none text-white-90">Startups</div>
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* By Role - Right */}
                    <div className="flex-1">
                      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider mb-2 text-white-50">
                        By Role
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          to="/solutions/marketers"
                          className="group block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-md flex items-center justify-center transition-colors bg-white-10">
                              <Megaphone className="w-4 h-4 text-white-80" />
                            </div>
                            <div className="text-sm font-medium leading-none text-white-90">Marketing</div>
                          </div>
                        </Link>

                        <Link
                          to="/solutions/marketing-ops"
                          className="group block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-md flex items-center justify-center transition-colors bg-white-10">
                              <Settings className="w-4 h-4 text-white-80" />
                            </div>
                            <div className="text-sm font-medium leading-none text-white-90">Marketing Ops</div>
                          </div>
                        </Link>

                        <Link
                          to="/solutions/sales"
                          className="group block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-md flex items-center justify-center transition-colors bg-white-10">
                              <Briefcase className="w-4 h-4 text-white-80" />
                            </div>
                            <div className="text-sm font-medium leading-none text-white-90">Sales</div>
                          </div>
                        </Link>

                        <Link
                          to="/solutions/developers"
                          className="group block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-md flex items-center justify-center transition-colors bg-white-10">
                              <Code className="w-4 h-4 text-white-80" />
                            </div>
                            <div className="text-sm font-medium leading-none text-white-90">Developers</div>
                          </div>
                        </Link>

                        <Link
                          to="/solutions/revops"
                          className="group block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-md flex items-center justify-center transition-colors bg-white-10">
                              <DollarSign className="w-4 h-4 text-white-80" />
                            </div>
                            <div className="text-sm font-medium leading-none text-white-90">RevOps</div>
                          </div>
                        </Link>

                        <Link
                          to="/solutions/partner-managers"
                          className="group block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-md flex items-center justify-center transition-colors bg-white-10">
                              <Handshake className="w-4 h-4 text-white-80" />
                            </div>
                            <div className="text-sm font-medium leading-none text-white-90">Partners</div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Resources Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9 px-3 text-small-text font-medium bg-transparent transition-apple text-white-70 hover:text-white-90 data-[state=open]:text-white-90">
                  {formatText("resources")}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[750px] p-4 flex gap-4 obsidian-glass-80 backdrop-blur-xl border border-white-10">
                    {/* Coming Soon Featured - Left */}
                    <div className="w-[240px] flex flex-col gap-2">
                      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider mb-1 text-white-50">
                        Coming Soon
                      </div>
                      
                      <Link 
                        to="/resources/playbooks/llm-ranking" 
                        className="group rounded-xl p-3 flex items-center gap-3 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-[1.02] bg-white-05"
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white-10">
                          <Bot className="w-4 h-4 text-white-80" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="text-xs font-semibold text-white-90">LLM Ranking</h3>
                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-white/30 text-white-70">NEW</Badge>
                          </div>
                          <p className="text-[10px] leading-tight text-white-50">AI search optimization</p>
                        </div>
                      </Link>

                      <Link 
                        to="/resources/frameworks/b2b-attribution" 
                        className="group rounded-xl p-3 flex items-center gap-3 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-[1.02] bg-white-05"
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white-10">
                          <Network className="w-4 h-4 text-white-80" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="text-xs font-semibold text-white-90">B2B Attribution</h3>
                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-white/30 text-white-70">NEW</Badge>
                          </div>
                          <p className="text-[10px] leading-tight text-white-50">revenue attribution framework</p>
                        </div>
                      </Link>

                      <Link 
                        to="/resources/reports/salary-benchmark-2026" 
                        className="group rounded-xl p-3 flex items-center gap-3 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-[1.02] bg-white-05"
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white-10">
                          <FileBarChart className="w-4 h-4 text-white-80" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="text-xs font-semibold text-white-90">Salary Benchmark</h3>
                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-white/30 text-white-70">FEATURED</Badge>
                          </div>
                          <p className="text-[10px] leading-tight text-white-50">2026 global report</p>
                        </div>
                      </Link>
                    </div>

                    {/* All Resource Categories - Right */}
                    <div className="flex-1">
                      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider mb-2 text-white-50">
                        Browse Resources
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <Link
                          to="/resources/guides"
                          className="group block select-none rounded-md p-2.5 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-md flex items-center justify-center transition-colors bg-white-10">
                              <BookOpen className="w-3.5 h-3.5 text-white-80" />
                            </div>
                            <div>
                              <div className="text-sm font-medium leading-none text-white-90">Guides</div>
                              <div className="text-[10px] text-white-50">6 guides</div>
                            </div>
                          </div>
                        </Link>

                        <Link
                          to="/resources/playbooks"
                          className="group block select-none rounded-md p-2.5 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-md flex items-center justify-center transition-colors bg-white-10">
                              <ClipboardList className="w-3.5 h-3.5 text-white-80" />
                            </div>
                            <div>
                              <div className="text-sm font-medium leading-none text-white-90">Playbooks</div>
                              <div className="text-[10px] text-white-50">7 playbooks</div>
                            </div>
                          </div>
                        </Link>

                        <Link
                          to="/resources/templates"
                          className="group block select-none rounded-md p-2.5 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-md flex items-center justify-center transition-colors bg-white-10">
                              <FileText className="w-3.5 h-3.5 text-white-80" />
                            </div>
                            <div>
                              <div className="text-sm font-medium leading-none text-white-90">Templates</div>
                              <div className="text-[10px] text-white-50">4 templates</div>
                            </div>
                          </div>
                        </Link>

                        <Link
                          to="/resources/checklists"
                          className="group block select-none rounded-md p-2.5 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-md flex items-center justify-center transition-colors bg-white-10">
                              <SearchCheck className="w-3.5 h-3.5 text-white-80" />
                            </div>
                            <div>
                              <div className="text-sm font-medium leading-none text-white-90">Checklists</div>
                              <div className="text-[10px] text-white-50">3 checklists</div>
                            </div>
                          </div>
                        </Link>

                        <Link
                          to="/resources/frameworks"
                          className="group block select-none rounded-md p-2.5 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-md flex items-center justify-center transition-colors bg-white-10">
                              <Puzzle className="w-3.5 h-3.5 text-white-80" />
                            </div>
                            <div>
                              <div className="text-sm font-medium leading-none text-white-90">Frameworks</div>
                              <div className="text-[10px] text-white-50">4 frameworks</div>
                            </div>
                          </div>
                        </Link>

                        <Link
                          to="/resources/examples"
                          className="group block select-none rounded-md p-2.5 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-md flex items-center justify-center transition-colors bg-white-10">
                              <FolderOpen className="w-3.5 h-3.5 text-white-80" />
                            </div>
                            <div>
                              <div className="text-sm font-medium leading-none text-white-90">Examples</div>
                              <div className="text-[10px] text-white-50">3 examples</div>
                            </div>
                          </div>
                        </Link>

                        <Link
                          to="/resources/glossary"
                          className="group block select-none rounded-md p-2.5 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-md flex items-center justify-center transition-colors bg-white-10">
                              <BookMarked className="w-3.5 h-3.5 text-white-80" />
                            </div>
                            <div>
                              <div className="text-sm font-medium leading-none text-white-90">Glossary</div>
                              <div className="text-[10px] text-white-50">70+ terms</div>
                            </div>
                          </div>
                        </Link>

                        <Link
                          to="/tools"
                          className="group block select-none rounded-md p-2.5 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-md flex items-center justify-center transition-colors bg-white-10">
                              <Wrench className="w-3.5 h-3.5 text-white-80" />
                            </div>
                            <div>
                              <div className="text-sm font-medium leading-none text-white-90">Tools</div>
                              <div className="text-[10px] text-white-50">8 free tools</div>
                            </div>
                          </div>
                        </Link>

                        <Link
                          to="/resources/reports"
                          className="group block select-none rounded-md p-2.5 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-md flex items-center justify-center transition-colors bg-white-10">
                              <FileBarChart className="w-3.5 h-3.5 text-white-80" />
                            </div>
                            <div>
                              <div className="text-sm font-medium leading-none text-white-90">Reports</div>
                              <div className="text-[10px] text-white-50">1 report</div>
                            </div>
                          </div>
                        </Link>

                        <Link
                          to="/resources/academy"
                          className="group block select-none rounded-md p-2.5 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-md flex items-center justify-center transition-colors bg-white-10">
                              <Target className="w-3.5 h-3.5 text-white-80" />
                            </div>
                            <div>
                              <div className="text-sm font-medium leading-none text-white-90">Academy</div>
                              <div className="text-[10px] text-white-50">learn utm.one</div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
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

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden text-white-70 hover:text-white-90 hover:bg-white/10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] obsidian-glass-80 border-l border-white-08 backdrop-blur-xl">
              <nav className="flex flex-col gap-4 mt-8">
                <Link 
                  to="/product" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium text-white-80 hover:text-white-90 transition-colors"
                >
                  Product
                </Link>
                <Link 
                  to="/features/short-links" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium text-white-80 hover:text-white-90 transition-colors"
                >
                  Features
                </Link>
                <Link 
                  to="/solutions/marketers" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium text-white-80 hover:text-white-90 transition-colors"
                >
                  Solutions
                </Link>
                <Link 
                  to="/resources" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium text-white-80 hover:text-white-90 transition-colors"
                >
                  Resources
                </Link>
                <Link 
                  to="/pricing" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium text-white-80 hover:text-white-90 transition-colors"
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
                    <Button variant="marketing" className="w-full rounded-full">
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
