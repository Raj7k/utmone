import { motion } from "framer-motion";
import { ReactNode } from "react";

const appleEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface FeatureShowcaseProps {
  headline: string;
  subheadline?: string;
  children: ReactNode;
  background?: "default" | "muted";
}

export const FeatureShowcase = ({
  headline,
  subheadline,
  children,
  background = "default",
}: FeatureShowcaseProps) => {
  return (
    <section className={`py-16 md:py-24 ${background === "muted" ? "bg-muted/30" : ""}`}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: appleEase }}
          className="text-center mb-12"
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

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.7, ease: appleEase }}
          className="relative"
        >
          {/* Showcase container with glass effect */}
          <div className="relative bg-card/50 backdrop-blur-xl border border-border rounded-2xl md:rounded-3xl overflow-hidden">
            {/* Subtle glow */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_hsl(var(--primary)_/_0.03)_0%,_transparent_70%)]" />
            
            <div className="relative z-10 p-6 md:p-10 lg:p-12">
              {children}
            </div>
          </div>

          {/* Ambient glow behind */}
          <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl -z-10 opacity-50" />
        </motion.div>
      </div>
    </section>
  );
};
