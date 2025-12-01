import { motion } from "framer-motion";
import { Link as LinkIcon, Tag, Shield, BarChart3, FileCheck } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";

const layers = [
  {
    number: 1,
    icon: LinkIcon,
    title: "Short URL",
    description: "utm.one/acme-webinar",
    detail: "Clean, semantic, memorable",
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    number: 2,
    icon: Tag,
    title: "UTM Structure",
    description: "source=linkedin&medium=cpc&campaign=q4-webinar",
    detail: "Consistent, validated, enforceable",
    color: "text-blazeOrange",
    bgColor: "bg-blazeOrange/10"
  },
  {
    number: 3,
    icon: Shield,
    title: "Safety Layer",
    description: "✓ SSL Verified  ✓ Malware Scanned  ✓ Blacklist Clear",
    detail: "Trust indicators for every click",
    color: "text-green-600",
    bgColor: "bg-green-600/10"
  },
  {
    number: 4,
    icon: BarChart3,
    title: "Analytics Layer",
    description: "Clicks • Devices • Geo • Conversions",
    detail: "Real-time visibility into performance",
    color: "text-purple-600",
    bgColor: "bg-purple-600/10"
  },
  {
    number: 5,
    icon: FileCheck,
    title: "Governance Layer",
    description: "Templates • Validation Rules • Audit Logs",
    detail: "Team-wide consistency and compliance",
    color: "text-blue-600",
    bgColor: "bg-blue-600/10"
  }
];

export const LinkLayersSection = () => {
  return (
    <AnimatedSection className="py-20 md:py-32 bg-muted/20">
      <div className="max-w-5xl mx-auto px-8">
        <div className="text-center mb-16 space-y-4">
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-label lowercase"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            one link. five layers.
          </motion.h2>
          <motion.p 
            className="text-xl text-secondary-label"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Most tools shorten. utm.one structures.
          </motion.p>
        </div>

        <div className="relative space-y-4">
          {layers.map((layer, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.15,
                ease: [0.25, 0.1, 0.25, 1]
              }}
              className="relative"
            >
              <div className="bg-card border-2 border-border rounded-2xl p-6 md:p-8 hover:shadow-lg transition-all duration-300 hover:border-primary/30">
                <div className="flex items-start gap-6">
                  {/* Number Badge */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${layer.bgColor} flex items-center justify-center`}>
                    <span className={`text-2xl font-bold ${layer.color}`}>
                      {layer.number}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${layer.bgColor} flex items-center justify-center`}>
                    <layer.icon className={`w-6 h-6 ${layer.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl font-display font-bold text-label mb-2 lowercase">
                      {layer.title}
                    </h3>
                    <p className="text-base font-mono text-secondary-label mb-2 break-all">
                      {layer.description}
                    </p>
                    <p className="text-sm text-tertiary-label">
                      {layer.detail}
                    </p>
                  </div>
                </div>
              </div>

              {/* Connecting Line (except for last item) */}
              {index < layers.length - 1 && (
                <div className="absolute left-[50px] top-full h-4 w-0.5 bg-border" />
              )}
            </motion.div>
          ))}
        </div>

        <motion.p 
          className="text-center text-2xl md:text-3xl font-display font-semibold text-blazeOrange mt-16 lowercase"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          every link tells the full story.
        </motion.p>
      </div>
    </AnimatedSection>
  );
};
