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
import { 
  AttributionSankeyMini, 
  IdentityStitchingMini, 
  JourneyFlowMini, 
  AnomalyPulseMini, 
  ForecastMini 
} from "./visuals";

// Enhanced Mini Visual Components with continuous animations

const AICommandVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <motion.rect x="10" y="10" width="70" height="16" rx="4" fill="rgba(255,255,255,0.1)"
      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} />
    <motion.rect x="40" y="32" width="70" height="16" rx="4" fill="rgba(255,255,255,0.2)"
      initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} />
    {/* Typing cursor animation */}
    <motion.rect
      x="72"
      y="14"
      width="2"
      height="8"
      fill="white"
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 0.8, repeat: Infinity }}
    />
    <motion.circle cx="20" cy="18" r="2" fill="rgba(255,255,255,0.5)" />
    <motion.circle cx="100" cy="40" r="2" fill="rgba(255,255,255,0.5)" />
  </svg>
);

const HeatmapVisual = () => {
  const [cells, setCells] = useState<number[][]>([]);
  
  useEffect(() => {
    // Generate random heatmap values
    const newCells = Array.from({ length: 4 }, () =>
      Array.from({ length: 7 }, () => 0.1 + Math.random() * 0.5)
    );
    setCells(newCells);
  }, []);

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      {cells.map((row, rowIdx) =>
        row.map((value, colIdx) => (
          <motion.rect
            key={`${colIdx}-${rowIdx}`}
            x={15 + colIdx * 14}
            y={8 + rowIdx * 12}
            width="10"
            height="8"
            rx="1"
            fill={`rgba(255,255,255,${value})`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.03 * (colIdx + rowIdx), duration: 0.3 }}
          />
        ))
      )}
      {/* Highlight best time with pulse */}
      <motion.rect
        x="57"
        y="8"
        width="10"
        height="8"
        rx="1"
        fill="none"
        stroke="white"
        strokeWidth="1"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </svg>
  );
};

const LiftVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <motion.rect x="25" y="25" width="20" height="30" rx="2" fill="rgba(255,255,255,0.2)"
      initial={{ height: 0, y: 55 }} animate={{ height: 30, y: 25 }} transition={{ duration: 0.5 }} />
    <motion.rect x="55" y="10" width="20" height="45" rx="2" fill="rgba(255,255,255,0.5)"
      initial={{ height: 0, y: 55 }} animate={{ height: 45, y: 10 }} transition={{ duration: 0.5, delay: 0.2 }} />
    <motion.path d="M65,5 L60,12 L70,12 Z" fill="rgba(255,255,255,0.6)"
      initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} />
    {/* +42% label with glow */}
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
    >
      <rect x="78" y="8" width="28" height="14" rx="7" fill="rgba(255,215,0,0.15)" stroke="rgba(255,215,0,0.5)" strokeWidth="0.5" />
      <text x="92" y="18" fill="rgba(255,215,0,0.9)" fontSize="7" textAnchor="middle" fontFamily="ui-monospace">+42%</text>
    </motion.g>
  </svg>
);

const FunnelVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <motion.path d="M20,10 L100,10 L85,30 L75,50 L45,50 L35,30 Z" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} />
    <motion.line x1="20" y1="10" x2="100" y2="10" stroke="rgba(255,255,255,0.4)" strokeWidth="2"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
    <motion.line x1="35" y1="30" x2="85" y2="30" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
    <motion.line x1="45" y1="50" x2="75" y2="50" stroke="rgba(255,255,255,0.5)" strokeWidth="2"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7 }} />
    {/* Animated particle dropping through funnel */}
    <motion.circle
      r="3"
      fill="white"
      initial={{ cx: 60, cy: 5, opacity: 0 }}
      animate={{ cx: 60, cy: [5, 15, 35, 52], opacity: [0, 1, 1, 0] }}
      transition={{ duration: 2, delay: 1, repeat: Infinity, repeatDelay: 1 }}
    />
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
    {/* Golden path */}
    <motion.path d="M15,30 L40,15 L70,20 L105,30" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
    {/* Dimmed alternative */}
    <motion.path d="M15,30 L40,45 L70,40 L105,30" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3 3"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.3 }} />
    {/* Traveling particle */}
    <motion.circle
      r="3"
      fill="white"
      filter="drop-shadow(0 0 4px white)"
      initial={{ offsetDistance: "0%" }}
      animate={{ offsetDistance: "100%" }}
      transition={{ duration: 2, delay: 1.2, repeat: Infinity, repeatDelay: 1.5, ease: "linear" }}
      style={{ offsetPath: 'path("M15,30 L40,15 L70,20 L105,30")' }}
    />
    {/* Highlighted nodes on golden path */}
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
    {/* Lightbulb icon */}
    <motion.path d="M60,20 L60,35 M60,40 L60,42" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />
    {/* Radiating insight rays */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <motion.line
        key={angle}
        x1={60 + Math.cos((angle * Math.PI) / 180) * 22}
        y1={30 + Math.sin((angle * Math.PI) / 180) * 22}
        x2={60 + Math.cos((angle * Math.PI) / 180) * 28}
        y2={30 + Math.sin((angle * Math.PI) / 180) * 28}
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.5"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
        transition={{ delay: 0.5 + i * 0.1, duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
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
    {/* Animated arrow dropping into document */}
    <motion.g
      initial={{ y: -15, opacity: 0 }}
      animate={{ y: [0, 5, 0], opacity: 1 }}
      transition={{ delay: 0.5, duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
    >
      <path d="M60,5 L60,18 M55,13 L60,18 L65,13" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" />
    </motion.g>
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
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ amount: 0.5 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          >
            12 ways to see what's really working
          </motion.h2>
          <motion.p 
            className="text-base sm:text-lg max-w-2xl mx-auto text-white/50"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.15 }}
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
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ amount: 0.3, margin: "-50px" }}
                  transition={{ 
                    duration: 0.5, 
                    delay: Math.min(index * 0.08, 0.4),
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { type: "spring", stiffness: 400, damping: 20 }
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
