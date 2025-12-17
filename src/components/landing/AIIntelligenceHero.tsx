import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { preserveAcronyms as p } from "@/utils/textFormatter";
import { 
  Sparkles, 
  TrendingUp, 
  GitBranch, 
  Navigation, 
  Shield,
  ArrowRight
} from "lucide-react";
import { useInView } from "@/hooks/useInView";

const AI_FEATURES = [
  {
    icon: TrendingUp,
    title: p("predictive analytics"),
    description: p("know which campaigns will perform before you launch"),
    href: "/features/predictive-analytics",
  },
  {
    icon: GitBranch,
    title: p("attribution graph"),
    description: p("see the true path from click to conversion"),
    href: "/features/attribution-graph",
  },
  {
    icon: Navigation,
    title: p("smart routing"),
    description: p("send visitors to the right destination automatically"),
    href: "/features/smart-routing",
  },
  {
    icon: Shield,
    title: p("link immunity"),
    description: p("auto-detect and fix broken links before they hurt you"),
    href: "/features/link-immunity",
  },
];

export const AIIntelligenceHero = () => {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section className="relative py-24 md:py-32 overflow-hidden" ref={ref}>
      {/* Obsidian Gradient Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, hsl(240 6% 10% / 0.6) 0%, hsl(0 0% 2% / 1) 100%)'
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-600 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-white/5 border border-white/10 backdrop-blur-xl"
          >
            <Sparkles className="w-4 h-4 text-white-80" />
            <span className="text-sm font-medium text-white-80">{p("clean-track intelligence")}</span>
          </div>
          
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 hero-gradient"
          >
            {p("four AI layers built into every link")}
          </h1>
          
          <p className="text-lg max-w-2xl mx-auto text-white-50">
            {p("mathematical models from MIT and Harvard scientists, working behind the scenes to make your data smarter.")}
          </p>
        </div>

        {/* Feature Cards Grid - 2x2 on mobile, 1x4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-12">
          {AI_FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`transition-all duration-500 ${
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}
                style={{ transitionDelay: isInView ? `${index * 100}ms` : '0ms' }}
              >
                <Link
                  to={feature.href}
                  className="group block h-full p-4 md:p-6 rounded-xl md:rounded-2xl transition-all duration-300 obsidian-glass-80 relative overflow-hidden"
                >
                  {/* Animated background glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 70%)'
                    }}
                  />
                  
                  <div 
                    className="relative w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-4 transition-colors bg-white/10"
                  >
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-white-80" />
                    {/* CSS-only pulsing ring on hover */}
                    <div className="absolute inset-0 rounded-lg md:rounded-xl border border-white/30 opacity-0 group-hover:opacity-100 group-hover:animate-pulse-ring" />
                  </div>
                  
                  <h3 
                    className="relative text-sm md:text-lg font-semibold mb-1 md:mb-2 transition-colors text-white-90"
                  >
                    {feature.title}
                  </h3>
                  
                  <p 
                    className="relative text-xs md:text-sm mb-2 md:mb-4 line-clamp-2 md:line-clamp-none text-white-50"
                  >
                    {feature.description}
                  </p>
                  
                  <span 
                    className="relative hidden md:inline-flex items-center gap-1 text-sm opacity-0 group-hover:opacity-100 transition-opacity text-white-70"
                  >
                    learn more
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div
          className={`text-center transition-all duration-500 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={{ transitionDelay: isInView ? '400ms' : '0ms' }}
        >
          <Link to="/early-access">
            <Button 
              size="lg" 
              className="rounded-full px-8 bg-white text-zinc-900 shadow-[0_0_30px_hsl(0_0%_100%/0.3),0_4px_15px_hsl(0_0%_0%/0.2)] hover:bg-zinc-100"
            >
              get early access
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
