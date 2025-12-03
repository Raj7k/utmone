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
                  <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    what do you need?
                  </p>
                )}
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
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
                  {USE_CASES.map((useCase) => {
                    const Icon = useCase.icon;
                    const isActive = activeUseCase === useCase.id;
                    
                    if (isCollapsed) {
                      return (
                        <Tooltip key={useCase.id}>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => handleUseCaseChange(useCase.id)}
                              className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200"
                              style={isActive ? {
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
                                border: '1px solid rgba(255,255,255,0.2)',
                                boxShadow: '0 8px 32px rgba(255,255,255,0.1), inset 0 1px 0 0 rgba(255,255,255,0.2)'
                              } : {
                                background: 'rgba(24,24,27,0.4)',
                                border: '1px solid rgba(255,255,255,0.08)',
                              }}
                            >
                              <Icon className="w-5 h-5" style={{ color: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)' }} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="p-3" style={{ background: 'rgba(24,24,27,0.95)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div className="flex flex-col gap-2">
                              <span className="font-medium lowercase" style={{ color: 'rgba(255,255,255,0.9)' }}>{useCase.label}</span>
                              <Link 
                                to={useCase.route} 
                                className="text-xs hover:underline inline-flex items-center gap-1 lowercase"
                                style={{ color: 'rgba(255,255,255,0.6)' }}
                              >
                                learn more <ArrowRight className="w-3 h-3" />
                              </Link>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    }
                    
                    return (
                      <div key={useCase.id} className="relative">
                        <button
                          onClick={() => handleUseCaseChange(useCase.id)}
                          className="w-full text-left p-4 rounded-xl transition-all duration-300 group"
                          style={isActive ? {
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
                            backdropFilter: 'blur(40px)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            borderTop: '1px solid rgba(255,255,255,0.25)',
                            boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.3)'
                          } : {
                            background: 'rgba(24,24,27,0.4)',
                            backdropFilter: 'blur(40px)',
                            border: '1px solid rgba(255,255,255,0.08)',
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                              style={{ background: isActive ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)' }}
                            >
                              <Icon className="w-5 h-5" style={{ color: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)' }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div 
                                className="font-semibold lowercase text-sm"
                                style={{ color: isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.8)' }}
                              >
                                {useCase.label}
                              </div>
                              <div 
                                className="text-xs"
                                style={{ color: isActive ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.4)' }}
                              >
                                {useCase.sublabel}
                              </div>
                            </div>
                            <Link 
                              to={useCase.route}
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                              style={{ color: isActive ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.5)' }}
                              aria-label={`Learn more about ${useCase.label}`}
                            >
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </nav>
              </TooltipProvider>

              {/* Mobile: Vertical Accordion */}
              <div className="lg:hidden space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
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
                      animate={{ 
                        backgroundColor: isActive ? "hsl(var(--primary))" : "hsl(var(--card))"
                      }}
                      className={`
                        rounded-xl border overflow-hidden transition-colors
                        ${isActive 
                          ? "border-primary shadow-lg shadow-primary/20" 
                          : "border-border"
                        }
                      `}
                    >
                      <button
                        onClick={() => handleUseCaseChange(useCase.id)}
                        className="w-full p-4 flex items-center justify-between"
                      >
                        {/* Text first */}
                        <div className="flex-1 text-left">
                          <div className={`font-semibold lowercase text-sm ${isActive ? "text-primary-foreground" : "text-foreground"}`}>
                            {useCase.label}
                          </div>
                          <div className={`text-xs ${isActive ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                            {useCase.sublabel}
                          </div>
                        </div>
                        {/* Icon last */}
                        <div className={`
                          w-10 h-10 rounded-lg flex items-center justify-center ml-3
                          ${isActive 
                            ? "bg-primary-foreground/20" 
                            : "bg-primary/10"
                          }
                        `}>
                          <Icon className={`w-5 h-5 ${isActive ? "text-primary-foreground" : "text-primary"}`} />
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
                                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-foreground/20 text-xs text-primary-foreground"
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
                                    className="w-full lowercase bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                                  >
                                    {content.cta}
                                    <ArrowRight className="ml-2 h-3 w-3" />
                                  </Button>
                                </Link>
                                <Link 
                                  to={useCase.route}
                                  className="p-2 rounded-lg bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 transition-colors"
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="space-y-8"
              >
                {/* Headline */}
                <div className="space-y-4">
                  <h1 
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold lowercase leading-[1.1]"
                    style={{
                      background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    {content.headline}
                  </h1>
                  <p className="text-lg md:text-xl max-w-2xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {content.subheadline}
                  </p>
                </div>

                {/* Features Chips */}
                {content.features && (
                  <div className="flex flex-wrap gap-2">
                    {content.features.map((feature) => (
                      <span
                        key={feature.name}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm lowercase"
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: 'rgba(255,255,255,0.7)'
                        }}
                      >
                        <ChevronRight className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.5)' }} />
                        {feature.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* CTA */}
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <Link to="/early-access">
                    <Button 
                      size="lg" 
                      className="h-14 px-8 text-base lowercase rounded-full font-semibold transition-all duration-300"
                      style={{
                        background: 'linear-gradient(135deg, #FFFFFF, #E4E4E7)',
                        color: '#050505',
                        boxShadow: '0 0 40px rgba(255,255,255,0.15), inset 0 1px 0 0 rgba(255,255,255,0.5)'
                      }}
                    >
                      {content.cta}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link 
                    to="/how-it-works" 
                    className="flex items-center gap-2 px-6 py-4 rounded-full text-sm font-medium lowercase transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.8)'
                    }}
                  >
                    see how it works
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
