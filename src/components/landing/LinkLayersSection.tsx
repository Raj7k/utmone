import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link2, Tags, Shield, BarChart3, FileCheck } from "lucide-react";

const layers = [
  {
    number: 1,
    icon: Link2,
    title: "short url",
    description: "Clean, semantic, memorable",
    detail: "utm.one/acme-webinar — not u7x2k9",
    color: "text-electricBlue",
    bgColor: "bg-white"
  },
  {
    number: 2,
    icon: Tags,
    title: "utm structure",
    description: "Enforced naming rules",
    detail: "source=linkedin&medium=paid&campaign=q1-webinar",
    color: "text-primary",
    bgColor: "bg-muted/30"
  },
  {
    number: 3,
    icon: Shield,
    title: "safety layer",
    description: "Real-time security scanning",
    detail: "✓ SSL secured • ✓ Scanned & safe • ✓ No malware",
    color: "text-green-600",
    bgColor: "bg-primary/5"
  },
  {
    number: 4,
    icon: BarChart3,
    title: "analytics layer",
    description: "Full funnel visibility",
    detail: "Clicks • Devices • Geo • Conversions • Attribution",
    color: "text-purple-600",
    bgColor: "bg-muted/30"
  },
  {
    number: 5,
    icon: FileCheck,
    title: "governance layer",
    description: "Templates, rules, audit logs",
    detail: "Who created what, when, why — full traceability",
    color: "text-blazeOrange",
    bgColor: "bg-blazeOrange/10"
  }
];

export const LinkLayersSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="relative min-h-[400vh] py-20 bg-muted/20">
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
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-6xl mx-auto px-8">
          {layers.map((layer, index) => {
            const Icon = layer.icon;
            const cardStart = index / layers.length;
            const cardEnd = (index + 1) / layers.length;
            
            const scale = useTransform(
              scrollYProgress,
              [Math.max(0, cardStart - 0.1), cardStart, cardEnd],
              [0.85 + (index * 0.03), 1, 1]
            );
            
            const opacity = useTransform(
              scrollYProgress,
              [Math.max(0, cardStart - 0.05), cardStart],
              [0.4, 1]
            );
            
            const y = useTransform(
              scrollYProgress,
              [0, cardStart, cardEnd],
              [index * 40, 0, -40]
            );
            
            return (
              <motion.div
                key={index}
                style={{
                  scale,
                  opacity,
                  y,
                  zIndex: layers.length - index,
                }}
                className={`absolute inset-0 ${layer.bgColor} rounded-3xl shadow-2xl border border-border overflow-hidden`}
              >
                <div className="h-full flex flex-col md:flex-row items-center justify-between p-8 md:p-16 gap-8 md:gap-12">
                  {/* Left: Content */}
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 border-2 border-current ${layer.color} flex items-center justify-center font-display font-bold text-xl md:text-2xl`}>
                        {layer.number}
                      </div>
                      <h3 className={`text-3xl md:text-4xl lg:text-5xl font-display font-bold ${layer.color} lowercase`}>
                        {layer.title}
                      </h3>
                    </div>
                    
                    <p className="text-xl md:text-2xl text-label font-medium">
                      {layer.description}
                    </p>
                    
                    <p className="text-base md:text-lg text-secondary-label font-mono bg-card/50 rounded-xl p-4 border border-border">
                      {layer.detail}
                    </p>
                  </div>

                  {/* Right: Visual */}
                  <div className="flex-1 flex items-center justify-center">
                    <div className={`w-48 h-48 md:w-64 md:h-64 rounded-3xl bg-primary/5 border-2 border-current ${layer.color} flex items-center justify-center`}>
                      <Icon className={`w-24 h-24 md:w-32 md:h-32 ${layer.color}`} strokeWidth={1.5} />
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
