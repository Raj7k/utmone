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
        className={`max-w-[1280px] mx-auto backdrop-blur-xl rounded-full px-6 md:px-8 py-3 md:py-4 flex items-center justify-between relative transition-all duration-300 ${
          isScrolled ? 'scale-95' : 'scale-100'
        }`}
        style={{
          background: 'rgba(24, 24, 27, 0.8)',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.1), 0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        }}
      >
        {/* Scroll Progress Bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] origin-left rounded-full"
          style={{ 
            width: progressWidth,
            background: 'linear-gradient(to right, rgba(255,255,255,0.3), rgba(255,255,255,0.6), rgba(255,255,255,0.3))'
          }}
        />
          {/* Logo with hover effect */}
          <Link to="/" className="flex items-center group transition-apple hover:opacity-70">
            <UtmOneLogo size="lg" className="[&>span]:text-white" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center obsidian-nav">
            <NavigationMenu>
              <NavigationMenuList className="gap-2">
                {/* Product Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger 
                    className="h-9 px-3 text-small-text font-medium bg-transparent transition-apple"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    {formatText("product")}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div 
                      className="w-[650px] p-4 flex gap-4"
                      style={{
                        background: 'rgba(24, 24, 27, 0.95)',
                        backdropFilter: 'blur(40px)',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}
                    >
                      {/* Featured Card - Left */}
                      <div 
                        className="w-[220px] rounded-lg p-4 flex flex-col justify-between"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)'
                        }}
                      >
                        <div>
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                            style={{ background: 'rgba(255,255,255,0.1)' }}
                          >
                            <Layers className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.8)' }} />
                          </div>
                          <h3 className="text-sm font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.9)' }}>customer-journey</h3>
                          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                            from shortening to attribution, manage every link touchpoint in one place
                          </p>
                        </div>
                        <Link 
                          to="/product" 
                          className="text-xs font-medium text-primary hover:underline mt-4 inline-flex items-center gap-1"
                        >
                          explore platform <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>

                      {/* Products Grid - Right */}
                      <div className="flex-1">
                        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                          Products
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            to="/products/link-orchestration"
                            className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <Link2 className="w-4 h-4 text-primary" />
                              </div>
                              <div className="text-sm font-medium leading-none">Link Orchestration</div>
                            </div>
                            <p className="text-xs leading-snug" style={{ color: 'rgba(255,255,255,0.5)' }}>
                              control & reliability
                            </p>
                          </Link>

                          <Link
                            to="/products/journey-intelligence"
                            className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <Network className="w-4 h-4 text-primary" />
                              </div>
                              <div className="text-sm font-medium leading-none">Journey Intelligence</div>
                            </div>
                            <p className="text-xs leading-snug" style={{ color: 'rgba(255,255,255,0.5)' }}>
                              truth & revenue
                            </p>
                          </Link>

                          <Link
                            to="/products/qr-studio"
                            className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <QrCode className="w-4 h-4 text-primary" />
                              </div>
                              <div className="text-sm font-medium leading-none">QR Studio</div>
                            </div>
                            <p className="text-xs leading-snug" style={{ color: 'rgba(255,255,255,0.5)' }}>
                              physical reliability
                            </p>
                          </Link>

                          <Link
                            to="/products/data-pipeline"
                            className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <Database className="w-4 h-4 text-primary" />
                              </div>
                              <div className="text-sm font-medium leading-none">Data Pipeline</div>
                            </div>
                            <p className="text-xs leading-snug" style={{ color: 'rgba(255,255,255,0.5)' }}>
                              freedom & scale
                            </p>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Features Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-9 px-3 text-small-text font-medium text-foreground/70 hover:text-foreground data-[state=open]:text-foreground bg-transparent transition-apple">
                    {formatText("features")}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[650px] p-4 flex gap-4">
                      {/* Featured Features - Left (Bento 3-card) */}
                      <div className="w-[220px] flex flex-col gap-2">
                        {/* Clean-Track */}
                        <Link 
                          to="/features/analytics" 
                          className="group rounded-xl p-3 flex items-center gap-3 border-2 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/25 bg-gradient-to-br from-blue-500/15 via-blue-500/5 to-background shadow-sm"
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 text-blue-500">
                            <BarChart3 className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xs font-semibold mb-0.5 text-foreground">clean-track™</h3>
                            <p className="text-[10px] leading-tight" style={{ color: 'rgba(255,255,255,0.5)' }}>
                              data you can trust
                            </p>
                          </div>
                        </Link>

                        {/* Link Immunity */}
                        <Link 
                          to="/features/link-immunity" 
                          className="group rounded-xl p-3 flex items-center gap-3 border-2 border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/25 bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-background shadow-sm"
                        >
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-500">
                            <Shield className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xs font-semibold mb-0.5 text-foreground">link immunity</h3>
                            <p className="text-[10px] leading-tight" style={{ color: 'rgba(255,255,255,0.5)' }}>
                              zero broken links
                            </p>
                          </div>
                        </Link>

                        {/* Smart Routing */}
                        <Link 
                          to="/features/smart-routing" 
                          className="group rounded-xl p-3 flex items-center gap-3 border-2 border-violet-500/20 hover:border-violet-500/40 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/25 bg-gradient-to-br from-violet-500/15 via-violet-500/5 to-background shadow-sm"
                        >
                          <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0 text-violet-500">
                            <Route className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xs font-semibold mb-0.5 text-foreground">smart routing</h3>
                            <p className="text-[10px] leading-tight" style={{ color: 'rgba(255,255,255,0.5)' }}>
                              geo-targeting magic
                            </p>
                          </div>
                        </Link>
                      </div>

                      {/* Features Grid - Right */}
                      <div className="flex-1">
                        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                          Core Features
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <Link
                            to="/features/short-links"
                            className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <Link2 className="w-4 h-4 text-primary" />
                              </div>
                              <div className="text-sm font-medium leading-none">Short Links</div>
                            </div>
                            <p className="text-xs leading-snug" style={{ color: 'rgba(255,255,255,0.5)' }}>
                              branded, memorable links
                            </p>
                          </Link>

                          <Link
                            to="/features/utm-builder"
                            className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <Tags className="w-4 h-4 text-primary" />
                              </div>
                              <div className="text-sm font-medium leading-none">UTM Builder</div>
                            </div>
                            <p className="text-xs leading-snug" style={{ color: 'rgba(255,255,255,0.5)' }}>
                              consistent parameters
                            </p>
                          </Link>

                          <Link
                            to="/features/qr-generator"
                            className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <QrCode className="w-4 h-4 text-primary" />
                              </div>
                              <div className="text-sm font-medium leading-none">QR Generator</div>
                            </div>
                            <p className="text-xs leading-snug" style={{ color: 'rgba(255,255,255,0.5)' }}>
                              on-brand codes
                            </p>
                          </Link>

                          <Link
                            to="/features/analytics"
                            className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <BarChart3 className="w-4 h-4 text-primary" />
                              </div>
                              <div className="text-sm font-medium leading-none">Analytics</div>
                            </div>
                            <p className="text-xs leading-snug" style={{ color: 'rgba(255,255,255,0.5)' }}>
                              clear data, better decisions
                            </p>
                          </Link>
                        </div>

                        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                          Intelligence
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            to="/features/predictive-analytics"
                            className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <TrendingUp className="w-4 h-4 text-primary" />
                              </div>
                              <div className="text-sm font-medium leading-none">Predictive</div>
                            </div>
                            <p className="text-xs leading-snug" style={{ color: 'rgba(255,255,255,0.5)' }}>
                              forecast clicks
                            </p>
                          </Link>

                          <Link
                            to="/features/attribution-graph"
                            className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <GitBranch className="w-4 h-4 text-primary" />
                              </div>
                              <div className="text-sm font-medium leading-none">Attribution</div>
                            </div>
                            <p className="text-xs leading-snug" style={{ color: 'rgba(255,255,255,0.5)' }}>
                              multi-touch truth
                            </p>
                          </Link>

                          <Link
                            to="/features/smart-routing"
                            className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <Route className="w-4 h-4 text-primary" />
                              </div>
                              <div className="text-sm font-medium leading-none">Smart Routing</div>
                            </div>
                            <p className="text-xs leading-snug" style={{ color: 'rgba(255,255,255,0.5)' }}>
                              geo-targeting
                            </p>
                          </Link>

                          <Link
                            to="/features/link-immunity"
                            className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <Shield className="w-4 h-4 text-primary" />
                              </div>
                              <div className="text-sm font-medium leading-none">Link Immunity</div>
                            </div>
                            <p className="text-xs leading-snug" style={{ color: 'rgba(255,255,255,0.5)' }}>
                              zero broken links
                            </p>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Solutions Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-9 px-3 text-small-text font-medium text-foreground/70 hover:text-foreground data-[state=open]:text-foreground bg-transparent transition-apple">
                    {formatText("solutions")}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[650px] p-4 flex gap-4">
                      {/* Use Case Cards - Left */}
                      <div className="w-[220px] flex flex-col gap-2">
                        {/* Campaign Tracking */}
                        <Link 
                          to="/solutions/marketers" 
                          className="group rounded-xl p-3 flex items-center gap-3 border-2 border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/25 bg-gradient-to-br from-orange-500/15 via-orange-500/5 to-background shadow-sm"
                        >
                          <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0 text-orange-500">
                            <Target className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xs font-semibold mb-0.5 text-foreground">campaign tracking</h3>
                            <p className="text-[10px] text-muted-foreground leading-tight">
                              never lose a click
                            </p>
                          </div>
                        </Link>

                        {/* Partner Attribution */}
                        <Link 
                          to="/solutions/partner-managers" 
                          className="group rounded-xl p-3 flex items-center gap-3 border-2 border-teal-500/20 hover:border-teal-500/40 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-500/25 bg-gradient-to-br from-teal-500/15 via-teal-500/5 to-background shadow-sm"
                        >
                          <div className="w-8 h-8 rounded-xl bg-teal-500/20 flex items-center justify-center shrink-0 text-teal-500">
                            <Handshake className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xs font-semibold mb-0.5 text-foreground">partner attribution</h3>
                            <p className="text-[10px] text-muted-foreground leading-tight">
                              automated credit
                            </p>
                          </div>
                        </Link>

                        {/* Data Governance */}
                        <Link 
                          to="/solutions/marketing-ops" 
                          className="group rounded-xl p-3 flex items-center gap-3 border-2 border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl hover:shadow-white/10 bg-gradient-to-br from-white/10 via-white/5 to-background shadow-sm"
                        >
                          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0 text-white/60">
                            <Settings className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xs font-semibold mb-0.5 text-foreground">data governance</h3>
                            <p className="text-[10px] text-muted-foreground leading-tight">
                              UTM consistency at scale
                            </p>
                          </div>
                        </Link>
                      </div>

                      {/* Solutions Grid - Right */}
                      <div className="flex-1">
                        <div className="grid grid-cols-2 gap-4">
                          {/* By Segment Column */}
                          <div>
                            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                              By Segment
                            </div>
                            <div className="space-y-1">
                              <Link
                                to="/solutions/enterprise"
                                className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <Building2 className="w-4 h-4 text-primary" />
                                  </div>
                                  <div className="text-sm font-medium leading-none">Enterprise</div>
                                </div>
                                <p className="text-xs leading-snug text-muted-foreground">
                                  security & scale
                                </p>
                              </Link>

                              <Link
                                to="/solutions/agencies"
                                className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <Users className="w-4 h-4 text-primary" />
                                  </div>
                                  <div className="text-sm font-medium leading-none">Agencies</div>
                                </div>
                                <p className="text-xs leading-snug text-muted-foreground">
                                  multi-client workspaces
                                </p>
                              </Link>

                              <Link
                                to="/solutions/startups"
                                className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <Rocket className="w-4 h-4 text-primary" />
                                  </div>
                                  <div className="text-sm font-medium leading-none">Startups</div>
                                </div>
                                <p className="text-xs leading-snug text-muted-foreground">
                                  enterprise quality
                                </p>
                              </Link>
                            </div>
                          </div>

                          {/* By Role Column */}
                          <div>
                            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                              By Role
                            </div>
                            <div className="space-y-1">
                              <Link
                                to="/solutions/marketers"
                                className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <Megaphone className="w-4 h-4 text-primary" />
                                  </div>
                                  <div className="text-sm font-medium leading-none">Marketing</div>
                                </div>
                              </Link>

                              <Link
                                to="/solutions/marketing-ops"
                                className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <Settings className="w-4 h-4 text-primary" />
                                  </div>
                                  <div className="text-sm font-medium leading-none">Ops</div>
                                </div>
                              </Link>

                              <Link
                                to="/solutions/sales"
                                className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <Briefcase className="w-4 h-4 text-primary" />
                                  </div>
                                  <div className="text-sm font-medium leading-none">Sales</div>
                                </div>
                              </Link>

                              <Link
                                to="/solutions/developers"
                                className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <Code className="w-4 h-4 text-primary" />
                                  </div>
                                  <div className="text-sm font-medium leading-none">Developers</div>
                                </div>
                              </Link>

                              <Link
                                to="/solutions/revops"
                                className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <DollarSign className="w-4 h-4 text-primary" />
                                  </div>
                                  <div className="text-sm font-medium leading-none">RevOps</div>
                                </div>
                              </Link>

                              <Link
                                to="/solutions/partner-managers"
                                className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <Handshake className="w-4 h-4 text-primary" />
                                  </div>
                                  <div className="text-sm font-medium leading-none">Partners</div>
                                </div>
                              </Link>

                              <Link
                                to="/solutions/reporting-team"
                                className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <FileBarChart className="w-4 h-4 text-primary" />
                                  </div>
                                  <div className="text-sm font-medium leading-none">Reporting</div>
                                </div>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>


                {/* Resources Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-9 px-3 text-small-text font-medium text-foreground/70 hover:text-foreground data-[state=open]:text-foreground bg-transparent transition-apple">
                    {formatText("resources")}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[650px] p-4 flex gap-4">
                      {/* Featured Resources - Left */}
                      <div className="w-[220px] flex flex-col gap-2">
                        {/* LLM Ranking Playbook - HOT */}
                        <Link 
                          to="/resources/playbooks/llm-ranking" 
                          className="group rounded-lg bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-background p-3 flex flex-col gap-2 border border-orange-500/20 hover:border-orange-500/40 transition-all hover:scale-[1.02]"
                        >
                          <div className="flex items-center justify-between">
                            <Bot className="w-4 h-4 text-orange-500" />
                            <Badge className="bg-orange-500 text-white text-[10px] px-2 py-0">HOT</Badge>
                          </div>
                          <div>
                            <h3 className="text-xs font-semibold mb-1">llm ranking playbook</h3>
                            <p className="text-[10px] text-muted-foreground leading-relaxed">
                              rank #1 in ChatGPT & Claude
                            </p>
                          </div>
                        </Link>

                        {/* B2B Attribution Framework - NEW */}
                        <Link 
                          to="/resources/frameworks/b2b-attribution" 
                          className="group rounded-lg bg-gradient-to-br from-primary/10 via-primary/5 to-background p-3 flex flex-col gap-2 border border-primary/20 hover:border-primary/40 transition-all hover:scale-[1.02]"
                        >
                          <div className="flex items-center justify-between">
                            <GitBranch className="w-4 h-4 text-primary" />
                            <Badge className="bg-primary text-primary-foreground text-[10px] px-2 py-0">NEW</Badge>
                          </div>
                          <div>
                            <h3 className="text-xs font-semibold mb-1">b2b attribution</h3>
                            <p className="text-[10px] text-muted-foreground leading-relaxed">
                              from $0 to $100m+
                            </p>
                          </div>
                        </Link>

                        {/* GTM Salary Insights - COMING SOON */}
                        <Link 
                          to="/resources/reports/salary-benchmark-2026" 
                          className="group rounded-lg bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-background p-3 flex flex-col gap-2 border border-blue-500/20 hover:border-blue-500/40 transition-all hover:scale-[1.02]"
                        >
                          <div className="flex items-center justify-between">
                            <DollarSign className="w-4 h-4 text-blue-500" />
                            <Badge className="bg-blue-500 text-white text-[10px] px-2 py-0">COMING SOON</Badge>
                          </div>
                          <div>
                            <h3 className="text-xs font-semibold mb-1">gtm salary insights</h3>
                            <p className="text-[10px] text-muted-foreground leading-relaxed">
                              2026 global benchmarks
                            </p>
                          </div>
                        </Link>
                      </div>

                      {/* Resources Grid - Right */}
                      <div className="flex-1">
                        <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          Learning
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <Link
                            to="/resources/guides"
                            className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <BookOpen className="w-4 h-4 text-primary" />
                              </div>
                              <div className="text-sm font-medium leading-none">Guides</div>
                            </div>
                            <p className="text-xs leading-snug text-muted-foreground">
                              educational content
                            </p>
                          </Link>

                          <Link
                            to="/resources/playbooks"
                            className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <ClipboardList className="w-4 h-4 text-primary" />
                              </div>
                              <div className="text-sm font-medium leading-none">Playbooks</div>
                            </div>
                            <p className="text-xs leading-snug text-muted-foreground">
                              step-by-step
                            </p>
                          </Link>

                          <Link
                            to="/resources/templates"
                            className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <FileText className="w-4 h-4 text-primary" />
                              </div>
                              <div className="text-sm font-medium leading-none">Templates</div>
                            </div>
                            <p className="text-xs leading-snug text-muted-foreground">
                              ready-to-use
                            </p>
                          </Link>

                          <Link
                            to="/resources/frameworks"
                            className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <Puzzle className="w-4 h-4 text-primary" />
                              </div>
                              <div className="text-sm font-medium leading-none">Frameworks</div>
                            </div>
                            <p className="text-xs leading-snug text-muted-foreground">
                              mental models
                            </p>
                          </Link>

                          <Link
                            to="/resources/examples"
                            className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <FolderOpen className="w-4 h-4 text-primary" />
                              </div>
                              <div className="text-sm font-medium leading-none">Examples</div>
                            </div>
                            <p className="text-xs leading-snug text-muted-foreground">
                              real-world cases
                            </p>
                          </Link>

                          <Link
                            to="/resources/glossary"
                            className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <BookMarked className="w-4 h-4 text-primary" />
                              </div>
                              <div className="text-sm font-medium leading-none">Glossary</div>
                            </div>
                            <p className="text-xs leading-snug text-muted-foreground">
                              utm terminology
                            </p>
                          </Link>
                        </div>

                        <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          Free Tools
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            to="/tools/shorten"
                            className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <Link2 className="w-4 h-4 text-primary" />
                              </div>
                              <div className="text-sm font-medium leading-none">URL Shortener</div>
                            </div>
                            <p className="text-xs leading-snug text-muted-foreground">
                              instant short links
                            </p>
                          </Link>

                          <Link
                            to="/tools/utm-builder"
                            className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <Tags className="w-4 h-4 text-primary" />
                              </div>
                              <div className="text-sm font-medium leading-none">UTM Builder</div>
                            </div>
                            <p className="text-xs leading-snug text-muted-foreground">
                              clean utm urls
                            </p>
                          </Link>

                          <Link
                            to="/tools/qr"
                            className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <QrCode className="w-4 h-4 text-primary" />
                              </div>
                              <div className="text-sm font-medium leading-none">QR Generator</div>
                            </div>
                            <p className="text-xs leading-snug text-muted-foreground">
                              branded qr codes
                            </p>
                          </Link>

                          <Link
                            to="/tools/link-health-checker"
                            className="group block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <SearchCheck className="w-4 h-4 text-primary" />
                              </div>
                              <div className="text-sm font-medium leading-none">Link Checker</div>
                            </div>
                            <p className="text-xs leading-snug text-muted-foreground">
                              check for broken links
                            </p>
                          </Link>
                        </div>
                      </div>
                    </div>
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
              <SheetContent side="right" className="w-full sm:w-[400px] p-0 overflow-hidden flex flex-col">
                {/* Logo at top of mobile menu - Sticky Header */}
                <div className="flex items-center gap-2 px-6 py-6 border-b border-separator bg-background sticky top-0 z-10">
                  <UtmOneLogo size="md" />
                </div>
                
                {/* Scrollable Navigation Content */}
                <nav className="flex-1 overflow-y-auto px-6 py-6">
                  <div className="flex flex-col gap-6">

                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-muted-foreground px-3 mb-2">Product</p>
                    <Link to="/products/link-orchestration" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
                      <Link2 className="h-4 w-4 text-primary" />
                      <span>Link Orchestration</span>
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Link>
                    <Link to="/products/journey-intelligence" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
                      <Network className="h-4 w-4 text-primary" />
                      <span>Journey Intelligence</span>
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Link>
                    <Link to="/products/qr-studio" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
                      <QrCode className="h-4 w-4 text-primary" />
                      <span>QR Studio</span>
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Link>
                    <Link to="/products/data-pipeline" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
                      <Database className="h-4 w-4 text-primary" />
                      <span>Data Pipeline</span>
                      <ChevronRight className="h-4 w-4 ml-auto" />
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

                  <div className="border-t pt-6 space-y-1">
                    <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
                      <span>Pricing</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                    <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
                      <span>About</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>

                  </div>
                </nav>

                {/* Sticky Footer CTA */}
                <div className="px-6 py-6 border-t border-separator bg-background sticky bottom-0 z-10">
                  <Link to="/early-access" onClick={() => setMobileMenuOpen(false)}>
                    <MagneticButton className="w-full rounded-full" strength={0.15}>
                      Get Early Access
                    </MagneticButton>
                  </Link>
                </div>
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
