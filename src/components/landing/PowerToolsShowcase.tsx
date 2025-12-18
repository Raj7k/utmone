import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FlaskConical, 
  ShieldCheck, 
  Globe, 
  Layers, 
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { AnimatedSection } from "./StaticSection";

const POWER_TOOLS = [
  {
    id: "smart-testing",
    icon: FlaskConical,
    label: "smart testing",
    description: "A/B testing with auto winner",
    mockup: (isVisible: boolean) => (
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white-50">variant performance</span>
          <span className="font-medium text-white-80">92% confidence</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-xs w-6 text-white-50">A</span>
            <div className="flex-1 h-2.5 rounded-full overflow-hidden bg-white/5">
              <div 
                className="h-full rounded-full bg-white/40 transition-all duration-600 ease-out"
                style={{ width: isVisible ? '45%' : '0%' }}
              />
            </div>
            <span className="text-xs font-medium w-10 text-white-90">4.5%</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs w-6 text-white-50">B</span>
            <div className="flex-1 h-2.5 rounded-full overflow-hidden bg-white/5">
              <div 
                className="h-full rounded-full bg-white/80 transition-all duration-600 ease-out"
                style={{ width: isVisible ? '72%' : '0%', transitionDelay: '0.1s' }}
              />
            </div>
            <span className="text-xs font-medium w-10 text-white-90">7.2% ✓</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs pt-1 text-white-80">
          <TrendingUp className="w-3 h-3" />
          Nike variant B wins with 60% improvement
        </div>
      </div>
    )
  },
  {
    id: "link-guard",
    icon: ShieldCheck,
    label: "link guard",
    description: "Security scanning & protection",
    mockup: (isVisible: boolean) => (
      <div className="space-y-2">
        {[
          { url: "tesla.com/model-s", status: "safe", time: "0.2s" },
          { url: "apple.com/iphone", status: "safe", time: "0.3s" },
          { url: "suspicious-link.xyz", status: "blocked", time: "0.1s" },
        ].map((scan, i) => (
          <div
            key={scan.url}
            className="flex items-center gap-2 p-2 rounded-lg bg-white/5 transition-opacity duration-300"
            style={{ 
              opacity: isVisible ? 1 : 0, 
              transitionDelay: `${i * 0.08}s` 
            }}
          >
            {scan.status === "safe" ? (
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-green-500/80" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-500/80" />
            )}
            <span className="text-xs font-mono flex-1 truncate text-white-90">{scan.url}</span>
            <span className={`text-xs ${scan.status === "safe" ? 'text-green-500/80' : 'text-red-500/80'}`}>
              {scan.status}
            </span>
          </div>
        ))}
      </div>
    )
  },
  {
    id: "geo-targeting",
    icon: Globe,
    label: "geo targeting",
    description: "Route by country",
    mockup: (isVisible: boolean) => (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {[
            { flag: "🇺🇸", code: "US", url: "/amazon-us" },
            { flag: "🇬🇧", code: "UK", url: "/amazon-uk" },
            { flag: "🇩🇪", code: "DE", url: "/amazon-de" },
          ].map((region, i) => (
            <div
              key={region.code}
              className="p-2 rounded-lg text-center bg-white/5 transition-all duration-300"
              style={{ 
                opacity: isVisible ? 1 : 0, 
                transform: isVisible ? 'scale(1)' : 'scale(0.9)',
                transitionDelay: `${i * 0.08}s` 
              }}
            >
              <div className="text-xl mb-0.5">{region.flag}</div>
              <div className="text-xs font-medium text-white-90">{region.code}</div>
              <div className="text-[10px] truncate text-white-50">{region.url}</div>
            </div>
          ))}
        </div>
        <div className="text-xs text-center text-white-50">
          Auto-detect → serve right content
        </div>
      </div>
    )
  },
  {
    id: "bulk-create",
    icon: Layers,
    label: "bulk create",
    description: "Hundreds of links from CSV",
    mockup: (isVisible: boolean) => (
      <div className="space-y-2">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
          <Layers className="w-3.5 h-3.5 text-white-80" />
          <span className="text-xs text-white-90">nike_campaign_links.csv</span>
          <span className="text-xs ml-auto text-white-50">247 rows</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-white-50">processing...</span>
            <span className="font-medium text-white-80">247/247</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden bg-white/5">
            <div 
              className="h-full rounded-full bg-white/80 transition-all duration-[1.2s] ease-out"
              style={{ width: isVisible ? '100%' : '0%' }}
            />
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-green-500/80">
          <CheckCircle2 className="w-3 h-3" />
          All links created with UTM validation
        </div>
      </div>
    )
  }
];

export const PowerToolsShowcase = () => {
  const [activeTool, setActiveTool] = useState("smart-testing");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const active = POWER_TOOLS.find(t => t.id === activeTool) || POWER_TOOLS[0];

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

  // Reset visibility when tool changes to trigger animation
  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, [activeTool]);

  return (
    <AnimatedSection className="py-16 md:py-24 bg-transparent">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-8 md:mb-12 space-y-3">
          <h1 className="hero-gradient text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold px-2">
            power tools for scale
          </h1>
          <p className="text-base sm:text-lg text-white-50">
            Advanced features for growth teams managing thousands of links
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {/* Mobile: Image First, Tabs Below */}
          <div className="md:hidden space-y-4">
            {/* Active Tool Preview - Mobile - FIRST */}
            <div
              key={activeTool}
              className="rounded-xl overflow-hidden bg-zinc-900/40 backdrop-blur-[40px] border border-white/8 animate-fade-in"
            >
              <div className="p-4">
                {active.mockup(isVisible)}
              </div>
            </div>
            
            {/* Tab Buttons - BELOW */}
            <div className="space-y-2">
              {POWER_TOOLS.map((tool) => {
                const Icon = tool.icon;
                const isActive = activeTool === tool.id;
                
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 active:scale-[0.98] ${
                      isActive
                        ? 'bg-white/90 text-obsidian'
                        : 'bg-zinc-900/40 backdrop-blur-[40px] border border-white/8'
                    }`}
                  >
                    <div 
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-black/10' : 'bg-white/5'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-obsidian' : 'text-white-80'}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <span className={`text-sm font-semibold ${isActive ? 'text-obsidian' : 'text-white-90'}`}>
                        {tool.label}
                      </span>
                      <p className={`text-xs ${isActive ? 'text-black/60' : 'text-white-50'}`}>
                        {tool.description}
                      </p>
                    </div>
                    <ArrowRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-obsidian' : 'text-white-50'}`} />
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Desktop: Horizontal Tabs */}
          <div className="hidden md:block">
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {POWER_TOOLS.map((tool) => {
                const Icon = tool.icon;
                const isActive = activeTool === tool.id;
                
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 ${
                      isActive
                        ? 'bg-white/90 text-obsidian shadow-glow-sm'
                        : 'bg-zinc-900/40 backdrop-blur-[40px] border border-white/8'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-obsidian' : 'text-white-80'}`} />
                    <span className={`text-sm font-medium ${isActive ? 'text-obsidian' : 'text-white-90'}`}>{tool.label}</span>
                  </button>
                );
              })}
            </div>
            
            {/* Active Tool Preview - Desktop */}
            <div
              key={activeTool}
              className="rounded-2xl overflow-hidden bg-zinc-900/40 backdrop-blur-[40px] border border-white/8 animate-fade-in"
            >
              <div className="p-6 md:p-8 min-h-[280px]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5">
                    {(() => {
                      const Icon = active.icon;
                      return <Icon className="w-5 h-5 text-white-80" />;
                    })()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white-90">{active.label}</h3>
                    <p className="text-sm text-white-50">{active.description}</p>
                  </div>
                </div>
                <div className="max-w-md">
                  {active.mockup(isVisible)}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <Link 
            to="/features/analytics"
            className="inline-flex items-center gap-2 font-medium transition-colors hover:opacity-80 text-white-80"
          >
            explore all features
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </AnimatedSection>
  );
};
