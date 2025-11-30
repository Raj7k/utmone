import { motion } from "framer-motion";
import { OrganicShapes } from "@/components/landing/OrganicShapes";
import { ReactNode } from "react";

interface FeatureHeroWithToolProps {
  headline: string;
  subheadline: string;
  toolComponent: ReactNode;
}

export const FeatureHeroWithTool = ({
  headline,
  subheadline,
  toolComponent,
}: FeatureHeroWithToolProps) => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-background">
      {/* Gradient glow behind headline */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-radial from-blazeOrange/10 via-transparent to-transparent blur-3xl pointer-events-none" />
      
      <OrganicShapes />
      
      <div className="container relative z-10 px-6">
        {/* Feature badges row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-wrap justify-center gap-2 mb-6"
        >
          <span className="px-3 py-1 text-xs bg-muted/50 rounded-full border border-border/40 text-secondary-label">
            ✓ Free tier
          </span>
          <span className="px-3 py-1 text-xs bg-muted/50 rounded-full border border-border/40 text-secondary-label">
            ✓ No signup
          </span>
          <span className="px-3 py-1 text-xs bg-muted/50 rounded-full border border-border/40 text-secondary-label">
            ✓ Instant
          </span>
        </motion.div>

        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter mb-4 hero-gradient leading-[1.05]"
          >
            {headline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-body text-secondary-label max-w-2xl mx-auto mb-0"
          >
            {subheadline}
          </motion.p>
        </div>

        {/* Tool with enhanced styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blazeOrange/5 via-primary/5 to-blazeOrange/5 rounded-2xl blur-xl pointer-events-none" />
          {toolComponent}
        </motion.div>
      </div>
    </section>
  );
};
