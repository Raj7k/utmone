import { Link } from "react-router-dom";
import { ArrowRight, Target, Users, TrendingUp } from "lucide-react";
import { SonarVisualization } from "@/components/events/SonarVisualization";
import { Badge } from "@/components/ui/badge";
import { preserveAcronyms as p } from "@/utils/textFormatter";
import { useRef, useState, useEffect } from "react";

// Custom hook for intersection observer
const useInView = (options = {}) => {
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.disconnect();
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isInView };
};

// Animated counter hook
const useAnimatedCounter = (end: number, duration: number = 2000, shouldStart: boolean = false) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!shouldStart) return;
    
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration, shouldStart]);
  
  return count;
};

// Animated stat component
const AnimatedStat = ({ end, prefix = "", suffix = "", label, isInView }: { end: number; prefix?: string; suffix?: string; label: string; isInView: boolean }) => {
  const count = useAnimatedCounter(end, 1500, isInView);
  
  return (
    <div>
      <div className="text-2xl font-bold text-white mb-1">
        {prefix}{count}{suffix}
      </div>
      <div className="text-sm text-white/50">{label}</div>
    </div>
  );
};

export const EventHaloShowcase = () => {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="py-12 md:py-16 relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div 
          className={`text-center mb-12 md:mb-16 transition-all duration-600 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 uppercase tracking-wider text-xs">
            New Feature
          </Badge>
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4"
            style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            track the invisible 90% from every event
          </h2>
          <p className="text-lg md:text-xl max-w-[640px] mx-auto text-white/50">
            you scan 100 badges. we find the other 900 who saw your booth but never stopped.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Sonar Visualization */}
          <div
            className={`flex justify-center transition-all duration-600 ${isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            style={{ transitionDelay: '200ms' }}
          >
            <SonarVisualization 
              haloVisitors={847}
              liftPercentage={340}
              city="Las Vegas"
              isActive={true}
            />
          </div>

          {/* Stats & CTA */}
          <div
            className={`space-y-8 transition-all duration-600 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'}`}
            style={{ transitionDelay: '300ms' }}
          >
            {/* Key Stats with animated counters */}
            <div className="grid grid-cols-2 gap-4">
              <div 
                className="obsidian-glass-60 rounded-xl p-5 border border-white/10 group hover:border-white/20 hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-3 group-hover:bg-white/15 transition-colors">
                  <Users className="w-5 h-5 text-white/80" />
                </div>
                <AnimatedStat end={847} suffix="" label="halo visitors detected" isInView={isInView} />
              </div>
              <div 
                className="obsidian-glass-60 rounded-xl p-5 border border-white/10 group hover:border-white/20 hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-3 group-hover:bg-white/15 transition-colors">
                  <TrendingUp className="w-5 h-5 text-white/80" />
                </div>
                <AnimatedStat end={340} prefix="+" suffix="%" label="lift vs baseline" isInView={isInView} />
              </div>
            </div>

            {/* Explanation */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white/90">event halo effect</h3>
              <p className="text-white/50 leading-relaxed">
                {p("Most event ROI is invisible. Event Halo detects the \"booth walk-by\" effect—people who saw your booth, picked up collateral, or heard your name, then visited your website days later without scanning a badge.")}
              </p>
              <ul className="space-y-2 text-sm text-white/60">
                <li className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span>Geographic proximity detection during event dates</span>
                </li>
                <li className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span>Post-event website visit correlation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span>Lift analysis vs baseline traffic</span>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <Link 
              to="/features/event-halo"
              className="inline-flex items-center gap-2 text-white font-medium hover:opacity-80 transition-opacity"
            >
              explore event halo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventHaloShowcase;
