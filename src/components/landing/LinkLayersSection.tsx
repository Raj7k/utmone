import { ProductMockup } from "@/components/product/ProductMockup";
import { useRef, useState, useEffect } from "react";
import { interpolate, useInView } from "@/lib/cssScrollUtils";

const layers = [
  {
    number: 1,
    mockupType: "browser" as const,
    headline: "clean, semantic links",
    description: "utm.one/webinar — not u7x2k9. Every link is readable, memorable, and trustworthy."
  },
  {
    number: 2,
    mockupType: "utm" as const,
    headline: "enforced naming rules",
    description: "source=linkedin&medium=paid&campaign=q1-webinar. Consistent parameters across every campaign."
  },
  {
    number: 3,
    mockupType: "security" as const,
    headline: "real-time security",
    description: "✓ SSL secured • ✓ Scanned & safe • ✓ No malware. Every link is verified before you share it."
  },
  {
    number: 4,
    mockupType: "analytics" as const,
    headline: "full funnel visibility",
    description: "Clicks • Devices • Geo • Conversions • Attribution. See exactly what's working and why."
  },
  {
    number: 5,
    mockupType: "governance" as const,
    headline: "templates & audit logs",
    description: "Who created what, when, why — full traceability. Your team stays aligned, your data stays clean."
  }
];

export const LinkLayersSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const rafRef = useRef<number>();
  const { ref: headerRef, inView: headerInView } = useInView({ once: true });
  const { ref: footerRef, inView: footerInView } = useInView({ once: true });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      if (rafRef.current) return;
      
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = undefined;
        
        const rect = section.getBoundingClientRect();
        const sectionHeight = rect.height;
        const viewportHeight = window.innerHeight;
        
        const scrollableDistance = sectionHeight - viewportHeight;
        const scrolled = -rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));
        
        setScrollProgress(progress);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative py-12 md:py-16 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2
            ref={headerRef}
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-label mb-4 md:mb-6 transition-all duration-500 ${
              headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            one link. five layers.
          </h2>
          <p
            className={`text-base sm:text-lg md:text-xl text-secondary-label max-w-2xl mx-auto px-2 transition-all duration-500 delay-100 ${
              headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            Most tools shorten. utm.one structures.
          </p>
        </div>

        {/* Mobile: Simple stacked cards */}
        <div className="lg:hidden space-y-4">
          {layers.map((layer, index) => {
            const { ref, inView } = useInView({ once: true, margin: "-50px" });
            
            return (
              <div
                key={index}
                ref={ref}
                className={`rounded-2xl p-6 shadow-sm bg-zinc-900/40 backdrop-blur-xl border border-white-08 transition-all duration-500 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col gap-4">
                  {/* Number Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full self-start bg-white/5 border border-white-10">
                    <span className="text-sm font-display font-bold text-white-90">
                      {layer.number}/5
                    </span>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-label">
                    {layer.headline}
                  </h3>
                  
                  <p className="text-sm sm:text-base text-secondary-label leading-relaxed">
                    {layer.description}
                  </p>

                  {/* Mockup - Centered and scaled for mobile */}
                  <div className="flex items-center justify-center mt-2">
                    <ProductMockup type={layer.mockupType} delay={0} size="default" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop: Stacking Cards */}
        <div className="hidden lg:block relative min-h-[2500px]">
          {layers.map((layer, index) => {
            const segmentSize = 0.22;
            const startProgress = 0.02 + (index * segmentSize);
            const midProgress = startProgress + 0.06;
            const exitStart = startProgress + segmentSize - 0.04;
            const exitEnd = startProgress + segmentSize;
            
            const y = interpolate(
              scrollProgress,
              [startProgress, midProgress, exitStart, exitEnd],
              [500, 0, 0, 0]
            );
            
            const scale = interpolate(
              scrollProgress,
              [startProgress, midProgress - 0.02, exitStart, exitEnd],
              [0.95, 1, 1, 0.92]
            );
            
            const opacity = interpolate(
              scrollProgress,
              [startProgress, startProgress + 0.04, exitStart, exitEnd],
              [0, 1, 1, 0]
            );

            const isEven = index % 2 === 0;
            
            return (
              <div
                key={index}
                style={{ 
                  transform: `translateY(${y}px) scale(${scale})`,
                  opacity,
                  zIndex: 10 + index, 
                  willChange: 'transform, opacity',
                  transition: 'transform 0.05s linear, opacity 0.05s linear',
                }}
                className="sticky top-20 rounded-3xl p-8 lg:p-12 xl:p-20 shadow-2xl min-h-[550px] lg:min-h-[650px] bg-zinc-900/60 backdrop-blur-xl border-2 border-white-10"
              >
                <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 lg:gap-12 xl:gap-20 h-full`}>
                  {/* Content */}
                  <div className="flex-1 space-y-4 lg:space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white-10">
                      <span className="text-lg lg:text-xl font-display font-bold text-white-90">
                        {layer.number}/5
                      </span>
                    </div>
                    
                    <h3 className="text-2xl lg:text-3xl xl:text-5xl font-display font-bold text-label">
                      {layer.headline}
                    </h3>
                    
                    <p className="text-base lg:text-lg text-secondary-label leading-relaxed max-w-xl">
                      {layer.description}
                    </p>
                  </div>

                  {/* Product Mockup */}
                  <div className="flex-1 flex items-center justify-center max-w-full overflow-hidden">
                    <ProductMockup type={layer.mockupType} delay={0} size="large" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          ref={footerRef}
          className={`text-center mt-12 lg:mt-16 transition-all duration-500 ${
            footerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <p className="text-lg sm:text-xl lg:text-2xl text-label font-display font-semibold">
            every link tells the full story.
          </p>
        </div>
      </div>
    </section>
  );
};
