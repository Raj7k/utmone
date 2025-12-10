import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
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

// Mini Visual Components
const AttributionBarsVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <motion.rect x="10" y="10" width="60" height="8" rx="2" fill="rgba(255,255,255,0.4)"
      initial={{ width: 0 }} animate={{ width: 60 }} transition={{ duration: 0.8, delay: 0.1 }} />
    <motion.rect x="10" y="24" width="45" height="8" rx="2" fill="rgba(255,255,255,0.3)"
      initial={{ width: 0 }} animate={{ width: 45 }} transition={{ duration: 0.8, delay: 0.2 }} />
    <motion.rect x="10" y="38" width="80" height="8" rx="2" fill="rgba(255,255,255,0.5)"
      initial={{ width: 0 }} animate={{ width: 80 }} transition={{ duration: 0.8, delay: 0.3 }} />
    <motion.rect x="10" y="52" width="30" height="8" rx="2" fill="rgba(255,255,255,0.2)"
      initial={{ width: 0 }} animate={{ width: 30 }} transition={{ duration: 0.8, delay: 0.4 }} />
  </svg>
);

const IdentityGraphVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <motion.line x1="20" y1="30" x2="50" y2="15" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="3,3"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
    <motion.line x1="20" y1="30" x2="50" y2="45" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="3,3"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.1 }} />
    <motion.line x1="50" y1="15" x2="90" y2="30" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="3,3"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.2 }} />
    <motion.line x1="50" y1="45" x2="90" y2="30" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="3,3"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.3 }} />
    <motion.circle cx="20" cy="30" r="6" fill="rgba(255,255,255,0.5)" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 }} />
    <motion.circle cx="50" cy="15" r="4" fill="rgba(255,255,255,0.3)" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }} />
    <motion.circle cx="50" cy="45" r="4" fill="rgba(255,255,255,0.3)" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 }} />
    <motion.circle cx="90" cy="30" r="6" fill="rgba(255,255,255,0.5)" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7 }} />
  </svg>
);

const JourneyFlowVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <motion.path d="M10,30 Q30,10 50,30 T90,30" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
    <motion.path d="M10,40 Q30,50 50,35 T90,40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.2 }} />
    <motion.circle cx="10" cy="30" r="3" fill="rgba(255,255,255,0.6)" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }} />
    <motion.circle cx="50" cy="30" r="3" fill="rgba(255,255,255,0.6)" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7 }} />
    <motion.circle cx="90" cy="30" r="3" fill="rgba(255,255,255,0.6)" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9 }} />
  </svg>
);

const ForecastingVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <motion.path d="M10,45 L30,35 L50,40 L70,25 L90,20 L110,10" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
    <motion.path d="M70,25 L90,20 L110,10" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="4,2"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} />
    <motion.path d="M70,30 Q90,28 110,18" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} />
  </svg>
);

const AnomalyVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <motion.path d="M5,35 L20,35 L25,33 L30,37 L35,34 L40,36 L45,35 L50,35 L55,10 L60,35 L65,35 L80,33 L90,36 L110,35" 
      fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
    <motion.circle cx="55" cy="10" r="4" fill="rgba(255,255,255,0.6)"
      initial={{ scale: 0 }} animate={{ scale: [0, 1.5, 1] }} transition={{ delay: 0.8, duration: 0.4 }} />
    <motion.circle cx="55" cy="10" r="8" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"
      initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1.5, opacity: [0, 0.5, 0] }} 
      transition={{ delay: 0.8, duration: 1, repeat: Infinity, repeatDelay: 1 }} />
  </svg>
);

const AICommandVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <motion.rect x="10" y="10" width="70" height="16" rx="4" fill="rgba(255,255,255,0.1)"
      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} />
    <motion.rect x="40" y="32" width="70" height="16" rx="4" fill="rgba(255,255,255,0.2)"
      initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} />
    <motion.circle cx="20" cy="18" r="2" fill="rgba(255,255,255,0.5)" />
    <motion.circle cx="100" cy="40" r="2" fill="rgba(255,255,255,0.5)" />
  </svg>
);

const HeatmapVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    {[0, 1, 2, 3, 4, 5, 6].map((col) =>
      [0, 1, 2, 3].map((row) => (
        <motion.rect
          key={`${col}-${row}`}
          x={15 + col * 14}
          y={8 + row * 12}
          width="10"
          height="8"
          rx="1"
          fill={`rgba(255,255,255,${0.1 + Math.random() * 0.5})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 * (col + row) }}
        />
      ))
    )}
  </svg>
);

const LiftVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <motion.rect x="25" y="25" width="20" height="30" rx="2" fill="rgba(255,255,255,0.2)"
      initial={{ height: 0, y: 55 }} animate={{ height: 30, y: 25 }} transition={{ duration: 0.5 }} />
    <motion.rect x="55" y="10" width="20" height="45" rx="2" fill="rgba(255,255,255,0.5)"
      initial={{ height: 0, y: 55 }} animate={{ height: 45, y: 10 }} transition={{ duration: 0.5, delay: 0.2 }} />
    <motion.path d="M65,5 L60,12 L70,12 Z" fill="rgba(255,255,255,0.6)"
      initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} />
  </svg>
);

const FunnelVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <motion.path d="M20,10 L100,10 L85,30 L75,50 L45,50 L35,30 Z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} />
    <motion.line x1="20" y1="10" x2="100" y2="10" stroke="rgba(255,255,255,0.4)" strokeWidth="2"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
    <motion.line x1="35" y1="30" x2="85" y2="30" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
    <motion.line x1="45" y1="50" x2="75" y2="50" stroke="rgba(255,255,255,0.5)" strokeWidth="2"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7 }} />
  </svg>
);

const GoldenPathVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <motion.circle cx="15" cy="30" r="4" fill="rgba(255,255,255,0.2)" />
    <motion.circle cx="40" cy="15" r="4" fill="rgba(255,255,255,0.2)" />
    <motion.circle cx="40" cy="45" r="4" fill="rgba(255,255,255,0.2)" />
    <motion.circle cx="70" cy="20" r="4" fill="rgba(255,255,255,0.2)" />
    <motion.circle cx="70" cy="40" r="4" fill="rgba(255,255,255,0.2)" />
    <motion.circle cx="105" cy="30" r="5" fill="rgba(255,255,255,0.5)" />
    <motion.path d="M15,30 L40,15 L70,20 L105,30" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
    <motion.circle cx="15" cy="30" r="4" fill="rgba(255,255,255,0.6)"
      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} />
    <motion.circle cx="40" cy="15" r="4" fill="rgba(255,255,255,0.6)"
      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 }} />
    <motion.circle cx="70" cy="20" r="4" fill="rgba(255,255,255,0.6)"
      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 }} />
  </svg>
);

const InsightsVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <motion.circle cx="60" cy="30" r="15" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"
      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.4 }} />
    <motion.path d="M60,20 L60,35 M60,40 L60,42" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <motion.line
        key={angle}
        x1={60 + Math.cos((angle * Math.PI) / 180) * 22}
        y1={30 + Math.sin((angle * Math.PI) / 180) * 22}
        x2={60 + Math.cos((angle * Math.PI) / 180) * 28}
        y2={30 + Math.sin((angle * Math.PI) / 180) * 28}
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ delay: 0.5 + i * 0.1, duration: 1, repeat: Infinity, repeatDelay: 1 }}
      />
    ))}
  </svg>
);

const ImportVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <motion.rect x="35" y="20" width="50" height="35" rx="3" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} />
    <motion.path d="M45,35 L55,35 M45,42 L65,42 M45,49 L60,49" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />
    <motion.path d="M60,5 L60,18 M55,13 L60,18 L65,13" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round"
      initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, type: "spring" }} />
  </svg>
);

const ANALYTICS_FEATURES = [
  {
    icon: GitBranch,
    title: "multi-touch attribution",
    description: "see every touchpoint that contributes to conversions with weighted credit distribution.",
    visual: <AttributionBarsVisual />,
  },
  {
    icon: Smartphone,
    title: "cross-device identity",
    description: "unify visitor journeys across mobile, tablet, and desktop with probabilistic matching.",
    visual: <IdentityGraphVisual />,
  },
  {
    icon: Route,
    title: "customer journey flow",
    description: "visualize the exact paths visitors take from first click to conversion.",
    visual: <JourneyFlowVisual />,
  },
  {
    icon: TrendingUp,
    title: "traffic forecasting",
    description: "predict future click volumes with confidence intervals using trend analysis.",
    visual: <ForecastingVisual />,
  },
  {
    icon: Activity,
    title: "anomaly detection",
    description: "get alerted instantly when traffic spikes or drops outside normal patterns.",
    visual: <AnomalyVisual />,
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

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
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
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14 space-y-3">
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold"
            style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            12 ways to see what's really working
          </motion.h2>
          <motion.p 
            className="text-base sm:text-lg max-w-2xl mx-auto text-white/50"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            every insight you need to prove marketing's impact on revenue
          </motion.p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Gradient Fade Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          {/* Left Arrow - Hidden on mobile */}
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow - Hidden on mobile */}
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
                <motion.div
                  key={index}
                  className="flex-shrink-0 w-[280px] sm:w-[300px] md:w-[320px]"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    duration: 0.4, 
                    delay: Math.min(index * 0.05, 0.3),
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                >
                  <AnalyticsFeatureCard
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    visual={feature.visual}
                    isActive={true}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Apple HIG Progress Bar */}
        <motion.div 
          className="flex items-center justify-center gap-3 mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="relative w-32 h-1 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full bg-white/60"
              animate={{ 
                width: `${((selectedIndex + 1) / scrollSnaps.length) * 100}%` 
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
          <span className="text-xs text-white/40 tabular-nums font-mono">
            {selectedIndex + 1}/{scrollSnaps.length}
          </span>
        </motion.div>
      </div>
    </section>
  );
};
