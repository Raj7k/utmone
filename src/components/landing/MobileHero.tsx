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
  },
  {
    id: "journey" as UseCaseType,
    icon: Route,
    label: "journey",
    fullLabel: "customer journey",
  },
  {
    id: "links" as UseCaseType,
    icon: LinkIcon,
    label: "links",
    fullLabel: "utm & links",
  },
  {
    id: "intelligence" as UseCaseType,
    icon: Sparkles,
    label: "AI",
    fullLabel: "AI intelligence",
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
            <h1 
              className="text-3xl font-display font-bold lowercase leading-tight"
              style={{
                background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {content.headline}
            </h1>
            <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {content.subheadline}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Primary CTA - Always Visible */}
        <Link to="/early-access" className="block">
          <Button 
            size="lg" 
            className="w-full h-14 text-base lowercase rounded-full font-semibold"
            style={{
              background: 'linear-gradient(135deg, #FFFFFF, #E4E4E7)',
              color: '#050505',
              boxShadow: '0 0 40px rgba(255,255,255,0.15)'
            }}
          >
            get early access
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>

        <Link 
          to="/how-it-works" 
          className="flex items-center justify-center gap-2 text-sm font-medium lowercase"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          see how it works
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Use Case Selector - 2x2 Grid */}
      <div className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>
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
                className="relative p-4 rounded-xl transition-all duration-200 min-h-[80px]"
                style={isActive ? {
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.3)'
                } : {
                  background: 'rgba(24,24,27,0.4)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: isActive ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)' }} />
                  </div>
                  <span 
                    className="text-sm font-semibold lowercase"
                    style={{ color: isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.7)' }}
                  >
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
          className="w-full p-4 rounded-xl transition-all duration-200 flex items-center gap-3"
          style={activeUseCase === "governance" ? {
            background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.3)'
          } : {
            background: 'rgba(24,24,27,0.4)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: activeUseCase === "governance" ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)' }}
          >
            <Shield className="w-5 h-5" style={{ color: activeUseCase === "governance" ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)' }} />
          </div>
          <div className="flex-1 text-left">
            <span 
              className="text-sm font-semibold lowercase"
              style={{ color: activeUseCase === "governance" ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.7)' }}
            >
              enterprise control
            </span>
            <p 
              className="text-xs"
              style={{ color: activeUseCase === "governance" ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.4)' }}
            >
              roles, rules & approvals
            </p>
          </div>
          <ChevronRight className="w-5 h-5" style={{ color: activeUseCase === "governance" ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)' }} />
        </motion.button>
      </div>
    </section>
  );
};
