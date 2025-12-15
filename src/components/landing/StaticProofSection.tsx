import { UseCaseType } from "./ControlDeckHero";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Zap, Clock, Shield, Brain, Target } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface StaticProofSectionProps {
  selectedUseCase: UseCaseType;
}

const PROOF_CONTENT: Record<UseCaseType, {
  eyebrow: string;
  headline: string;
  capabilities: { icon: typeof CheckCircle2; title: string; description: string }[];
  cta: { text: string; route: string };
}> = {
  attribution: {
    eyebrow: "clean-track attribution engine",
    headline: "mathematical proof, not guesswork.",
    capabilities: [
      {
        icon: Target,
        title: "30+ day attribution windows",
        description: "measure influence across the entire customer journey, not just the last 7 days.",
      },
      {
        icon: Brain,
        title: "clean track intelligence™ models",
        description: "calculate true channel contribution using statistical analysis, not arbitrary rules.",
      },
      {
        icon: Zap,
        title: "real-time lift analysis",
        description: "isolate the incremental impact of each channel with holdout testing.",
      },
    ],
    cta: { text: "explore attribution engine", route: "/features/attribution-graph" },
  },
  journey: {
    eyebrow: "visitor memory engine",
    headline: "identity stitching in <100ms.",
    capabilities: [
      {
        icon: Clock,
        title: "18-month visitor memory",
        description: "remember anonymous visitors for 18 months across sessions and devices.",
      },
      {
        icon: Target,
        title: "probabilistic identity matching",
        description: "stitch anonymous visits to known customers using behavioral signals.",
      },
      {
        icon: Shield,
        title: "cross-device tracking",
        description: "follow the customer from mobile browse to desktop purchase seamlessly.",
      },
    ],
    cta: { text: "explore journey analytics", route: "/features/predictive-analytics" },
  },
  links: {
    eyebrow: "link governance engine",
    headline: "create link + utm + qr in <5 seconds.",
    capabilities: [
      {
        icon: Zap,
        title: "one-click smart links",
        description: "auto-generate slug, apply UTM template, create branded QR — all at once.",
      },
      {
        icon: Shield,
        title: "zero UTM typos",
        description: "every link validated before creation. naming conventions enforced automatically.",
      },
      {
        icon: Brain,
        title: "LLM-ready metadata",
        description: "rich structured data attached to every link for AI-powered analysis.",
      },
    ],
    cta: { text: "explore link management", route: "/features/utm-builder" },
  },
  intelligence: {
    eyebrow: "pulse watchdog engine",
    headline: "anomalies detected before you log in.",
    capabilities: [
      {
        icon: Zap,
        title: "real-time anomaly detection",
        description: "Z-score analysis catches traffic spikes and drops within minutes, not days.",
      },
      {
        icon: Brain,
        title: "probabilistic forecasting",
        description: "predict future performance using clean track intelligence™ models.",
      },
      {
        icon: Target,
        title: "proactive alert dispatch",
        description: "email/slack notifications sent automatically when something's wrong.",
      },
    ],
    cta: { text: "explore AI intelligence", route: "/features/predictive-analytics" },
  },
  governance: {
    eyebrow: "enterprise control engine",
    headline: "governance that feels invisible.",
    capabilities: [
      {
        icon: Shield,
        title: "role-based permissions",
        description: "admins, editors, viewers — each with precisely scoped access.",
      },
      {
        icon: Target,
        title: "approval workflows",
        description: "require manager approval for sensitive links without blocking velocity.",
      },
      {
        icon: Clock,
        title: "complete audit trails",
        description: "every action logged. every change tracked. forever.",
      },
    ],
    cta: { text: "explore enterprise features", route: "/features/enterprise-control" },
  },
  linkpages: {
    eyebrow: "link pages engine",
    headline: "one link, full attribution.",
    capabilities: [
      {
        icon: Zap,
        title: "drag-and-drop builder",
        description: "create beautiful link-in-bio pages in under 30 seconds.",
      },
      {
        icon: Target,
        title: "full UTM tracking",
        description: "every click measured, every visitor identified. no more dark social.",
      },
      {
        icon: Shield,
        title: "verified badges",
        description: "Instagram-style verification to build trust and credibility.",
      },
    ],
    cta: { text: "explore link pages", route: "/features/link-pages" },
  },
  eventhalo: {
    eyebrow: "event halo engine",
    headline: "detect the invisible 90%.",
    capabilities: [
      {
        icon: Zap,
        title: "geo-temporal analysis",
        description: "detect booth walk-bys using location and time correlation.",
      },
      {
        icon: Brain,
        title: "control group comparison",
        description: "scientifically measure lift vs non-event control cities.",
      },
      {
        icon: Target,
        title: "live traffic pulse",
        description: "real-time gauge for field teams during events.",
      },
    ],
    cta: { text: "explore event halo", route: "/features/event-halo" },
  },
};

export const StaticProofSection = ({ selectedUseCase }: StaticProofSectionProps) => {
  const content = PROOF_CONTENT[selectedUseCase] || PROOF_CONTENT.attribution;
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

  const displayContent = PROOF_CONTENT[currentUseCase] || PROOF_CONTENT.attribution;

  return (
    <section ref={sectionRef} className="py-16 md:py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div
          className={`space-y-12 transition-all duration-500 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <div 
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
              }`}
            >
              <span className="text-xs font-medium uppercase tracking-wider text-primary">
                {displayContent.eyebrow}
              </span>
            </div>

            <h2 
              className={`text-3xl md:text-4xl lg:text-5xl font-display font-bold transition-all duration-500 delay-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
              style={{
                background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {displayContent.headline}
            </h2>
          </div>

          {/* Capabilities Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {displayContent.capabilities.map((capability, i) => {
              const Icon = capability.icon;
              return (
                <div
                  key={capability.title}
                  className={`relative p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-primary/30 transition-all duration-300 group cursor-pointer overflow-hidden ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
                  }`}
                  style={{ 
                    transitionDelay: `${300 + i * 120}ms`,
                  }}
                >
                  {/* Gradient overlay */}
                  <div 
                    className="absolute inset-0 rounded-2xl pointer-events-none opacity-50"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)',
                    }}
                  />
                  
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-white/90 mb-2 group-hover:text-white transition-colors">
                      {capability.title}
                    </h3>
                    <p className="text-sm text-white/50 leading-relaxed group-hover:text-white/60 transition-colors">
                      {capability.description}
                    </p>
                  </div>
                  
                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-primary/50 to-primary/0 group-hover:w-full transition-all duration-300" />
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div 
            className={`text-center transition-all duration-500 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: '600ms' }}
          >
            <Link
              to={displayContent.cta.route}
              className="inline-flex items-center gap-2 text-primary font-medium hover:opacity-80 transition-opacity group"
            >
              {displayContent.cta.text}
              <span className="inline-block group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

// Export with the same name for backward compatibility
export const DynamicProofSection = StaticProofSection;
