import { motion, useScroll, useTransform } from "framer-motion";
import { ProductMockup } from "@/components/product/ProductMockup";
import { useRef } from "react";

const engines = [
  {
    number: 1,
    mockupType: "identity-stitching" as const,
    headline: "visitor memory",
    subheadline: "recognize returning visitors",
    description: "Clean-Track remembers that 'Anonymous Visitor 582' who read your blog 3 weeks ago is actually Sarah from Nike. When she finally signs up, we backfill her history instantly."
  },
  {
    number: 2,
    mockupType: "attribution-graph" as const,
    headline: "intelligent attribution",
    subheadline: "see the invisible influence",
    description: "Forget 'Linear' or 'Time Decay' models. Clean-Track calculates the true 'Lift' of every channel. See exactly how a LinkedIn impression causes a Direct search three days later."
  },
  {
    number: 3,
    mockupType: "state-value" as const,
    headline: "page value scoring",
    subheadline: "know the dollar value of every page",
    description: "Not all pages are equal. Clean-Track models your site to calculate the value of every URL. Your Pricing Page is worth $45.00 per visit. Your 'About Us' page is worth $0.50."
  }
];

export const EnginesStackingSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  return (
    <section 
      ref={sectionRef} 
      className="relative py-12 md:py-16 bg-white/5"
    >
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-white"
          >
            the three engines
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl max-w-2xl mx-auto text-white/60"
          >
            visitor memory • intelligent attribution • page value scoring
          </motion.p>
        </div>

        {/* Stacking Cards */}
        <div className="relative min-h-[1800px]">
          {engines.map((engine, index) => {
            const segmentSize = 0.35;
            const startProgress = 0.02 + (index * segmentSize);
            const midProgress = startProgress + 0.08;
            const exitStart = startProgress + segmentSize - 0.05;
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
                className="sticky top-20 rounded-3xl p-12 md:p-20 shadow-2xl min-h-[550px] md:min-h-[650px] bg-zinc-900/60 backdrop-blur-xl border border-white/10"
              >
                <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16 md:gap-20 h-full`}>
                  {/* Left: Content */}
                  <div className="flex-1 space-y-6">
                    {/* Number Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20">
                      <span className="text-xl font-display font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                        {engine.number}/3
                      </span>
                    </div>
                    
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white">
                      {engine.headline}
                    </h3>

                    <p className="text-xl md:text-2xl font-semibold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                      {engine.subheadline}
                    </p>
                    
                    <p className="text-lg leading-relaxed max-w-xl text-white/60">
                      {engine.description}
                    </p>
                  </div>

                  {/* Right: Product Mockup */}
                  <div className="flex-1 flex items-center justify-center">
                    <ProductMockup type={engine.mockupType} delay={0} size="large" />
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
          className="text-center mt-16"
        >
          <p className="text-2xl font-display font-semibold text-white">
            every journey tells the full story.
          </p>
        </motion.div>
      </div>
    </section>
  );
};