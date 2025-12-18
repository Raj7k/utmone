import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  PieChart, 
  Route, 
  Link as LinkIcon,
  ArrowRight
} from "lucide-react";
import { HeroInlineCTA } from "./HeroInlineCTA";
import { useTrackCTAClick } from "@/hooks/analytics";

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
    subheadline: "tired of Google taking 100% credit? see which channels actually drive conversions with Clean Track Intelligence™ — not last-click guessing.",
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayedContent, setDisplayedContent] = useState(USE_CASE_CONTENT["attribution"]);
  const [mounted, setMounted] = useState(false);
  const trackCTAClick = useTrackCTAClick();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleUseCaseChange = (useCase: UseCaseType) => {
    if (useCase === selectedUseCase) return;
    
    setIsTransitioning(true);
    setSelectedUseCase(useCase);
    onUseCaseChange?.(useCase);
    trackCTAClick(`hero-usecase-${useCase}`);
    
    // Update content after fade out
    setTimeout(() => {
      setDisplayedContent(USE_CASE_CONTENT[useCase]);
      setIsTransitioning(false);
    }, 200);
  };

  return (
    <section className="relative py-12 md:py-20 lg:py-24 bg-background overflow-hidden">
      <div className="relative z-10 max-w-[980px] mx-auto px-4 sm:px-6 md:px-8">
        <div 
          className={`text-center space-y-6 md:space-y-8 transition-opacity duration-600 ${
            mounted ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Use Case Selector Pills */}
          <div 
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 transition-all duration-500 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2.5'
            }`}
            style={{ transitionDelay: '100ms' }}
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
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${isSelected ? "scale-110" : "group-hover:scale-105"}`} />
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
          </div>

          {/* Dynamic Headline */}
          <h1 
            className={`hero-gradient text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tighter text-balance leading-[1.1] md:leading-[1.05] transition-all duration-300 ${
              isTransitioning ? 'opacity-0 translate-y-5' : 'opacity-100 translate-y-0'
            }`}
          >
            {displayedContent.headline1}<br />
            {displayedContent.headline2}
          </h1>
          
          {/* Dynamic Subheadline */}
          <p 
            className={`text-base sm:text-lg md:text-xl max-w-[720px] mx-auto text-balance leading-relaxed px-2 text-white-60 transition-opacity duration-300 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ transitionDelay: isTransitioning ? '0ms' : '100ms' }}
          >
            {displayedContent.subheadline}
          </p>
          
          {/* CTA Section */}
          <div
            className={`space-y-4 transition-opacity duration-600 ${
              mounted ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <HeroInlineCTA />
            
            <div
              className={`transition-opacity duration-200 ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <Link 
                to={displayedContent.secondaryCtaLink}
                className="inline-flex items-center gap-2 text-sm transition-colors font-medium hover:opacity-80 text-white-80"
                onClick={() => trackCTAClick(`hero-secondary-${selectedUseCase}`)}
              >
                {displayedContent.secondaryCta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { USE_CASE_CONTENT };
