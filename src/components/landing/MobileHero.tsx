import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Route, 
  Link as LinkIcon,
  ArrowRight,
  Shield,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { UseCaseType } from "./SideNavHero";

interface MobileHeroProps {
  onUseCaseChange?: (useCase: UseCaseType) => void;
}

const USE_CASES = [
  {
    id: "attribution" as UseCaseType,
    icon: TrendingUp,
    label: "revenue",
    fullLabel: "attribution & revenue",
    color: "bg-primary",
  },
  {
    id: "journey" as UseCaseType,
    icon: Route,
    label: "journey",
    fullLabel: "customer journey",
    color: "bg-primary/80",
  },
  {
    id: "links" as UseCaseType,
    icon: LinkIcon,
    label: "links",
    fullLabel: "utm & links",
    color: "bg-primary/70",
  },
  {
    id: "intelligence" as UseCaseType,
    icon: Sparkles,
    label: "AI",
    fullLabel: "AI intelligence",
    color: "bg-primary/60",
  },
];

const HERO_CONTENT = {
  attribution: {
    headline: "finally know where revenue comes from",
    subheadline: "Clean-Track attribution for growth teams who want data they can actually trust.",
  },
  journey: {
    headline: "see every touchpoint, across every device",
    subheadline: "From anonymous visit to enterprise contract — see the complete customer path.",
  },
  links: {
    headline: "clean links. clean data. clear decisions.",
    subheadline: "Short links, UTM builder, QR codes, and governance in one place.",
  },
  intelligence: {
    headline: "four AI layers built into every link",
    subheadline: "Predictive analytics, attribution graphs, smart routing, and link immunity.",
  },
  governance: {
    headline: "your team's links, under control",
    subheadline: "Role-based access, approval workflows, naming conventions, and audit trails.",
  },
};

export const MobileHero = ({ onUseCaseChange }: MobileHeroProps) => {
  const [activeUseCase, setActiveUseCase] = useState<UseCaseType>("attribution");

  const handleUseCaseChange = (useCase: UseCaseType) => {
    setActiveUseCase(useCase);
    onUseCaseChange?.(useCase);
  };

  const content = HERO_CONTENT[activeUseCase];

  return (
    <section className="min-h-[85vh] flex flex-col justify-center py-8 px-4 bg-background">
      {/* Main Content - Always Visible */}
      <div className="space-y-6 mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeUseCase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <h1 className="hero-gradient text-3xl font-display font-bold lowercase leading-tight">
              {content.headline}
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              {content.subheadline}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Primary CTA - Always Visible */}
        <Link to="/early-access" className="block">
          <Button size="lg" className="w-full h-14 text-base lowercase shadow-lg">
            get early access
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>

        <Link 
          to="/how-it-works" 
          className="flex items-center justify-center gap-2 text-primary text-sm font-medium lowercase"
        >
          see how it works
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Use Case Selector - 2x2 Grid */}
      <div className="space-y-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          explore by need
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          {USE_CASES.map((useCase) => {
            const Icon = useCase.icon;
            const isActive = activeUseCase === useCase.id;
            
            return (
              <motion.button
                key={useCase.id}
                onClick={() => handleUseCaseChange(useCase.id)}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative p-4 rounded-xl transition-all duration-200 min-h-[80px]
                  ${isActive 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : "bg-card border border-border"
                  }
                `}
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center
                    ${isActive 
                      ? "bg-primary-foreground/20" 
                      : "bg-primary/10"
                    }
                  `}>
                    <Icon className={`w-5 h-5 ${isActive ? "text-primary-foreground" : "text-primary"}`} />
                  </div>
                  <span className={`text-sm font-semibold lowercase ${isActive ? "" : "text-foreground"}`}>
                    {useCase.label}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Enterprise Control - Full Width */}
        <motion.button
          onClick={() => handleUseCaseChange("governance")}
          whileTap={{ scale: 0.98 }}
          className={`
            w-full p-4 rounded-xl transition-all duration-200 flex items-center gap-3
            ${activeUseCase === "governance" 
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
              : "bg-card border border-border"
            }
          `}
        >
          <div className={`
            w-10 h-10 rounded-lg flex items-center justify-center shrink-0
            ${activeUseCase === "governance" 
              ? "bg-primary-foreground/20" 
              : "bg-primary/10"
            }
          `}>
            <Shield className={`w-5 h-5 ${activeUseCase === "governance" ? "text-primary-foreground" : "text-primary"}`} />
          </div>
          <div className="flex-1 text-left">
            <span className={`text-sm font-semibold lowercase ${activeUseCase === "governance" ? "" : "text-foreground"}`}>
              enterprise control
            </span>
            <p className={`text-xs ${activeUseCase === "governance" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
              roles, rules & approvals
            </p>
          </div>
          <ChevronRight className={`w-5 h-5 ${activeUseCase === "governance" ? "text-primary-foreground" : "text-muted-foreground"}`} />
        </motion.button>
      </div>
    </section>
  );
};
