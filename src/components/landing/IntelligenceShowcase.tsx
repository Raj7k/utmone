import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Zap, 
  Brain, 
  FileSearch, 
  ArrowRight,
  Sparkles,
  MessageSquare,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { AnimatedSection } from "./StaticSection";

export const IntelligenceShowcase = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <AnimatedSection className="py-16 md:py-24 bg-transparent">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-8 md:mb-12 space-y-3">
          <h1 className="hero-gradient text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold px-2">
            clean-track intelligence
          </h1>
          <p className="text-base sm:text-lg px-2 text-white-60">
            AI-powered insights built on mathematical models from MIT and Harvard scientists
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: AI Chat Mockup - Compact */}
          <div
            className="rounded-xl shadow-lg overflow-hidden bg-zinc-900/60 border border-white-10 transition-all duration-500"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-20px)'
            }}
          >
            {/* Chat Header */}
            <div className="flex items-center gap-2 px-3 py-2.5 bg-white/5 border-b border-white-10">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-white-80 to-white/40 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-obsidian" />
              </div>
              <div>
                <div className="font-semibold text-xs text-white-90">clean-track AI</div>
                <div className="text-[10px] text-white-50">MIT & Harvard algorithms</div>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className="p-3 space-y-3 max-h-[300px]">
              {/* User Message */}
              <div className="flex justify-end">
                <div className="rounded-xl rounded-tr-sm px-3 py-1.5 max-w-[80%] bg-white-90 text-obsidian">
                  <p className="text-xs">Which Nike campaign performed best?</p>
                </div>
              </div>
              
              {/* AI Response */}
              <div
                className="flex gap-2 transition-all duration-300"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
                  transitionDelay: '0.3s'
                }}
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-white/5">
                  <Brain className="w-3 h-3 text-white-80" />
                </div>
                <div className="rounded-xl rounded-tl-sm px-3 py-2 space-y-2 bg-white/5">
                  <p className="text-xs text-white-90">
                    <strong>Nike Q4 Launch</strong> drove most conversions:
                  </p>
                  <div className="space-y-1">
                    {[
                      { label: "Clicks", value: "24,847" },
                      { label: "Conversion", value: "4.8%" },
                      { label: "Revenue", value: "$128,200" },
                    ].map((stat) => (
                      <div key={stat.label} className="flex justify-between text-[11px]">
                        <span className="text-white-50">{stat.label}</span>
                        <span className="font-semibold text-white-90">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] pt-1 text-white-80">
                    <TrendingUp className="w-3 h-3" />
                    Clean-Track confidence: 94%
                  </div>
                </div>
              </div>
              
              {/* AI Alert Response */}
              <div
                className="flex gap-2 transition-all duration-300"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
                  transitionDelay: '0.5s'
                }}
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-amber-500/10">
                  <AlertCircle className="w-3 h-3 text-amber-500/80" />
                </div>
                <div className="rounded-xl rounded-tl-sm px-3 py-2 space-y-1.5 bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-center gap-1.5 text-amber-500/80">
                    <span className="text-[11px] font-medium">1 anomaly detected</span>
                  </div>
                  <p className="text-[11px] text-white-90">
                    Traffic from <strong>Tesla email</strong> dropped 45% yesterday.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Chat Input */}
            <div className="p-3 border-t border-white-10">
              <div className="flex items-center gap-2 rounded-lg px-3 py-1.5 bg-white/5">
                <MessageSquare className="w-3 h-3 text-white-50" />
                <span className="text-xs text-white-50">Ask anything about your links...</span>
              </div>
            </div>
          </div>
          
          {/* Right: Feature Cards - Compact */}
          <div className="space-y-4">
            {[
              {
                icon: Zap,
                title: "instant links",
                description: "AI generates title, slug, and UTM parameters from any URL in seconds."
              },
              {
                icon: Brain,
                title: "predictive insights",
                description: "Know which campaigns will work before launch — powered by Clean-Track algorithms."
              },
              {
                icon: FileSearch,
                title: "onelink validator",
                description: "Intelligent duplicate detection and version management."
              }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-xl p-4 transition-all duration-300 bg-zinc-900/60 border border-white-10 hover:-translate-y-0.5"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transitionDelay: `${i * 0.1}s`
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-white/5">
                      <Icon className="w-5 h-5 text-white-80" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold mb-1 text-white-90">{feature.title}</h2>
                      <p className="text-xs text-white-50">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            
            <div className="pt-2">
              <Link 
                to="/features/predictive-analytics"
                className="inline-flex items-center gap-2 font-medium transition-colors text-sm hover:opacity-80 text-white-80"
              >
                explore clean-track intelligence
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};
