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
    <section ref={sectionRef} className="relative py-24 md:py-32 bg-gradient-to-br from-blazeOrange/5 via-primary/5 to-deepSea/5"
    >
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-label mb-6 lowercase"
          >
            one link. five layers.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-secondary-label max-w-2xl mx-auto"
          >
            Most tools shorten. utm.one structures.
          </motion.p>
        </div>

        {/* Stacking Cards */}
        <div className="relative min-h-[3500px]">
          {layers.map((layer, index) => {
            const startProgress = index * 0.18;
            const midProgress = startProgress + 0.09;
            const endProgress = startProgress + 0.18;
            const exitStart = endProgress;
            const exitEnd = Math.min(exitStart + 0.1, 1);
            
            // Entry animation: slide up from below
            const y = useTransform(
              scrollYProgress,
              [startProgress, midProgress, exitStart, exitEnd],
              [600, index * 80, index * 80, -200]
            );
            
            // Scale: grow on entry, shrink on exit
            const scale = useTransform(
              scrollYProgress,
              [startProgress, midProgress, exitStart, exitEnd],
              [0.88, 1, 1, 0.85]
            );
            
            // Opacity: fade in on entry, fade out on exit
            const opacity = useTransform(
              scrollYProgress,
              [startProgress, startProgress + 0.03, exitStart, exitEnd],
              [0, 1, 1, 0.2]
            );

            const isEven = index % 2 === 0;
            
            return (
              <motion.div
                key={index}
                style={{ y, scale, opacity, zIndex: 50 - index }}
                className="sticky top-16 bg-card border-2 border-border rounded-3xl p-8 md:p-12 shadow-2xl mb-8 min-h-[500px] md:min-h-[600px]"
              >
                <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-16 h-full`}>
                  {/* Left: Content */}
                  <div className="flex-1 space-y-6">
                    {/* Number Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                      <span className="text-xl font-display font-bold text-primary">
                        {layer.number}/5
                      </span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-label lowercase">
                      {layer.headline}
                    </h2>
                    
                    <p className="text-lg text-secondary-label leading-relaxed max-w-xl">
                      {layer.description}
                    </p>
                  </div>

                  {/* Right: Product Mockup */}
                  <div className="flex-1 flex items-center justify-center">
                    <ProductMockup type={layer.mockupType} delay={0} />
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
          className="text-center mt-32"
        >
          <p className="text-2xl text-label font-display font-semibold lowercase">
            every link tells the full story.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
