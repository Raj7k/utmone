import { motion, useScroll, useTransform } from "framer-motion";
import { ProductMockup } from "@/components/product/ProductMockup";
import { useRef } from "react";

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
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  return (
    <section ref={sectionRef} className="relative py-12 md:py-16 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-label mb-4 md:mb-6 lowercase"
          >
            one link. five layers.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base sm:text-lg md:text-xl text-secondary-label max-w-2xl mx-auto px-2"
          >
            Most tools shorten. utm.one structures.
          </motion.p>
        </div>

        {/* Mobile: Simple stacked cards | Desktop: Stacking scroll animation */}
        <div className="lg:hidden space-y-4">
          {layers.map((layer, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl p-6 shadow-sm bg-zinc-900/40 backdrop-blur-xl border border-white-08"
            >
              <div className="flex flex-col gap-4">
                {/* Number Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full self-start bg-white/5 border border-white-10">
                  <span className="text-sm font-display font-bold text-white-90">
                    {layer.number}/5
                  </span>
                </div>
                
                <h3 className="text-xl sm:text-2xl font-display font-bold text-label lowercase">
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
            </motion.div>
          ))}
        </div>

        {/* Desktop: Stacking Cards */}
        <div className="hidden lg:block relative min-h-[2500px]">
          {layers.map((layer, index) => {
            const segmentSize = 0.22;
            const startProgress = 0.02 + (index * segmentSize);
            const midProgress = startProgress + 0.06;
            const exitStart = startProgress + segmentSize - 0.04;
            const exitEnd = startProgress + segmentSize;
            
            const y = useTransform(
              scrollYProgress,
              [startProgress, midProgress, exitStart, exitEnd],
              [500, 0, 0, 0]
            );
            
            const scale = useTransform(
              scrollYProgress,
              [startProgress, midProgress - 0.02, exitStart, exitEnd],
              [0.95, 1, 1, 0.92]
            );
            
            const opacity = useTransform(
              scrollYProgress,
              [startProgress, startProgress + 0.04, exitStart, exitEnd],
              [0, 1, 1, 0]
            );

            const isEven = index % 2 === 0;
            
            return (
              <motion.div
                key={index}
                style={{ 
                  y, 
                  scale, 
                  opacity, 
                  zIndex: 10 + index, 
                  willChange: 'transform, opacity',
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
                    
                    <h3 className="text-2xl lg:text-3xl xl:text-5xl font-display font-bold text-label lowercase">
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
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-12 lg:mt-16"
        >
          <p className="text-lg sm:text-xl lg:text-2xl text-label font-display font-semibold lowercase">
            every link tells the full story.
          </p>
        </motion.div>
      </div>
    </section>
  );
};