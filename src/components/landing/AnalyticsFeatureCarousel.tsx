import { useCallback, useEffect, useState, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { 
  GitBranch, 
  Smartphone, 
  Route, 
  TrendingUp, 
  Activity, 
  Bot, 
  Clock, 
  ArrowUpRight, 
  Filter, 
  Sparkles, 
  Lightbulb, 
  Upload,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { AnalyticsFeatureCard } from "./AnalyticsFeatureCard";
import { 
  AttributionSankeyMini, 
  IdentityStitchingMini, 
  JourneyFlowMini, 
  AnomalyPulseMini, 
  ForecastMini 
} from "./visuals";
import { useInView } from "@/hooks/useInView";

// CSS-only Mini Visual Components

const AICommandVisual = () => {
  const [typingVisible, setTypingVisible] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTypingVisible(v => !v);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <rect x="10" y="10" width="70" height="16" rx="4" fill="rgba(255,255,255,0.1)" className="animate-fade-in" style={{ animationDelay: '100ms' }} />
      <rect x="40" y="32" width="70" height="16" rx="4" fill="rgba(255,255,255,0.2)" className="animate-fade-in" style={{ animationDelay: '300ms' }} />
      <rect
        x="72"
        y="14"
        width="2"
        height="8"
        fill="white"
        opacity={typingVisible ? 1 : 0}
        className="transition-opacity duration-100"
      />
      <circle cx="20" cy="18" r="2" fill="rgba(255,255,255,0.5)" />
      <circle cx="100" cy="40" r="2" fill="rgba(255,255,255,0.5)" />
    </svg>
  );
};

const HeatmapVisual = () => {
  const [cells, setCells] = useState<number[][]>([]);
  
  useEffect(() => {
    const newCells = Array.from({ length: 4 }, () =>
      Array.from({ length: 7 }, () => 0.1 + Math.random() * 0.5)
    );
    setCells(newCells);
  }, []);

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      {cells.map((row, rowIdx) =>
        row.map((value, colIdx) => (
          <rect
            key={`${colIdx}-${rowIdx}`}
            x={15 + colIdx * 14}
            y={8 + rowIdx * 12}
            width="10"
            height="8"
            rx="1"
            fill={`rgba(255,255,255,${value})`}
            className="animate-scale-in"
            style={{ 
              animationDelay: `${30 * (colIdx + rowIdx)}ms`,
              transformOrigin: `${15 + colIdx * 14 + 5}px ${8 + rowIdx * 12 + 4}px`
            }}
          />
        ))
      )}
      <rect
        x="57"
        y="8"
        width="10"
        height="8"
        rx="1"
        fill="none"
        stroke="white"
        strokeWidth="1"
        className="animate-pulse"
      />
    </svg>
  );
};

const LiftVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <rect x="25" y="25" width="20" height="30" rx="2" fill="rgba(255,255,255,0.2)" className="animate-grow-up" style={{ transformOrigin: '35px 55px' }} />
    <rect x="55" y="10" width="20" height="45" rx="2" fill="rgba(255,255,255,0.5)" className="animate-grow-up" style={{ animationDelay: '200ms', transformOrigin: '65px 55px' }} />
    <path d="M65,5 L60,12 L70,12 Z" fill="rgba(255,255,255,0.6)" className="animate-fade-in" style={{ animationDelay: '700ms' }} />
    <g className="animate-fade-in" style={{ animationDelay: '800ms' }}>
      <rect x="78" y="8" width="28" height="14" rx="7" fill="rgba(255,215,0,0.15)" stroke="rgba(255,215,0,0.5)" strokeWidth="0.5" />
      <text x="92" y="18" fill="rgba(255,215,0,0.9)" fontSize="7" textAnchor="middle" fontFamily="ui-monospace">+42%</text>
    </g>
  </svg>
);

const FunnelVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <path d="M20,10 L100,10 L85,30 L75,50 L45,50 L35,30 Z" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" className="animate-fade-in" />
    <line x1="20" y1="10" x2="100" y2="10" stroke="rgba(255,255,255,0.4)" strokeWidth="2" className="animate-draw-line" style={{ animationDelay: '300ms' }} />
    <line x1="35" y1="30" x2="85" y2="30" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" className="animate-draw-line" style={{ animationDelay: '500ms' }} />
    <line x1="45" y1="50" x2="75" y2="50" stroke="rgba(255,255,255,0.5)" strokeWidth="2" className="animate-draw-line" style={{ animationDelay: '700ms' }} />
    <circle
      r="3"
      fill="white"
      className="animate-funnel-drop"
    />
  </svg>
);

const GoldenPathVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <circle cx="15" cy="30" r="4" fill="rgba(255,255,255,0.2)" />
    <circle cx="40" cy="15" r="4" fill="rgba(255,255,255,0.2)" />
    <circle cx="40" cy="45" r="4" fill="rgba(255,255,255,0.2)" />
    <circle cx="70" cy="20" r="4" fill="rgba(255,255,255,0.2)" />
    <circle cx="70" cy="40" r="4" fill="rgba(255,255,255,0.2)" />
    <circle cx="105" cy="30" r="5" fill="rgba(255,255,255,0.5)" />
    <path d="M15,30 L40,15 L70,20 L105,30" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" className="animate-draw-line" />
    <path d="M15,30 L40,45 L70,40 L105,30" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3 3" className="animate-draw-line" style={{ animationDelay: '300ms' }} />
    <circle cx="15" cy="30" r="4" fill="rgba(255,255,255,0.6)" className="animate-scale-in" style={{ animationDelay: '200ms' }} />
    <circle cx="40" cy="15" r="4" fill="rgba(255,255,255,0.6)" className="animate-scale-in" style={{ animationDelay: '400ms' }} />
    <circle cx="70" cy="20" r="4" fill="rgba(255,255,255,0.6)" className="animate-scale-in" style={{ animationDelay: '600ms' }} />
  </svg>
);

const InsightsVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <circle cx="60" cy="30" r="15" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" className="animate-scale-in" />
    <path d="M60,20 L60,35 M60,40 L60,42" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" className="animate-fade-in" style={{ animationDelay: '300ms' }} />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <line
        key={angle}
        x1={60 + Math.cos((angle * Math.PI) / 180) * 22}
        y1={30 + Math.sin((angle * Math.PI) / 180) * 22}
        x2={60 + Math.cos((angle * Math.PI) / 180) * 28}
        y2={30 + Math.sin((angle * Math.PI) / 180) * 28}
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.5"
        className="animate-pulse"
        style={{ animationDelay: `${500 + i * 100}ms` }}
      />
    ))}
  </svg>
);

const ImportVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <rect x="35" y="20" width="50" height="35" rx="3" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" className="animate-fade-in" />
    <path d="M45,35 L55,35 M45,42 L65,42 M45,49 L60,49" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" className="animate-fade-in" style={{ animationDelay: '400ms' }} />
    <g className="animate-import-arrow">
      <path d="M60,5 L60,18 M55,13 L60,18 L65,13" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" />
    </g>
  </svg>
);

const ANALYTICS_FEATURES = [
  {
    icon: GitBranch,
    title: "multi-touch attribution",
    description: "see every touchpoint that contributes to conversions with weighted credit distribution.",
    visual: <AttributionSankeyMini />,
  },
  {
    icon: Smartphone,
    title: "cross-device identity",
    description: "unify visitor journeys across mobile, tablet, and desktop with probabilistic matching.",
    visual: <IdentityStitchingMini />,
  },
  {
    icon: Route,
    title: "customer journey flow",
    description: "visualize the exact paths visitors take from first click to conversion.",
    visual: <JourneyFlowMini />,
  },
  {
    icon: TrendingUp,
    title: "traffic forecasting",
    description: "predict future click volumes with confidence intervals using trend analysis.",
    visual: <ForecastMini />,
  },
  {
    icon: Activity,
    title: "anomaly detection",
    description: "get alerted instantly when traffic spikes or drops outside normal patterns.",
    visual: <AnomalyPulseMini />,
  },
  {
    icon: Bot,
    title: "ai command center",
    description: "ask questions about your data and get actionable insights in plain language.",
    visual: <AICommandVisual />,
  },
  {
    icon: Clock,
    title: "best time analysis",
    description: "discover when your audience is most active for optimal campaign timing.",
    visual: <HeatmapVisual />,
  },
  {
    icon: ArrowUpRight,
    title: "lift analysis",
    description: "measure the true incremental impact of your marketing efforts.",
    visual: <LiftVisual />,
  },
  {
    icon: Filter,
    title: "conversion funnels",
    description: "build custom funnels to identify where visitors drop off in your flow.",
    visual: <FunnelVisual />,
  },
  {
    icon: Sparkles,
    title: "golden path discovery",
    description: "automatically identify the highest-converting visitor journeys.",
    visual: <GoldenPathVisual />,
  },
  {
    icon: Lightbulb,
    title: "smart insights",
    description: "receive proactive recommendations based on your performance data.",
    visual: <InsightsVisual />,
  },
  {
    icon: Upload,
    title: "offline conversion import",
    description: "connect CRM sales data back to original marketing touchpoints.",
    visual: <ImportVisual />,
  },
];

export const AnalyticsFeatureCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    dragFree: true,
    containScroll: false,
    align: "start",
    skipSnaps: false
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const { ref: sectionRef, isInView } = useInView({ threshold: 0.2 });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();
    
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14 space-y-3">
          <h2 
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold transition-all duration-600 ${
              isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
            }`}
            style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            12 ways to see what's really working
          </h2>
          <p 
            className={`text-base sm:text-lg max-w-2xl mx-auto text-white/50 transition-all duration-500 delay-150 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            every insight you need to prove marketing's impact on revenue
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Gradient Fade Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          {/* Left Arrow */}
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div 
            className="overflow-hidden cursor-grab active:cursor-grabbing" 
            ref={emblaRef}
          >
            <div className="flex gap-4 md:gap-6">
              {ANALYTICS_FEATURES.map((feature, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 w-[300px] sm:w-[340px] md:w-[380px] transition-all duration-500 ${
                    isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-90'
                  }`}
                  style={{ 
                    transitionDelay: `${Math.min(index * 80, 400)}ms`
                  }}
                >
                  <div className="transition-transform duration-200 hover:scale-[1.02]">
                    <AnalyticsFeatureCard
                      icon={feature.icon}
                      title={feature.title}
                      description={feature.description}
                      visual={feature.visual}
                      isActive={true}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div 
          className={`flex items-center justify-center gap-3 mt-8 transition-opacity duration-300 delay-300 ${
            isInView ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="relative w-32 h-1 rounded-full bg-white/10 overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-white/60 transition-all duration-300 ease-out"
              style={{ width: `${((selectedIndex + 1) / scrollSnaps.length) * 100}%` }}
            />
          </div>
          <span className="text-xs text-white/40 tabular-nums font-mono">
            {selectedIndex + 1}/{scrollSnaps.length}
          </span>
        </div>
      </div>
    </section>
  );
};