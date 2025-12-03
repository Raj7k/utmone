import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";
import { 
  ChevronUp, Link2, Network, QrCode, Database, Layers,
  Tags, BarChart3, TrendingUp, GitBranch, Route, Shield,
  Building2, Users, Rocket, Megaphone, Settings, Briefcase, Code,
  DollarSign, Handshake, FileBarChart,
  BookOpen, ClipboardList, FileText, Puzzle, FolderOpen, BookMarked, SearchCheck,
  Sparkles, Bot, Target
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
          className="fixed bottom-4 md:bottom-8 left-1/2 z-50 rounded-full px-3 md:px-6 py-2 md:py-3 max-w-[calc(100vw-2rem)] md:max-w-none overflow-x-auto scrollbar-hide"
          style={{
            background: 'rgba(24, 24, 27, 0.9)',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1), 0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}
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
                    className="h-8 px-3 text-xs font-medium transition-apple"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    product <ChevronUp className="ml-1 h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  side="top" 
                  align="center" 
                  sideOffset={12}
                  className="w-[500px] p-3 z-[60]"
                  style={{
                    background: 'rgba(24, 24, 27, 0.95)',
                    backdropFilter: 'blur(40px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
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
                    {/* Featured Features (Bento 3-card) */}
                    <div className="w-[180px] flex flex-col gap-1.5">
                      <Link 
                        to="/features/analytics" 
                        className="group rounded-xl p-2 flex items-center gap-2 border-2 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/25 bg-gradient-to-br from-blue-500/15 via-blue-500/5 to-background shadow-sm"
                      >
                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 text-blue-500">
                          <BarChart3 className="w-3 h-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[10px] font-semibold leading-tight text-foreground">clean-track™</h3>
                        </div>
                      </Link>

                      <Link 
                        to="/features/link-immunity" 
                        className="group rounded-xl p-2 flex items-center gap-2 border-2 border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/25 bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-background shadow-sm"
                      >
                        <div className="w-6 h-6 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-500">
                          <Shield className="w-3 h-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[10px] font-semibold leading-tight text-foreground">link immunity</h3>
                        </div>
                      </Link>

                      <Link 
                        to="/features/smart-routing" 
                        className="group rounded-xl p-2 flex items-center gap-2 border-2 border-violet-500/20 hover:border-violet-500/40 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/25 bg-gradient-to-br from-violet-500/15 via-violet-500/5 to-background shadow-sm"
                      >
                        <div className="w-6 h-6 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0 text-violet-500">
                          <Route className="w-3 h-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[10px] font-semibold leading-tight text-foreground">smart routing</h3>
                        </div>
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
                    {/* Use Case Cards - Left */}
                    <div className="w-[180px] flex flex-col gap-1.5">
                      <Link 
                        to="/solutions/marketers" 
                        className="group rounded-xl p-2 flex items-center gap-2 border-2 border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/25 bg-gradient-to-br from-orange-500/15 via-orange-500/5 to-background shadow-sm"
                      >
                        <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0 text-orange-500">
                          <Target className="w-3 h-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[10px] font-semibold leading-tight text-foreground">campaign tracking</h3>
                        </div>
                      </Link>

                      <Link 
                        to="/solutions/partner-managers" 
                        className="group rounded-xl p-2 flex items-center gap-2 border-2 border-teal-500/20 hover:border-teal-500/40 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-500/25 bg-gradient-to-br from-teal-500/15 via-teal-500/5 to-background shadow-sm"
                      >
                        <div className="w-6 h-6 rounded-xl bg-teal-500/20 flex items-center justify-center shrink-0 text-teal-500">
                          <Handshake className="w-3 h-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[10px] font-semibold leading-tight text-foreground">partner attribution</h3>
                        </div>
                      </Link>

                      <Link 
                        to="/solutions/marketing-ops" 
                        className="group rounded-xl p-2 flex items-center gap-2 border-2 border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl hover:shadow-white/10 bg-gradient-to-br from-white/10 via-white/5 to-background shadow-sm"
                      >
                        <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center shrink-0 text-white/60">
                          <Settings className="w-3 h-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[10px] font-semibold leading-tight text-foreground">data governance</h3>
                        </div>
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
                    {/* Featured Resources */}
                    <div className="w-[180px] flex flex-col gap-1.5">
                      {/* LLM Ranking - HOT */}
                      <Link 
                        to="/resources/playbooks/llm-ranking" 
                        className="group rounded-lg bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-background p-2.5 flex flex-col gap-1.5 border border-orange-500/20 hover:border-orange-500/40 transition-all hover:scale-[1.02]"
                      >
                        <div className="flex items-center justify-between">
                          <Bot className="w-3.5 h-3.5 text-orange-500" />
                          <Badge className="bg-orange-500 text-white text-[9px] px-1.5 py-0">HOT</Badge>
                        </div>
                        <div>
                          <h3 className="text-[10px] font-semibold mb-0.5">llm ranking</h3>
                          <p className="text-[9px] text-muted-foreground leading-tight">
                            rank #1 in ChatGPT
                          </p>
                        </div>
                      </Link>

                      {/* B2B Attribution Framework - NEW */}
                      <Link 
                        to="/resources/frameworks/b2b-attribution" 
                        className="group rounded-lg bg-gradient-to-br from-primary/10 via-primary/5 to-background p-2.5 flex flex-col gap-1.5 border border-primary/20 hover:border-primary/40 transition-all hover:scale-[1.02]"
                      >
                        <div className="flex items-center justify-between">
                          <GitBranch className="w-3.5 h-3.5 text-primary" />
                          <Badge className="bg-primary text-primary-foreground text-[9px] px-1.5 py-0">NEW</Badge>
                        </div>
                        <div>
                          <h3 className="text-[10px] font-semibold mb-0.5">b2b attribution</h3>
                          <p className="text-[9px] text-muted-foreground leading-tight">
                            from $0 to $100m+
                          </p>
                        </div>
                      </Link>

                      {/* GTM Salary - COMING SOON */}
                      <Link 
                        to="/resources/reports/salary-benchmark-2026" 
                        className="group rounded-lg bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-background p-2.5 flex flex-col gap-1.5 border border-blue-500/20 hover:border-blue-500/40 transition-all hover:scale-[1.02]"
                      >
                        <div className="flex items-center justify-between">
                          <DollarSign className="w-3.5 h-3.5 text-blue-500" />
                          <Badge className="bg-blue-500 text-white text-[9px] px-1.5 py-0">SOON</Badge>
                        </div>
                        <div>
                          <h3 className="text-[10px] font-semibold mb-0.5">gtm salary</h3>
                          <p className="text-[9px] text-muted-foreground leading-tight">
                            2026 benchmarks
                          </p>
                        </div>
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
