/**
 * StaticInsightSection - CSS-only replacement for DynamicInsightSection
 * Removes framer-motion dependency for better LCP
 */
import { useEffect, useRef, useState } from "react";
import { UseCaseType } from "./ControlDeckHero";
import { cn } from "@/lib/utils";

interface StaticInsightSectionProps {
  selectedUseCase: UseCaseType;
}

const INSIGHT_CONTENT: Record<UseCaseType, {
  insight: string;
  explanation: string;
  principles: string[];
  caption: string;
}> = {
  attribution: {
    insight: "attribution isn't about the last touch. it's about measuring influence.",
    explanation: "every touchpoint that contributed to a sale deserves credit proportional to its influence. not just the last one that happened to be there when the customer clicked 'buy'.",
    principles: ["Clean Track Intelligence™", "30-day windows", "Lift analysis"],
    caption: "influence flows to revenue",
  },
  journey: {
    insight: "every visitor leaves breadcrumbs. the question is whether you're collecting them.",
    explanation: "identity isn't binary — known or unknown. it's probabilistic. we stitch anonymous visits to known customers using behavioral fingerprints, not just cookies.",
    principles: ["Probabilistic matching", "Cross-device linking", "18-month memory"],
    caption: "many sessions → one identity",
  },
  links: {
    insight: "a link isn't just a redirect. it's a data contract between you and your future self.",
    explanation: "when you create a link carelessly, you're writing corrupted data to a database you'll query in 6 months. every link should be validated before it exists.",
    principles: ["Validation first", "Naming conventions", "Template-driven"],
    caption: "clean input → clean output",
  },
  intelligence: {
    insight: "the best analytics don't wait for you to log in. they come to you.",
    explanation: "by the time you notice a problem, it's already cost you money. proactive alerts catch anomalies in real-time using statistical analysis — not arbitrary thresholds.",
    principles: ["Z-score detection", "Probabilistic forecasts", "Real-time alerts"],
    caption: "insights that find you",
  },
  governance: {
    insight: "clean data isn't about rules. it's about making the right thing the easy thing.",
    explanation: "if creating a bad link is easier than creating a good one, people will create bad links. governance should be invisible — defaults that guide without blocking.",
    principles: ["Templates as guardrails", "Approval workflows", "Audit trails"],
    caption: "chaos → order",
  },
  linkpages: {
    insight: "one link to rule them all. every click tracked.",
    explanation: "link-in-bio pages that actually tell you who clicked what. no more dark social. every visitor gets a UTM, every action gets attributed to revenue.",
    principles: ["UTM-powered links", "Verified badges", "Full analytics"],
    caption: "one link → all destinations",
  },
  eventhalo: {
    insight: "the booth sees 10%. the halo detects the rest.",
    explanation: "badge scans capture the obvious visitors. event halo uses proximity detection to identify the walk-bys who never stopped — but still influenced pipeline.",
    principles: ["Proximity detection", "Lift analysis", "Control groups"],
    caption: "booth scans + halo visitors",
  },
};

// CSS-only Visual Container
const VisualContainer = ({ children, caption }: { children: React.ReactNode; caption: string }) => (
  <div className="relative">
    <div className="aspect-video bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
      {children}
    </div>
    <p className="text-center text-xs text-white/40 font-mono mt-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
      {caption}
    </p>
  </div>
);

// CSS-only Attribution Visual
const AttributionVisual = () => (
  <svg className="w-full h-full" viewBox="0 0 640 360" preserveAspectRatio="xMidYMid meet">
    <defs>
      <linearGradient id="flowLine" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
      </linearGradient>
    </defs>
    
    {[
      { y: 80, label: "linkedin", value: "32%" },
      { y: 140, label: "google", value: "28%" },
      { y: 200, label: "email", value: "24%" },
      { y: 260, label: "direct", value: "16%" },
    ].map((node, i) => (
      <g key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
        <circle cx={80} cy={node.y} r={6} fill="white" />
        <text x={95} y={node.y + 4} fill="rgba(255,255,255,0.5)" fontSize="11" fontFamily="ui-monospace, monospace">
          {node.label}
        </text>
        <text x={170} y={node.y + 4} fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="ui-monospace, monospace">
          {node.value}
        </text>
        <path
          d={`M 200 ${node.y} C 350 ${node.y}, 400 180, 500 180`}
          stroke="url(#flowLine)"
          strokeWidth="1"
          fill="none"
          className="animate-draw-line"
          style={{ animationDelay: `${i * 0.15 + 0.3}s` }}
        />
      </g>
    ))}
    
    <circle cx={540} cy={180} r={24} fill="none" stroke="white" strokeWidth="1" className="animate-scale-in" style={{ animationDelay: '0.6s' }} />
    <text x={540} y={176} fill="white" fontSize="14" fontFamily="ui-monospace, monospace" textAnchor="middle" className="animate-fade-in" style={{ animationDelay: '0.9s' }}>
      $1.2M
    </text>
    <text x={540} y={192} fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="ui-monospace, monospace" textAnchor="middle" className="animate-fade-in" style={{ animationDelay: '1s' }}>
      revenue
    </text>
  </svg>
);

// CSS-only Journey Visual
const JourneyVisual = () => (
  <svg className="w-full h-full" viewBox="0 0 640 360" preserveAspectRatio="xMidYMid meet">
    <line x1={80} y1={180} x2={480} y2={180} stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" className="animate-draw-line" />
    
    {[
      { x: 120, icon: "M120 165 L120 195 M110 165 L130 165 M115 195 L125 195", label: "mobile", sessions: "3" },
      { x: 280, icon: "M265 165 L295 165 L295 195 L265 195 Z M275 195 L285 195 L285 200", label: "desktop", sessions: "5" },
      { x: 440, icon: "M425 165 L455 180 L425 195 Z", label: "email", sessions: "2" },
    ].map((node, i) => (
      <g key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.2 + 0.3}s` }}>
        <rect x={node.x - 24} y={156} width={48} height={48} rx={8} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <path d={node.icon} stroke="white" strokeWidth="1.5" fill="none" opacity="0.7" />
        <text x={node.x} y={225} fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="ui-monospace, monospace" textAnchor="middle">
          {node.label}
        </text>
        <text x={node.x} y={240} fill="rgba(255,255,255,0.25)" fontSize="9" fontFamily="ui-monospace, monospace" textAnchor="middle">
          {node.sessions} visits
        </text>
      </g>
    ))}
    
    <path d="M 490 180 L 540 180" stroke="rgba(255,255,255,0.3)" strokeWidth="1" markerEnd="url(#arrowhead)" className="animate-draw-line" style={{ animationDelay: '1s' }} />
    <defs>
      <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
        <path d="M 0 0 L 6 3 L 0 6 Z" fill="rgba(255,255,255,0.3)" />
      </marker>
    </defs>
    
    <circle cx={570} cy={180} r={24} fill="rgba(255,255,255,0.05)" stroke="white" strokeWidth="1" className="animate-scale-in" style={{ animationDelay: '1.2s' }} />
    <text x={570} y={184} fill="white" fontSize="16" textAnchor="middle" className="animate-fade-in" style={{ animationDelay: '1.4s' }}>●</text>
    <text x={570} y={225} fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="ui-monospace, monospace" textAnchor="middle" className="animate-fade-in" style={{ animationDelay: '1.5s' }}>
      1 identity
    </text>
  </svg>
);

// CSS-only Links Visual
const LinksVisual = () => {
  const lines = [
    { text: "// link data contract", dim: true },
    { text: "{", dim: false },
    { text: '  "short": "utm.one/abc",', dim: false },
    { text: '  "source": "linkedin",', dim: false },
    { text: '  "medium": "social",', dim: false },
    { text: '  "campaign": "q4-2024",', dim: false },
    { text: '  "valid": true', dim: false, highlight: true },
    { text: "}", dim: false },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-black/40 border border-white/10 rounded-xl overflow-hidden animate-fade-in">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
          <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
          <span className="text-[10px] text-white/30 font-mono ml-2">contract.json</span>
        </div>
        <div className="p-4 font-mono text-sm leading-relaxed">
          {lines.map((line, i) => (
            <div
              key={i}
              className={cn(
                "animate-fade-in",
                line.dim ? 'text-white/30' : line.highlight ? 'text-white' : 'text-white/60'
              )}
              style={{ animationDelay: `${i * 0.08 + 0.3}s` }}
            >
              {line.text}
              {line.highlight && <span className="ml-2 text-white/40 animate-fade-in" style={{ animationDelay: '1s' }}>✓</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// CSS-only Intelligence Visual
const IntelligenceVisual = () => {
  const alerts = [
    { label: "spike", message: "+340% traffic detected", time: "2m" },
    { label: "drop", message: "linkedin underperforming", time: "1h" },
    { label: "insight", message: "best time: tue 9am", time: "3h" },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-3">
        {alerts.map((alert, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/10 rounded-xl animate-fade-in"
            style={{ animationDelay: `${i * 0.15 + 0.2}s` }}
          >
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white/80 truncate">{alert.message}</p>
              <p className="text-[10px] text-white/30 font-mono mt-0.5">{alert.label} · {alert.time} ago</p>
            </div>
            <svg className="w-4 h-4 text-white/20" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
};

// CSS-only Governance Visual
const GovernanceVisual = () => (
  <div className="w-full h-full flex items-center justify-center p-8">
    <div className="w-full max-w-lg grid grid-cols-2 gap-6">
      <div className="animate-fade-in">
        <p className="text-[10px] text-white/30 font-mono mb-3 uppercase tracking-wider">before</p>
        <div className="space-y-2 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
          {["LinkedIn", "linkedin", "li", "LINKEDIN"].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-xs font-mono text-white/40 animate-fade-in"
              style={{ animationDelay: `${i * 0.1 + 0.3}s` }}
            >
              <span className="text-white/20">×</span>
              <span>utm_source={item}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-white/20 font-mono mt-2 text-center">4 variations</p>
      </div>
      
      <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <p className="text-[10px] text-white/30 font-mono mb-3 uppercase tracking-wider">after</p>
        <div className="space-y-2 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
          {[1, 2, 3, 4].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-xs font-mono text-white/60 animate-fade-in"
              style={{ animationDelay: `${i * 0.1 + 0.5}s` }}
            >
              <span className="text-white/40">✓</span>
              <span>utm_source=linkedin</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-white/20 font-mono mt-2 text-center">1 template</p>
      </div>
    </div>
  </div>
);

// CSS-only Link Pages Visual
const LinkPagesVisual = () => (
  <svg className="w-full h-full" viewBox="0 0 640 360" preserveAspectRatio="xMidYMid meet">
    <defs>
      <linearGradient id="linkPagesFlow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#F97316" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#EC4899" stopOpacity="0.2" />
      </linearGradient>
    </defs>
    
    {/* Source: One link node */}
    <g className="animate-fade-in">
      <rect x={60} y={165} width={80} height={30} rx={4} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
      <text x={100} y={184} fill="white" fontSize="10" fontFamily="ui-monospace, monospace" textAnchor="middle" opacity="0.7">utm.one/alex</text>
    </g>
    
    {/* Flow paths to destinations */}
    {[
      { y: 100, label: "blog", color: "#F97316" },
      { y: 160, label: "portfolio", color: "#EC4899" },
      { y: 220, label: "store", color: "#8B5CF6" },
      { y: 280, label: "social", color: "#06B6D4" },
    ].map((dest, i) => (
      <g key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.1 + 0.2}s` }}>
        <path
          d={`M 140 180 C 280 180, 320 ${dest.y}, 460 ${dest.y}`}
          fill="none"
          stroke="url(#linkPagesFlow)"
          strokeWidth="1"
          className="animate-draw-line"
          style={{ animationDelay: `${i * 0.15 + 0.3}s` }}
        />
        <rect x={470} y={dest.y - 10} width={70} height={20} rx={3} fill="rgba(255,255,255,0.05)" stroke={dest.color} strokeWidth="0.5" strokeOpacity="0.5" />
        <text x={505} y={dest.y + 4} fill="white" fontSize="9" fontFamily="ui-monospace, monospace" textAnchor="middle" opacity="0.6">{dest.label}</text>
      </g>
    ))}
    
    {/* Stats */}
    <text x={100} y={320} fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="ui-monospace, monospace" textAnchor="middle" className="animate-fade-in" style={{ animationDelay: '1s' }}>
      47 links · 12.4K clicks
    </text>
  </svg>
);

// CSS-only Event Halo Visual
const EventHaloVisual = () => (
  <svg className="w-full h-full" viewBox="0 0 640 360" preserveAspectRatio="xMidYMid meet">
    <defs>
      <linearGradient id="haloFlow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#10B981" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.2" />
      </linearGradient>
    </defs>
    
    {/* Booth node */}
    <g className="animate-fade-in">
      <rect x={80} y={160} width={60} height={40} rx={4} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
      <text x={110} y={184} fill="white" fontSize="9" fontFamily="ui-monospace, monospace" textAnchor="middle" opacity="0.6">booth</text>
      <text x={110} y={220} fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="ui-monospace, monospace" textAnchor="middle">100 scans</text>
    </g>
    
    {/* Flow path */}
    <path
      d="M 140 180 C 220 180, 280 180, 360 180"
      fill="none"
      stroke="url(#haloFlow)"
      strokeWidth="1"
      className="animate-draw-line"
      style={{ animationDelay: '0.3s' }}
    />
    
    {/* Halo detection center */}
    <g className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
      {/* Expanding rings */}
      <circle cx={460} cy={180} r={80} fill="none" stroke="rgba(16,185,129,0.1)" strokeWidth="0.5" className="animate-pulse" />
      <circle cx={460} cy={180} r={55} fill="none" stroke="rgba(16,185,129,0.15)" strokeWidth="0.5" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
      <circle cx={460} cy={180} r={30} fill="none" stroke="rgba(16,185,129,0.2)" strokeWidth="0.5" className="animate-pulse" style={{ animationDelay: '0.6s' }} />
      
      {/* Center node */}
      <circle cx={460} cy={180} r={12} fill="rgba(16,185,129,0.2)" stroke="#10B981" strokeWidth="0.5" />
      <text x={460} y={184} fill="white" fontSize="8" fontFamily="ui-monospace, monospace" textAnchor="middle">halo</text>
    </g>
    
    {/* Detected visitors dots */}
    {[
      { x: 420, y: 140 }, { x: 500, y: 150 }, { x: 430, y: 210 },
      { x: 490, y: 200 }, { x: 410, y: 175 }, { x: 510, y: 180 },
    ].map((dot, i) => (
      <circle 
        key={i} 
        cx={dot.x} 
        cy={dot.y} 
        r={2} 
        fill="#10B981" 
        opacity="0.6"
        className="animate-fade-in"
        style={{ animationDelay: `${0.8 + i * 0.1}s` }}
      />
    ))}
    
    {/* Stats */}
    <text x={460} y={290} fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="ui-monospace, monospace" textAnchor="middle" className="animate-fade-in" style={{ animationDelay: '1.2s' }}>
      +847 halo visitors detected
    </text>
  </svg>
);

const VISUAL_COMPONENTS: Record<UseCaseType, React.FC> = {
  attribution: AttributionVisual,
  journey: JourneyVisual,
  links: LinksVisual,
  intelligence: IntelligenceVisual,
  governance: GovernanceVisual,
  linkpages: LinkPagesVisual,
  eventhalo: EventHaloVisual,
};

// Intersection Observer hook for scroll animations
function useInView(ref: React.RefObject<HTMLElement>, threshold = 0.2) {
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "-50px" }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, [threshold]);
  
  return isInView;
}

export const StaticInsightSection = ({ selectedUseCase }: StaticInsightSectionProps) => {
  const content = INSIGHT_CONTENT[selectedUseCase] || INSIGHT_CONTENT.attribution;
  const VisualComponent = VISUAL_COMPONENTS[selectedUseCase] || VISUAL_COMPONENTS.attribution;
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef);

  return (
    <section 
      ref={sectionRef}
      className={cn(
        "py-24 md:py-32 relative overflow-hidden transition-opacity duration-600",
        isInView ? "opacity-100" : "opacity-0"
      )}
    >
      {/* Subtle ambient glow */}
      <div className={cn(
        "absolute inset-0 pointer-events-none transition-opacity duration-1000",
        isInView ? "opacity-100" : "opacity-0"
      )} style={{ transitionDelay: '0.3s' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/[0.02] rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          key={selectedUseCase}
          className={cn(
            "grid lg:grid-cols-[45%_55%] gap-12 lg:gap-16 items-center transition-opacity duration-400",
            isInView ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Left: Text Content */}
          <div className="space-y-6">
            <div className={cn(
              "transition-all duration-600",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}>
              <p className="text-xs font-medium uppercase tracking-widest text-white/30 mb-4">
                the insight
              </p>
              <h2 
                className="text-3xl md:text-4xl lg:text-[2.75rem] font-display font-bold leading-[1.15] tracking-tight"
                style={{
                  background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                "{content.insight}"
              </h2>
            </div>

            <p className={cn(
              "text-base md:text-lg text-white/40 leading-relaxed transition-all duration-600",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )} style={{ transitionDelay: '0.15s' }}>
              {content.explanation}
            </p>

            <p className={cn(
              "text-sm text-white/25 font-mono transition-all duration-600",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )} style={{ transitionDelay: '0.25s' }}>
              {content.principles.map((principle, i) => (
                <span key={principle}>
                  {i > 0 && <span className="mx-2">·</span>}
                  {principle}
                </span>
              ))}
            </p>
          </div>

          {/* Right: Visual */}
          <div className={cn(
            "transition-all duration-700",
            isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
          )} style={{ transitionDelay: '0.2s' }}>
            <VisualContainer caption={content.caption}>
              <VisualComponent />
            </VisualContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

// Export alias for backward compatibility
export { StaticInsightSection as DynamicInsightSection };
