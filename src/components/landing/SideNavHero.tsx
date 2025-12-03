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
  Shield
} from "lucide-react";

export type UseCaseType = "attribution" | "journey" | "links" | "governance";

interface SideNavHeroProps {
  onUseCaseChange?: (useCase: UseCaseType) => void;
}

const USE_CASES = [
  {
    id: "attribution" as UseCaseType,
    icon: TrendingUp,
    label: "attribution & revenue",
    sublabel: "know where money comes from",
  },
  {
    id: "journey" as UseCaseType,
    icon: Route,
    label: "journey analytics",
    sublabel: "see every touchpoint",
  },
  {
    id: "links" as UseCaseType,
    icon: LinkIcon,
    label: "utm & links",
    sublabel: "clean data, every time",
  },
  {
    id: "governance" as UseCaseType,
    icon: Shield,
    label: "enterprise control",
    sublabel: "roles, rules & approvals",
  },
];

const HERO_CONTENT: Record<UseCaseType, { headline: string; subheadline: string; cta: string; stats: { value: string; label: string }[] }> = {
  attribution: {
    headline: "finally know where revenue comes from",
    subheadline: "tired of Google taking 100% credit? see which channels actually drive conversions with Bayesian attribution.",
    cta: "get early access",
    stats: [
      { value: "60%", label: "of budget typically misallocated" },
      { value: "3.2x", label: "better ROAS with true attribution" },
    ]
  },
  journey: {
    headline: "see every touchpoint, across every device",
    subheadline: "stop tracking clicks. start engineering journeys. from anonymous visit to enterprise contract — see the complete path.",
    cta: "get early access",
    stats: [
      { value: "12", label: "avg touchpoints before conversion" },
      { value: "47%", label: "conversions happen cross-device" },
    ]
  },
  links: {
    headline: "clean links. clean data. clear decisions.",
    subheadline: "short links, UTM builder, QR codes, and clean-track governance in one place. every link follows the same rules.",
    cta: "get early access",
    stats: [
      { value: "5", label: "layers of link intelligence" },
      { value: "0", label: "hours cleaning data manually" },
    ]
  },
  governance: {
    headline: "your team's links, under control.",
    subheadline: "role-based access, approval workflows, naming conventions, and audit trails. scale link management without chaos.",
    cta: "get early access",
    stats: [
      { value: "100%", label: "links follow your rules" },
      { value: "0", label: "rogue campaigns" },
    ]
  },
};

export const SideNavHero = ({ onUseCaseChange }: SideNavHeroProps) => {
  const [activeUseCase, setActiveUseCase] = useState<UseCaseType>("attribution");

  const handleUseCaseChange = (useCase: UseCaseType) => {
    setActiveUseCase(useCase);
    onUseCaseChange?.(useCase);
  };

  const content = HERO_CONTENT[activeUseCase];

  return (
    <section className="relative pt-8 md:pt-12 pb-16 md:pb-24 bg-background overflow-hidden">

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left: Vertical Side Navigation */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="lg:sticky lg:top-32">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
                what do you need?
              </p>
              
              <nav className="space-y-2">
                {USE_CASES.map((useCase) => {
                  const Icon = useCase.icon;
                  const isActive = activeUseCase === useCase.id;
                  
                  return (
                    <button
                      key={useCase.id}
                      onClick={() => handleUseCaseChange(useCase.id)}
                      className={`
                        w-full text-left p-4 rounded-xl transition-all duration-300 group
                        ${isActive 
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                          : "bg-card border border-border hover:border-primary/30 hover:bg-muted/50"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-10 h-10 rounded-lg flex items-center justify-center transition-colors
                          ${isActive 
                            ? "bg-primary-foreground/20" 
                            : "bg-primary/10 text-primary group-hover:bg-primary/20"
                          }
                        `}>
                          <Icon className={`w-5 h-5 ${isActive ? "text-primary-foreground" : ""}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`font-semibold lowercase text-sm ${isActive ? "" : "text-foreground"}`}>
                            {useCase.label}
                          </div>
                          <div className={`text-xs ${isActive ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                            {useCase.sublabel}
                          </div>
                        </div>
                        <ChevronRight className={`
                          w-4 h-4 transition-transform
                          ${isActive ? "text-primary-foreground" : "text-muted-foreground opacity-0 group-hover:opacity-100"}
                        `} />
                      </div>
                    </button>
                  );
                })}
              </nav>

              {/* Mobile: Horizontal scroll */}
              <div className="lg:hidden mt-6 -mx-4 px-4">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {USE_CASES.map((useCase) => {
                    const Icon = useCase.icon;
                    const isActive = activeUseCase === useCase.id;
                    
                    return (
                      <button
                        key={useCase.id}
                        onClick={() => handleUseCaseChange(useCase.id)}
                        className={`
                          flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all
                          ${isActive 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }
                        `}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium lowercase">{useCase.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Dynamic Content */}
          <div className="lg:col-span-8 xl:col-span-9">
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
                  <h1 className="hero-gradient text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tighter leading-[1.1] lowercase">
                    {content.headline}
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                    {content.subheadline}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-6">
                  {content.stats.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 + i * 0.1 }}
                      className="flex items-baseline gap-2"
                    >
                      <span className="text-3xl md:text-4xl font-display font-bold text-primary">
                        {stat.value}
                      </span>
                      <span className="text-sm text-muted-foreground max-w-[120px]">
                        {stat.label}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <Link to="/early-access">
                    <Button size="lg" variant="marketing" className="lowercase">
                      {content.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link 
                    to="/how-it-works" 
                    className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium lowercase py-3"
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
