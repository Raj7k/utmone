import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link2, Tags, Shield, BarChart3, FileCheck } from "lucide-react";

const layers = [
  {
    number: 1,
    icon: Link2,
    title: "short url",
    headline: "Clean, Semantic Links",
    description: "utm.one/acme-webinar — not u7x2k9. Every link is readable, memorable, and trustworthy.",
    color: "text-primary",
    bgColor: "bg-white"
  },
  {
    number: 2,
    icon: Tags,
    title: "utm structure",
    headline: "Enforced Naming Rules",
    description: "source=linkedin&medium=paid&campaign=q1-webinar. Consistent parameters across every campaign.",
    color: "text-primary",
    bgColor: "bg-muted/30"
  },
  {
    number: 3,
    icon: Shield,
    title: "safety layer",
    headline: "Real-Time Security",
    description: "✓ SSL secured • ✓ Scanned & safe • ✓ No malware. Every link is verified before you share it.",
    color: "text-primary",
    bgColor: "bg-white"
  },
  {
    number: 4,
    icon: BarChart3,
    title: "analytics layer",
    headline: "Full Funnel Visibility",
    description: "Clicks • Devices • Geo • Conversions • Attribution. See exactly what's working and why.",
    color: "text-primary",
    bgColor: "bg-muted/30"
  },
  {
    number: 5,
    icon: FileCheck,
    title: "governance layer",
    headline: "Templates & Audit Logs",
    description: "Who created what, when, why — full traceability. Your team stays aligned, your data stays clean.",
    color: "text-primary",
    bgColor: "bg-white"
  }
];

export const LinkLayersSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="relative min-h-[500vh] py-20 bg-muted/20">
      {/* Header */}
      <div className="text-center mb-12 px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-label mb-6 lowercase"
        >
          one link. five layers.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xl text-secondary-label max-w-2xl mx-auto"
        >
          Most tools shorten. utm.one structures.
        </motion.p>
      </div>

      {/* Stacking Cards Container */}
      <div className="sticky top-20 h-[80vh] flex items-center justify-center px-8">
        <div className="relative w-full max-w-6xl">
          {layers.map((layer, index) => {
            const Icon = layer.icon;
            const totalCards = layers.length;
            const cardStart = index / totalCards;
            const cardEnd = (index + 1) / totalCards;
            
            // Card slides up from below viewport
            const y = useTransform(
              scrollYProgress,
              [Math.max(0, cardStart - 0.1), cardStart, cardEnd, 1],
              [600, 0, 0, -100]
            );
            
            // Active card is 1, previous cards scale down progressively
            const scale = useTransform(
              scrollYProgress,
              [cardStart, cardEnd, 1],
              [1, 0.95 - (index * 0.02), 0.95 - (index * 0.02)]
            );
            
            // Fade in as card approaches
            const opacity = useTransform(
              scrollYProgress,
              [Math.max(0, cardStart - 0.1), cardStart],
              [0, 1]
            );
            
            return (
              <motion.div
                key={index}
                style={{
                  y,
                  scale,
                  opacity,
                  zIndex: totalCards - index,
                }}
                className={`absolute left-0 right-0 ${layer.bgColor} rounded-3xl shadow-2xl border border-border min-h-[500px]`}
              >
                <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-12 lg:p-16 gap-8 md:gap-12 h-full">
                  {/* Left: Content */}
                  <div className="flex-1 space-y-6">
                    {/* Number Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                      <span className="text-2xl font-display font-bold text-primary">
                        {layer.number}/5
                      </span>
                    </div>
                    
                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-label lowercase">
                      {layer.headline}
                    </h3>
                    
                    <p className="text-lg md:text-xl text-secondary-label leading-relaxed max-w-xl">
                      {layer.description}
                    </p>
                  </div>

                  {/* Right: Visual */}
                  <div className="flex-1 flex items-center justify-center">
                    <div className={`w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-3xl bg-primary/5 border-2 border-primary/20 flex items-center justify-center`}>
                      <Icon className={`w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 text-primary`} strokeWidth={1.5} />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-12 px-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl text-label font-display font-semibold lowercase"
        >
          every link tells the full story.
        </motion.p>
      </div>
    </div>
  );
};
