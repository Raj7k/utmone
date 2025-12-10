import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  PieChart, 
  Route, 
  Link as LinkIcon,
  ArrowRight
} from "lucide-react";
import { HeroInlineCTA } from "./HeroInlineCTA";
import { useTrackCTAClick } from "@/hooks/useLandingPageAnalytics";

export type UseCaseType = "attribution" | "journey" | "links";

interface UseCasePill {
  id: UseCaseType;
  icon: React.ElementType;
  label: string;
  sublabel: string;
}

const USE_CASE_PILLS: UseCasePill[] = [
  {
    id: "attribution",
    icon: PieChart,
    label: "attribution",
    sublabel: "& revenue"
  },
  {
    id: "journey",
    icon: Route,
    label: "journey",
    sublabel: "analytics"
  },
  {
    id: "links",
    icon: LinkIcon,
    label: "utm & links",
    sublabel: "management"
  }
];

interface HeroContent {
  headline1: string;
  headline2: string;
  subheadline: string;
  secondaryCta: string;
  secondaryCtaLink: string;
}

const USE_CASE_CONTENT: Record<UseCaseType, HeroContent> = {
  attribution: {
    headline1: "finally know where",
    headline2: "revenue comes from.",
    subheadline: "tired of Google taking 100% credit? see which channels actually drive conversions with Bayesian attribution — not last-click guessing.",
    secondaryCta: "see attribution in action",
    secondaryCtaLink: "/features/attribution-graph"
  },
  journey: {
    headline1: "stop tracking clicks.",
    headline2: "start engineering journeys.",
    subheadline: "see the complete path from first anonymous visit to enterprise contract. cross-device, cross-channel, cross-campaign identity stitching.",
    secondaryCta: "explore journey analytics",
    secondaryCtaLink: "/features/predictive-analytics"
  },
  links: {
    headline1: "clean links. clean data.",
    headline2: "clear decisions.",
    subheadline: "short links, UTM builder, QR codes, and clean-track governance in one place. every link follows the same rules — so your dashboards never break.",
    secondaryCta: "see how it works",
    secondaryCtaLink: "/how-it-works"
  }
};

interface InteractiveHeroProps {
  onUseCaseChange?: (useCase: UseCaseType) => void;
}

export const InteractiveHero = ({ onUseCaseChange }: InteractiveHeroProps) => {
  const [selectedUseCase, setSelectedUseCase] = useState<UseCaseType>("attribution");
  const trackCTAClick = useTrackCTAClick();
  const content = USE_CASE_CONTENT[selectedUseCase];

  const handleUseCaseChange = (useCase: UseCaseType) => {
    setSelectedUseCase(useCase);
    onUseCaseChange?.(useCase);
    trackCTAClick(`hero-usecase-${useCase}`);
  };

  return (
    <section className="relative py-12 md:py-20 lg:py-24 bg-background overflow-hidden">
      <div className="relative z-10 max-w-[980px] mx-auto px-4 sm:px-6 md:px-8">
        <motion.div 
          className="text-center space-y-6 md:space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Use Case Selector Pills */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {USE_CASE_PILLS.map((pill) => {
              const Icon = pill.icon;
              const isSelected = selectedUseCase === pill.id;
              
              return (
                <button
                  key={pill.id}
                  onClick={() => handleUseCaseChange(pill.id)}
                  className={`group flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-full transition-all duration-300 min-w-[160px] sm:min-w-[180px] ${
                    isSelected 
                      ? 'bg-primary text-white shadow-[0_10px_25px_-5px_hsl(var(--primary)/0.25)]' 
                      : 'bg-white/5 text-white-70 border border-white-10'
                  }`}
                  aria-pressed={isSelected}
                >
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${isSelected ? "scale-110" : "group-hover:scale-105"}`} />
                  <div className="text-left">
                    <div className="text-sm sm:text-base font-semibold leading-tight">{pill.label}</div>
                    <div 
                      className={`text-xs leading-tight ${isSelected ? 'text-white-80' : 'text-white-50'}`}
                    >
                      {pill.sublabel}
                    </div>
                  </div>
                </button>
              );
            })}
          </motion.div>

          {/* Dynamic Headline */}
          <AnimatePresence mode="wait">
            <motion.h1 
              key={selectedUseCase}
              className="hero-gradient text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tighter text-balance leading-[1.1] md:leading-[1.05]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {content.headline1}<br />
              {content.headline2}
            </motion.h1>
          </AnimatePresence>
          
          {/* Dynamic Subheadline */}
          <AnimatePresence mode="wait">
            <motion.p 
              key={`sub-${selectedUseCase}`}
              className="text-base sm:text-lg md:text-xl max-w-[720px] mx-auto text-balance leading-relaxed px-2 text-white-60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {content.subheadline}
            </motion.p>
          </AnimatePresence>
          
          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            <HeroInlineCTA />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={`cta-${selectedUseCase}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Link 
                  to={content.secondaryCtaLink}
                  className="inline-flex items-center gap-2 text-sm transition-colors font-medium hover:opacity-80 text-white-80"
                  onClick={() => trackCTAClick(`hero-secondary-${selectedUseCase}`)}
                >
                  {content.secondaryCta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export { USE_CASE_CONTENT };