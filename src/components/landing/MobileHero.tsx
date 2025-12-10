import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { preserveAcronyms as p } from "@/utils/textFormatter";
import { 
  TrendingUp, 
  Route, 
  Link as LinkIcon,
  ArrowRight,
  Shield,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { UseCaseType } from "./ControlDeckHero";

interface MobileHeroProps {
  onUseCaseChange?: (useCase: UseCaseType) => void;
}

const USE_CASES = [
  {
    id: "attribution" as UseCaseType,
    icon: TrendingUp,
    label: p("revenue"),
    fullLabel: p("attribution & revenue"),
    sublabel: p("know where money comes from"),
  },
  {
    id: "journey" as UseCaseType,
    icon: Route,
    label: p("journey"),
    fullLabel: p("journey analytics"),
    sublabel: p("see every touchpoint"),
  },
  {
    id: "links" as UseCaseType,
    icon: LinkIcon,
    label: p("links"),
    fullLabel: p("UTM & links"),
    sublabel: p("clean data, every time"),
  },
  {
    id: "intelligence" as UseCaseType,
    icon: Sparkles,
    label: p("AI"),
    fullLabel: p("AI intelligence"),
    sublabel: p("clean-track insights"),
  },
];

const HERO_CONTENT: Record<UseCaseType, { headline: string; subheadline: string }> = {
  attribution: {
    headline: p("finally know where revenue comes from"),
    subheadline: p("multi-touch attribution reveals the true path from first click to closed deal."),
  },
  journey: {
    headline: p("see the complete customer path"),
    subheadline: p("from anonymous visit to signed contract — map every touchpoint across every device."),
  },
  links: {
    headline: p("clean links. clean data. clear decisions."),
    subheadline: p("short links, UTM builder, QR codes, and validation rules that ensure your data never breaks."),
  },
  intelligence: {
    headline: p("four AI layers built into every link"),
    subheadline: p("predictive analytics, attribution graphs, smart routing, and link immunity."),
  },
  governance: {
    headline: p("your links, under total control"),
    subheadline: p("naming conventions, approval workflows, audit trails. scale without chaos."),
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
    <section className="min-h-[85vh] flex flex-col justify-center py-8 px-4">
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
            <h1 className="text-3xl font-display font-bold lowercase leading-tight hero-gradient">
              {content.headline}
            </h1>
            <p className="text-base leading-relaxed text-white-60">
              {content.subheadline}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Primary CTA - Always Visible */}
        <Link to="/early-access" className="block">
          <Button 
            variant="halo"
            size="lg" 
            className="w-full h-14 text-base lowercase"
          >
            get early access
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>

        <Link 
          to="/how-it-works" 
          className="flex items-center justify-center gap-2 text-sm font-medium lowercase text-white-70"
        >
          see how it works
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Use Case Selector - 2x2 Grid */}
      <div className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-wider text-white-40">
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
                className={`relative p-4 rounded-xl transition-all duration-200 min-h-[90px] ${
                  isActive 
                    ? 'bg-gradient-to-br from-white/12 to-white/4 border border-white/20 shadow-glass'
                    : 'bg-zinc-900/40 border border-white/8'
                }`}
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <div 
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isActive ? 'bg-white/15' : 'bg-white/8'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white-90' : 'text-white-60'}`} />
                  </div>
                  <div>
                    <span className={`block text-sm font-semibold lowercase ${isActive ? 'text-white-95' : 'text-white-70'}`}>
                      {useCase.label}
                    </span>
                    <span className={`block text-[10px] mt-0.5 lowercase ${isActive ? 'text-white-50' : 'text-white-40'}`}>
                      {useCase.sublabel}
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Enterprise Control - Full Width */}
        <motion.button
          onClick={() => handleUseCaseChange("governance")}
          whileTap={{ scale: 0.98 }}
          className={`w-full p-4 rounded-xl transition-all duration-200 flex items-center gap-3 ${
            activeUseCase === "governance"
              ? 'bg-gradient-to-br from-white/12 to-white/4 border border-white/20 shadow-glass'
              : 'bg-zinc-900/40 border border-white/8'
          }`}
        >
          <div 
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              activeUseCase === "governance" ? 'bg-white/15' : 'bg-white/8'
            }`}
          >
            <Shield className={`w-5 h-5 ${activeUseCase === "governance" ? 'text-white-90' : 'text-white-60'}`} />
          </div>
          <div className="flex-1 text-left">
            <span className={`text-sm font-semibold lowercase ${activeUseCase === "governance" ? 'text-white-95' : 'text-white-70'}`}>
              enterprise control
            </span>
            <p className={`text-xs lowercase ${activeUseCase === "governance" ? 'text-white-60' : 'text-white-40'}`}>
              roles, rules & approvals
            </p>
          </div>
          <ChevronRight className={`w-5 h-5 ${activeUseCase === "governance" ? 'text-white-70' : 'text-white-40'}`} />
        </motion.button>
      </div>
    </section>
  );
};
