import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Fingerprint, 
  GitBranch, 
  TrendingUp, 
  AlertTriangle,
  Sparkles,
  Clock,
  ArrowUpRight,
  Target,
  Route,
  Lightbulb,
  Download
} from "lucide-react";
import { AnalyticsFeatureCard } from "./AnalyticsFeatureCard";

const ANALYTICS_FEATURES = [
  {
    icon: BarChart3,
    title: "multi-touch attribution",
    description: "See every touchpoint that led to conversion, not just the last click."
  },
  {
    icon: Fingerprint,
    title: "cross-device identity",
    description: "Connect the dots across devices to see the full customer journey."
  },
  {
    icon: GitBranch,
    title: "customer journey flow",
    description: "Visualize how users navigate from first touch to purchase."
  },
  {
    icon: TrendingUp,
    title: "traffic forecasting",
    description: "Predict future traffic patterns based on historical data and trends."
  },
  {
    icon: AlertTriangle,
    title: "anomaly detection",
    description: "Get instant alerts when traffic spikes or drops unexpectedly."
  },
  {
    icon: Sparkles,
    title: "ai command center",
    description: "Natural language queries for instant insights from your data."
  },
  {
    icon: Clock,
    title: "best time analysis",
    description: "Discover when your audience is most active and engaged."
  },
  {
    icon: ArrowUpRight,
    title: "lift analysis",
    description: "Measure the true incremental impact of your campaigns."
  },
  {
    icon: Target,
    title: "conversion funnels",
    description: "Track drop-offs at every stage of your conversion path."
  },
  {
    icon: Route,
    title: "golden path discovery",
    description: "Find the highest-converting journey through your funnel."
  },
  {
    icon: Lightbulb,
    title: "smart insights",
    description: "AI-powered recommendations to optimize your campaigns."
  },
  {
    icon: Download,
    title: "offline conversion import",
    description: "Connect offline sales data to your digital touchpoints."
  }
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

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    
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
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold lowercase"
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
                    isActive={true}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Dots */}
        <motion.div 
          className="flex justify-center gap-1.5 mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${index === selectedIndex 
                  ? 'bg-white w-6' 
                  : 'bg-white/20 hover:bg-white/40'
                }
              `}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </motion.div>

        {/* Swipe Hint */}
        <motion.p 
          className="text-center text-xs text-white/30 mt-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          ← swipe to explore →
        </motion.p>
      </div>
    </section>
  );
};
