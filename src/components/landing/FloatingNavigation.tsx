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
                    className="h-8 px-3 text-xs font-medium transition-apple hover:bg-white/10"
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
                      className="group block select-none space-y-1.5 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-md flex items-center justify-center group-hover:bg-white/10 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                          <Link2 className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.8)' }} />
                        </div>
                        <div className="text-xs font-medium leading-none" style={{ color: 'rgba(255,255,255,0.9)' }}>Link Orchestration</div>
                      </div>
                      <p className="text-[10px] leading-snug" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        control & reliability
                      </p>
                    </Link>

                    <Link
                      to="/products/journey-intelligence"
                      className="group block select-none space-y-1.5 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-md flex items-center justify-center group-hover:bg-white/10 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                          <Network className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.8)' }} />
                        </div>
                        <div className="text-xs font-medium leading-none" style={{ color: 'rgba(255,255,255,0.9)' }}>Journey Intelligence</div>
                      </div>
                      <p className="text-[10px] leading-snug" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        truth & revenue
                      </p>
                    </Link>

                    <Link
                      to="/products/qr-studio"
                      className="group block select-none space-y-1.5 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-md flex items-center justify-center group-hover:bg-white/10 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                          <QrCode className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.8)' }} />
                        </div>
                        <div className="text-xs font-medium leading-none" style={{ color: 'rgba(255,255,255,0.9)' }}>QR Studio</div>
                      </div>
                      <p className="text-[10px] leading-snug" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        physical reliability
                      </p>
                    </Link>

                    <Link
                      to="/products/data-pipeline"
                      className="group block select-none space-y-1.5 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-md flex items-center justify-center group-hover:bg-white/10 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                          <Database className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.8)' }} />
                        </div>
                        <div className="text-xs font-medium leading-none" style={{ color: 'rgba(255,255,255,0.9)' }}>Data Pipeline</div>
                      </div>
                      <p className="text-[10px] leading-snug" style={{ color: 'rgba(255,255,255,0.5)' }}>
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
                    className="h-8 px-3 text-xs font-medium hover:bg-white/10 transition-apple"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    features <ChevronUp className="ml-1 h-3 w-3" />
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
                  <div className="flex gap-3">
                    {/* Featured Features (Bento 3-card) */}
                    <div className="w-[180px] flex flex-col gap-1.5">
                      <Link 
                        to="/features/analytics" 
                        className="group rounded-xl p-2 flex items-center gap-2 border-2 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 shadow-sm border-primary/20 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent"
                      >
                        <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-primary/20 text-primary">
                          <BarChart3 className="w-3 h-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[10px] font-semibold leading-tight" style={{ color: 'rgba(255,255,255,0.9)' }}>clean-track™</h3>
                        </div>
                      </Link>

                      <Link 
                        to="/features/link-immunity" 
                        className="group rounded-xl p-2 flex items-center gap-2 border-2 border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/25 bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-transparent shadow-sm"
                      >
                        <div className="w-6 h-6 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-500">
                          <Shield className="w-3 h-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[10px] font-semibold leading-tight" style={{ color: 'rgba(255,255,255,0.9)' }}>link immunity</h3>
                        </div>
                      </Link>

                      <Link 
                        to="/features/smart-routing" 
                        className="group rounded-xl p-2 flex items-center gap-2 border-2 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 shadow-sm"
                        style={{ 
                          borderColor: 'rgba(139,92,246,0.2)', 
                          background: 'linear-gradient(to bottom right, rgba(139,92,246,0.15), rgba(139,92,246,0.05), transparent)'
                        }}
                      >
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(139,92,246,0.2)', color: 'rgba(139,92,246,1)' }}>
                          <Route className="w-3 h-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[10px] font-semibold leading-tight" style={{ color: 'rgba(255,255,255,0.9)' }}>smart routing</h3>
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
                            <div className="w-6 h-6 rounded flex items-center justify-center group-hover:bg-white/10 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                              <Link2 className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.8)' }} />
                            </div>
                            <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>Short Links</span>
                          </div>
                        </Link>

                        <Link
                          to="/features/utm-builder"
                          className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-white/10"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded flex items-center justify-center group-hover:bg-white/10 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                              <Tags className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.8)' }} />
                            </div>
                            <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>UTM Builder</span>
                          </div>
                        </Link>

                        <Link
                          to="/features/qr-generator"
                          className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-white/10"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded flex items-center justify-center group-hover:bg-white/10 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                              <QrCode className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.8)' }} />
                            </div>
                            <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>QR Gen</span>
                          </div>
                        </Link>

                        <Link
                          to="/features/analytics"
                          className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-white/10"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded flex items-center justify-center group-hover:bg-white/10 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                              <BarChart3 className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.8)' }} />
                            </div>
                            <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>Analytics</span>
                          </div>
                        </Link>

                        <Link
                          to="/features/predictive-analytics"
                          className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-white/10"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded flex items-center justify-center group-hover:bg-white/10 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                              <TrendingUp className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.8)' }} />
                            </div>
                            <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>Predictive</span>
                          </div>
                        </Link>

                        <Link
                          to="/features/smart-routing"
                          className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-white/10"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded flex items-center justify-center group-hover:bg-white/10 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                              <Route className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.8)' }} />
                            </div>
                            <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>Smart Routing</span>
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
                    className="h-8 px-3 text-xs font-medium hover:bg-white/10 transition-apple"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    solutions <ChevronUp className="ml-1 h-3 w-3" />
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
                  <div className="flex gap-3">
                    {/* Use Case Cards - Left */}
                    <div className="w-[180px] flex flex-col gap-1.5">
                      <Link 
                        to="/solutions/marketers" 
                        className="group rounded-xl p-2 flex items-center gap-2 border-2 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 shadow-sm"
                        style={{ 
                          borderColor: 'rgba(249,115,22,0.2)', 
                          background: 'linear-gradient(to bottom right, rgba(249,115,22,0.15), rgba(249,115,22,0.05), transparent)'
                        }}
                      >
                        <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(249,115,22,0.2)', color: 'rgba(249,115,22,1)' }}>
                          <Target className="w-3 h-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[10px] font-semibold leading-tight" style={{ color: 'rgba(255,255,255,0.9)' }}>campaign tracking</h3>
                        </div>
                      </Link>

                      <Link 
                        to="/solutions/partner-managers" 
                        className="group rounded-xl p-2 flex items-center gap-2 border-2 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 shadow-sm"
                        style={{ 
                          borderColor: 'rgba(20,184,166,0.2)', 
                          background: 'linear-gradient(to bottom right, rgba(20,184,166,0.15), rgba(20,184,166,0.05), transparent)'
                        }}
                      >
                        <div className="w-6 h-6 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(20,184,166,0.2)', color: 'rgba(20,184,166,1)' }}>
                          <Handshake className="w-3 h-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[10px] font-semibold leading-tight" style={{ color: 'rgba(255,255,255,0.9)' }}>partner attribution</h3>
                        </div>
                      </Link>

                      <Link 
                        to="/solutions/marketing-ops" 
                        className="group rounded-xl p-2 flex items-center gap-2 border-2 border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl hover:shadow-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent shadow-sm"
                      >
                        <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center shrink-0 text-white/60">
                          <Settings className="w-3 h-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[10px] font-semibold leading-tight" style={{ color: 'rgba(255,255,255,0.9)' }}>data governance</h3>
                        </div>
                      </Link>
                    </div>

                    {/* Grid */}
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <Link
                        to="/solutions/enterprise"
                        className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-white/10"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded flex items-center justify-center group-hover:bg-white/10 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <Building2 className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.8)' }} />
                          </div>
                          <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>Enterprise</span>
                        </div>
                      </Link>

                      <Link
                        to="/solutions/marketers"
                        className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-white/10"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded flex items-center justify-center group-hover:bg-white/10 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <Megaphone className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.8)' }} />
                          </div>
                          <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>Marketing</span>
                        </div>
                      </Link>

                      <Link
                        to="/solutions/agencies"
                        className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-white/10"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded flex items-center justify-center group-hover:bg-white/10 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <Users className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.8)' }} />
                          </div>
                          <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>Agencies</span>
                        </div>
                      </Link>

                      <Link
                        to="/solutions/sales"
                        className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-white/10"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded flex items-center justify-center group-hover:bg-white/10 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <Briefcase className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.8)' }} />
                          </div>
                          <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>Sales</span>
                        </div>
                      </Link>

                      <Link
                        to="/solutions/developers"
                        className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-white/10"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded flex items-center justify-center group-hover:bg-white/10 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <Code className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.8)' }} />
                          </div>
                          <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>Developers</span>
                        </div>
                      </Link>

                      <Link
                        to="/solutions/revops"
                        className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-white/10"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded flex items-center justify-center group-hover:bg-white/10 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <DollarSign className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.8)' }} />
                          </div>
                          <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>RevOps</span>
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
                    className="h-8 px-3 text-xs font-medium hover:bg-white/10 transition-apple"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    resources <ChevronUp className="ml-1 h-3 w-3" />
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
                  <div className="flex gap-3">
                    {/* Featured Resources */}
                    <div className="w-[180px] flex flex-col gap-1.5">
                      {/* LLM Ranking - HOT */}
                      <Link 
                        to="/resources/playbooks/llm-ranking" 
                        className="group rounded-lg p-2.5 flex flex-col gap-1.5 border transition-all hover:scale-[1.02]"
                        style={{ 
                          background: 'linear-gradient(to bottom right, rgba(249,115,22,0.1), rgba(249,115,22,0.05), transparent)',
                          borderColor: 'rgba(249,115,22,0.2)'
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <Bot className="w-3.5 h-3.5" style={{ color: 'rgba(249,115,22,1)' }} />
                          <Badge className="text-white text-[9px] px-1.5 py-0" style={{ background: 'rgba(249,115,22,1)' }}>HOT</Badge>
                        </div>
                        <div>
                          <h3 className="text-[10px] font-semibold mb-0.5" style={{ color: 'rgba(255,255,255,0.9)' }}>llm ranking</h3>
                          <p className="text-[9px] leading-tight" style={{ color: 'rgba(255,255,255,0.5)' }}>
                            rank #1 in ChatGPT
                          </p>
                        </div>
                      </Link>

                      {/* B2B Attribution Framework - NEW */}
                      <Link 
                        to="/resources/frameworks/b2b-attribution" 
                        className="group rounded-lg bg-gradient-to-br from-white/10 via-white/5 to-transparent p-2.5 flex flex-col gap-1.5 border border-white/20 hover:border-white/40 transition-all hover:scale-[1.02]"
                      >
                        <div className="flex items-center justify-between">
                          <GitBranch className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.8)' }} />
                          <Badge className="text-[9px] px-1.5 py-0" style={{ background: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.9)' }}>NEW</Badge>
                        </div>
                        <div>
                          <h3 className="text-[10px] font-semibold mb-0.5" style={{ color: 'rgba(255,255,255,0.9)' }}>b2b attribution</h3>
                          <p className="text-[9px] leading-tight" style={{ color: 'rgba(255,255,255,0.5)' }}>
                            from $0 to $100m+
                          </p>
                        </div>
                      </Link>

                      {/* GTM Salary - COMING SOON */}
                      <Link 
                        to="/resources/reports/salary-benchmark-2026" 
                        className="group rounded-lg p-2.5 flex flex-col gap-1.5 border transition-all hover:scale-[1.02] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20"
                      >
                        <div className="flex items-center justify-between">
                          <DollarSign className="w-3.5 h-3.5 text-primary" />
                          <Badge className="text-white text-[9px] px-1.5 py-0 bg-primary">SOON</Badge>
                        </div>
                        <div>
                          <h3 className="text-[10px] font-semibold mb-0.5" style={{ color: 'rgba(255,255,255,0.9)' }}>gtm salary</h3>
                          <p className="text-[9px] leading-tight" style={{ color: 'rgba(255,255,255,0.5)' }}>
                            2026 benchmarks
                          </p>
                        </div>
                      </Link>
                    </div>

                    {/* Grid */}
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <Link
                        to="/resources/guides"
                        className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-white/10"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded flex items-center justify-center group-hover:bg-white/10 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <BookOpen className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.8)' }} />
                          </div>
                          <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>Guides</span>
                        </div>
                      </Link>

                      <Link
                        to="/resources/playbooks"
                        className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-white/10"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded flex items-center justify-center group-hover:bg-white/10 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <ClipboardList className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.8)' }} />
                          </div>
                          <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>Playbooks</span>
                        </div>
                      </Link>

                      <Link
                        to="/resources/templates"
                        className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-white/10"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded flex items-center justify-center group-hover:bg-white/10 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <FileText className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.8)' }} />
                          </div>
                          <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>Templates</span>
                        </div>
                      </Link>

                      <Link
                        to="/resources/glossary"
                        className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-white/10"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded flex items-center justify-center group-hover:bg-white/10 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <BookMarked className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.8)' }} />
                          </div>
                          <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>Glossary</span>
                        </div>
                      </Link>

                      <Link
                        to="/tools/shorten"
                        className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-white/10"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded flex items-center justify-center group-hover:bg-white/10 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <Link2 className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.8)' }} />
                          </div>
                          <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>Shortener</span>
                        </div>
                      </Link>

                      <Link
                        to="/tools/qr"
                        className="group block select-none rounded-md p-2 leading-none transition-colors hover:bg-white/10"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded flex items-center justify-center group-hover:bg-white/10 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <QrCode className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.8)' }} />
                          </div>
                          <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>QR Gen</span>
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
