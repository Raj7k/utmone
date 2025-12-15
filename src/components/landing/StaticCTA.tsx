import { UseCaseType } from "./ControlDeckHero";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { preserveAcronyms as p } from "@/utils/textFormatter";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { useEffect, useRef, useState } from "react";

interface StaticCTAProps {
  selectedUseCase: UseCaseType;
}

const CTA_CONTENT: Record<UseCaseType, {
  headline: string;
  subheadline: string;
  primaryCta: string;
  secondaryCta: { text: string; route: string };
}> = {
  attribution: {
    headline: "stop guessing where revenue comes from.",
    subheadline: "get mathematical proof of which channels actually drive conversions.",
    primaryCta: "start attributing revenue",
    secondaryCta: { text: "see attribution demo", route: "/features/attribution-graph" },
  },
  journey: {
    headline: "see the complete customer path.",
    subheadline: "from anonymous first visit to final sale — across devices and time.",
    primaryCta: "start tracking journeys",
    secondaryCta: { text: "see journey demo", route: "/features/predictive-analytics" },
  },
  links: {
    headline: "create your first smart link in 5 seconds.",
    subheadline: p("short URL + UTM + branded QR — validated and consistent, every time."),
    primaryCta: "start creating links",
    secondaryCta: { text: "see link builder demo", route: "/features/utm-builder" },
  },
  intelligence: {
    headline: p("get AI insights delivered to you."),
    subheadline: "anomalies detected. forecasts generated. recommendations sent — before you log in.",
    primaryCta: p("activate AI intelligence"),
    secondaryCta: { text: p("see AI demo"), route: "/features/predictive-analytics" },
  },
  governance: {
    headline: "governance that doesn't slow you down.",
    subheadline: "roles, templates, approvals — invisible guardrails for clean data.",
    primaryCta: "schedule enterprise demo",
    secondaryCta: { text: "see governance features", route: "/features/enterprise-control" },
  },
  linkpages: {
    headline: "one link to rule them all.",
    subheadline: "link-in-bio pages with full UTM tracking. every click measured.",
    primaryCta: "build your page",
    secondaryCta: { text: "see link pages demo", route: "/features/link-pages" },
  },
  eventhalo: {
    headline: "detect the invisible 90%.",
    subheadline: "see the full impact of field marketing, not just badge scans.",
    primaryCta: "explore event halo",
    secondaryCta: { text: "see event halo demo", route: "/features/event-halo" },
  },
};

export const StaticCTA = ({ selectedUseCase }: StaticCTAProps) => {
  const content = CTA_CONTENT[selectedUseCase] || CTA_CONTENT.attribution;
  const [isVisible, setIsVisible] = useState(false);
  const [currentUseCase, setCurrentUseCase] = useState(selectedUseCase);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Handle use case changes
  useEffect(() => {
    if (selectedUseCase !== currentUseCase) {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setCurrentUseCase(selectedUseCase);
        setIsVisible(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedUseCase, currentUseCase]);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const displayContent = CTA_CONTENT[currentUseCase] || CTA_CONTENT.attribution;

  return (
    <section ref={sectionRef} className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div
          className={`text-center space-y-8 transition-all duration-500 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          {/* Content */}
          <div className="space-y-4">
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl font-display font-bold"
              style={{
                background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {displayContent.headline}
            </h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              {displayContent.subheadline}
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/early-access">
              <ShimmerButton
                className="px-8 py-3 text-base font-medium"
                shimmerColor="rgba(255, 255, 255, 0.4)"
                background="hsl(var(--primary))"
              >
                {displayContent.primaryCta}
                <ArrowRight className="w-4 h-4 ml-2" />
              </ShimmerButton>
            </Link>
            <Link
              to={displayContent.secondaryCta.route}
              className="inline-flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
            >
              {displayContent.secondaryCta.text}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Trust Badge */}
          <p 
            className={`text-xs text-white/30 transition-all duration-500 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: '500ms' }}
          >
            free during early access • no credit card required
          </p>
        </div>
      </div>
    </section>
  );
};

// Export with the same name for backward compatibility
export const DynamicCTA = StaticCTA;
