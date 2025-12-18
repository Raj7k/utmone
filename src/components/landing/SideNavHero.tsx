import { useState, useRef, useEffect } from "react";
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
import { DEFAULT_USE_CASE, resolveUseCaseContent, UseCaseType } from "./useCaseConfig";

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

const HERO_CONTENT: Partial<Record<UseCaseType, HeroContentItem>> = {
  attribution: {
    headline: "stop the guessing. start the knowing.",
    subheadline: "see which channels actually drive revenue — not which ones take credit. Clean-Track attribution shows you where every dollar comes from.",
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
    headline: "watch strangers become customers.",
    subheadline: "from first click to final purchase — see every touchpoint across every device. understand the paths that convert, and replicate them.",
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
    headline: "links that work harder than you do.",
    subheadline: "short links, UTM builder, QR codes — all enforcing the same rules. your data stays clean without you lifting a finger.",
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
    headline: "smarter decisions. while you sleep.",
    subheadline: "four AI layers work behind the scenes — predicting winners, fixing broken links, routing traffic, and connecting the dots you'd never see.",
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
    headline: "scale fast. stay in control.",
    subheadline: "as your team grows, your links stay consistent. roles, rules, approvals, and audit trails — without the bureaucracy.",
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

const HERO_FALLBACK_CONTENT = HERO_CONTENT.attribution ?? {
  headline: "see everything clearly.",
  subheadline: "utm.one keeps links consistent so your analytics always make sense.",
  cta: "get early access",
  stats: [],
  features: [],
};

// CSS animation hook using Intersection Observer
const useInViewAnimation = (threshold = 0.2) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
};

export const SideNavHero = ({ onUseCaseChange }: SideNavHeroProps) => {
  const [activeUseCase, setActiveUseCase] = useState<UseCaseType>(DEFAULT_USE_CASE);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<UseCaseType | null>(null);
  const isMobile = useIsMobile();

  const handleUseCaseChange = (useCase: UseCaseType) => {
    setActiveUseCase(useCase);
    onUseCaseChange?.(useCase);
  };

  const handleMobileToggle = (useCase: UseCaseType) => {
    if (expandedMobile === useCase) {
      setExpandedMobile(null);
    } else {
      setExpandedMobile(useCase);
      handleUseCaseChange(useCase);
    }
  };

  const { content } = resolveUseCaseContent({
    contentMap: HERO_CONTENT,
    useCase: activeUseCase,
    fallbackUseCase: "links",
    defaultContent: HERO_FALLBACK_CONTENT,
    section: "Hero",
  });

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
                  className="p-2 rounded-lg transition-colors text-white-50 hover:bg-white/5"
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
                            <button
                              onClick={() => handleUseCaseChange(useCase.id)}
                              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 ${
                                isActive 
                                  ? 'bg-white/15 border border-white/20 shadow-glow-sm' 
                                  : 'bg-zinc-900/40 border border-white/[0.08]'
                              }`}
                              style={{ 
                                opacity: 0,
                                transform: 'translateX(-20px)',
                                animation: `fade-slide-in 0.3s ease-out ${index * 0.05}s forwards`
                              }}
                            >
                              <Icon className={`w-5 h-5 ${isActive ? 'text-white-90' : 'text-white-50'}`} />
                            </button>
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
                      <div 
                        key={useCase.id} 
                        className="relative"
                        style={{ 
                          opacity: 0,
                          transform: 'translateX(-30px)',
                          animation: `fade-slide-in 0.4s ease-out ${index * 0.08}s forwards`
                        }}
                      >
                        {/* Active indicator line */}
                        {isActive && (
                          <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary to-primary/50 rounded-full transition-all duration-300"
                          />
                        )}
                        
                        <button
                          onClick={() => handleUseCaseChange(useCase.id)}
                          className={`w-full text-left p-4 rounded-xl transition-all duration-300 group backdrop-blur-[40px] hover:translate-x-1 active:scale-[0.98] ${
                            isActive 
                              ? 'bg-gradient-to-br from-white/[0.12] to-white/[0.04] border border-white/15 border-t-white/25 shadow-glass ml-2' 
                              : 'bg-zinc-900/40 border border-white/[0.08] hover:bg-zinc-900/60 hover:border-white/15'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:rotate-[5deg] ${
                                isActive ? 'bg-white/15' : 'bg-white/[0.08]'
                              }`}
                            >
                              <Icon className={`w-5 h-5 ${isActive ? 'text-white-90' : 'text-white-60'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={`font-semibold lowercase text-sm ${isActive ? 'text-white-95' : 'text-white-80'}`}>
                                {useCase.label}
                              </div>
                              <div className={`text-xs ${isActive ? 'text-white-60' : 'text-white-40'}`}>
                                {useCase.sublabel}
                              </div>
                            </div>
                            <div
                              className={`text-white-70 transition-all duration-200 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}
                            >
                              <ChevronRight className="w-4 h-4" />
                            </div>
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
                        </button>
                      </div>
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
                  const isExpanded = expandedMobile === useCase.id;
                  const mobileContent = HERO_CONTENT[useCase.id];
                  
                  return (
                    <div 
                      key={useCase.id}
                      className={`rounded-xl overflow-hidden transition-colors duration-200 ${
                        isActive 
                          ? 'bg-white/15 border border-white/20 shadow-lg' 
                          : 'bg-zinc-900/40 border border-white/[0.08]'
                      }`}
                    >
                      <button
                        onClick={() => handleMobileToggle(useCase.id)}
                        className="w-full p-4 flex items-center justify-between"
                      >
                        <div className="flex-1 text-left">
                          <div className={`font-semibold lowercase text-sm ${isActive ? 'text-white-95' : 'text-white-90'}`}>
                            {useCase.label}
                          </div>
                          <div className={`text-xs ${isActive ? 'text-white-70' : 'text-white-50'}`}>
                            {useCase.sublabel}
                          </div>
                        </div>
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ml-3 ${
                          isActive ? 'bg-white/20' : 'bg-white/10'
                        }`}>
                          <Icon className={`w-5 h-5 ${isActive ? 'text-white-95' : 'text-white-70'}`} />
                        </div>
                      </button>
                      
                      {/* Expanded content - CSS transition */}
                      <div 
                        className={`overflow-hidden transition-all duration-300 ease-out ${
                          isExpanded ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="px-4 pb-4 space-y-4">
                          {mobileContent?.features && (
                            <div className="flex flex-wrap gap-2">
                              {mobileContent.features.map((feature) => (
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
                          
                          <div className="flex items-center gap-3">
                            <Link to="/early-access" className="flex-1">
                              <Button 
                                size="sm" 
                                variant="secondary" 
                                className="w-full bg-white/95 text-obsidian-bg"
                              >
                                {mobileContent?.cta || "get early access"}
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
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Dynamic Content */}
          <div className={`transition-all duration-300 ${isCollapsed ? "lg:col-span-11" : "lg:col-span-8 xl:col-span-9"}`}>
            <div
              key={activeUseCase}
              className="space-y-6 animate-fade-in"
            >
              {/* Two-column layout for attribution */}
              <div className={`grid gap-8 ${activeUseCase === 'attribution' ? 'lg:grid-cols-2 items-center' : ''}`}>
                {/* Left: Text Content */}
                <div className="space-y-6">
                  {/* Headline with text reveal */}
                  <div className="space-y-4">
                    <h1 
                      className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-display font-bold leading-[1.1] obsidian-platinum-text animate-fade-in"
                    >
                      {content.headline}
                    </h1>
                    <p 
                      className="text-base md:text-lg max-w-xl leading-relaxed text-muted-foreground animate-fade-in"
                      style={{ animationDelay: '0.1s' }}
                    >
                      {content.subheadline}
                    </p>
                  </div>

                  {/* Features Chips with staggered animation */}
                  {content.features && (
                    <div 
                      className="flex flex-wrap gap-2 animate-fade-in"
                      style={{ animationDelay: '0.2s' }}
                    >
                      {content.features.map((feature, index) => (
                        <span
                          key={feature.name}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-white/[0.06] border border-white/10 text-white-70 cursor-default transition-all duration-200 hover:scale-105 hover:bg-white/10"
                          style={{ 
                            opacity: 0,
                            animation: `fade-slide-in 0.3s ease-out ${0.25 + index * 0.08}s forwards`
                          }}
                        >
                          <ChevronRight className="w-3 h-3 text-white-50" />
                          {feature.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* CTA with enhanced animation */}
                  <div 
                    className="flex flex-col sm:flex-row items-start gap-4 animate-fade-in"
                    style={{ animationDelay: '0.4s' }}
                  >
                    <Link to="/early-access">
                      <Button 
                        size="lg" 
                        className="h-12 px-6 text-sm rounded-full font-semibold transition-all duration-300 bg-gradient-to-br from-white to-zinc-200 text-obsidian-bg shadow-glow-sm hover:scale-[1.03] active:scale-[0.98]"
                      >
                        {content.cta}
                        <span className="ml-2 animate-bounce-x">
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </Button>
                    </Link>
                    <Link to="/how-it-works">
                      <div
                        className="flex items-center gap-2 px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 bg-white/5 border border-white/10 text-white-80 hover:scale-[1.03] hover:bg-white/[0.08] active:scale-[0.98]"
                      >
                        learn more
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Right: Fiber Optic Graph (only for attribution) */}
                {activeUseCase === 'attribution' && (
                  <div
                    className="hidden lg:block animate-fade-in"
                    style={{ animationDelay: '0.3s' }}
                  >
                    <FiberOpticGraph />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fade-slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
        
        .animate-bounce-x {
          animation: bounce-x 1.5s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
};
