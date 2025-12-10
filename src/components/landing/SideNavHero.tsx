import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Route, 
  Link as LinkIcon,
  ArrowRight,
  ChevronRight,
  Shield,
  PanelLeftClose,
  PanelLeft,
  Sparkles
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileHero } from "./MobileHero";
import { FiberOpticGraph } from "./FiberOpticGraph";

export type UseCaseType = "attribution" | "journey" | "links" | "governance" | "intelligence";

interface SideNavHeroProps {
  onUseCaseChange?: (useCase: UseCaseType) => void;
}

const USE_CASES = [
  {
    id: "attribution" as UseCaseType,
    icon: TrendingUp,
    label: "attribution & revenue",
    sublabel: "know where money comes from",
    route: "/features/attribution-graph",
  },
  {
    id: "journey" as UseCaseType,
    icon: Route,
    label: "journey analytics",
    sublabel: "see every touchpoint",
    route: "/features/customer-journey",
  },
  {
    id: "links" as UseCaseType,
    icon: LinkIcon,
    label: "utm & links",
    sublabel: "clean data, every time",
    route: "/features/utm-builder",
  },
  {
    id: "intelligence" as UseCaseType,
    icon: Sparkles,
    label: "AI intelligence",
    sublabel: "clean-track powered insights",
    route: "/features/predictive-analytics",
  },
  {
    id: "governance" as UseCaseType,
    icon: Shield,
    label: "enterprise control",
    sublabel: "roles, rules & approvals",
    route: "/features/enterprise-control",
  },
];

interface HeroContentItem {
  headline: string;
  subheadline: string;
  cta: string;
  stats: { value: string; label: string }[];
  features?: { name: string; description: string }[];
}

const HERO_CONTENT: Record<UseCaseType, HeroContentItem> = {
  attribution: {
    headline: "finally know where revenue comes from",
    subheadline: "tired of Google taking 100% credit? see which channels actually drive conversions with Clean-Track attribution — built on mathematical models from MIT and Harvard scientists.",
    cta: "get early access",
    stats: [
      { value: "60%", label: "of budget typically misallocated" },
      { value: "3.2x", label: "better ROAS with true attribution" },
    ],
    features: [
      { name: "multi-touch attribution", description: "see every touchpoint that influenced the conversion" },
      { name: "revenue mapping", description: "connect clicks directly to closed deals and revenue" },
      { name: "channel comparison", description: "compare true ROI across all marketing channels" },
      { name: "budget optimizer", description: "know exactly where to invest your next dollar" },
    ]
  },
  journey: {
    headline: "see every touchpoint, across every device",
    subheadline: "stop tracking clicks. start engineering journeys. from anonymous visit to enterprise contract — see the complete path with Clean-Track intelligence.",
    cta: "get early access",
    stats: [
      { value: "12", label: "avg touchpoints before conversion" },
      { value: "47%", label: "conversions happen cross-device" },
    ],
    features: [
      { name: "cross-device tracking", description: "follow users from phone to laptop to tablet seamlessly" },
      { name: "touchpoint mapping", description: "visualize every interaction before conversion" },
      { name: "conversion paths", description: "discover the most effective routes to purchase" },
      { name: "behavioral insights", description: "understand what actions lead to conversions" },
    ]
  },
  links: {
    headline: "clean links. clean data. clear decisions.",
    subheadline: "short links, UTM builder, QR codes, and clean-track governance in one place. every link follows the same rules.",
    cta: "get early access",
    stats: [
      { value: "5", label: "layers of link intelligence" },
      { value: "0", label: "hours cleaning data manually" },
    ],
    features: [
      { name: "utm builder", description: "consistent parameters with templates and validation" },
      { name: "short links", description: "branded domains that build trust and track clicks" },
      { name: "qr generator", description: "custom QR codes with your logo and brand colors" },
      { name: "clean-track validation", description: "automatic syntax checking and naming enforcement" },
    ]
  },
  intelligence: {
    headline: "four AI layers built into every link",
    subheadline: "Clean-Track Intelligence — mathematical models from MIT and Harvard scientists, working behind the scenes to make your data smarter.",
    cta: "get early access",
    stats: [
      { value: "4", label: "intelligence layers" },
      { value: "0", label: "setup required" },
    ],
    features: [
      { name: "predictive analytics", description: "know which campaigns will work before you launch" },
      { name: "attribution graph", description: "see the true path from click to conversion" },
      { name: "smart routing", description: "send visitors to the right destination automatically" },
      { name: "link immunity", description: "auto-detect and fix broken links before they hurt you" },
    ]
  },
  governance: {
    headline: "your team's links, under control.",
    subheadline: "role-based access, approval workflows, naming conventions, and audit trails. scale link management without chaos.",
    cta: "get early access",
    stats: [
      { value: "100%", label: "links follow your rules" },
      { value: "0", label: "rogue campaigns" },
    ],
    features: [
      { name: "role-based access", description: "admins, editors, and viewers with the right permissions" },
      { name: "approval workflows", description: "review links before they go live" },
      { name: "naming conventions", description: "enforce consistent UTM patterns across teams" },
      { name: "audit trails", description: "see who created, edited, or deleted every link" },
    ]
  },
};

export const SideNavHero = ({ onUseCaseChange }: SideNavHeroProps) => {
  const [activeUseCase, setActiveUseCase] = useState<UseCaseType>("attribution");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();

  const handleUseCaseChange = (useCase: UseCaseType) => {
    setActiveUseCase(useCase);
    onUseCaseChange?.(useCase);
  };

  const content = HERO_CONTENT[activeUseCase];

  // Render mobile-specific hero on small screens
  if (isMobile) {
    return <MobileHero onUseCaseChange={onUseCaseChange} />;
  }

  return (
    <section className="relative min-h-[80vh] md:min-h-[85vh] flex flex-col justify-center py-16 md:py-24 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Vertical Side Navigation - Collapsible */}
          <div className={`relative z-20 transition-all duration-300 ${isCollapsed ? "lg:col-span-1" : "lg:col-span-4 xl:col-span-3"}`}>
            <div className="lg:sticky lg:top-32">
              {/* Collapse Toggle - Desktop Only */}
              <div className="hidden lg:flex items-center justify-between mb-4">
                {!isCollapsed && (
                  <p className="text-xs font-medium uppercase tracking-wider text-white-50">
                    what do you need?
                  </p>
                )}
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="p-2 rounded-lg transition-colors text-white-50"
                  aria-label={isCollapsed ? "Expand navigation" : "Collapse navigation"}
                >
                  {isCollapsed ? (
                    <PanelLeft className="w-4 h-4" />
                  ) : (
                    <PanelLeftClose className="w-4 h-4" />
                  )}
                </button>
              </div>
              
              {/* Desktop Navigation */}
              <TooltipProvider delayDuration={0}>
                <nav className="hidden lg:block space-y-2">
                  {USE_CASES.map((useCase, index) => {
                    const Icon = useCase.icon;
                    const isActive = activeUseCase === useCase.id;
                    
                    if (isCollapsed) {
                      return (
                        <Tooltip key={useCase.id}>
                          <TooltipTrigger asChild>
                            <motion.button
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              onClick={() => handleUseCaseChange(useCase.id)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                                isActive 
                                  ? 'bg-white/15 border border-white/20 shadow-glow-sm' 
                                  : 'bg-zinc-900/40 border border-white/[0.08]'
                              }`}
                            >
                              <Icon className={`w-5 h-5 ${isActive ? 'text-white-90' : 'text-white-50'}`} />
                            </motion.button>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="p-3 bg-zinc-900/95 border border-white/10">
                            <div className="flex flex-col gap-2">
                              <span className="font-medium text-white-90">{useCase.label}</span>
                              <Link 
                                to={useCase.route} 
                                className="text-xs hover:underline inline-flex items-center gap-1 text-white-60"
                              >
                                learn more <ArrowRight className="w-3 h-3" />
                              </Link>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    }
                    
                    return (
                      <motion.div 
                        key={useCase.id} 
                        className="relative"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: index * 0.08,
                          type: "spring",
                          stiffness: 100,
                          damping: 15
                        }}
                      >
                        {/* Active indicator line */}
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary to-primary/50 rounded-full"
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                        
                        <motion.button
                          onClick={() => handleUseCaseChange(useCase.id)}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full text-left p-4 rounded-xl transition-all duration-300 group backdrop-blur-[40px] ${
                            isActive 
                              ? 'bg-gradient-to-br from-white/[0.12] to-white/[0.04] border border-white/15 border-t-white/25 shadow-glass ml-2' 
                              : 'bg-zinc-900/40 border border-white/[0.08] hover:bg-zinc-900/60 hover:border-white/15'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <motion.div 
                              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                                isActive ? 'bg-white/15' : 'bg-white/[0.08]'
                              }`}
                              whileHover={{ rotate: isActive ? 0 : 5 }}
                            >
                              <Icon className={`w-5 h-5 ${isActive ? 'text-white-90' : 'text-white-60'}`} />
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <div className={`font-semibold lowercase text-sm ${isActive ? 'text-white-95' : 'text-white-80'}`}>
                                {useCase.label}
                              </div>
                              <div className={`text-xs ${isActive ? 'text-white-60' : 'text-white-40'}`}>
                                {useCase.sublabel}
                              </div>
                            </div>
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -10 }}
                              className="text-white-70"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </motion.div>
                            <Link 
                              to={useCase.route}
                              onClick={(e) => e.stopPropagation()}
                              className={`p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${
                                isActive ? 'text-white-70' : 'text-white-50'
                              }`}
                              aria-label={`Learn more about ${useCase.label}`}
                            >
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </nav>
              </TooltipProvider>

              {/* Mobile: Vertical Accordion */}
              <div className="lg:hidden space-y-2">
                <p className="text-xs font-medium uppercase tracking-wider mb-4 text-white-50">
                  what do you need?
                </p>
                {USE_CASES.map((useCase) => {
                  const Icon = useCase.icon;
                  const isActive = activeUseCase === useCase.id;
                  const content = HERO_CONTENT[useCase.id];
                  
                  return (
                    <motion.div 
                      key={useCase.id}
                      initial={false}
                      className={`rounded-xl overflow-hidden transition-colors ${
                        isActive 
                          ? 'bg-white/15 border border-white/20 shadow-lg' 
                          : 'bg-zinc-900/40 border border-white/[0.08]'
                      }`}
                    >
                      <button
                        onClick={() => handleUseCaseChange(useCase.id)}
                        className="w-full p-4 flex items-center justify-between"
                      >
                        {/* Text first */}
                        <div className="flex-1 text-left">
                          <div className={`font-semibold lowercase text-sm ${isActive ? 'text-white-95' : 'text-white-90'}`}>
                            {useCase.label}
                          </div>
                          <div className={`text-xs ${isActive ? 'text-white-70' : 'text-white-50'}`}>
                            {useCase.sublabel}
                          </div>
                        </div>
                        {/* Icon last */}
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ml-3 ${
                          isActive ? 'bg-white/20' : 'bg-white/10'
                        }`}>
                          <Icon className={`w-5 h-5 ${isActive ? 'text-white-95' : 'text-white-70'}`} />
                        </div>
                      </button>
                      
                      {/* Expanded content */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 space-y-4">
                              {/* Features list */}
                              {content.features && (
                                <div className="flex flex-wrap gap-2">
                                  {content.features.map((feature) => (
                                    <span
                                      key={feature.name}
                                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-white/20 text-white-95"
                                    >
                                      <ChevronRight className="w-3 h-3" />
                                      {feature.name}
                                    </span>
                                  ))}
                                </div>
                              )}
                              
                              {/* CTA buttons */}
                              <div className="flex items-center gap-3">
                                <Link to="/early-access" className="flex-1">
                                  <Button 
                                    size="sm" 
                                    variant="secondary" 
                                    className="w-full bg-white/95 text-obsidian-bg"
                                  >
                                    {content.cta}
                                    <ArrowRight className="ml-2 h-3 w-3" />
                                  </Button>
                                </Link>
                                <Link 
                                  to={useCase.route}
                                  className="p-2 rounded-lg transition-colors bg-white/20 text-white-95"
                                  aria-label={`Learn more about ${useCase.label}`}
                                >
                                  <ArrowRight className="w-4 h-4" />
                                </Link>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Dynamic Content */}
          <div className={`transition-all duration-300 ${isCollapsed ? "lg:col-span-11" : "lg:col-span-8 xl:col-span-9"}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeUseCase}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Two-column layout for attribution */}
                <div className={`grid gap-8 ${activeUseCase === 'attribution' ? 'lg:grid-cols-2 items-center' : ''}`}>
                  {/* Left: Text Content */}
                  <div className="space-y-6">
                    {/* Headline with text reveal */}
                    <div className="space-y-4">
                      <motion.h1 
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-display font-bold leading-[1.1] obsidian-platinum-text"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                      >
                        {content.headline}
                      </motion.h1>
                      <motion.p 
                        className="text-base md:text-lg max-w-xl leading-relaxed text-muted-foreground"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                      >
                        {content.subheadline}
                      </motion.p>
                    </div>

                    {/* Features Chips with staggered animation */}
                    {content.features && (
                      <motion.div 
                        className="flex flex-wrap gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {content.features.map((feature, index) => (
                          <motion.span
                            key={feature.name}
                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ 
                              delay: 0.25 + index * 0.08,
                              type: "spring",
                              stiffness: 200,
                              damping: 20
                            }}
                            whileHover={{ 
                              scale: 1.05, 
                              backgroundColor: "rgba(255,255,255,0.1)",
                              transition: { duration: 0.2 }
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-white/[0.06] border border-white/10 text-white-70 cursor-default"
                          >
                            <ChevronRight className="w-3 h-3 text-white-50" />
                            {feature.name}
                          </motion.span>
                        ))}
                      </motion.div>
                    )}

                    {/* CTA with enhanced animation */}
                    <motion.div 
                      className="flex flex-col sm:flex-row items-start gap-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <Link to="/early-access">
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button 
                            size="lg" 
                            className="h-12 px-6 text-sm rounded-full font-semibold transition-all duration-300 bg-gradient-to-br from-white to-zinc-200 text-obsidian-bg shadow-glow-sm"
                          >
                            {content.cta}
                            <motion.span
                              className="ml-2"
                              animate={{ x: [0, 4, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                            >
                              <ArrowRight className="h-4 w-4" />
                            </motion.span>
                          </Button>
                        </motion.div>
                      </Link>
                      <Link to="/how-it-works">
                        <motion.div
                          whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.08)" }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center gap-2 px-4 py-3 rounded-full text-sm font-medium transition-colors bg-white/5 border border-white/10 text-white-80"
                        >
                          learn more
                          <ArrowRight className="h-4 w-4" />
                        </motion.div>
                      </Link>
                    </motion.div>
                  </div>

                  {/* Right: Fiber Optic Graph (only for attribution) */}
                  {activeUseCase === 'attribution' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, x: 30 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                      className="hidden lg:block"
                    >
                      <FiberOpticGraph />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
