import { motion } from "framer-motion";
import { LucideIcon, Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const appleEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

export interface CapabilityItem {
  id?: string;
  title: string;
  icon: LucideIcon;
  features: string[];
  href?: string;
}

interface FeatureBentoGridProps {
  headline: string;
  subheadline?: string;
  capabilities?: CapabilityItem[];
  items?: CapabilityItem[];
}

export const FeatureBentoGrid = ({
  headline,
  subheadline,
  capabilities,
  items,
}: FeatureBentoGridProps) => {
  const data = items || capabilities || [];
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: appleEase }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-sans font-bold hero-gradient mb-4">
            {headline}
          </h2>
          {subheadline && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subheadline}
            </p>
          )}
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((cap, index) => {
            const Icon = cap.icon;
            const Wrapper = cap.href ? Link : "div";
            const wrapperProps = cap.href ? { to: cap.href } : {};

            return (
              <motion.div
                key={cap.id || index}
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: appleEase }}
              >
                <Wrapper {...(wrapperProps as any)} className="block group h-full">
                  <div className="relative p-8 h-full transition-all duration-500 group-hover:scale-[1.02] bg-card/50 backdrop-blur-xl rounded-2xl border border-border group-hover:border-primary/30">
                    {/* Hover glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary)_/_0.05)_0%,_transparent_60%)] rounded-2xl" />

                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-muted group-hover:bg-primary/10 transition-colors">
                        <Icon className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <h3 className="text-xl font-sans font-semibold text-foreground mb-4">
                        {cap.title}
                      </h3>
                      <ul className="space-y-2">
                        {cap.features.map((feature, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <Check className="w-4 h-4 text-primary shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      {cap.href && (
                        <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                          learn more
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                </Wrapper>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
